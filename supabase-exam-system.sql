-- ============================================================
-- 阶段性考试与任务系统 - 数据库Schema
-- ============================================================

-- 1. 考试模板表（存储所有考试类型）
CREATE TABLE IF NOT EXISTS exam_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,                 -- 考试名称
  category TEXT NOT NULL,             -- 分类：language, computer, professional, competition, other
  total_days INTEGER NOT NULL,        -- 建议备考天数
  description TEXT,                   -- 考试说明
  icon TEXT DEFAULT '📚',            -- 图标
  created_at TIMESTAMP DEFAULT NOW()
);

-- 2. 考试任务模板表（每个考试的具体任务）
CREATE TABLE IF NOT EXISTS exam_task_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  exam_template_id UUID REFERENCES exam_templates(id) ON DELETE CASCADE,
  day_offset INTEGER NOT NULL,        -- 第几天（负数表示距离考试的天数）
  phase TEXT NOT NULL,                -- 阶段名称（基础/强化/冲刺）
  week_number INTEGER,                 -- 第几周
  task_content TEXT NOT NULL,          -- 任务内容
  estimated_minutes INTEGER,          -- 预计用时（分钟）
  difficulty INTEGER DEFAULT 1,       -- 难度 1-5
  task_type TEXT,                     -- 任务类型：listening, reading, writing, practice, mock
  created_at TIMESTAMP DEFAULT NOW()
);

-- 3. 用户考试计划表
CREATE TABLE IF NOT EXISTS user_exams (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  exam_template_id UUID REFERENCES exam_templates(id) ON DELETE CASCADE,
  exam_name TEXT NOT NULL,            -- 考试名称（冗余，方便查询）
  start_date DATE NOT NULL,           -- 开始日期
  exam_date DATE NOT NULL,            -- 考试日期
  status TEXT DEFAULT 'active',       -- 状态：active, paused, completed, abandoned
  progress INTEGER DEFAULT 0,         -- 进度 0-100
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 4. 用户每日考试任务表
CREATE TABLE IF NOT EXISTS user_exam_tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_exam_id UUID REFERENCES user_exams(id) ON DELETE CASCADE,
  task_date DATE NOT NULL,            -- 任务日期
  task_content TEXT NOT NULL,         -- 任务内容
  estimated_minutes INTEGER,          -- 预计用时
  difficulty INTEGER DEFAULT 1,       -- 难度
  task_type TEXT,                     -- 任务类型
  phase TEXT,                         -- 阶段
  is_completed BOOLEAN DEFAULT FALSE, -- 是否完成
  completed_at TIMESTAMP,             -- 完成时间
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- RLS 策略
-- ============================================================

-- exam_templates: 所有人可读
ALTER TABLE exam_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "所有人可读取考试模板" ON exam_templates
  FOR SELECT USING (true);

-- exam_task_templates: 所有人可读
ALTER TABLE exam_task_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "所有人可读取考试任务模板" ON exam_task_templates
  FOR SELECT USING (true);

-- user_exams: 用户只能管理自己的考试计划
ALTER TABLE user_exams ENABLE ROW LEVEL SECURITY;
CREATE POLICY "用户可管理自己的考试计划" ON user_exams
  FOR ALL USING (auth.uid() = user_id);

-- user_exam_tasks: 用户只能管理自己的考试任务
ALTER TABLE user_exam_tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "用户可管理自己的考试任务" ON user_exam_tasks
  FOR ALL USING (
    user_exam_id IN (
      SELECT id FROM user_exams WHERE user_id = auth.uid()
    )
  );

-- ============================================================
-- 索引优化
-- ============================================================
CREATE INDEX idx_exam_task_templates_exam_id ON exam_task_templates(exam_template_id);
CREATE INDEX idx_user_exams_user_id ON user_exams(user_id);
CREATE INDEX idx_user_exam_tasks_user_exam_id ON user_exam_tasks(user_exam_id);
CREATE INDEX idx_user_exam_tasks_task_date ON user_exam_tasks(task_date);

-- ============================================================
-- 插入主流考试模板数据
-- ============================================================

-- 英语类
INSERT INTO exam_templates (name, category, total_days, description, icon) VALUES
('英语四级（CET-4）', 'language', 90, '大学英语四级考试，词汇量4500左右', '🇬🇧'),
('英语六级（CET-6）', 'language', 90, '大学英语六级考试，词汇量5500左右', '🇬🇧'),
('雅思（IELTS）', 'language', 120, '国际英语语言测试系统，听说读写四项', '🇬🇧'),
('托福（TOEFL）', 'language', 120, '托福考试，北美留学必备', '🇺🇸'),
('GRE', 'language', 150, '研究生入学考试，词汇量12000+', '🇺🇸'),
('GMAT', 'language', 120, '商科研究生入学考试', '🇺🇸'),
('日语N1', 'language', 180, '日语能力测试N1级别', '🇯🇵'),
('日语N2', 'language', 150, '日语能力测试N2级别', '🇯🇵'),
('日语N3', 'language', 120, '日语能力测试N3级别', '🇯🇵'),
('韩语TOPIK', 'language', 120, '韩语能力考试', '🇰🇷');

-- 计算机类
INSERT INTO exam_templates (name, category, total_days, description, icon) VALUES
('计算机二级（MS Office）', 'computer', 60, '全国计算机等级考试二级，Office高级应用', '💻'),
('计算机二级（Python）', 'computer', 60, '全国计算机等级考试二级，Python语言', '🐍'),
('计算机三级（网络技术）', 'computer', 75, '全国计算机等级考试三级', '🌐'),
('软件设计师（软考中级）', 'computer', 120, '计算机技术与软件专业技术资格（中级）', '👨‍💻'),
('网络工程师（软考中级）', 'computer', 120, '计算机技术与软件专业技术资格（中级）', '🌐'),
('数据库系统工程师', 'computer', 120, '计算机技术与软件专业技术资格（中级）', '🗄️');

-- 职业资格类
INSERT INTO exam_templates (name, category, total_days, description, icon) VALUES
('教师资格证（小学）', 'professional', 90, '小学教师资格证考试', '👩‍🏫'),
('教师资格证（中学）', 'professional', 90, '中学教师资格证考试', '👨‍🏫'),
('注册会计师（CPA）', 'professional', 180, '注册会计师考试，6门科目', '📊'),
('公务员考试', 'professional', 120, '国家/地方公务员录用考试', '🏛️'),
('法律职业资格考试', 'professional', 150, '国家统一法律职业资格考试（法考）', '⚖️'),
('执业医师资格证', 'professional', 150, '医师资格考试', '🏥');

-- 研究生入学考试
INSERT INTO exam_templates (name, category, total_days, description, icon) VALUES
('考研（公共课+专业课）', 'postgraduate', 300, '全国硕士研究生入学考试，长期备考', '🎓'),
('管理类联考（MBA/MPA/MEM）', 'postgraduate', 180, '管理类专业学位联考', '💼'),
('法律硕士（法硕）', 'postgraduate', 240, '法律硕士专业学位研究生入学考试', '⚖️');

-- 竞赛类
INSERT INTO exam_templates (name, category, total_days, description, icon) VALUES
('数学建模竞赛', 'competition', 90, '全国大学生数学建模竞赛培训', '📐'),
('ACM程序设计竞赛', 'competition', 120, 'ACM-ICPC程序设计竞赛培训', '💻'),
('蓝桥杯大赛', 'competition', 90, '蓝桥杯全国软件和信息技术专业人才大赛', '🏆'),
('挑战杯', 'competition', 120, '挑战杯全国大学生课外学术科技作品竞赛', '🏅'),
('互联网+大赛', 'competition', 90, '中国"互联网+"大学生创新创业大赛', '💡');

-- 其他类
INSERT INTO exam_templates (name, category, total_days, description, icon) VALUES
('普通话水平测试', 'other', 30, '普通话水平等级测试', '🎤'),
('驾驶证（科目一）', 'other', 15, '机动车驾驶证理论考试', '🚗'),
('驾驶证（科目二三四）', 'other', 45, '机动车驾驶证场地与路考', '🚗');

-- ============================================================
-- 为"英语四级"插入任务模板（示例）
-- ============================================================

-- 基础阶段（第1-30天）
INSERT INTO exam_task_templates (exam_template_id, day_offset, phase, week_number, task_content, estimated_minutes, difficulty, task_type)
SELECT 
  id,
  -90 + (week_num - 1) * 7 + day_num,
  '基础阶段',
  week_num,
  CASE 
    WHEN day_num % 5 = 1 THEN '听力训练：新闻听力 ' || (week_num * 5 + day_num) || ' 篇'
    WHEN day_num % 5 = 2 THEN '阅读理解：仔细阅读 ' || (week_num * 3 + day_num) || ' 篇'
    WHEN day_num % 5 = 3 THEN '写作练习：作文 ' || (week_num) || ' 篇'
    WHEN day_num % 5 = 4 THEN '翻译练习：汉译英 ' || (week_num * 2) || ' 句'
    ELSE '单词背诵：核心词汇 ' || (50 + week_num * 10) || ' 个'
  END,
  CASE 
    WHEN day_num % 5 = 1 THEN 30
    WHEN day_num % 5 = 2 THEN 40
    WHEN day_num % 5 = 3 THEN 30
    WHEN day_num % 5 = 4 THEN 20
    ELSE 30
  END,
  CASE 
    WHEN week_num <= 2 THEN 1
    WHEN week_num <= 4 THEN 2
    ELSE 3
  END,
  CASE 
    WHEN day_num % 5 = 1 THEN 'listening'
    WHEN day_num % 5 = 2 THEN 'reading'
    WHEN day_num % 5 = 3 THEN 'writing'
    WHEN day_num % 5 = 4 THEN 'translation'
    ELSE 'vocabulary'
  END
FROM exam_templates,
     generate_series(1, 4) AS week_num,
     generate_series(1, 7) AS day_num
WHERE name = '英语四级（CET-4）'
  AND (week_num - 1) * 7 + day_num <= 30;

-- 强化阶段（第31-60天）
INSERT INTO exam_task_templates (exam_template_id, day_offset, phase, week_number, task_content, estimated_minutes, difficulty, task_type)
SELECT 
  id,
  -60 + (week_num - 5) * 7 + day_num,
  '强化阶段',
  week_num,
  CASE 
    WHEN day_num % 5 = 1 THEN '听力训练：长对话 ' || (week_num * 5) || ' 篇'
    WHEN day_num % 5 = 2 THEN '阅读理解：快速阅读 ' || (week_num * 3) || ' 篇'
    WHEN day_num % 5 = 3 THEN '写作练习：真题作文 ' || (week_num - 4) || ' 篇'
    WHEN day_num % 5 = 4 THEN '翻译练习：真题翻译 ' || (week_num - 4) || ' 篇'
    ELSE '单词复习：核心词汇复习 ' || (week_num * 50) || ' 个'
  END,
  CASE 
    WHEN day_num % 5 = 1 THEN 35
    WHEN day_num % 5 = 2 THEN 45
    WHEN day_num % 5 = 3 THEN 35
    WHEN day_num % 5 = 4 THEN 25
    ELSE 30
  END,
  CASE 
    WHEN week_num <= 6 THEN 3
    WHEN week_num <= 8 THEN 4
    ELSE 4
  END,
  CASE 
    WHEN day_num % 5 = 1 THEN 'listening'
    WHEN day_num % 5 = 2 THEN 'reading'
    WHEN day_num % 5 = 3 THEN 'writing'
    WHEN day_num % 5 = 4 THEN 'translation'
    ELSE 'vocabulary'
  END
FROM exam_templates,
     generate_series(5, 8) AS week_num,
     generate_series(1, 7) AS day_num
WHERE name = '英语四级（CET-4）'
  AND (week_num - 1) * 7 + day_num <= 60;

-- 冲刺阶段（第61-90天）
INSERT INTO exam_task_templates (exam_template_id, day_offset, phase, week_number, task_content, estimated_minutes, difficulty, task_type)
SELECT 
  id,
  -30 + (week_num - 9) * 7 + day_num,
  '冲刺阶段',
  week_num,
  CASE 
    WHEN day_num % 7 = 1 THEN '真题模拟：完整套题 ' || (week_num - 8) || ' 套'
    WHEN day_num % 7 = 2 THEN '听力强化：真题听力 ' || (week_num * 3) || ' 篇'
    WHEN day_num % 7 = 3 THEN '阅读强化：真题阅读 ' || (week_num * 3) || ' 篇'
    WHEN day_num % 7 = 4 THEN '写作强化：预测作文 ' || (week_num - 8) || ' 篇'
    WHEN day_num % 7 = 5 THEN '翻译强化：预测翻译 ' || (week_num - 8) || ' 篇'
    WHEN day_num % 7 = 6 THEN '错题复习：整理错题本'
    ELSE '单词冲刺：高频词汇复习'
  END,
  CASE 
    WHEN day_num % 7 = 1 THEN 120
    WHEN day_num % 7 = 2 THEN 40
    WHEN day_num % 7 = 3 THEN 50
    WHEN day_num % 7 = 4 THEN 40
    WHEN day_num % 7 = 5 THEN 30
    WHEN day_num % 7 = 6 THEN 60
    ELSE 30
  END,
  5,
  CASE 
    WHEN day_num % 7 = 1 THEN 'mock'
    WHEN day_num % 7 = 2 THEN 'listening'
    WHEN day_num % 7 = 3 THEN 'reading'
    WHEN day_num % 7 = 4 THEN 'writing'
    WHEN day_num % 7 = 5 THEN 'translation'
    WHEN day_num % 7 = 6 THEN 'review'
    ELSE 'vocabulary'
  END
FROM exam_templates,
     generate_series(9, 13) AS week_num,
     generate_series(1, 7) AS day_num
WHERE name = '英语四级（CET-4）'
  AND (week_num - 1) * 7 + day_num <= 90;

-- ============================================================
-- 为"计算机二级（MS Office）"插入任务模板
-- ============================================================

-- 基础阶段（第1-20天）
INSERT INTO exam_task_templates (exam_template_id, day_offset, phase, week_number, task_content, estimated_minutes, difficulty, task_type)
SELECT 
  id,
  -60 + (week_num - 1) * 7 + day_num,
  '基础阶段',
  week_num,
  CASE 
    WHEN day_num % 3 = 1 THEN 'Word基础：文本编辑与格式化（第' || week_num || '天）'
    WHEN day_num % 3 = 2 THEN 'Excel基础：公式与函数（第' || week_num || '天）'
    ELSE 'PowerPoint基础：演示文稿制作（第' || week_num || '天）'
  END,
  CASE 
    WHEN day_num % 3 = 1 THEN 40
    WHEN day_num % 3 = 2 THEN 50
    ELSE 30
  END,
  CASE 
    WHEN week_num <= 1 THEN 1
    WHEN week_num <= 2 THEN 2
    ELSE 2
  END,
  CASE 
    WHEN day_num % 3 = 1 THEN 'word'
    WHEN day_num % 3 = 2 THEN 'excel'
    ELSE 'powerpoint'
  END
FROM exam_templates,
     generate_series(1, 3) AS week_num,
     generate_series(1, 7) AS day_num
WHERE name = '计算机二级（MS Office）'
  AND (week_num - 1) * 7 + day_num <= 20;

-- 强化阶段（第21-40天）
INSERT INTO exam_task_templates (exam_template_id, day_offset, phase, week_number, task_content, estimated_minutes, difficulty, task_type)
SELECT 
  id,
  -40 + (week_num - 4) * 7 + day_num,
  '强化阶段',
  week_num,
  CASE 
    WHEN day_num % 4 = 1 THEN 'Word高级：样式、目录、邮件合并'
    WHEN day_num % 4 = 2 THEN 'Excel高级：数据透视表、图表'
    WHEN day_num % 4 = 3 THEN 'PowerPoint高级：动画、切换、母版'
    ELSE '选择题练习：公共基础知识'
  END,
  CASE 
    WHEN day_num % 4 = 1 THEN 45
    WHEN day_num % 4 = 2 THEN 55
    WHEN day_num % 4 = 3 THEN 35
    ELSE 30
  END,
  3,
  CASE 
    WHEN day_num % 4 = 1 THEN 'word'
    WHEN day_num % 4 = 2 THEN 'excel'
    WHEN day_num % 4 = 3 THEN 'powerpoint'
    ELSE 'choice'
  END
FROM exam_templates,
     generate_series(4, 6) AS week_num,
     generate_series(1, 7) AS day_num
WHERE name = '计算机二级（MS Office）'
  AND (week_num - 1) * 7 + day_num <= 40;

-- 冲刺阶段（第41-60天）
INSERT INTO exam_task_templates (exam_template_id, day_offset, phase, week_number, task_content, estimated_minutes, difficulty, task_type)
SELECT 
  id,
  -20 + (week_num - 7) * 7 + day_num,
  '冲刺阶段',
  week_num,
  CASE 
    WHEN day_num % 7 = 1 THEN '真题模拟：整套操作题（第' || (week_num - 6) || '套）'
    WHEN day_num % 7 = 2 THEN 'Word冲刺：真题演练'
    WHEN day_num % 7 = 3 THEN 'Excel冲刺：真题演练'
    WHEN day_num % 7 = 4 THEN 'PowerPoint冲刺：真题演练'
    WHEN day_num % 7 = 5 THEN '选择题冲刺：高频考点'
    WHEN day_num % 7 = 6 THEN '错题复习：整理操作题错题'
    ELSE '全套模拟：完整考试流程'
  END,
  CASE 
    WHEN day_num % 7 = 1 THEN 90
    WHEN day_num % 7 = 2 THEN 50
    WHEN day_num % 7 = 3 THEN 50
    WHEN day_num % 7 = 4 THEN 40
    WHEN day_num % 7 = 5 THEN 30
    WHEN day_num % 7 = 6 THEN 40
    ELSE 120
  END,
  4,
  CASE 
    WHEN day_num % 7 = 1 THEN 'mock'
    WHEN day_num % 7 = 2 THEN 'word'
    WHEN day_num % 7 = 3 THEN 'excel'
    WHEN day_num % 7 = 4 THEN 'powerpoint'
    WHEN day_num % 7 = 5 THEN 'choice'
    WHEN day_num % 7 = 6 THEN 'review'
    ELSE 'mock'
  END
FROM exam_templates,
     generate_series(7, 9) AS week_num,
     generate_series(1, 7) AS day_num
WHERE name = '计算机二级（MS Office）'
  AND (week_num - 1) * 7 + day_num <= 60;

-- ============================================================
-- 函数：生成用户考试任务
-- ============================================================
CREATE OR REPLACE FUNCTION generate_user_exam_tasks(
  p_user_exam_id UUID
)
RETURNS void AS $$
DECLARE
  v_user_id UUID;
  v_exam_template_id UUID;
  v_start_date DATE;
  v_exam_date DATE;
  v_total_days INTEGER;
  v_template_record RECORD;
BEGIN
  -- 获取用户考试信息
  SELECT 
    ue.user_id, ue.exam_template_id, ue.start_date, ue.exam_date
  INTO 
    v_user_id, v_exam_template_id, v_start_date, v_exam_date
  FROM user_exams ue
  WHERE ue.id = p_user_exam_id;

  v_total_days := v_exam_date - v_start_date;

  -- 删除已存在的任务（重新生成）
  DELETE FROM user_exam_tasks WHERE user_exam_id = p_user_exam_id;

  -- 从模板生成每日任务
  INSERT INTO user_exam_tasks (
    user_exam_id,
    task_date,
    task_content,
    estimated_minutes,
    difficulty,
    task_type,
    phase
  )
  SELECT 
    p_user_exam_id,
    v_start_date + (ett.day_offset + v_total_days) * INTERVAL '1 day',
    ett.task_content,
    ett.estimated_minutes,
    ett.difficulty,
    ett.task_type,
    ett.phase
  FROM exam_task_templates ett
  WHERE ett.exam_template_id = v_exam_template_id
    AND ett.day_offset + v_total_days >= 0
    AND ett.day_offset + v_total_days < v_total_days
  ORDER BY ett.day_offset;

  -- 如果模板数据不足，补充通用任务
  IF NOT EXISTS (SELECT 1 FROM user_exam_tasks WHERE user_exam_id = p_user_exam_id) THEN
    INSERT INTO user_exam_tasks (
      user_exam_id,
      task_date,
      task_content,
      estimated_minutes,
      difficulty,
      task_type,
      phase
    )
    SELECT 
      p_user_exam_id,
      v_start_date + (seq - 1) * INTERVAL '1 day',
      '📚 第' || seq || '天学习任务：复习' || et.name || '知识点',
      60,
      3,
      'study',
      CASE 
        WHEN seq <= v_total_days * 0.3 THEN '基础阶段'
        WHEN seq <= v_total_days * 0.7 THEN '强化阶段'
        ELSE '冲刺阶段'
      END
    FROM exam_templates et,
         generate_series(1, v_total_days) AS seq
    WHERE et.id = v_exam_template_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- 触发器：自动生成任务
-- ============================================================
CREATE OR REPLACE FUNCTION trigger_generate_exam_tasks()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM generate_user_exam_tasks(NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_generate_exam_tasks
  AFTER INSERT ON user_exams
  FOR EACH ROW
  EXECUTE FUNCTION trigger_generate_exam_tasks();

-- ============================================================
-- 完成
-- ============================================================
SELECT 'Exam system tables created successfully!' AS result;
