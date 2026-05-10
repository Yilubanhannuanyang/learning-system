// ============================================================
// ExamsPage.tsx - 考试计划页面
// ============================================================
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useExamTemplates, useUserExams, useCreateUserExam, useDeleteUserExam } from '../hooks/useExams';

// ========== 考试类型分类 ==========
const CATEGORY_LABELS: Record<string, string> = {
  'language': '🇬🇧 语言考试',
  'computer': '💻 计算机考试',
  'professional': '💼 职业资格',
  'postgraduate': '🎓 研究生考试',
  'competition': '🏆 竞赛类',
  'other': '📋 其他'
};

// ========== 考试计划卡片 ==========
function ExamCard({ 
  exam, 
  onDelete 
}: { 
  exam: any; 
  onDelete: (id: string) => void;
}) {
  const daysLeft = Math.ceil(
    (new Date(exam.exam_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div style={{
      padding: '16px',
      background: 'var(--color-background-primary)',
      border: '0.5px solid var(--color-border-tertiary)',
      borderRadius: 'var(--border-radius-lg)',
      marginBottom: '12px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 600 }}>{exam.exam_name}</h3>
        <button
          onClick={() => onDelete(exam.id)}
          style={{
            border: 'none',
            background: 'transparent',
            color: 'var(--color-text-tertiary)',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          删除
        </button>
      </div>
      <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>
        <div>📅 考试日期：{exam.exam_date}</div>
        <div>⏱️ 开始日期：{exam.start_date}</div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{
          fontSize: '12px',
          fontWeight: 500,
          color: daysLeft <= 7 ? 'var(--color-error)' : daysLeft <= 30 ? 'var(--color-warning)' : 'var(--color-success)'
        }}>
          {daysLeft > 0 ? `还剩 ${daysLeft} 天` : '已过期'}
        </span>
        <div style={{
          flex: 1,
          marginLeft: '12px',
          height: '6px',
          background: 'var(--color-border-tertiary)',
          borderRadius: '3px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${exam.progress || 0}%`,
            height: '100%',
            background: 'var(--color-text-primary)',
            borderRadius: '3px'
          }} />
        </div>
        <span style={{ marginLeft: '8px', fontSize: '12px' }}>{exam.progress || 0}%</span>
      </div>
    </div>
  );
}

// ========== 新建考试计划弹窗 ==========
function CreateExamModal({ 
  onClose, 
  onSuccess 
}: { 
  onClose: () => void; 
  onSuccess: () => void;
}) {
  const { user } = useAuth();
  const { templates, loading: templatesLoading } = useExamTemplates();
  const { createExam, loading: creating } = useCreateUserExam();
  
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [examDate, setExamDate] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredTemplates = selectedCategory === 'all' 
    ? templates 
    : templates.filter(t => t.category === selectedCategory);

  const handleSubmit = async () => {
    if (!user || !selectedTemplate || !examDate || !startDate) {
      alert('请填写完整信息！');
      return;
    }

    const template = templates.find(t => t.id === selectedTemplate);
    const { error } = await createExam(
      user.id,
      selectedTemplate,
      template?.name || '',
      startDate,
      examDate
    );

    if (error) {
      alert('创建失败：' + error.message);
    } else {
      onSuccess();
      onClose();
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100
    }}>
      <div style={{
        background: 'var(--color-background-primary)',
        borderRadius: 'var(--border-radius-lg)',
        padding: '24px',
        width: '90%',
        maxWidth: '600px',
        maxHeight: '80vh',
        overflowY: 'auto'
      }}>
        <h2 style={{ marginTop: 0, fontSize: '18px' }}>新建考试计划</h2>

        {/* 分类筛选 */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '13px', marginBottom: '8px', fontWeight: 500 }}>
            考试分类
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            <button
              onClick={() => setSelectedCategory('all')}
              style={{
                padding: '6px 12px',
                border: '0.5px solid var(--color-border-tertiary)',
                borderRadius: 'var(--border-radius-md)',
                background: selectedCategory === 'all' ? 'var(--color-text-primary)' : 'transparent',
                color: selectedCategory === 'all' ? 'var(--color-background-primary)' : 'var(--color-text-primary)',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              全部
            </button>
            {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                style={{
                  padding: '6px 12px',
                  border: '0.5px solid var(--color-border-tertiary)',
                  borderRadius: 'var(--border-radius-md)',
                  background: selectedCategory === key ? 'var(--color-text-primary)' : 'transparent',
                  color: selectedCategory === key ? 'var(--color-background-primary)' : 'var(--color-text-primary)',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* 选择考试类型 */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '13px', marginBottom: '8px', fontWeight: 500 }}>
            考试类型 *
          </label>
          <select
            value={selectedTemplate}
            onChange={(e) => setSelectedTemplate(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '0.5px solid var(--color-border-tertiary)',
              borderRadius: 'var(--border-radius-md)',
              fontSize: '13px',
              background: 'var(--color-background-primary)',
              color: 'var(--color-text-primary)'
            }}
          >
            <option value="">-- 请选择考试 --</option>
            {filteredTemplates.map(template => (
              <option key={template.id} value={template.id}>
                {template.icon} {template.name}（建议备考{template.total_days}天）
              </option>
            ))}
          </select>
        </div>

        {/* 开始日期 */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '13px', marginBottom: '8px', fontWeight: 500 }}>
            开始日期 *
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '0.5px solid var(--color-border-tertiary)',
              borderRadius: 'var(--border-radius-md)',
              fontSize: '13px',
              background: 'var(--color-background-primary)',
              color: 'var(--color-text-primary)'
            }}
          />
        </div>

        {/* 考试日期 */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontSize: '13px', marginBottom: '8px', fontWeight: 500 }}>
            考试日期 *
          </label>
          <input
            type="date"
            value={examDate}
            onChange={(e) => setExamDate(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '0.5px solid var(--color-border-tertiary)',
              borderRadius: 'var(--border-radius-md)',
              fontSize: '13px',
              background: 'var(--color-background-primary)',
              color: 'var(--color-text-primary)'
            }}
          />
        </div>

        {/* 按钮 */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            style={{
              padding: '8px 16px',
              border: '0.5px solid var(--color-border-tertiary)',
              borderRadius: 'var(--border-radius-md)',
              background: 'transparent',
              cursor: 'pointer',
              fontSize: '13px'
            }}
          >
            取消
          </button>
          <button
            onClick={handleSubmit}
            disabled={creating}
            style={{
              padding: '8px 16px',
              border: 'none',
              borderRadius: 'var(--border-radius-md)',
              background: 'var(--color-text-primary)',
              color: 'var(--color-background-primary)',
              cursor: creating ? 'not-allowed' : 'pointer',
              fontSize: '13px',
              opacity: creating ? 0.6 : 1
            }}
          >
            {creating ? '创建中...' : '创建计划'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ========== 主页面 ==========
export function ExamsPage() {
  const { user } = useAuth();
  const { exams, loading, refetch } = useUserExams(user?.id);
  const { deleteExam } = useDeleteUserExam();
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleDelete = async (examId: string) => {
    if (!confirm('确定要删除这个考试计划吗？')) return;
    
    const { error } = await deleteExam(examId);
    if (error) {
      alert('删除失败：' + error.message);
    } else {
      refetch();
    }
  };

  return (
    <div>
      {/* 标题栏 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 600 }}>📚 考试计划</h2>
        <button
          onClick={() => setShowCreateModal(true)}
          style={{
            padding: '8px 16px',
            border: 'none',
            borderRadius: 'var(--border-radius-md)',
            background: 'var(--color-text-primary)',
            color: 'var(--color-background-primary)',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: 500
          }}
        >
          + 新建计划
        </button>
      </div>

      {/* 考试计划列表 */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-tertiary)' }}>
          加载中...
        </div>
      ) : exams.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          background: 'var(--color-background-primary)',
          borderRadius: 'var(--border-radius-lg)',
          border: '0.5px dashed var(--color-border-tertiary)'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📚</div>
          <div style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>
            暂无考试计划
          </div>
          <div style={{ fontSize: '12px', color: 'var(--color-text-tertiary)' }}>
            点击"新建计划"开始制定你的考试备考计划
          </div>
        </div>
      ) : (
        <div>
          {exams.map(exam => (
            <ExamCard key={exam.id} exam={exam} onDelete={handleDelete} />
          ))}
        </div>
      )}

      {/* 新建弹窗 */}
      {showCreateModal && (
        <CreateExamModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={refetch}
        />
      )}
    </div>
  );
}
