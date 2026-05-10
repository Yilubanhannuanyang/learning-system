// ============================================================
// useExams.ts - 考试计划相关Hooks
// ============================================================
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { ExamTemplate, UserExam, UserExamTask } from '../types';

// ========== 获取考试模板列表 ==========
export function useExamTemplates(category?: string) {
  const [templates, setTemplates] = useState<ExamTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchTemplates = useCallback(async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('exam_templates')
        .select('*')
        .order('category', { ascending: true })
        .order('total_days', { ascending: true });

      if (category) {
        query = query.eq('category', category);
      }

      const { data, error } = await query;

      if (error) throw error;
      setTemplates(data || []);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  return { templates, loading, error, refetch: fetchTemplates };
}

// ========== 获取用户考试计划列表 ==========
export function useUserExams(userId: string | undefined) {
  const [exams, setExams] = useState<UserExam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchExams = useCallback(async () => {
    if (!userId) {
      setExams([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_exams')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setExams(data || []);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchExams();
  }, [fetchExams]);

  return { exams, loading, error, refetch: fetchExams };
}

// ========== 创建用户考试计划 ==========
export function useCreateUserExam() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createExam = useCallback(async (
    userId: string,
    examTemplateId: string,
    examName: string,
    startDate: string,
    examDate: string
  ) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: supaError } = await supabase
        .from('user_exams')
        .insert({
          user_id: userId,
          exam_template_id: examTemplateId,
          exam_name: examName,
          start_date: startDate,
          exam_date: examDate,
          status: 'active'
        })
        .select()
        .single();

      if (supaError) throw supaError;
      return { data, error: null };
    } catch (err) {
      const e = err as Error;
      setError(e);
      return { data: null, error: e };
    } finally {
      setLoading(false);
    }
  }, []);

  return { createExam, loading, error };
}

// ========== 获取用户考试任务 ==========
export function useUserExamTasks(userExamId: string | undefined) {
  const [tasks, setTasks] = useState<UserExamTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchTasks = useCallback(async () => {
    if (!userExamId) {
      setTasks([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_exam_tasks')
        .select('*')
        .eq('user_exam_id', userExamId)
        .order('task_date', { ascending: true });

      if (error) throw error;
      setTasks(data || []);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [userExamId]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return { tasks, loading, error, refetch: fetchTasks };
}

// ========== 更新任务完成状态 ==========
export function useUpdateExamTask() {
  const [loading, setLoading] = useState(false);

  const toggleTask = useCallback(async (taskId: string, isCompleted: boolean) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('user_exam_tasks')
        .update({
          is_completed: isCompleted,
          completed_at: isCompleted ? new Date().toISOString() : null
        })
        .eq('id', taskId);

      if (error) throw error;
      return { error: null };
    } catch (err) {
      return { error: err as Error };
    } finally {
      setLoading(false);
    }
  }, []);

  return { toggleTask, loading };
}

// ========== 删除用户考试计划 ==========
export function useDeleteUserExam() {
  const [loading, setLoading] = useState(false);

  const deleteExam = useCallback(async (examId: string) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('user_exams')
        .delete()
        .eq('id', examId);

      if (error) throw error;
      return { error: null };
    } catch (err) {
      return { error: err as Error };
    } finally {
      setLoading(false);
    }
  }, []);

  return { deleteExam, loading };
}
