// ============================================================
// Dashboard 页面 - 今日任务看板（默认首页）
// ============================================================
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useAuth } from '../hooks/useAuth';
import { useTasks, useTaskStats } from '../hooks/useTasks';
import { LEARNING_STAGES, getTodayWeekAndDay } from '../lib/learningData';
import type { LearningStage, TaskWithCompletion } from '../types';

export function DashboardPage() {
  const { user, settings } = useAuth();
  const { tasks, loading, toggleTask, updateNote } = useTasks(user?.id, settings);
  const { getStageProgress, getOverallProgress } = useTaskStats(tasks);
  const [todayTasks, setTodayTasks] = useState<TaskWithCompletion[]>([]);
  const [reminderMsg, setReminderMsg] = useState<string | null>(null);
  const [noteModalTask, setNoteModalTask] = useState<TaskWithCompletion | null>(null);
  const [noteText, setNoteText] = useState('');

  // 计算今天是第几周第几天
  const todayInfo = getTodayWeekAndDay(settings?.start_date || '2026-05-09');
  const currentStage: LearningStage | undefined = LEARNING_STAGES.find(
    s => s.id === (todayInfo.week <= 4 ? 1 : todayInfo.week <= 9 ? 2 : todayInfo.week <= 14 ? 3 : todayInfo.week <= 18 ? 4 : 5)
  );

  useEffect(() => {
    if (tasks.length === 0) return;
    const filtered = tasks.filter(
      t => t.week_num === todayInfo.week && t.day_num === todayInfo.day
    );
    setTodayTasks(filtered);
  }, [tasks, todayInfo]);

  // 检查未完成提醒
  useEffect(() => {
    if (todayTasks.length === 0) return;
    const undone = todayTasks.filter(t => !t.completed);
    if (undone.length > 0) {
      setReminderMsg(`今日还有 ${undone.length} 项任务未完成，加油！`);
    } else {
      setReminderMsg(null);
    }
  }, [todayTasks]);

  const overall = getOverallProgress();
  const stageProgress = currentStage ? getStageProgress().find(s => s.stage_id === currentStage.id) : null;

  const difficultyColor: Record<string, string> = {
    simple: 'var(--color-success)',
    medium: 'var(--color-warning)',
    advanced: 'var(--color-danger)',
  };
  const difficultyLabel: Record<string, string> = { simple: '简单', medium: '中等', advanced: '进阶' };

  const handleNoteSave = async () => {
    if (!noteModalTask) return;
    await updateNote(noteModalTask.id, noteText);
    setNoteModalTask(null);
    setNoteText('');
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      {/* 页面标题 */}
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 600, margin: '0 0 4px' }}>
          📅 今日任务看板
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', margin: 0 }}>
          第 <strong>{todayInfo.week}</strong> 周 · 第 <strong>{todayInfo.day}</strong> 天
          {currentStage && (
            <Badge style={{ marginLeft: '8px', background: 'var(--color-background-secondary)', color: 'var(--color-text-primary)' }}>
              {currentStage.icon} {currentStage.name}
            </Badge>
          )}
        </p>
      </div>

      {/* 提醒 Banner */}
      {reminderMsg && (
        <Alert
          style={{
            marginBottom: '16px',
            borderColor: 'var(--color-border-warning)',
            background: 'var(--color-background-primary)',
          }}
        >
          <AlertDescription style={{ color: 'var(--color-text-warning)', fontSize: '13px' }}>
            ⏰ {reminderMsg}
          </AlertDescription>
        </Alert>
      )}

      {/* 总进度 + 阶段进度 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
        <Card>
          <CardHeader style={{ paddingBottom: '8px' }}>
            <CardTitle style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-secondary)' }}>
              总进度
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ fontSize: '28px', fontWeight: 600, marginBottom: '4px' }}>{overall.pct}%</div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
              已完成 {overall.completed} / {overall.total} 项
            </div>
          </CardContent>
        </Card>
        {stageProgress && currentStage && (
          <Card>
            <CardHeader style={{ paddingBottom: '8px' }}>
              <CardTitle style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-secondary)' }}>
                {currentStage.icon} {currentStage.name} · 阶段进度
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div style={{ fontSize: '28px', fontWeight: 600, marginBottom: '4px' }}>{stageProgress.progress_pct}%</div>
              <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                已完成 {stageProgress.completed_tasks} / {stageProgress.total_tasks} 项
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* 今日任务列表 */}
      <Card>
        <CardHeader>
          <CardTitle style={{ fontSize: '15px' }}>
            今日任务（{todayTasks.filter(t => t.completed).length} / {todayTasks.length} 已完成）
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '20px', color: 'var(--color-text-tertiary)' }}>
              加载中...
            </div>
          ) : todayTasks.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px', color: 'var(--color-text-tertiary)' }}>
              今日无任务安排，可前往「学习路线」查看完整计划
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {todayTasks.map(task => (
                <div
                  key={task.id}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    padding: '10px 12px',
                    background: task.completed ? 'var(--color-background-secondary)' : 'var(--color-background-primary)',
                    border: '0.5px solid var(--color-border-tertiary)',
                    borderRadius: 'var(--border-radius-md)',
                    opacity: task.completed ? 0.7 : 1,
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
                        fontWeight: 500,
                        textDecoration: task.completed ? 'line-through' : 'none',
                        color: task.completed ? 'var(--color-text-tertiary)' : 'var(--color-text-primary)',
                        lineHeight: '1.5',
                      }}
                    >
                      {task.content}
                    </div>
                    {task.description && (
                      <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '2px', lineHeight: '1.4' }}>
                        {task.description}
                      </div>
                    )}
                    <div style={{ display: 'flex', gap: '6px', marginTop: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
                      <Badge
                        style={{
                          fontSize: '11px',
                          background: difficultyColor[task.difficulty] + '20',
                          color: difficultyColor[task.difficulty],
                          border: 'none',
                        }}
                      >
                        {difficultyLabel[task.difficulty]}
                      </Badge>
                      {task.repo_url && (
                        <a
                          href={task.repo_url}
                          target="_blank"
                          rel="noopener"
                          style={{ fontSize: '11px', color: 'var(--color-text-info)' }}
                        >
                          🔗 相关项目
                        </a>
                      )}
                      <button
                        onClick={() => { setNoteModalTask(task); setNoteText(task.note || ''); }}
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
        </CardContent>
      </Card>

      {/* 笔记弹窗 */}
      {noteModalTask && (
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
          onClick={() => setNoteModalTask(null)}
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
              📝 {noteModalTask.content}
            </h3>
            <Label>笔记</Label>
            <Textarea
              value={noteText}
              onChange={e => setNoteText(e.target.value)}
              placeholder="记录你的学习心得、问题、解决方案..."
              style={{ minHeight: '120px', marginTop: '6px' }}
            />
            <div style={{ display: 'flex', gap: '8px', marginTop: '12px', justifyContent: 'flex-end' }}>
              <Button variant="outline" onClick={() => setNoteModalTask(null)}>取消</Button>
              <Button onClick={handleNoteSave}>保存</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
