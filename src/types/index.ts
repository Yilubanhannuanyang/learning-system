// ============================================================
// Agent 学习管理系统 - TypeScript 类型定义
// ============================================================

// ---------- 用户相关 ----------
export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface UserSettings {
  id?: string;
  user_id: string;
  server_chan_key: string | null;         // Server酱 SCKEY
  start_date: string;                      // 学习开始日期 YYYY-MM-DD
  reminder_enabled: boolean;
  reminder_hour: number;                  // 提醒时间（小时 0-23）
  created_at?: string;
  updated_at?: string;
}

// ---------- 任务相关 ----------
export type Difficulty = 'simple' | 'medium' | 'advanced';

export interface Task {
  id: string;
  stage_id: number;
  week_num: number;
  day_num: number;
  date: string;                           // YYYY-MM-DD
  content: string;
  description?: string;
  repo_url?: string;                      // 关联开源项目链接
  difficulty: Difficulty;
  sort_order: number;
}

export interface TaskCompletion {
  id?: string;
  user_id: string;
  task_id: string;
  completed: boolean;
  completed_at: string | null;
  note: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface TaskWithCompletion extends Task {
  completion_id?: string;
  completed: boolean;
  completed_at: string | null;
  note: string | null;
}

// ---------- 开源项目相关 ----------
export interface OpenSourceProject {
  id?: string;
  stage_id: number;
  name: string;
  repo_url: string;
  github_url: string;
  description: string;
  difficulty: Difficulty;
  stars: number;
  practice_focus: string;                 // 练习重点
  interview_relevance: string;            // 面试相关度说明
  tags: string[];                         // 技术标签
  is_builtin: boolean;                   // 是否系统预置
  created_by?: string;
  created_at?: string;
  updated_at?: string;
}

export interface UserProject {
  id?: string;
  user_id: string;
  project_id: string;
  status: 'todo' | 'in_progress' | 'completed';
  note: string | null;
  completed_at: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface ProjectWithUserStatus extends OpenSourceProject {
  user_project_id?: string;
  status: 'todo' | 'in_progress' | 'completed';
  user_note: string | null;
}

// ---------- 学习阶段 ----------
export interface LearningStage {
  id: number;
  name: string;
  name_en: string;
  description: string;
  color: string;           // 阶段主题色（CSS 变量名）
  icon: string;            // emoji 图标
  week_start: number;      // 起始周次
  week_end: number;        // 结束周次
}

// ---------- 统计数据 ----------
export interface StageProgress {
  stage_id: number;
  stage_name: string;
  total_tasks: number;
  completed_tasks: number;
  progress_pct: number;
}

export interface WeekProgress {
  week_num: number;
  total_tasks: number;
  completed_tasks: number;
  progress_pct: number;
}

export interface DailyCompletion {
  date: string;
  completed: number;
  total: number;
}

// ---------- 路由 ----------
export type AppPage = 'dashboard' | 'roadmap' | 'exams' | 'projects' | 'stats' | 'settings' | 'login';

// ---------- Server酱 ----------
export interface ServerChanPayload {
  title: string;
  desp: string;          // 正文（支持 Markdown）
}

export interface ServerChanResponse {
  code: number;
  message: string;
  data?: {
    pushid: string;
    readkey: string;
    error?: string;
  };
}

// ---------- 考试系统 ----------
export interface ExamTemplate {
  id: string;
  name: string;
  category: string;
  total_days: number;
  description: string | null;
  icon: string | null;
  created_at: string;
}

export interface ExamTaskTemplate {
  id: string;
  exam_template_id: string;
  day_offset: number;
  phase: string;
  week_number: number | null;
  task_content: string;
  estimated_minutes: number | null;
  difficulty: number | null;
  task_type: string | null;
  created_at: string;
}

export interface UserExam {
  id: string;
  user_id: string;
  exam_template_id: string;
  exam_name: string;
  start_date: string;
  exam_date: string;
  status: string;
  progress: number | null;
  created_at: string;
  updated_at: string;
}

export interface UserExamTask {
  id: string;
  user_exam_id: string;
  task_date: string;
  task_content: string;
  estimated_minutes: number | null;
  difficulty: number | null;
  task_type: string | null;
  phase: string | null;
  is_completed: boolean | null;
  completed_at: string | null;
  created_at: string;
}
