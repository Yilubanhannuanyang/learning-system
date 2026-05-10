// ============================================================
// Layout 组件 - 带侧边栏的主布局
// ============================================================
import { type ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';
import type { AppPage } from '../types';

interface LayoutProps {
  children: ReactNode;
  overallPct: number;
}

const NAV_ITEMS: { key: AppPage; label: string; icon: string }[] = [
  { key: 'dashboard', label: '今日任务', icon: '🟢' },
  { key: 'roadmap', label: '学习路线', icon: '📅' },
  { key: 'exams', label: '考试计划', icon: '📚' },
  { key: 'projects', label: '开源项目', icon: '🟣' },
  { key: 'stats', label: '进度统计', icon: '📊' },
  { key: 'settings', label: '设置', icon: '⚙️' },
];

export function Layout({ children, overallPct }: LayoutProps) {
  const { user, page, setPage, signOut } = useAuth();

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--color-background-tertiary)' }}>
      {/* 侧边栏 */}
      <aside
        style={{
          width: '240px',
          background: 'var(--color-background-primary)',
          borderRight: '0.5px solid var(--color-border-tertiary)',
          display: 'flex',
          flexDirection: 'column',
          padding: '16px 0',
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          zIndex: 10,
        }}
      >
        {/* Logo */}
        <div style={{ padding: '0 20px 20px', borderBottom: '0.5px solid var(--color-border-tertiary)' }}>
          <h1 style={{ fontSize: '16px', fontWeight: 600, margin: 0, color: 'var(--color-text-primary)' }}>
            📚 学习管理
          </h1>
          <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', margin: '4px 0 0' }}>
            {user?.email || '未登录'}
          </p>
        </div>

        {/* 总进度 */}
        <div style={{ padding: '16px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>总进度</span>
            <span style={{ fontSize: '12px', fontWeight: 500 }}>{overallPct}%</span>
          </div>
          <div
            style={{
              height: '6px',
              background: 'var(--color-border-tertiary)',
              borderRadius: '3px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${overallPct}%`,
                background: 'var(--color-text-primary)',
                borderRadius: '3px',
                transition: 'width 0.3s ease',
              }}
            />
          </div>
        </div>

        {/* 导航 */}
        <nav style={{ flex: 1, padding: '8px 12px', overflowY: 'auto' }}>
          {NAV_ITEMS.map(item => (
            <button
              key={item.key}
              onClick={() => setPage(item.key)}
              style={{
                width: '100%',
                padding: '10px 12px',
                marginBottom: '4px',
                border: 'none',
                borderRadius: 'var(--border-radius-md)',
                background: page === item.key ? 'var(--color-background-secondary)' : 'transparent',
                color: page === item.key ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                fontWeight: page === item.key ? 500 : 400,
                fontSize: '13px',
                cursor: 'pointer',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* 登出 */}
        <div style={{ padding: '12px 20px', borderTop: '0.5px solid var(--color-border-tertiary)' }}>
          <button
            onClick={signOut}
            style={{
              width: '100%',
              padding: '8px',
              border: '0.5px solid var(--color-border-tertiary)',
              borderRadius: 'var(--border-radius-md)',
              background: 'transparent',
              color: 'var(--color-text-secondary)',
              fontSize: '13px',
              cursor: 'pointer',
            }}
          >
            登出
          </button>
        </div>
      </aside>

      {/* 主内容区 */}
      <main style={{ flex: 1, marginLeft: '240px', padding: '24px' }}>
        {children}
      </main>
    </div>
  );
}
