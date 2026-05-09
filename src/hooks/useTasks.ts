import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { generateTasks, LEARNING_STAGES } from '../lib/learningData';
import type { Task, TaskCompletion, TaskWithCompletion, LearningStage, StageProgress, WeekProgress, DailyCompletion } from '../types';

// ========== 从 supabase 加载任务完成状态 ==========
export function useTasks(user_id: string | undefined, settings: { start_date: string } | null) {
  const [tasks, setTasks] = useState<TaskWithCompletion[]>([]);
  const [loading, setLoading] = useState(true);
  const [stages] = useState<LearningStage[]>(() => {
    return LEARNING_STAGES;
  });

  // 生成所有任务（基于开始日期）
  const allTasks = getTasksForUser(settings?.start_date || '2026-05-09');

  // 加载完成状态
  const loadCompletions = useCallback(async () => {
    if (!user_id) { setLoading(false); return; }
    setLoading(true);
    const { data } = await supabase
      .from('task_completions')
      .select('*')
      .eq('user_id', user_id);
    const completionMap = new Map<string, TaskCompletion>();
    (data || []).forEach((c: any) => completionMap.set(c.task_id, c as TaskCompletion));

    const merged: TaskWithCompletion[] = allTasks.map(t => {
      const c = completionMap.get(t.id);
      return {
        ...t,
        completion_id: c?.id,
        completed: c?.completed || false,
        completed_at: c?.completed_at || null,
        note: c?.note || null,
      };
    });
    setTasks(merged);
    setLoading(false);
  }, [user_id, settings?.start_date]);

  useEffect(() => { loadCompletions(); }, [loadCompletions]);

  // 切换任务完成状态
  const toggleTask = useCallback(async (taskId: string, completed: boolean) => {
    if (!user_id) return;
    const existing = tasks.find(t => t.id === taskId);
    if (existing?.completion_id) {
      // 更新
      await supabase
        .from('task_completions')
        .update({
          completed,
          completed_at: completed ? new Date().toISOString() : null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.completion_id);
    } else {
      // 插入
      await supabase
        .from('task_completions')
        .insert({
          user_id,
          task_id: taskId,
          completed,
          completed_at: completed ? new Date().toISOString() : null,
        });
    }
    await loadCompletions();
    // 检查是否需要发送提醒
    checkAndSendReminder(user_id, settings);
  }, [user_id, tasks, settings, loadCompletions]);

  // 更新任务笔记
  const updateNote = useCallback(async (taskId: string, note: string) => {
    if (!user_id) return;
    const existing = tasks.find(t => t.id === taskId);
    if (existing?.completion_id) {
      await supabase
        .from('task_completions')
        .update({ note, updated_at: new Date().toISOString() })
        .eq('id', existing.completion_id);
    } else {
      await supabase
        .from('task_completions')
        .insert({ user_id, task_id: taskId, completed: false, note });
    }
    await loadCompletions();
  }, [user_id, tasks, loadCompletions]);

  return { tasks, loading, toggleTask, updateNote, stages, allTasks };
}

// ========== 生成任务列表（客户端）==========
function getTasksForUser(startDate: string): Task[] {
  return generateTasks(startDate);
}

// ========== 提醒检查 ==========
async function checkAndSendReminder(user_id: string, settings: { server_chan_key?: string; reminder_enabled?: boolean; start_date: string } | null) {
  if (!settings?.reminder_enabled || !settings?.server_chan_key) return;
  const start = new Date(settings.start_date);
  const today = new Date();
  start.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  const diffDays = Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  const weekNum = Math.floor(diffDays / 7) + 1;
  const dayNum = (diffDays % 7) + 1;

  // 获取今日未完成任务
  const { data: completions } = await supabase
    .from('task_completions')
    .select('task_id, completed')
    .eq('user_id', user_id);
  const completedIds = new Set((completions || []).filter((c: any) => c.completed).map((c: any) => c.task_id));

  const generatedTasks = generateTasks(settings.start_date);
  const todayTasks = generatedTasks.filter(t => t.week_num === weekNum && t.day_num === dayNum);
  const undone = todayTasks.filter(t => !completedIds.has(t.id));

  if (undone.length > 0) {
    // 调用 Server酱 推送
    const desp = undone.map(t => `- [ ] ${t.content}`).join('\n');
    await fetch(`https://sctapi.ftqq.com/${settings.server_chan_key}.send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: `📅 今日学习任务提醒（第${weekNum}周 第${dayNum}天）`,
        desp: `## 未完成任务（${undone.length}项）\n\n${desp}\n\n> 打开 App 标记完成：\${window.location.origin}`,
      }),
    }).catch(() => {});
  }
}

// ========== 统计数据计算 ==========
export function useTaskStats(tasks: TaskWithCompletion[]) {
  const getStageProgress = (): StageProgress[] => {
    const result: StageProgress[] = [];
    for (let stageId = 1; stageId <= 5; stageId++) {
      const st = tasks.filter(t => t.stage_id === stageId);
      result.push({
        stage_id: stageId,
        stage_name: ['基础铺垫','核心框架','RAG & 多Agent','工程化部署','项目实战求职'][stageId - 1],
        total_tasks: st.length,
        completed_tasks: st.filter(t => t.completed).length,
        progress_pct: st.length ? Math.round(st.filter(t => t.completed).length / st.length * 100) : 0,
      });
    }
    return result;
  };

  const getWeekProgress = (weekNum: number): WeekProgress => {
    const wt = tasks.filter(t => t.week_num === weekNum);
    return {
      week_num: weekNum,
      total_tasks: wt.length,
      completed_tasks: wt.filter(t => t.completed).length,
      progress_pct: wt.length ? Math.round(wt.filter(t => t.completed).length / wt.length * 100) : 0,
    };
  };

  const getDailyCompletions = (days: number): DailyCompletion[] => {
    const result: DailyCompletion[] = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dt = tasks.filter(t => t.date === dateStr);
      result.push({
        date: dateStr,
        completed: dt.filter(t => t.completed).length,
        total: dt.length,
      });
    }
    return result;
  };

  const getOverallProgress = () => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    return { total, completed, pct: total ? Math.round(completed / total * 100) : 0 };
  };

  return { getStageProgress, getWeekProgress, getDailyCompletions, getOverallProgress };
}
