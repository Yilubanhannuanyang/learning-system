// ============================================================
// Roadmap 页面 - 完整学习路线（可勾选任务）
// ============================================================
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '../hooks/useAuth';
import { useTasks } from '../hooks/useTasks';
import { LEARNING_STAGES } from '../lib/learningData';
import type { TaskWithCompletion } from '../types';

const DIFF_LABEL: Record<string, string> = { simple: '简单', medium: '中等', advanced: '进阶' };
const DIFF_COLOR: Record<string, string> = {
  simple: 'var(--color-success)',
  medium: 'var(--color-warning)',
  advanced: 'var(--color-danger)',
};

// 阶段颜色映射
const STAGE_COLOR: Record<number, string> = {
  1: '#7F77DD',
  2: '#1D9E75',
  3: '#D85A30',
  4: '#378ADD',
  5: '#639922',
};

export function RoadmapPage() {
  const { user, settings } = useAuth();
  const { tasks, loading, toggleTask, updateNote } = useTasks(user?.id, settings);
  const [expandedStage, setExpandedStage] = useState<number | null>(1);
  const [expandedWeek, setExpandedWeek] = useState<number | null>(1);
  const [noteModal, setNoteModal] = useState<TaskWithCompletion | null>(null);
  const [noteText, setNoteText] = useState('');

  const handleNoteSave = async () => {
    if (!noteModal) return;
    await updateNote(noteModal.id, noteText);
    setNoteModal(null);
    setNoteText('');
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 600, margin: '0 0 4px' }}>
          学习路线图
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', margin: 0 }}>
          点击阶段展开每周任务，勾选完成任务
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-tertiary)' }}>
          加载中...
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {LEARNING_STAGES.map(stage => {
            const stageTasks = tasks.filter(t => t.stage_id === stage.id);
            const completed = stageTasks.filter(t => t.completed).length;
            const total = stageTasks.length;
            const pct = total > 0 ? Math.round(completed / total * 100) : 0;
            const isExpanded = expandedStage === stage.id;

            return (
              <Card key={stage.id} style={{ borderLeft: `4px solid ${STAGE_COLOR[stage.id]}` }}>
                <CardHeader
                  style={{ cursor: 'pointer', paddingBottom: '8px' }}
                  onClick={() => setExpandedStage(isExpanded ? null : stage.id)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '18px' }}>{stage.icon}</span>
                      <CardTitle style={{ fontSize: '15px' }}>
                        {stage.name}
                      </CardTitle>
                      <Badge style={{ fontSize: '11px', background: 'var(--color-background-secondary)', color: 'var(--color-text-secondary)' }}>
                        {stage.description}
                      </Badge>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                        {completed}/{total} · {pct}%
                      </span>
                      <div
                        style={{
                          width: '80px',
                          height: '6px',
                          background: 'var(--color-border-tertiary)',
                          borderRadius: '3px',
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            height: '100%',
                            width: `${pct}%`,
                            background: STAGE_COLOR[stage.id],
                            borderRadius: '3px',
                            transition: 'width 0.3s ease',
                          }}
                        />
                      </div>
                      <span style={{ fontSize: '12px', color: 'var(--color-text-tertiary)' }}>
                        {isExpanded ? '收起 ▲' : '展开 ▼'}
                      </span>
                    </div>
                  </div>
                </CardHeader>

                {isExpanded && (
                  <CardContent>
                    {/* 周次列表 */}
                    {Array.from({ length: stage.week_end - stage.week_start + 1 }, (_, i) => {
                      const weekNum = stage.week_start + i;
                      const weekTasks = tasks.filter(t => t.week_num === weekNum);
                      const weekCompleted = weekTasks.filter(t => t.completed).length;
                      const weekTotal = weekTasks.length;
                      const weekPct = weekTotal > 0 ? Math.round(weekCompleted / weekTotal * 100) : 0;
                      const isWeekExpanded = expandedWeek === weekNum;

                      return weekTasks.length === 0 ? null : (
                        <div key={weekNum} style={{ marginBottom: '8px' }}>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              padding: '6px 8px',
                              background: 'var(--color-background-secondary)',
                              borderRadius: 'var(--border-radius-md)',
                              cursor: 'pointer',
                              fontSize: '13px',
                            }}
                            onClick={() => setExpandedWeek(isWeekExpanded ? null : weekNum)}
                          >
                            <span style={{ fontWeight: 500 }}>第 {weekNum} 周</span>
                            <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                              {weekCompleted}/{weekTotal}
                            </span>
                            <div
                              style={{
                                flex: 1,
                                height: '4px',
                                background: 'var(--color-border-tertiary)',
                                borderRadius: '2px',
                                overflow: 'hidden',
                              }}
                            >
                              <div
                                style={{
                                  height: '100%',
                                  width: `${weekPct}%`,
                                  background: 'var(--color-text-primary)',
                                  borderRadius: '2px',
                                }}
                              />
                            </div>
                            <span style={{ fontSize: '11px', color: 'var(--color-text-tertiary)' }}>
                              {isWeekExpanded ? '▲' : '▼'}
                            </span>
                          </div>

                          {isWeekExpanded && (
                            <div style={{ padding: '8px 0 4px 12px' }}>
                              {weekTasks
                                .sort((a, b) => a.day_num - b.day_num)
                                .map(task => (
                                  <div
                                    key={task.id}
                                    style={{
                                      display: 'flex',
                                      alignItems: 'flex-start',
                                      gap: '8px',
                                      padding: '6px 0',
                                      opacity: task.completed ? 0.6 : 1,
                                    }}
                                  >
                                    <Checkbox
                                      checked={task.completed}
                                      onCheckedChange={async (checked) => {
                                        await toggleTask(task.id, checked === true);
                                      }}
                                      style={{ marginTop: '2px' }}
                                    />
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                      <div
                                        style={{
                                          fontSize: '13px',
                                          textDecoration: task.completed ? 'line-through' : 'none',
                                          color: task.completed ? 'var(--color-text-tertiary)' : 'var(--color-text-primary)',
                                          lineHeight: '1.5',
                                        }}
                                      >
                                        第{task.day_num}天：{task.content}
                                      </div>
                                      {task.description && (
                                        <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', lineHeight: '1.4', marginTop: '2px' }}>
                                          {task.description}
                                        </div>
                                      )}
                                      <div style={{ display: 'flex', gap: '6px', marginTop: '4px', alignItems: 'center', flexWrap: 'wrap' }}>
                                        <Badge
                                          style={{
                                            fontSize: '10px',
                                            background: DIFF_COLOR[task.difficulty] + '20',
                                            color: DIFF_COLOR[task.difficulty],
                                            border: 'none',
                                          }}
                                        >
                                          {DIFF_LABEL[task.difficulty]}
                                        </Badge>
                                        {task.repo_url && (
                                          <a
                                            href={task.repo_url}
                                            target="_blank"
                                            rel="noreferrer"
                                            style={{ fontSize: '11px', color: 'var(--color-text-info)' }}
                                          >
                                            🔗 相关项目
                                          </a>
                                        )}
                                        <button
                                          onClick={() => { setNoteModal(task); setNoteText(task.note || ''); }}
                                          style={{
                                            background: 'none',
                                            border: 'none',
                                            color: 'var(--color-text-tertiary)',
                                            fontSize: '11px',
                                            cursor: 'pointer',
                                          }}
                                        >
                                          {task.note ? '📝 查看笔记' : '📝 添加笔记'}
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {/* 笔记弹窗 */}
      {noteModal && (
        <div
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
          }}
          onClick={() => setNoteModal(null)}
        >
          <div
            style={{
              background: 'var(--color-background-primary)',
              borderRadius: 'var(--border-radius-lg)',
              padding: '20px',
              width: '90%',
              maxWidth: '500px',
            }}
            onClick={e => e.stopPropagation()}
          >
            <h3 style={{ fontSize: '15px', fontWeight: 600, margin: '0 0 12px' }}>
              📝 {noteModal.content}
            </h3>
            <Label>笔记</Label>
            <Textarea
              value={noteText}
              onChange={e => setNoteText(e.target.value)}
              placeholder="记录你的学习心得、问题、解决方案..."
              style={{ minHeight: '120px', marginTop: '6px' }}
            />
            <div style={{ display: 'flex', gap: '8px', marginTop: '12px', justifyContent: 'flex-end' }}>
              <Button variant="outline" onClick={() => setNoteModal(null)}>取消</Button>
              <Button onClick={handleNoteSave}>保存</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
