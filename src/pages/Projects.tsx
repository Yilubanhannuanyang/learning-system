// ============================================================
// Projects 页面 - 开源项目库（每阶段5个，分难度）
// ============================================================
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '../hooks/useAuth';
import { useProjects } from '../hooks/useProjects';
import type { ProjectWithUserStatus, Difficulty } from '../types';

const DIFF_MAP: Record<Difficulty, { label: string; color: string; bg: string }> = {
  simple:   { label: '简单', color: 'var(--color-success)', bg: 'var(--color-success)15' },
  medium:   { label: '中等', color: 'var(--color-warning)', bg: 'var(--color-warning)15' },
  advanced: { label: '进阶', color: 'var(--color-danger)',  bg: 'var(--color-danger)15'  },
};
const STAGE_NAME = ['', '基础铺垫', '核心框架', 'RAG & 多Agent', '工程化部署', '项目实战求职'];

export function ProjectsPage() {
  const { user } = useAuth();
  const {
    projects, loading, showAddModal, setShowAddModal,
    addProject, updateProjectStatus, updateProjectNote,
  } = useProjects(user?.id);
  const [filterStage, setFilterStage] = useState<number>(0);
  const [filterDiff, setFilterDiff] = useState<Difficulty | ''>('');
  const [viewProject, setViewProject] = useState<ProjectWithUserStatus | null>(null);
  const [noteText, setNoteText] = useState('');
  const [addStage, setAddStage] = useState<number>(1);
  const [addName, setAddName] = useState('');
  const [addUrl, setAddUrl] = useState('');
  const [addDesc, setAddDesc] = useState('');
  const [addDiff, setAddDiff] = useState<Difficulty>('medium');
  const [addTags, setAddTags] = useState('');
  const [addFocus, setAddFocus] = useState('');
  const [addRelevance, setAddRelevance] = useState('');
  const [addStars, setAddStars] = useState<number>(0);

  const filtered = projects.filter(p =>
    (filterStage === 0 || p.stage_id === filterStage) &&
    (filterDiff === '' || p.difficulty === filterDiff)
  );

  const handleAdd = async () => {
    if (!addName || !addUrl) return;
    await addProject({
      stage_id: addStage,
      name: addName,
      repo_url: addUrl,
      github_url: addUrl,
      description: addDesc,
      difficulty: addDiff,
      stars: addStars,
      practice_focus: addFocus,
      interview_relevance: addRelevance,
      tags: addTags.split(/[,\s]+/).filter(Boolean),
      is_builtin: false,
    });
    setShowAddModal(false);
    setAddName(''); setAddUrl(''); setAddDesc(''); setAddFocus(''); setAddRelevance(''); setAddTags(''); setAddStars(0);
  };

  const handleNoteSave = async () => {
    if (!viewProject) return;
    await updateProjectNote(viewProject.id!, noteText);
    setViewProject(null); setNoteText('');
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 600, margin: '0 0 4px' }}>
          开源项目练习库
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', margin: 0 }}>
          每个阶段 5 个精选项目，分简单/中等/进阶难度，贴合大厂面试
        </p>
      </div>

      {/* 筛选栏 + 添加按钮 */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
        <select
          value={filterStage}
          onChange={e => setFilterStage(Number(e.target.value))}
          style={{ padding: '6px 10px', borderRadius: 'var(--border-radius-md)', border: '0.5px solid var(--color-border-tertiary)', fontSize: '13px' }}
        >
          <option value={0}>全部阶段</option>
          {STAGE_NAME.filter(Boolean).map((n, i) => (
            <option key={i + 1} value={i + 1}>{n}</option>
          ))}
        </select>
        <select
          value={filterDiff}
          onChange={e => setFilterDiff(e.target.value as any)}
          style={{ padding: '6px 10px', borderRadius: 'var(--border-radius-md)', border: '0.5px solid var(--color-border-tertiary)', fontSize: '13px' }}
        >
          <option value="">全部难度</option>
          <option value="simple">简单</option>
          <option value="medium">中等</option>
          <option value="advanced">进阶</option>
        </select>
        <div style={{ flex: 1 }} />
        <Button onClick={() => setShowAddModal(true)} style={{ fontSize: '13px' }}>
          ＋ 添加项目
        </Button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-tertiary)' }}>加载中...</div>
      ) : (
        /* 按阶段分组 */
        [1, 2, 3, 4, 5].map(stageId => {
          const stageProjects = filtered.filter(p => p.stage_id === stageId);
          if (stageProjects.length === 0) return null;
          const stageComplete = stageProjects.filter(p => p.status === 'completed').length;
          return (
            <div key={stageId} style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 600, margin: 0 }}>{STAGE_NAME[stageId]}</h3>
                <Badge style={{ fontSize: '11px', background: 'var(--color-background-secondary)', color: 'var(--color-text-secondary)' }}>
                  {stageComplete}/{stageProjects.length} 已完成
                </Badge>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {stageProjects.map(p => {
                  const d = DIFF_MAP[p.difficulty];
                  return (
                    <div
                      key={p.id}
                      style={{
                        display: 'flex', alignItems: 'flex-start', gap: '10px',
                        padding: '10px 14px',
                        background: p.status === 'completed' ? 'var(--color-background-secondary)' : 'var(--color-background-primary)',
                        border: '0.5px solid var(--color-border-tertiary)',
                        borderRadius: 'var(--border-radius-md)',
                        opacity: p.status === 'completed' ? 0.7 : 1,
                        cursor: 'pointer',
                      }}
                      onClick={() => setViewProject(p)}
                    >
                      {/* 状态选择 */}
                      <select
                        value={p.status}
                        onClick={e => e.stopPropagation()}
                        onChange={async e => { await updateProjectStatus(p.id!, e.target.value as any); }}
                        style={{ marginTop: '2px', fontSize: '12px', padding: '2px 4px', borderRadius: '4px', border: '0.5px solid var(--color-border-tertiary)' }}
                      >
                        <option value="todo">待练习</option>
                        <option value="in_progress">进行中</option>
                        <option value="completed">已完成</option>
                      </select>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-primary)', lineHeight: '1.5' }}>
                          {p.name}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', lineHeight: '1.4', marginTop: '2px' }}>
                          {p.description}
                        </div>
                        <div style={{ display: 'flex', gap: '6px', marginTop: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
                          <Badge style={{ fontSize: '10px', background: d.bg, color: d.color, border: 'none' }}>{d.label}</Badge>
                          {p.stars > 0 && (
                            <span style={{ fontSize: '11px', color: 'var(--color-text-tertiary)' }}>⭐ {p.stars.toLocaleString()}</span>
                          )}
                          {p.tags.map((t: string) => (
                            <Badge key={t} style={{ fontSize: '10px', background: 'var(--color-background-secondary)', color: 'var(--color-text-secondary)', border: 'none' }}>{t}</Badge>
                          ))}
                          <a
                            href={p.github_url}
                            target="_blank"
                            rel="noreferrer"
                            onClick={e => e.stopPropagation()}
                            style={{ fontSize: '11px', color: 'var(--color-text-info)' }}
                          >🔗 GitHub</a>
                          {p.is_builtin && (
                            <Badge style={{ fontSize: '10px', background: 'var(--color-background-tertiary)', color: 'var(--color-text-tertiary)', border: 'none' }}>预置</Badge>
                          )}
                        </div>
                        {p.interview_relevance && (
                          <div style={{ fontSize: '11px', color: 'var(--color-text-tertiary)', marginTop: '4px', fontStyle: 'italic' }}>
                            面试相关：{p.interview_relevance}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })
      )}

      {/* 项目详情/笔记弹窗 */}
      {viewProject && (
        <div
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}
          onClick={() => setViewProject(null)}
        >
          <div
            style={{ background: 'var(--color-background-primary)', borderRadius: 'var(--border-radius-lg)', padding: '20px', width: '90%', maxWidth: '540px', maxHeight: '80vh', overflowY: 'auto' }}
            onClick={e => e.stopPropagation()}
          >
            <h3 style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 8px' }}>{viewProject.name}</h3>
            <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: '1.5', margin: '0 0 8px' }}>{viewProject.description}</p>
            <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>
              <strong>练习重点：</strong>{viewProject.practice_focus}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '12px' }}>
              <strong>面试相关：</strong>{viewProject.interview_relevance}
            </div>
            <Label>我的笔记</Label>
            <Textarea
              value={noteText}
              onChange={e => setNoteText(e.target.value)}
              placeholder="记录练习心得、遇到的问题、解决方案..."
              style={{ minHeight: '100px', marginTop: '6px' }}
            />
            <div style={{ display: 'flex', gap: '8px', marginTop: '12px', justifyContent: 'flex-end' }}>
              <Button variant="outline" onClick={() => setViewProject(null)}>关闭</Button>
              <Button onClick={handleNoteSave}>保存笔记</Button>
            </div>
          </div>
        </div>
      )}

      {/* 添加项目弹窗 */}
      {showAddModal && (
        <div
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}
          onClick={() => setShowAddModal(false)}
        >
          <div
            style={{ background: 'var(--color-background-primary)', borderRadius: 'var(--border-radius-lg)', padding: '20px', width: '90%', maxWidth: '500px' }}
            onClick={e => e.stopPropagation()}
          >
            <h3 style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 16px' }}>添加开源项目</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div>
                <Label>所属阶段</Label>
                <select
                  value={addStage}
                  onChange={e => setAddStage(Number(e.target.value))}
                  style={{ width: '100%', padding: '6px 10px', borderRadius: 'var(--border-radius-md)', border: '0.5px solid var(--color-border-tertiary)', fontSize: '13px', marginTop: '4px' }}
                >
                  {STAGE_NAME.filter(Boolean).map((n, i) => (
                    <option key={i + 1} value={i + 1}>{n}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label>项目名称 *</Label>
                <Input value={addName} onChange={e => setAddName(e.target.value)} placeholder="例如：LangChain" style={{ marginTop: '4px' }} />
              </div>
              <div>
                <Label>GitHub 地址 *</Label>
                <Input value={addUrl} onChange={e => setAddUrl(e.target.value)} placeholder="https://github.com/..." style={{ marginTop: '4px' }} />
              </div>
              <div>
                <Label>项目描述</Label>
                <Textarea value={addDesc} onChange={e => setAddDesc(e.target.value)} placeholder="简要描述项目内容和学习价值" style={{ marginTop: '4px' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <Label>难度</Label>
                  <select
                    value={addDiff}
                    onChange={e => setAddDiff(e.target.value as Difficulty)}
                    style={{ width: '100%', padding: '6px 10px', borderRadius: 'var(--border-radius-md)', border: '0.5px solid var(--color-border-tertiary)', fontSize: '13px', marginTop: '4px' }}
                  >
                    <option value="simple">简单</option>
                    <option value="medium">中等</option>
                    <option value="advanced">进阶</option>
                  </select>
                </div>
                <div>
                  <Label>Stars（选填）</Label>
                  <Input
                    type="number"
                    value={addStars || ''}
                    onChange={e => setAddStars(Number(e.target.value))}
                    placeholder="0"
                    style={{ marginTop: '4px' }}
                  />
                </div>
              </div>
              <div>
                <Label>练习重点</Label>
                <Input value={addFocus} onChange={e => setAddFocus(e.target.value)} placeholder="例如：LCEL语法、Agent执行流程" style={{ marginTop: '4px' }} />
              </div>
              <div>
                <Label>面试相关度</Label>
                <Input value={addRelevance} onChange={e => setAddRelevance(e.target.value)} placeholder="为什么这个项目对面试有帮助" style={{ marginTop: '4px' }} />
              </div>
              <div>
                <Label>标签（逗号分隔）</Label>
                <Input value={addTags} onChange={e => setAddTags(e.target.value)} placeholder="LangChain, Agent, RAG" style={{ marginTop: '4px' }} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px', marginTop: '16px', justifyContent: 'flex-end' }}>
              <Button variant="outline" onClick={() => setShowAddModal(false)}>取消</Button>
              <Button onClick={handleAdd} disabled={!addName || !addUrl}>添加</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
