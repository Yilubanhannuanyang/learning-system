import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { OpenSourceProject, UserProject, ProjectWithUserStatus } from '../types';

// ========== 开源项目 Hook ==========
export function useProjects(user_id: string | undefined, stage_id: number = 0) {
  const [projects, setProjects] = useState<ProjectWithUserStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProject, setEditingProject] = useState<OpenSourceProject | null>(null);

  // 加载项目列表（含用户状态）
  const loadProjects = useCallback(async () => {
    if (!user_id) { setLoading(false); return; }
    setLoading(true);

    // 1. 加载所有项目
    let query = supabase.from('open_source_projects').select('*').order('stage_id').order('difficulty', { ascending: false }).order('stars', { ascending: false });
    const { data: allProjects, error } = await query;
    if (error || !allProjects) { setLoading(false); return; }

    // 2. 加载用户的项目状态
    const { data: userProjects } = await supabase
      .from('user_projects')
      .select('*')
      .eq('user_id', user_id);

    const userProjectMap = new Map<string, UserProject>();
    (userProjects || []).forEach((up: any) => userProjectMap.set(up.project_id, up as UserProject));

    // 3. 合并
    const merged: ProjectWithUserStatus[] = (allProjects as OpenSourceProject[]).map(p => {
      const up = userProjectMap.get(p.id!);
      return {
        ...p,
        user_project_id: up?.id,
        status: up?.status || 'todo',
        user_note: up?.note || null,
      };
    });

    setProjects(merged);
    setLoading(false);
  }, [user_id]);

  useEffect(() => { loadProjects(); }, [loadProjects]);

  // 添加一个项目（用户自定义）
  const addProject = useCallback(async (project: Omit<OpenSourceProject, 'id' | 'created_at' | 'updated_at'>) => {
    if (!user_id) return;
    const { error } = await supabase.from('open_source_projects').insert({
      ...project,
      created_by: user_id,
      is_builtin: false,
    });
    if (!error) await loadProjects();
  }, [user_id, loadProjects]);

  // 更新项目状态（todo / in_progress / completed）
  const updateProjectStatus = useCallback(async (projectId: string, status: 'todo' | 'in_progress' | 'completed') => {
    if (!user_id) return;
    const existing = projects.find(p => p.id === projectId);
    
    if (existing?.user_project_id) {
      await supabase
        .from('user_projects')
        .update({ 
          status, 
          completed_at: status === 'completed' ? new Date().toISOString() : null,
          updated_at: new Date().toISOString() 
        })
        .eq('id', existing.user_project_id);
    } else {
      await supabase
        .from('user_projects')
        .insert({
          user_id,
          project_id: projectId,
          status,
          completed_at: status === 'completed' ? new Date().toISOString() : null,
        });
    }
    await loadProjects();
  }, [user_id, projects, loadProjects]);

  // 更新项目笔记
  const updateProjectNote = useCallback(async (projectId: string, note: string) => {
    if (!user_id) return;
    const existing = projects.find(p => p.id === projectId);
    
    if (existing?.user_project_id) {
      await supabase
        .from('user_projects')
        .update({ note, updated_at: new Date().toISOString() })
        .eq('id', existing.user_project_id);
    } else {
      await supabase
        .from('user_projects')
        .insert({
          user_id,
          project_id: projectId,
          status: 'todo',
          note,
        });
    }
    await loadProjects();
  }, [user_id, projects, loadProjects]);

  return {
    projects: stage_id > 0 ? projects.filter(p => p.stage_id === stage_id) : projects,
    allProjects: projects,
    loading,
    showAddModal,
    setShowAddModal,
    editingProject,
    setEditingProject,
    addProject,
    updateProjectStatus,
    updateProjectNote,
    loadProjects,
  };
}
