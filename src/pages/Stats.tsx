// ============================================================
// Stats 页面 - 进度统计（Chart.js 图表）
// ============================================================
import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '../hooks/useAuth';
import { useTasks, useTaskStats } from '../hooks/useTasks';
import type { StageProgress, WeekProgress, DailyCompletion } from '../types';

// Chart.js CDN 加载（脚本只加载一次）
let chartJsLoaded = false;
function loadChartJs(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (chartJsLoaded || (window as any).Chart) { resolve(); return; }
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.7/chart.umd.min.js';
    script.onload = () => { chartJsLoaded = true; resolve(); };
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

export function StatsPage() {
  const { user, settings } = useAuth();
  const { tasks, loading } = useTasks(user?.id, settings);
  const { getStageProgress, getWeekProgress, getDailyCompletions, getOverallProgress } = useTaskStats(tasks);
  const [stageData, setStageData] = useState<StageProgress[]>([]);
  const [weekData, setWeekData] = useState<WeekProgress[]>([]);
  const [dailyData, setDailyData] = useState<DailyCompletion[]>([]);
  const stageChartRef = useRef<HTMLCanvasElement>(null);
  const weekChartRef = useRef<HTMLCanvasElement>(null);
  const dailyChartRef = useRef<HTMLCanvasElement>(null);
  const [chartInstances, setChartInstances] = useState<any[]>([]);

  // 数据计算
  useEffect(() => {
    if (tasks.length === 0) return;
    setStageData(getStageProgress());
    // 只显示有任务的周次
    const wd: WeekProgress[] = [];
    for (let w = 1; w <= 22; w++) {
      const wp = getWeekProgress(w);
      if (wp.total_tasks > 0) wd.push(wp);
    }
    setWeekData(wd);
    setDailyData(getDailyCompletions(14)); // 最近14天
  }, [tasks, getStageProgress, getWeekProgress, getDailyCompletions]);

  // 渲染图表
  useEffect(() => {
    if (loading || stageData.length === 0) return;
    let newInstances: any[] = [];
    loadChartJs().then(() => {
      const Chart = (window as any).Chart;
      // 销毁旧图表
      chartInstances.forEach((c: any) => c.destroy());

      // 1. 阶段进度环形图
      if (stageChartRef.current) {
        const ctx = stageChartRef.current.getContext('2d')!;
        newInstances.push(new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: stageData.map(s => s.stage_name),
            datasets: [{
              data: stageData.map(s => s.completed_tasks),
              backgroundColor: ['#7F77DD', '#1D9E75', '#D85A30', '#378ADD', '#639922'],
              borderWidth: 2,
              borderColor: 'var(--color-background-primary)',
            }],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 11 } } },
              title: { display: true, text: '各阶段完成数', font: { size: 13 } },
            },
          },
        }));
      }

      // 2. 周进度柱状图
      if (weekChartRef.current) {
        const ctx = weekChartRef.current.getContext('2d')!;
        newInstances.push(new Chart(ctx, {
          type: 'bar',
          data: {
            labels: weekData.map(w => `W${w.week_num}`),
            datasets: [
              {
                label: '已完成',
                data: weekData.map(w => w.completed_tasks),
                backgroundColor: 'var(--color-success, #22c55e)',
                borderRadius: 4,
              },
              {
                label: '总数',
                data: weekData.map(w => w.total_tasks),
                backgroundColor: 'var(--color-border-tertiary, #e5e7eb)',
                borderRadius: 4,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { labels: { boxWidth: 12, font: { size: 11 } } } },
            scales: {
              x: { ticks: { font: { size: 10 } } },
              y: { beginAtZero: true, ticks: { stepSize: 1, font: { size: 10 } } },
            },
          },
        }));
      }

      // 3. 每日完成折线图
      if (dailyChartRef.current && dailyData.length > 0) {
        const ctx = dailyChartRef.current.getContext('2d')!;
        newInstances.push(new Chart(ctx, {
          type: 'line',
          data: {
            labels: dailyData.map(d => d.date.slice(5)), // MM-DD
            datasets: [
              {
                label: '已完成',
                data: dailyData.map(d => d.completed),
                borderColor: '#378ADD',
                backgroundColor: 'rgba(55,138,221,0.1)',
                tension: 0.3,
                fill: true,
              },
              {
                label: '总数',
                data: dailyData.map(d => d.total),
                borderColor: 'var(--color-border-tertiary, #888)',
                borderDash: [4, 4],
                fill: false,
                tension: 0.3,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { labels: { boxWidth: 12, font: { size: 11 } } } },
            scales: {
              y: { beginAtZero: true, ticks: { stepSize: 1, font: { size: 10 } } },
            },
          },
        }));
      }
      setChartInstances(newInstances);
    }).catch(() => {});
    return () => { newInstances.forEach((c: any) => c.destroy()); };
  }, [loading, stageData, weekData, dailyData]);

  const overall = getOverallProgress();

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 600, margin: '0 0 4px' }}>进度统计</h2>
        <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', margin: 0 }}>
          可视化你的学习进度，持续追踪完成情况
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-tertiary)' }}>加载中...</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* 总进度卡片 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
            <Card>
              <CardContent style={{ padding: '16px' }}>
                <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>总进度</div>
                <div style={{ fontSize: '24px', fontWeight: 600 }}>{overall.pct}%</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent style={{ padding: '16px' }}>
                <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>已完成</div>
                <div style={{ fontSize: '24px', fontWeight: 600, color: 'var(--color-success)' }}>{overall.completed}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent style={{ padding: '16px' }}>
                <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>总任务数</div>
                <div style={{ fontSize: '24px', fontWeight: 600 }}>{overall.total}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent style={{ padding: '16px' }}>
                <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>进行中阶段</div>
                <div style={{ fontSize: '24px', fontWeight: 600 }}>
                  {stageData.find(s => s.progress_pct > 0 && s.progress_pct < 100)?.stage_name || '—'}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 阶段进度环形图 */}
          <Card>
            <CardHeader><CardTitle style={{ fontSize: '14px' }}>各阶段完成情况</CardTitle></CardHeader>
            <CardContent>
              <div style={{ height: '280px', position: 'relative' }}>
                <canvas ref={stageChartRef} />
              </div>
            </CardContent>
          </Card>

          {/* 周进度柱状图 */}
          <Card>
            <CardHeader><CardTitle style={{ fontSize: '14px' }}>周进度（已完成 vs 总数）</CardTitle></CardHeader>
            <CardContent>
              <div style={{ height: '280px', position: 'relative' }}>
                <canvas ref={weekChartRef} />
              </div>
            </CardContent>
          </Card>

          {/* 每日完成折线图 */}
          <Card>
            <CardHeader><CardTitle style={{ fontSize: '14px' }}>最近14天每日完成数</CardTitle></CardHeader>
            <CardContent>
              <div style={{ height: '280px', position: 'relative' }}>
                <canvas ref={dailyChartRef} />
              </div>
            </CardContent>
          </Card>

          {/* 阶段明细表格 */}
          <Card>
            <CardHeader><CardTitle style={{ fontSize: '14px' }}>阶段明细</CardTitle></CardHeader>
            <CardContent>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', fontSize: '13px', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '0.5px solid var(--color-border-tertiary)' }}>
                      <th style={{ textAlign: 'left', padding: '8px 10px', fontWeight: 500 }}>阶段</th>
                      <th style={{ textAlign: 'center', padding: '8px 10px', fontWeight: 500 }}>总任务</th>
                      <th style={{ textAlign: 'center', padding: '8px 10px', fontWeight: 500 }}>已完成</th>
                      <th style={{ textAlign: 'center', padding: '8px 10px', fontWeight: 500 }}>进度</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stageData.map(s => (
                      <tr key={s.stage_id} style={{ borderBottom: '0.5px solid var(--color-border-tertiary)' }}>
                        <td style={{ padding: '8px 10px' }}>{s.stage_name}</td>
                        <td style={{ textAlign: 'center', padding: '8px 10px' }}>{s.total_tasks}</td>
                        <td style={{ textAlign: 'center', padding: '8px 10px', color: 'var(--color-success)' }}>{s.completed_tasks}</td>
                        <td style={{ padding: '8px 10px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ flex: 1, height: '6px', background: 'var(--color-border-tertiary)', borderRadius: '3px', overflow: 'hidden' }}>
                              <div style={{ height: '100%', width: `${s.progress_pct}%`, background: 'var(--color-text-primary)', borderRadius: '3px' }} />
                            </div>
                            <span style={{ fontSize: '12px', minWidth: '36px' }}>{s.progress_pct}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
