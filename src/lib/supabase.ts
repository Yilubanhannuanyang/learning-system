// ============================================================
// Supabase 客户端配置
// ============================================================
// 部署前请替换为你自己的 Supabase 项目 URL 和 Anon Key
// 1. 前往 https://supabase.com 创建项目
// 2. 在 Project Settings → API 中获取 URL 和 anon key
// 3. 执行下方 SQL 建表（见文件底部 SQL 脚本）
// ============================================================

import { createClient } from '@supabase/supabase-js';
export type { User, UserSettings } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://YOUR_PROJECT_ID.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_ANON_KEY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export default supabase;

// ============================================================
// 数据库建表 SQL（在 Supabase SQL Editor 中执行）
// ============================================================
/**
-- 1. 用户设置表
CREATE TABLE user_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  server_chan_key TEXT,
  start_date DATE NOT NULL DEFAULT '2026-05-09',
  reminder_enabled BOOLEAN NOT NULL DEFAULT false,
  reminder_hour INT NOT NULL DEFAULT 8,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- 2. 任务表（系统预置，所有用户共享）
CREATE TABLE tasks (
  id TEXT PRIMARY KEY,
  stage_id INT NOT NULL,
  week_num INT NOT NULL,
  day_num INT NOT NULL,
  date DATE NOT NULL,
  content TEXT NOT NULL,
  description TEXT,
  repo_url TEXT,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('simple','medium','advanced')),
  sort_order INT NOT NULL DEFAULT 0
);

-- 3. 任务完成记录表
CREATE TABLE task_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  task_id TEXT REFERENCES tasks(id) ON DELETE CASCADE NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMPTZ,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, task_id)
);

-- 4. 开源项目表（系统预置 + 用户添加）
CREATE TABLE open_source_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stage_id INT NOT NULL,
  name TEXT NOT NULL,
  repo_url TEXT NOT NULL,
  github_url TEXT NOT NULL,
  description TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('simple','medium','advanced')),
  stars INT NOT NULL DEFAULT 0,
  practice_focus TEXT NOT NULL,
  interview_relevance TEXT NOT NULL,
  tags TEXT[] NOT NULL DEFAULT '{}',
  is_builtin BOOLEAN NOT NULL DEFAULT true,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. 用户项目练习记录表
CREATE TABLE user_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  project_id UUID REFERENCES open_source_projects(id) ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('todo','in_progress','completed')) DEFAULT 'todo',
  note TEXT,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, project_id)
);

-- 6. 启用 RLS（行级安全）
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE open_source_projects ENABLE ROW LEVEL SECURITY;

-- 7. RLS 策略
-- user_settings: 用户只能操作自己的设置
CREATE POLICY "Users can manage own settings" ON user_settings
  FOR ALL USING (auth.uid() = user_id);

-- task_completions: 用户只能操作自己的完成记录
CREATE POLICY "Users can manage own task completions" ON task_completions
  FOR ALL USING (auth.uid() = user_id);

-- user_projects: 用户只能操作自己的项目记录
CREATE POLICY "Users can manage own project records" ON user_projects
  FOR ALL USING (auth.uid() = user_id);

-- open_source_projects: 所有人可读，创建者可修改自己的，系统预置只有管理员可改
CREATE POLICY "Anyone can view projects" ON open_source_projects
  FOR SELECT USING (true);
CREATE POLICY "Users can insert own projects" ON open_source_projects
  FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Users can update own projects" ON open_source_projects
  FOR UPDATE USING (auth.uid() = created_by);

-- 8. 初始数据：将学习任务插入 tasks 表（见 learningData.ts 的 SQL 导出）
-- 见 /src/lib/seedTasks.sql（项目生成后运行）

-- 9. 触发器：自动更新 updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_settings_updated_at BEFORE UPDATE ON user_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_task_completions_updated_at BEFORE UPDATE ON task_completions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_open_source_projects_updated_at BEFORE UPDATE ON open_source_projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_user_projects_updated_at BEFORE UPDATE ON user_projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
**/
