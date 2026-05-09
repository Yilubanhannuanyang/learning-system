// ============================================================
// Settings 页面 - 设置（Server酱微信提醒配置）
// ============================================================
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '../hooks/useAuth';

export function SettingsPage() {
  const { settings, updateSettings } = useAuth();
  const [serverKey, setServerKey] = useState(settings?.server_chan_key || '');
  const [startDate, setStartDate] = useState(settings?.start_date || '2026-05-09');
  const [reminderHour, setReminderHour] = useState(settings?.reminder_hour ?? 8);
  const [reminderEnabled, setReminderEnabled] = useState(settings?.reminder_enabled ?? false);
  const [saved, setSaved] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  // 从 settings 加载
  useEffect(() => {
    if (settings) {
      setServerKey(settings.server_chan_key || '');
      setStartDate(settings.start_date || '2026-05-09');
      setReminderHour(settings.reminder_hour ?? 8);
      setReminderEnabled(settings.reminder_enabled ?? false);
    }
  }, [settings]);

  const handleSave = async () => {
    await updateSettings({
      server_chan_key: serverKey || null,
      start_date: startDate,
      reminder_enabled: reminderEnabled,
      reminder_hour: reminderHour,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  // 测试 Server酱 推送
  const handleTestPush = async () => {
    if (!serverKey) { setTestResult('请先填写 Server酱 SCKEY'); return; }
    setTesting(true);
    setTestResult(null);
    try {
      const res = await fetch(`https://sctapi.ftqq.com/${serverKey}.send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: '🧪 Server酱 测试推送',
          desp: '如果你在微信收到了这条消息，说明配置成功！\n\n> 来自 Agent 学习管理系统',
        }),
      });
      const data = await res.json();
      if (data.errno === 0) setTestResult('✅ 推送成功！请查收微信消息');
      else setTestResult(`❌ 推送失败：${data.errmsg || '未知错误'}`);
    } catch (e: any) {
      setTestResult(`❌ 网络错误：${e.message}`);
    }
    setTesting(false);
  };

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto' }}>
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 600, margin: '0 0 4px' }}>设置</h2>
        <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', margin: 0 }}>
          配置学习开始日期和微信提醒
        </p>
      </div>

      {saved && (
        <Alert style={{ marginBottom: '16px', borderColor: 'var(--color-border-success)' }}>
          <AlertDescription style={{ color: 'var(--color-text-success)' }}>✅ 设置已保存</AlertDescription>
        </Alert>
      )}
      {testResult && (
        <Alert style={{ marginBottom: '16px', borderColor: testResult.startsWith('✅') ? 'var(--color-border-success)' : 'var(--color-border-danger)' }}>
          <AlertDescription style={{ color: testResult.startsWith('✅') ? 'var(--color-text-success)' : 'var(--color-text-danger)' }}>{testResult}</AlertDescription>
        </Alert>
      )}

      {/* 学习开始日期 */}
      <Card style={{ marginBottom: '16px' }}>
        <CardHeader>
          <CardTitle style={{ fontSize: '14px' }}>📅 学习开始日期</CardTitle>
        </CardHeader>
        <CardContent>
          <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', margin: '0 0 8px' }}>
            设置后系统自动计算今天是「第几周第几天」，并以此显示今日任务。
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Input
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              style={{ width: '200px' }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Server酱 微信提醒 */}
      <Card style={{ marginBottom: '16px' }}>
        <CardHeader>
          <CardTitle style={{ fontSize: '14px' }}>📱 Server酱 微信提醒</CardTitle>
        </CardHeader>
        <CardContent>
          <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', margin: '0 0 12px', lineHeight: '1.6' }}>
            绑定后，系统每天会在设定时间检查今日任务完成情况，如有未完成项将推送提醒到微信。<br />
            <strong>获取 SCKEY 步骤：</strong>访问 <a href="https://sct.ftqq.com" target="_blank" rel="noreferrer" style={{ color: 'var(--color-text-info)' }}>sct.ftqq.com</a> → 登录 → 复制 SCKEY
          </p>
          <div style={{ marginBottom: '12px' }}>
            <Label>SCKEY（Server酱推送密钥）</Label>
            <Input
              type="password"
              value={serverKey}
              onChange={e => setServerKey(e.target.value)}
              placeholder="SCTxxxxxxxxxx..."
              style={{ marginTop: '4px' }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <span style={{ fontSize: '13px' }}>启用提醒</span>
            <Switch checked={reminderEnabled} onCheckedChange={setReminderEnabled} />
          </div>
          {reminderEnabled && (
            <div style={{ marginBottom: '12px' }}>
              <Label>提醒时间（小时）</Label>
              <Input
                type="number"
                min={0}
                max={23}
                value={reminderHour}
                onChange={e => setReminderHour(Number(e.target.value))}
                style={{ width: '80px', marginTop: '4px' }}
              />
              <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginLeft: '6px' }}>每日 {reminderHour.toString().padStart(2, '0')}:00 检查并推送</span>
            </div>
          )}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <Button variant="outline" onClick={handleTestPush} disabled={testing}>
              {testing ? '发送中...' : '🧪 测试推送'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 保存按钮 */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button onClick={handleSave} style={{ minWidth: '100px' }}>保存设置</Button>
      </div>

      {/* 使用说明 */}
      <Card style={{ marginTop: '20px' }}>
        <CardHeader>
          <CardTitle style={{ fontSize: '14px' }}>📖 使用说明</CardTitle>
        </CardHeader>
        <CardContent>
          <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', lineHeight: '1.8' }}>
            <p style={{ margin: '0 0 4px', fontWeight: 500, color: 'var(--color-text-primary)' }}>⏰ 提醒工作原理</p>
            <p style={{ margin: '0 0 8px' }}>
              系统根据「开始日期」算出今天是_第{Math.max(1, Math.floor((new Date().getTime() - new Date('2026-05-09').getTime()) / 86400000 / 7 + 1))}_周第_<strong>{(Math.floor((new Date().getTime() - new Date('2026-05-09').getTime()) / 86400000) % 7 + 1)}</strong>_天，自动展示对应任务。开启提醒后，系统会在设定的时间检查完成情况并推送到微信。
            </p>
            <p style={{ margin: '0 0 4px', fontWeight: 500, color: 'var(--color-text-primary)' }}>📌 关于数据</p>
            <p style={{ margin: 0 }}>
              任务完成状态保存在云端（Supabase），更换设备登录后数据自动同步。开源项目库中「预置」项目为系统内置，不可删除；自定义添加的项目可以删除。
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
