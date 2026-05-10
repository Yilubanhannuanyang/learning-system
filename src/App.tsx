// ============================================================
// App.tsx - 主应用路由
// ============================================================
import { Suspense } from 'react';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { useTasks, useTaskStats } from './hooks/useTasks';
import { Layout } from './components/Layout';
import { LoginPage } from './pages/Login';
import { DashboardPage } from './pages/Dashboard';
import { RoadmapPage } from './pages/Roadmap';
import { ExamsPage } from './pages/ExamsPage';
import { ProjectsPage } from './pages/Projects';
import { StatsPage } from './pages/Stats';
import { SettingsPage } from './pages/Settings';

// ========== 加载中占位 ==========
function LoadingFallback() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontSize: '14px', color: 'var(--color-text-tertiary)' }}>
      加载中...
    </div>
  );
}

// ========== 内部 App（已登录）==========
function AppInner() {
  const { user, loading, page } = useAuth();
  const { tasks } = useTasks(user?.id, { start_date: '2026-05-09' });
  const { getOverallProgress } = useTaskStats(tasks);

  if (loading) return <LoadingFallback />;
  if (!user) return <LoginPage />;

  const overall = getOverallProgress();

  return (
    <Layout overallPct={overall.pct}>
      <Suspense fallback={<LoadingFallback />}>
        {page === 'dashboard' && <DashboardPage />}
        {page === 'roadmap' && <RoadmapPage />}
        {page === 'exams' && <ExamsPage />}
        {page === 'projects' && <ProjectsPage />}
        {page === 'stats' && <StatsPage />}
        {page === 'settings' && <SettingsPage />}
      </Suspense>
    </Layout>
  );
}

// ========== 导出：包在 AuthProvider 中 ==========
export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}
