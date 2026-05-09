// ============================================================
// Login 页面 - 注册/登录
// ============================================================
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '../hooks/useAuth';

export function LoginPage() {
  const { signIn, signUp } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    if (!email || !password) { setError('请填写邮箱和密码'); return; }
    if (password.length < 6) { setError('密码至少需要 6 位'); return; }
    setLoading(true);
    const errMsg = isLogin
      ? await signIn(email, password)
      : await signUp(email, password);
    setLoading(false);
    if (errMsg) setError(errMsg);
    else if (!isLogin) setSuccessMsg('注册成功！请查收验证邮件（如有），然后登录。');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--color-background-tertiary)',
        padding: '16px',
      }}
    >
      <Card style={{ width: '100%', maxWidth: '400px', border: '0.5px solid var(--color-border-tertiary)' }}>
        <CardHeader>
          <CardTitle style={{ textAlign: 'center', fontSize: '20px' }}>
            🤖 Agent 学习管理系统
          </CardTitle>
          <p style={{ textAlign: 'center', fontSize: '13px', color: 'var(--color-text-secondary)', margin: '4px 0 0' }}>
            {isLogin ? '登录后同步你的学习进度' : '注册开始你的 Agent 开发学习之旅'}
          </p>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert style={{ marginBottom: '12px', borderColor: 'var(--color-border-danger)' }}>
              <AlertDescription style={{ color: 'var(--color-text-danger)' }}>{error}</AlertDescription>
            </Alert>
          )}
          {successMsg && (
            <Alert style={{ marginBottom: '12px', borderColor: 'var(--color-border-success)' }}>
              <AlertDescription style={{ color: 'var(--color-text-success)' }}>{successMsg}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <Label htmlFor="email">邮箱</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                style={{ width: '100%' }}
              />
            </div>
            <div>
              <Label htmlFor="password">密码</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="至少 6 位"
                style={{ width: '100%' }}
              />
            </div>
            <Button type="submit" disabled={loading} style={{ width: '100%', marginTop: '4px' }}>
              {loading ? '处理中...' : isLogin ? '登录' : '注册'}
            </Button>
          </form>
          <div style={{ textAlign: 'center', marginTop: '12px' }}>
            <button
              type="button"
              onClick={() => { setIsLogin(!isLogin); setError(null); setSuccessMsg(null); }}
              style={{ background: 'none', border: 'none', color: 'var(--color-text-info)', cursor: 'pointer', fontSize: '13px' }}
            >
              {isLogin ? '没有账号？点击注册' : '已有账号？点击登录'}
            </button>
          </div>

          <div
            style={{
              marginTop: '16px',
              padding: '12px',
              background: 'var(--color-background-secondary)',
              borderRadius: 'var(--border-radius-md)',
              fontSize: '12px',
              color: 'var(--color-text-secondary)',
              lineHeight: '1.6',
            }}
          >
            <p style={{ margin: '0 0 4px', fontWeight: 500, color: 'var(--color-text-primary)' }}>📌 使用说明</p>
            <p style={{ margin: 0 }}>
              首次使用请先注册账号，登录后数据将自动同步到云端。
              <br />开始日期默认为 2026-05-09（今天），可在设置中修改。
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
