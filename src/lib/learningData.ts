// ============================================================
// 学习数据层：5个阶段、22周任务、开源项目库
// ============================================================
import type { Task, TaskWithCompletion, OpenSourceProject, LearningStage, Difficulty } from '../types';

// ========== 阶段定义 ==========
export const LEARNING_STAGES: LearningStage[] = [
  {
    id: 1,
    name: '基础铺垫',
    name_en: 'Foundation',
    description: 'Python进阶 → LLM原理 → Prompt工程 → API实战',
    color: 'c-purple',
    icon: '🟣',
    week_start: 1,
    week_end: 4,
  },
  {
    id: 2,
    name: '核心框架',
    name_en: 'Core Frameworks',
    description: 'LangChain → LangGraph → Tool Calling → Memory',
    color: 'c-teal',
    icon: '🟢',
    week_start: 5,
    week_end: 9,
  },
  {
    id: 3,
    name: 'RAG & 多Agent',
    name_en: 'RAG & Multi-Agent',
    description: '向量数据库 → RAG系统 → 多Agent协作',
    color: 'c-coral',
    icon: '🟠',
    week_start: 10,
    week_end: 14,
  },
  {
    id: 4,
    name: '工程化部署',
    name_en: 'Engineering & Deploy',
    description: '评估体系 → FastAPI → Docker → 监控',
    color: 'c-blue',
    icon: '🔵',
    week_start: 15,
    week_end: 18,
  },
  {
    id: 5,
    name: '项目实战求职',
    name_en: 'Project & Career',
    description: '端到端项目 → 开源贡献 → 简历面试',
    color: 'c-green',
    icon: '🟢',
    week_start: 19,
    week_end: 22,
  },
];

// ========== 每日任务数据生成器 ==========
// 基于开始日期（2026-05-09 = 第1周第1天）生成任务列表
// 每个阶段每周7天，每天若干任务

interface DayTaskDef {
  content: string;
  description: string;
  difficulty: Difficulty;
  repo_url?: string;
}

interface WeekTaskDef {
  [day: number]: DayTaskDef[];
}

// ---------- 阶段一：基础铺垫 ----------
const STAGE1_TASKS: { [week: number]: WeekTaskDef } = {
  1: {
    1: [{ content: 'Python类型系统：typing模块深入', description: '学 Type Hints、泛型、TypeVar、Protocol', difficulty: 'simple' }, { content: '给一段旧代码加上完整类型标注', description: '实践：为一个 200 行脚本加类型标注', difficulty: 'medium', repo_url: 'https://github.com/python/typing' }],
    2: [{ content: 'asyncio基础：事件循环原理', description: '理解 Event Loop、协程、Task、Future', difficulty: 'medium' }, { content: 'async/await 语法深入', description: '学 await 原理、可等待对象', difficulty: 'simple' }],
    3: [{ content: 'asyncio.gather & semaphore并发控制', description: '实现并发限制器，防止过载', difficulty: 'medium' }, { content: '异步异常处理最佳实践', description: '学 asyncio 的错误处理模式', difficulty: 'medium' }],
    4: [{ content: '装饰器原理与元编程', description: '理解装饰器本质、functools.wraps、参数化装饰器', difficulty: 'advanced' }, { content: '实现 @retry(times=3) 装饰器', description: '支持指数退避的通用重试装饰器', difficulty: 'medium' }],
    5: [{ content: 'Pydantic v2 深度使用', description: '学 model_config、Field、validator、序列化', difficulty: 'medium' }, { content: '用 Pydantic 构建配置管理模块', description: '支持环境变量、类型校验、嵌套配置', difficulty: 'medium' }],
    6: [{ content: '周项目：异步API客户端', description: '用 asyncio + Pydantic + httpx 写一个可复用的异步 API 客户端，支持并发请求、自动重试、类型安全的响应解析', difficulty: 'advanced', repo_url: 'https://github.com/encode/httpx' }],
    7: [{ content: '第1周复盘：整理笔记', description: '总结 asyncio 核心概念，整理到个人知识库', difficulty: 'simple' }],
  },
  2: {
    1: [{ content: 'Transformer架构：Attention机制精读', description: '手画 Self-Attention 计算流程图，标注 Q/K/V 维度变换', difficulty: 'advanced', repo_url: 'https://github.com/huggingface/transformers' }, { content: '读 "Attention Is All You Need" 精读笔记', description: '重点：Multi-Head Attention、Position Encoding', difficulty: 'advanced' }],
    2: [{ content: 'Tokenization原理：BPE/WordPiece', description: '学 tiktoken 库，理解 token 边界问题', difficulty: 'medium' }, { content: '中文 vs 英文 Token 数对比实验', description: '用 tiktoken 统计不同文本的 token 消耗', difficulty: 'simple' }],
    3: [{ content: 'Embeddings原理与相似度计算', description: '理解向量空间、余弦相似度、欧氏距离', difficulty: 'medium' }, { content: '用 sentence-transformers 实践', description: '计算两段文本的语义相似度', difficulty: 'medium', repo_url: 'https://github.com/UKPLab/sentence-transformers' }],
    4: [{ content: 'LLM推理过程：自回归生成', description: '理解 temperature/top-p/nucleus sampling', difficulty: 'medium' }, { content: '用不同参数调用 API 对比输出', description: '控制变量法：固定 prompt，改变参数观察输出差异', difficulty: 'simple' }],
    5: [{ content: 'LLM局限：幻觉/上下文限制/推理成本', description: '写总结文章：LLM 能做什么不能做什么', difficulty: 'medium' }],
    6: [{ content: '周项目：LLM原理实验 Notebook', description: '用 Jupyter 做一组对比实验：不同模型/参数/ prompt 对输出质量的影响，给出定量评估', difficulty: 'advanced' }],
    7: [{ content: '第2周复盘', description: '整理 Transformer → Embedding → Sampling 知识图谱', difficulty: 'simple' }],
  },
  3: {
    1: [{ content: 'Zero-shot / Few-shot / One-shot 对比', description: '同一任务测试三种范式，记录准确率差异', difficulty: 'simple' }, { content: 'Few-shot 示例选择策略', description: '学 kNN 选示例、多样性采样', difficulty: 'medium' }],
    2: [{ content: 'Chain-of-Thought (CoT) 原理', description: '读论文，理解 Let\'s think step by step 思想', difficulty: 'advanced', repo_url: 'https://github.com/openai/openai-cookbook' }, { content: 'CoT vs 无 CoT 数学推理对比', description: '用 GSM8K 数据集做对比实验', difficulty: 'medium' }],
    3: [{ content: 'System Prompt 设计模式', description: '学角色设定、输出格式约束、思维链引导', difficulty: 'medium' }, { content: '设计严格 JSON 输出 prompt', description: '让 LLM 稳定输出可解析的 JSON', difficulty: 'medium' }],
    4: [{ content: 'Prompt 攻击与防御', description: '学 Jailbreak 原理（DAN、虚拟场景等）', difficulty: 'advanced' }, { content: '防御方法：输入过滤、输出校验', description: '实现一个简单的 Prompt 注入检测器', difficulty: 'advanced' }],
    5: [{ content: '高级技巧：ToT / Self-Consistency', description: '读 Tree of Thoughts 论文摘要，理解多路径推理', difficulty: 'advanced' }],
    6: [{ content: '周项目：个人 Prompt 模板库', description: '设计并实现一套完整的 Prompt 模板（摘要/翻译/代码生成/数据分析），支持变量替换和批量测试', difficulty: 'advanced' }],
    7: [{ content: '第3周复盘', description: '整理 Prompt 工程技巧清单，更新个人模板库', difficulty: 'simple' }],
  },
  4: {
    1: [{ content: 'OpenAI Chat Completions API 全貌', description: '学 messages 结构、role 含义、stream 参数', difficulty: 'simple' }, { content: '实现多轮对话脚本', description: '维护 messages 历史，支持连续对话', difficulty: 'medium' }],
    2: [{ content: 'Function Calling 深入', description: '学工具定义 Schema、auto vs required', difficulty: 'medium' }, { content: '实现查天气工具调用', description: '完整的 Function Calling 流程：定义→调用→解析→回复', difficulty: 'medium' }],
    3: [{ content: 'Anthropic Claude API 对比', description: '学 Messages API、System Prompt 分离', difficulty: 'medium' }, { content: 'Gemini API 对比使用', description: '同一任务调用三个不同模型，对比输出质量和成本', difficulty: 'medium' }],
    4: [{ content: 'Streaming 输出实现', description: '学 Server-Sent Events，实现逐字输出效果', difficulty: 'medium' }, { content: '错误处理与重试机制', description: '实现指数退避重试、优雅降级', difficulty: 'advanced' }],
    5: [{ content: '阶段一考核', description: '完成阶段一考核题目（见考核标准文档）', difficulty: 'advanced' }],
    6: [{ content: '考核补强（如需要）', description: '针对考核中的薄弱点进行针对性练习', difficulty: 'medium' }],
    7: [{ content: '阶段总结 & 规划阶段二', description: '整理阶段一学习笔记，制定阶段二详细计划', difficulty: 'simple' }],
  },
};

// ---------- 阶段二：核心框架 ----------
const STAGE2_TASKS: { [week: number]: WeekTaskDef } = {
  5: {
    1: [{ content: 'LangChain 架构概览 & LCEL 语法', description: '学 LangChain Expression Language，理解 | 操作符', difficulty: 'medium', repo_url: 'https://github.com/langchain-ai/langchain' }, { content: '用 LCEL 写一个简单链', description: 'PromptTemplate | ChatModel | OutputParser', difficulty: 'simple' }],
    2: [{ content: 'PromptTemplates 动态构建', description: '学 ChatPromptTemplate、MessagesPlaceholder', difficulty: 'simple' }],
    3: [{ content: 'OutputParsers：Pydantic输出解析', description: '学 PydanticOutputParser，实现强制 JSON 输出', difficulty: 'medium' }],
    4: [{ content: 'Chains 组合：SequentialChain', description: '学管道操作符，实现多步骤推理链', difficulty: 'medium' }],
    5: [{ content: 'Callbacks & LangSmith 基础', description: '学 LangSmith 追踪，查看完整 trace', difficulty: 'simple' }],
    6: [{ content: '周项目：文章摘要+关键词提取链', description: '用 LangChain 构建：输入文章 → 摘要 → 关键词提取 → 结构化输出', difficulty: 'medium' }],
    7: [{ content: '第5周复盘：整理 LCEL 语法笔记', description: '手画 LCEL 数据流图', difficulty: 'simple' }],
  },
  6: {
    1: [{ content: 'Agent 原理：ReAct 论文精读', description: '理解 Thought-Action-Observation 循环', difficulty: 'advanced', repo_url: 'https://github.com/hwchase17/react-langchain' }, { content: '手画 ReAct 循环图', description: '标注每个环节的输入输出', difficulty: 'medium' }],
    2: [{ content: 'Tool 定义：@tool 装饰器', description: '学 BaseTool 自定义，设计良好的工具 Schema', difficulty: 'medium' }, { content: '定义 3 个自定义工具', description: '工具需要有清晰的 name/description/args_schema', difficulty: 'medium' }],
    3: [{ content: 'AgentExecutor：执行流程深入', description: '学最大迭代次数、错误处理、early stopping', difficulty: 'advanced' }],
    4: [{ content: '高级 Agent 类型对比', description: 'Structured Chat Agent vs OpenAI Functions Agent', difficulty: 'advanced' }],
    5: [{ content: '工具检索：大量工具的动态选择', description: '学 Toolkits、工具检索器', difficulty: 'advanced' }],
    6: [{ content: '周项目：代码解释器+搜索引擎 Agent', description: '构建一个能执行 Python 代码并搜索网络的 Agent', difficulty: 'advanced' }],
    7: [{ content: '第6周复盘：Agent 调试技巧整理', description: '整理 LangSmith trace 分析方法', difficulty: 'simple' }],
  },
  7: {
    1: [{ content: '为什么需要 LangGraph：状态机 Agent', description: '学传统 Agent 的局限：无法处理复杂循环和分支', difficulty: 'medium', repo_url: 'https://github.com/langchain-ai/langgraph' }],
    2: [{ content: 'StateGraph 基础：定义状态、添加节点', description: '学 State 类型定义、add_node、add_edge', difficulty: 'medium' }],
    3: [{ content: '条件边 & 循环控制', description: '学 add_conditional_edges，实现动态路由', difficulty: 'advanced' }],
    4: [{ content: 'Checkpointer：持久化 & 人机协作', description: '学 MemorySaver、SqliteSaver，实现可中断恢复的 Agent', difficulty: 'advanced' }],
    5: [{ content: '用 LangGraph 重构阶段二的 Agent', description: '将上周的代码解释器 Agent 用 LangGraph 重写', difficulty: 'advanced' }],
    6: [{ content: '周项目：多步骤研究助手（LangGraph版）', description: '用 LangGraph 构建：规划→搜索→分析→汇总 的循环流程', difficulty: 'advanced' }],
    7: [{ content: '第7周复盘：LangChain Agent vs LangGraph', description: '写对比分析文档，明确选型决策树', difficulty: 'medium' }],
  },
  8: {
    1: [{ content: 'Memory 类型全览', description: 'ConversationBufferMemory / Summary / BufferWindow', difficulty: 'simple' }],
    2: [{ content: '向量存储 Memory：VectorStoreRetrieverMemory', description: '学长期记忆检索原理', difficulty: 'medium' }],
    3: [{ content: 'Memory 压缩：摘要记忆 & Token 预算管理', description: '实现带 Token 预算的 Memory 系统', difficulty: 'advanced' }],
    4: [{ content: '多用户 Memory 隔离', description: '学如何为不同用户维护独立对话历史', difficulty: 'medium' }],
    5: [{ content: '高级 Memory：MemGPT 思路学习', description: '读 MemGPT 论文，理解自管理 Memory', difficulty: 'advanced', repo_url: 'https://github.com/cpacker/MemGPT' }],
    6: [{ content: '周项目：给 Agent 加上完整 Memory 系统', description: '为阶段二的研究助手 Agent 集成多层级 Memory', difficulty: 'advanced' }],
    7: [{ content: '第8周复盘：Memory 选型决策树', description: '整理不同场景下的最优 Memory 方案', difficulty: 'medium' }],
  },
  9: {
    1: [{ content: '阶段二项目开发（第1天）', description: '个人研究助手 Agent：架构设计 + 状态图设计', difficulty: 'advanced' }],
    2: [{ content: '阶段二项目开发（第2天）', description: '实现规划节点 + 搜索节点', difficulty: 'advanced' }],
    3: [{ content: '阶段二项目开发（第3天）', description: '实现分析节点 + 汇总节点 + 循环逻辑', difficulty: 'advanced' }],
    4: [{ content: '项目完善：README + 架构图 + 测试', description: '写完整文档，画架构图，补充单元测试', difficulty: 'medium' }],
    5: [{ content: '阶段二考核', description: '完成阶段二考核题目', difficulty: 'advanced' }],
    6: [{ content: '考核补强 & 代码重构', description: '针对薄弱环节补强', difficulty: 'medium' }],
    7: [{ content: '阶段总结 & 规划阶段三', description: '整理 LangGraph 核心概念卡片', difficulty: 'simple' }],
  },
};

// ---------- 阶段三：RAG & 多Agent ----------
const STAGE3_TASKS: { [week: number]: WeekTaskDef } = {
  10: {
    1: [{ content: '向量检索基础：ANN算法（HNSW/IVF）', description: '理解近似最近邻搜索原理，手画 HNSW 索引结构', difficulty: 'advanced' }, { content: '相似度度量：余弦/欧氏/内积', description: '理解不同相似度度量的适用场景', difficulty: 'medium' }],
    2: [{ content: 'Chroma 实战：安装到查询', description: '学 Chroma 增删改查、持久化、集合管理', difficulty: 'simple', repo_url: 'https://github.com/chroma-core/chroma' }],
    3: [{ content: 'Pinecone 实战：云端向量库', description: '学命名空间、元数据过滤、索引管理', difficulty: 'medium', repo_url: 'https://github.com/pinecone-io' }],
    4: [{ content: 'Embedding 模型对比', description: '对比 bge-large-zh / text-embedding-3 / gte', difficulty: 'medium' }],
    5: [{ content: 'Hybrid Search：向量+关键词', description: '学 BM25 + 向量检索融合', difficulty: 'advanced' }],
    6: [{ content: '周项目：本地论文检索系统', description: '用 Chroma + SentenceTransformer 构建个人论文库检索', difficulty: 'advanced' }],
    7: [{ content: '第10周复盘：向量数据库选型指南', description: '整理 Chroma/Pinecone/Weaviate/Milvus 对比', difficulty: 'medium' }],
  },
  11: {
    1: [{ content: 'RAG 架构全览', description: 'Indexing → Retrieval → Generation，画出完整架构图', difficulty: 'medium' }],
    2: [{ content: '文档处理：PDF/HTML 解析', description: '学 PyPDF2、Unstructured、专为中文的解析库', difficulty: 'medium' }],
    3: [{ content: 'Chunking 策略：固定大小 vs 语义分块', description: '学 RecursiveCharacterTextSplitter、语义分块算法', difficulty: 'advanced' }],
    4: [{ content: '检索优化：Query Rewriting & Expansion', description: '学查询改写、假设文档生成（HyDE）', difficulty: 'advanced' }],
    5: [{ content: '生成优化：Context Compression & Reranking', description: '学 Cohere Rerank、LLM-based 压缩', difficulty: 'advanced' }],
    6: [{ content: '完整 RAG 实现 + RAGAS 评估', description: '用 LangChain 实现完整 RAG 链并用 RAGAS 评估', difficulty: 'advanced', repo_url: 'https://github.com/explodinggradients/rags' }],
    7: [{ content: '第11周复盘：RAG 优化技巧清单', description: '整理各阶段优化方法（索引/检索/生成）', difficulty: 'medium' }],
  },
  12: {
    1: [{ content: 'Advanced RAG：Corrective RAG & Self-RAG', description: '读 Self-RAG 论文，理解自适应检索', difficulty: 'advanced' }],
    2: [{ content: 'Graph RAG：知识图谱 + RAG', description: '学 Neo4j 基础，实现简单 Graph RAG', difficulty: 'advanced', repo_url: 'https://github.com/neo4j/neo4j-python-driver' }],
    3: [{ content: 'Agentic RAG：Agent 主动决定检索策略', description: '实现让 Agent 自主决定何时检索、检索什么', difficulty: 'advanced' }],
    4: [{ content: '多模态 RAG：图片/表格检索', description: '学多模态 Embedding、CLIP', difficulty: 'advanced', repo_url: 'https://github.com/openai/CLIP' }],
    5: [{ content: 'RAG 生产问题：数据更新 & 版本管理', description: '学增量索引、文档版本控制', difficulty: 'advanced' }],
    6: [{ content: '周项目：生产级 RAG 系统', description: '完整实现：文档上传 → 智能 Chunking → 向量存储 → 多路检索 → Rerank → 生成 → 评估', difficulty: 'advanced' }],
    7: [{ content: '第12周复盘：RAG 技术选型决策树', description: '不同场景下的最优 RAG 方案', difficulty: 'medium' }],
  },
  13: {
    1: [{ content: '多Agent模式：Orchestrator-Workers', description: '理解主从模式，画出架构图', difficulty: 'advanced' }],
    2: [{ content: '多Agent模式：Hierarchical & Debate', description: '学层级化 Agent、Agent 辩论模式', difficulty: 'advanced' }],
    3: [{ content: 'AutoGen 基础：ConversableAgent & GroupChat', description: '学两个 Agent 对话，实现简单协作', difficulty: 'medium', repo_url: 'https://github.com/microsoft/autogen' }],
    4: [{ content: 'AutoGen 高级：自定义Agent & Human-in-the-loop', description: '实现带人工审核的多 Agent 系统', difficulty: 'advanced' }],
    5: [{ content: 'LangGraph 多Agent：用状态图实现多Agent协作', description: '对比 AutoGen vs LangGraph 多Agent实现', difficulty: 'advanced' }],
    6: [{ content: '周项目：多Agent协作系统', description: '选一个场景（研究/编程/分析），实现完整的多 Agent 协作', difficulty: 'advanced' }],
    7: [{ content: '第13周复盘：多Agent框架选型指南', description: 'AutoGen vs CrewAI vs LangGraph 对比分析', difficulty: 'medium' }],
  },
  14: {
    1: [{ content: '阶段三项目开发（第1-2天）', description: '企业知识库 RAG 系统 OR 多Agent协作系统（二选一）', difficulty: 'advanced' }],
    2: [{ content: '阶段三项目开发（第3天）', description: '完成核心功能 + Web UI（Streamlit）', difficulty: 'advanced' }],
    3: [{ content: '项目完善：评估 + 文档 + Demo', description: '用 RAGAS 评估、写 README、录 Demo 视频', difficulty: 'medium' }],
    4: [{ content: '阶段三考核', description: '完成阶段三考核题目', difficulty: 'advanced' }],
    5: [{ content: '考核补强', description: '针对性复习 RAG 优化和 Multi-Agent 模式', difficulty: 'medium' }],
    6: [{ content: '自由练习：补强薄弱点', description: '根据考核结果针对性练习', difficulty: 'medium' }],
    7: [{ content: '阶段总结 & 规划阶段四', description: '整理阶段三核心知识点', difficulty: 'simple' }],
  },
};

// ---------- 阶段四：工程化部署 ----------
const STAGE4_TASKS: { [week: number]: WeekTaskDef } = {
  15: {
    1: [{ content: 'Agent 评估：为什么需要评估', description: 'LLM 应用测试 vs 传统软件测试的核心差异', difficulty: 'simple' }],
    2: [{ content: '评估维度：Faithfulness / Answer Relevancy', description: '理解 RAG 评估的核心指标', difficulty: 'medium' }],
    3: [{ content: 'RAGAS 框架深入', description: '学 Context Precision/Recall、Answer Correctness', difficulty: 'advanced', repo_url: 'https://github.com/explodinggradients/rags' }],
    4: [{ content: 'LLM-as-Judge：用强模型评估弱模型', description: '学避免 Judge Bias 的方法', difficulty: 'advanced' }],
    5: [{ content: '自动化评估流水线搭建', description: '构建评估数据集，实现自动化跑分', difficulty: 'advanced' }],
    6: [{ content: '周项目：评估自己的 RAG 系统', description: '用 RAGAS 对自己的阶段三项目做完整评估，输出报告', difficulty: 'advanced' }],
    7: [{ content: '第15周复盘：Agent 评估最佳实践', description: '整理评估指标选型指南', difficulty: 'medium' }],
  },
  16: {
    1: [{ content: 'FastAPI 基础：路径参数 & 请求体', description: '学 FastAPI 基本用法，写简单 CRUD API', difficulty: 'simple', repo_url: 'https://github.com/fastapi/fastapi' }],
    2: [{ content: '异步 FastAPI：async def 端点', description: '将 Agent 封装为异步 API', difficulty: 'medium' }],
    3: [{ content: 'Pydantic 请求/响应模型', description: '为 Agent API 设计完整 Schema', difficulty: 'medium' }],
    4: [{ content: '错误处理 & 全局异常处理器', description: '实现生产级错误处理', difficulty: 'medium' }],
    5: [{ content: '认证 & 限流：API Key + Rate Limiting', description: '实现带认证和限流的 Agent API', difficulty: 'advanced' }],
    6: [{ content: '周项目：RAG 系统封装为 FastAPI 服务', description: '完整封装，支持文档上传、查询、流式输出', difficulty: 'advanced' }],
    7: [{ content: '第16周复盘：FastAPI 最佳实践', description: '整理 API 设计原则', difficulty: 'simple' }],
  },
  17: {
    1: [{ content: 'Docker 基础：Dockerfile 编写', description: '为 Agent API 写 Dockerfile（多阶段构建）', difficulty: 'medium' }],
    2: [{ content: 'Docker Compose：多容器编排', description: '编排 API + Redis + VectorDB', difficulty: 'advanced' }],
    3: [{ content: '云部署：Railway / Render / Fly.io', description: '将 Agent API 部署到云平台（选一个）', difficulty: 'medium' }],
    4: [{ content: 'CI/CD：GitHub Actions 自动部署', description: '配置自动测试 + 自动部署流水线', difficulty: 'advanced' }],
    5: [{ content: '成本优化：响应缓存 & Token 预算管理', description: '实现语义缓存（相似问题复用回答）', difficulty: 'advanced' }],
    6: [{ content: '周项目：完整部署 Agent API', description: 'Docker + 云平台 + CI/CD + 监控，完整上线', difficulty: 'advanced' }],
    7: [{ content: '第17周复盘：部署 Checklist', description: '整理 Agent 生产部署完整 Checklist', difficulty: 'medium' }],
  },
  18: {
    1: [{ content: 'LangSmith 深入：Trace & Feedback', description: '学 Dataset 管理、标注、评估', difficulty: 'medium' }],
    2: [{ content: '自定义日志系统：结构化日志', description: '实现 Agent 专用日志（请求/响应/延迟/成本）', difficulty: 'advanced' }],
    3: [{ content: '可观测性关键指标', description: '延迟、成本、准确率、用户满意度', difficulty: 'medium' }],
    4: [{ content: '阶段四项目完善：整合评估+部署+监控', description: '将前三周的工作整合为一个完整可观测的系统', difficulty: 'advanced' }],
    5: [{ content: '阶段四考核', description: '完成阶段四考核题目', difficulty: 'advanced' }],
    6: [{ content: '考核补强', description: '针对性复习工程化知识点', difficulty: 'medium' }],
    7: [{ content: '阶段总结 & 规划阶段五', description: '整理生产级 Agent 系统架构图', difficulty: 'simple' }],
  },
};

// ---------- 阶段五：项目实战求职 ----------
const STAGE5_TASKS: { [week: number]: WeekTaskDef } = {
  19: {
    1: [{ content: '端到端项目一：需求分析 + 技术选型', description: '选做：智能代码 Review Agent OR 个人知识管理 Agent', difficulty: 'advanced' }],
    2: [{ content: '项目一：核心功能开发（第1-2天）', description: '完成核心 Agent 逻辑', difficulty: 'advanced' }],
    3: [{ content: '项目一：API 封装 + Web UI', description: 'FastAPI + Streamlit/Gradio', difficulty: 'advanced' }],
    4: [{ content: '项目一：测试 + 文档', description: '单元测试 + 完整 README + 架构图', difficulty: 'medium' }],
    5: [{ content: '项目一：部署 + Demo', description: '部署到云平台，录制 Demo 视频', difficulty: 'medium' }],
    6: [{ content: '项目一完善：根据自测反馈迭代', description: '模拟用户使用，修复问题', difficulty: 'medium' }],
    7: [{ content: '第19周复盘：项目架构复盘', description: '写技术博客：项目中的技术选型思考', difficulty: 'medium' }],
  },
  20: {
    1: [{ content: '路径A：第二个端到端项目 或 路径B：开源贡献', description: '二选一：项目二（对话Agent/代码生成Agent/数据分析Agent）OR 找 LangChain/AutoGen 的 good first issue', difficulty: 'advanced' }],
    2: [{ content: '开源贡献：阅读贡献指南 + 选 issue', description: '理解项目代码规范，选一个 good first issue', difficulty: 'medium' }],
    3: [{ content: '开源贡献：写代码 + 测试 + 提交 PR', description: '遵循项目 PR 规范，写清楚 PR 描述', difficulty: 'advanced' }],
    4: [{ content: '项目二 或 第二个开源 PR', description: '继续推进', difficulty: 'advanced' }],
    5: [{ content: '项目二 或 跟进 PR review', description: '根据 maintainer 反馈修改代码', difficulty: 'medium' }],
    6: [{ content: '本周总结：确保有一个完整项目 + 一个PR', description: '检查进度，查漏补缺', difficulty: 'medium' }],
    7: [{ content: '第20周复盘', description: '整理开源贡献经验', difficulty: 'simple' }],
  },
  21: {
    1: [{ content: '项目整理：确保所有项目有完整 README + Demo', description: '检查 GitHub 每个项目：README、截图、Live Demo 链接', difficulty: 'simple' }],
    2: [{ content: '简历撰写：Agent 开发岗位定向简历', description: '用 STAR 法则写项目经历，量化成果', difficulty: 'advanced' }],
    3: [{ content: '技术博客：写 1-2 篇深度文章', description: '发布在知乎/掘金/个人网站，主题：Agent 设计实践', difficulty: 'advanced' }],
    4: [{ content: 'LinkedIn / 个人网站完善', description: '完善在线简历，关联 GitHub 和博客', difficulty: 'simple' }],
    5: [{ content: 'GitHub Profile 整理', description: '确保 Profile 整洁、有亮点项目置顶、有 contributions 绿墙', difficulty: 'simple' }],
    6: [{ content: '求职材料包整理', description: '简历 + 项目集 + 博客链接 + Demo 视频，打包', difficulty: 'medium' }],
    7: [{ content: '模拟自我介绍（录像回看）', description: '3 分钟自我介绍，技术亮点清晰，录像复盘', difficulty: 'medium' }],
  },
  22: {
    1: [{ content: '系统设计方案准备：设计 RAG 系统', description: '准备：数据流入→索引→检索→生成→评估 完整设计', difficulty: 'advanced' }],
    2: [{ content: 'Coding 刷题：树/图/DFS/BFS', description: 'LeetCode Agent 相关题：二叉树的序列化、拓扑排序、最短路径', difficulty: 'advanced' }],
    3: [{ content: 'LLM 基础知识面试准备', description: '准备：Transformer、RLHF、Prompt 工程面试题', difficulty: 'advanced' }],
    4: [{ content: '项目深挖：能把自己的项目讲深讲透', description: '准备：技术方案选型原因、踩过的坑、如何优化', difficulty: 'advanced' }],
    5: [{ content: 'Mock Interview：模拟面试', description: '找朋友或自己录视频做模拟面试（45分钟）', difficulty: 'advanced' }],
    6: [{ content: '查漏补缺：针对模拟面试弱点补强', description: '整理面试问题清单 + 答案要点', difficulty: 'medium' }],
    7: [{ content: '最终复盘：整理面试问题清单', description: '输出：Agent 开发岗位面试题库（含答案要点）', difficulty: 'advanced' }],
  },
};

// ========== 汇总共 22 周任务数据 ==========
const ALL_TASK_DEFS: { [week: number]: WeekTaskDef } = {
  ...STAGE1_TASKS,
  ...STAGE2_TASKS,
  ...STAGE3_TASKS,
  ...STAGE4_TASKS,
  ...STAGE5_TASKS,
};

// ========== 根据开始日期生成任务列表 ==========
export function generateTasks(startDate: string): Task[] {
  const start = new Date(startDate);
  const tasks: Task[] = [];
  let sortOrder = 0;

  for (let week = 1; week <= 22; week++) {
    const stageId = week <= 4 ? 1 : week <= 9 ? 2 : week <= 14 ? 3 : week <= 18 ? 4 : 5;
    const weekDef = ALL_TASK_DEFS[week];
    if (!weekDef) continue;

    for (let day = 1; day <= 7; day++) {
      const dayTasks = weekDef[day];
      if (!dayTasks) continue;

      const taskDate = new Date(start);
      taskDate.setDate(start.getDate() + (week - 1) * 7 + (day - 1));
      const dateStr = taskDate.toISOString().split('T')[0];

      for (const t of dayTasks) {
        sortOrder++;
        tasks.push({
          id: `s${stageId}_w${week}_d${day}_${sortOrder}`,
          stage_id: stageId,
          week_num: week,
          day_num: day,
          date: dateStr,
          content: t.content,
          description: t.description,
          repo_url: t.repo_url || undefined,
          difficulty: t.difficulty,
          sort_order: sortOrder,
        });
      }
    }
  }
  return tasks;
}

// ========== 开源项目库（每个阶段5个，分难度）==========

// 难度说明：
// simple   = 新手友好，有好 README + 示例代码，适合跟着敲
// medium   = 需要一定基础，需要理解核心代码逻辑
// advanced = 需要深入理解，适合面试前啃源码

export const BUILTIN_PROJECTS: Omit<OpenSourceProject, 'id' | 'created_at' | 'updated_at'>[] = [
  // ========== 阶段一：基础铺垫 ==========
  {
    stage_id: 1,
    name: 'Python Typing Module',
    repo_url: 'https://github.com/python/typing',
    github_url: 'https://github.com/python/typing',
    description: 'Python 官方类型提示模块，学习 Type Hints 的最佳参考',
    difficulty: 'simple',
    stars: 1500,
    practice_focus: '类型标注语法、Generic、TypeVar、Protocol',
    interview_relevance: '类型安全是大型项目的基石，面试官常问 Type Hints 的高级用法',
    tags: ['Python', 'Type Hints', '基础'],
    is_builtin: true,
    created_by: undefined,
  },
  {
    stage_id: 1,
    name: 'httpx',
    repo_url: 'https://github.com/encode/httpx',
    github_url: 'https://github.com/encode/httpx',
    description: '下一代 Python HTTP 客户端，支持同步/异步，是 requests 的现代替代品',
    difficulty: 'medium',
    stars: 13500,
    practice_focus: '异步 HTTP 请求、连接池管理、超时控制',
    interview_relevance: '异步 HTTP 是 Agent 调用 API 的基础，常考异步编程',
    tags: ['Python', 'asyncio', 'HTTP', 'API'],
    is_builtin: true,
    created_by: undefined,
  },
  {
    stage_id: 1,
    name: 'OpenAI Cookbook',
    repo_url: 'https://github.com/openai/openai-cookbook',
    github_url: 'https://github.com/openai/openai-cookbook',
    description: 'OpenAI 官方示例代码集合，包含各种 Prompt 工程和 API 使用技巧',
    difficulty: 'simple',
    stars: 62000,
    practice_focus: 'Prompt 设计、Function Calling、嵌入式应用',
    interview_relevance: '直接学习大厂（OpenAI）的最佳实践，面试常问 Prompt 技巧',
    tags: ['OpenAI', 'Prompt Engineering', 'LLM'],
    is_builtin: true,
    created_by: undefined,
  },
  {
    stage_id: 1,
    name: 'sentence-transformers',
    repo_url: 'https://github.com/UKPLab/sentence-transformers',
    github_url: 'https://github.com/UKPLab/sentence-transformers',
    description: '最流行的句子嵌入库，支持多种预训练模型，适合学习 Embedding 原理',
    difficulty: 'medium',
    stars: 17000,
    practice_focus: 'Embedding 模型使用、相似度计算、语义检索',
    interview_relevance: 'Embedding 是 RAG 的基础，常问向量相似度计算',
    tags: ['NLP', 'Embedding', 'Semantic Search'],
    is_builtin: true,
    created_by: undefined,
  },
  {
    stage_id: 1,
    name: 'Anthropic Prompt Engineering',
    repo_url: 'https://github.com/anthropics/prompt-eng-interactive-tutorial',
    github_url: 'https://github.com/anthropics/prompt-eng-interactive-tutorial',
    description: 'Anthropic 官方 Prompt 工程互动教程，包含大量实践案例',
    difficulty: 'medium',
    stars: 19000,
    practice_focus: 'Claude API 使用、Prompt 设计模式、系统提示词设计',
    interview_relevance: 'Anthropic 是顶级 AI 公司，其 Prompt 工程方法是面试高频考点',
    tags: ['Anthropic', 'Claude', 'Prompt Engineering'],
    is_builtin: true,
    created_by: undefined,
  },
  // ========== 阶段二：核心框架 ==========
  {
    stage_id: 2,
    name: 'LangChain',
    repo_url: 'https://github.com/langchain-ai/langchain',
    github_url: 'https://github.com/langchain-ai/langchain',
    description: '最流行的 LLM 应用开发框架，学习 Agent 开发的必读源码',
    difficulty: 'advanced',
    stars: 105000,
    practice_focus: 'LCEL 语法、Agent 执行流程、Tool 定义、Memory 管理',
    interview_relevance: 'LangChain 是 Agent 开发的事实标准，源码理解是面试加分项',
    tags: ['LangChain', 'Agent', 'LLM Framework'],
    is_builtin: true,
    created_by: undefined,
  },
  {
    stage_id: 2,
    name: 'LangGraph',
    repo_url: 'https://github.com/langchain-ai/langgraph',
    github_url: 'https://github.com/langchain-ai/langgraph',
    description: 'LangChain 官方多步骤 Agent 编排框架，基于状态图',
    difficulty: 'advanced',
    stars: 12000,
    practice_focus: 'StateGraph 设计、条件边、Checkpointer、人机协作',
    interview_relevance: 'LangGraph 是最热门的 Agent 框架，大厂面试高频考点',
    tags: ['LangGraph', 'Agent', 'State Machine'],
    is_builtin: true,
    created_by: undefined,
  },
  {
    stage_id: 2,
    name: 'LangChain Academy Code',
    repo_url: 'https://github.com/langchain-ai/langchain-academy',
    github_url: 'https://github.com/langchain-ai/langchain-academy',
    description: 'LangChain 官方教程配套代码，跟着敲一遍等于学完 LangChain',
    difficulty: 'simple',
    stars: 2500,
    practice_focus: 'LCEL 基础、RAG、Agent、LangGraph 基础',
    interview_relevance: '官方教程，覆盖面试常考的所有 LangChain 核心概念',
    tags: ['LangChain', 'Tutorial', 'Learning'],
    is_builtin: true,
    created_by: undefined,
  },
  {
    stage_id: 2,
    name: 'ReAct Paper Implementation',
    repo_url: 'https://github.com/hwchase17/react-langchain',
    github_url: 'https://github.com/hwchase17/react-langchain',
    description: 'ReAct（推理+行动）论文的参考实现，理解 Agent 原理的必读代码',
    difficulty: 'advanced',
    stars: 1200,
    practice_focus: 'ReAct 循环实现、Prompt 设计、工具调用流程',
    interview_relevance: 'ReAct 是 Agent 的基础范式，面试必考',
    tags: ['ReAct', 'Agent', 'Paper Implementation'],
    is_builtin: true,
    created_by: undefined,
  },
  {
    stage_id: 2,
    name: 'MemGPT',
    repo_url: 'https://github.com/cpacker/MemGPT',
    github_url: 'https://github.com/cpacker/MemGPT',
    description: '自管理 Memory 的 Agent 系统，解决长对话上下文限制问题',
    difficulty: 'advanced',
    stars: 13000,
    practice_focus: 'Memory 分层设计、自管理逻辑、虚拟上下文',
    interview_relevance: 'Memory 管理是 Agent 的核心挑战，MemGPT 思路是面试高频话题',
    tags: ['Memory', 'Agent', 'Advanced'],
    is_builtin: true,
    created_by: undefined,
  },
  // ========== 阶段三：RAG & 多Agent ==========
  {
    stage_id: 3,
    name: 'RAGAS - RAG Evaluation Framework',
    repo_url: 'https://github.com/explodinggradients/rags',
    github_url: 'https://github.com/explodinggradients/rags',
    description: '最流行的 RAG 评估框架，提供完整的评估指标体系',
    difficulty: 'medium',
    stars: 7000,
    practice_focus: 'Faithfulness、Answer Relevancy、Context Precision/Recall',
    interview_relevance: 'RAG 评估是生产级系统的核心，面试常问如何评估 RAG 质量',
    tags: ['RAG', 'Evaluation', 'Metrics'],
    is_builtin: true,
    created_by: undefined,
  },
  {
    stage_id: 3,
    name: 'Chroma',
    repo_url: 'https://github.com/chroma-core/chroma',
    github_url: 'https://github.com/chroma-core/chroma',
    description: '最流行的嵌入式向量数据库，适合学习和快速原型开发',
    difficulty: 'simple',
    stars: 16000,
    practice_focus: '向量存储、相似度检索、元数据过滤、持久化',
    interview_relevance: '向量数据库是 RAG 的基础设施，常问 ANN 算法原理',
    tags: ['Vector DB', 'RAG', 'Embedded'],
    is_builtin: true,
    created_by: undefined,
  },
  {
    stage_id: 3,
    name: 'AutoGen',
    repo_url: 'https://github.com/microsoft/autogen',
    github_url: 'https://github.com/microsoft/autogen',
    description: '微软开源的多 Agent 协作框架，支持复杂对话模式',
    difficulty: 'advanced',
    stars: 42000,
    practice_focus: 'ConversableAgent、GroupChat、代码执行、人类反馈',
    interview_relevance: '多 Agent 是 Agent 开发的高级话题，AutoGen 是主流框架',
    tags: ['Multi-Agent', 'Microsoft', 'Advanced'],
    is_builtin: true,
    created_by: undefined,
  },
  {
    stage_id: 3,
    name: 'QAnything',
    repo_url: 'https://github.com/netease-youdao/QAnything',
    github_url: 'https://github.com/netease-youdao/QAnything',
    description: '网易有道开源的企业级 RAG 系统，支持多文件格式和大规模文档',
    difficulty: 'advanced',
    stars: 12000,
    practice_focus: '完整 RAG 系统架构、文档解析、大规模向量检索',
    interview_relevance: '企业级 RAG 系统实战，面试展示项目经验的优质参考',
    tags: ['RAG', 'Enterprise', 'Chinese'],
    is_builtin: true,
    created_by: undefined,
  },
  {
    stage_id: 3,
    name: 'LangChain RAG Tutorial',
    repo_url: 'https://github.com/langchain-ai/rag-from-scratch',
    github_url: 'https://github.com/langchain-ai/rag-from-scratch',
    description: 'LangChain 官方 RAG 从零开始教程，覆盖 19 种 RAG 技术',
    difficulty: 'medium',
    stars: 7000,
    practice_focus: '各种 RAG 优化技术：HyDE、Multi-Query、Reranking',
    interview_relevance: '19 种 RAG 技术全面覆盖，是面试 RAG 话题的百科全书',
    tags: ['RAG', 'Tutorial', 'LangChain'],
    is_builtin: true,
    created_by: undefined,
  },
  // ========== 阶段四：工程化部署 ==========
  {
    stage_id: 4,
    name: 'FastAPI',
    repo_url: 'https://github.com/fastapi/fastapi',
    github_url: 'https://github.com/fastapi/fastapi',
    description: '现代 Python API 框架，性能高、易用性好，是封装 Agent 服务的首选',
    difficulty: 'medium',
    stars: 82000,
    practice_focus: '异步端点、Pydantic 集成、依赖注入、自动文档',
    interview_relevance: 'FastAPI 是 Python Web 开发主流框架，常考异步编程和类型校验',
    tags: ['FastAPI', 'Python', 'API'],
    is_builtin: true,
    created_by: undefined,
  },
  {
    stage_id: 4,
    name: 'LangSmith',
    repo_url: 'https://github.com/langchain-ai/langsmith-sdk',
    github_url: 'https://github.com/langchain-ai/langsmith-sdk',
    description: 'LangChain 官方 LLM 应用监控和可观测性平台',
    difficulty: 'medium',
    stars: 800,
    practice_focus: 'Trace 分析、Dataset 管理、自动化评估',
    interview_relevance: 'LLM 应用监控是生产级系统的核心能力，面试常问如何调试 Agent',
    tags: ['Monitoring', 'LangChain', 'Observability'],
    is_builtin: true,
    created_by: undefined,
  },
  {
    stage_id: 4,
    name: 'Semantic Cache',
    repo_url: 'https://github.com/aurelio-labs/semantic-router',
    github_url: 'https://github.com/aurelio-labs/semantic-router',
    description: '语义路由和缓存库，用语义相似度实现智能缓存和请求路由',
    difficulty: 'advanced',
    stars: 3800,
    practice_focus: '语义缓存、意图路由、成本优化',
    interview_relevance: '语义缓存是降低 LLM 调用成本的关键技术，面试常问优化策略',
    tags: ['Cache', 'Semantic', 'Cost Optimization'],
    is_builtin: true,
    created_by: undefined,
  },
  {
    stage_id: 4,
    name: 'Agent Evaluation Framework',
    repo_url: 'https://github.com/patronus-ai/patronus',
    github_url: 'https://github.com/patronus-ai/patronus',
    description: 'LLM 应用自动化评估框架，支持自定义评估指标',
    difficulty: 'advanced',
    stars: 1200,
    practice_focus: '自动化评估流水线、自定义指标、回归测试',
    interview_relevance: '评估体系是 LLM 应用开发的核心工程能力',
    tags: ['Evaluation', 'Testing', 'Advanced'],
    is_builtin: true,
    created_by: undefined,
  },
  {
    stage_id: 4,
    name: 'Docker FastAPI Production Template',
    repo_url: 'https://github.com/tiangolo/full-stack-fastapi-template',
    github_url: 'https://github.com/tiangolo/full-stack-fastapi-template',
    description: 'FastAPI 作者维护的生产级项目模板，包含 Docker、PostgreSQL、测试',
    difficulty: 'medium',
    stars: 19000,
    practice_focus: 'Docker 多阶段构建、数据库集成、异步测试、CI/CD',
    interview_relevance: '生产级项目结构是面试展示工程能力的重要参考',
    tags: ['FastAPI', 'Docker', 'Production'],
    is_builtin: true,
    created_by: undefined,
  },
  // ========== 阶段五：项目实战求职 ==========
  {
    stage_id: 5,
    name: 'ChatDev',
    repo_url: 'https://github.com/OpenBMB/ChatDev',
    github_url: 'https://github.com/OpenBMB/ChatDev',
    description: '多 Agent 协作开发软件的经典项目，理解多 Agent 系统设计的最佳参考',
    difficulty: 'advanced',
    stars: 25000,
    practice_focus: '多 Agent 角色设计、协作流程、代码生成质量管控',
    interview_relevance: '多 Agent 系统的标杆项目，面试展示系统思维的理想案例',
    tags: ['Multi-Agent', 'Software Development', 'Advanced'],
    is_builtin: true,
    created_by: undefined,
  },
  {
    stage_id: 5,
    name: 'MetaGPT',
    repo_url: 'https://github.com/geekan/MetaGPT',
    github_url: 'https://github.com/geekan/MetaGPT',
    description: '软件公司多 Agent 框架，让 GPT 组成软件公司完成复杂任务',
    difficulty: 'advanced',
    stars: 53000,
    practice_focus: 'Agent 角色定义、任务分解、SOP 设计',
    interview_relevance: '多 Agent 协作的经典实现，面试时可以用来展示对 Agent 系统的深度理解',
    tags: ['Multi-Agent', 'SOP', 'Advanced'],
    is_builtin: true,
    created_by: undefined,
  },
  {
    stage_id: 5,
    name: 'Agent Protocol',
    repo_url: 'https://github.com/AI-Engineer-Foundation/agent-protocol',
    github_url: 'https://github.com/AI-Engineer-Foundation/agent-protocol',
    description: 'Agent 通信协议标准，学习 Agent 互操作性的官方规范',
    difficulty: 'medium',
    stars: 1800,
    practice_focus: 'Agent 通信标准、互操作性设计',
    interview_relevance: 'Agent 协议标准化是行业趋势，展示对 Agent 生态的理解',
    tags: ['Protocol', 'Standard', 'Interoperability'],
    is_builtin: true,
    created_by: undefined,
  },
  {
    stage_id: 5,
    name: 'RAGFlow',
    repo_url: 'https://github.com/infiniflow/ragflow',
    github_url: 'https://github.com/infiniflow/ragflow',
    description: '基于深度文档理解的开源 RAG 引擎，适合学习完整生产级 RAG 系统',
    difficulty: 'advanced',
    stars: 43000,
    practice_focus: '完整 RAG 系统架构、文档理解、向量检索优化',
    interview_relevance: '完整 RAG 系统参考，可以用来学习端到端系统工程实现',
    tags: ['RAG', 'Production', 'Advanced'],
    is_builtin: true,
    created_by: undefined,
  },
  {
    stage_id: 5,
    name: 'Open-Interpreter',
    repo_url: 'https://github.com/OpenInterpreter/open-interpreter',
    github_url: 'https://github.com/OpenInterpreter/open-interpreter',
    description: '本地运行 LLM 的代码解释器，理解工具调用和代码执行的优秀参考',
    difficulty: 'advanced',
    stars: 60000,
    practice_focus: '代码执行安全、工具调用设计、本地 LLM 集成',
    interview_relevance: '代码解释器是 Agent 的核心能力之一，该项目是优秀参考',
    tags: ['Code Interpreter', 'Tool Use', 'Advanced'],
    is_builtin: true,
    created_by: undefined,
  },
];

// ========== 工具函数 ==========
export function getStageByWeek(weekNum: number): LearningStage {
  if (weekNum <= 4) return LEARNING_STAGES[0];
  if (weekNum <= 9) return LEARNING_STAGES[1];
  if (weekNum <= 14) return LEARNING_STAGES[2];
  if (weekNum <= 18) return LEARNING_STAGES[3];
  return LEARNING_STAGES[4];
}

export function getWeekProgress(tasks: TaskWithCompletion[], weekNum: number): { total: number; completed: number } {
  const weekTasks = tasks.filter(t => t.week_num === weekNum);
  return {
    total: weekTasks.length,
    completed: weekTasks.filter(t => t.completed).length,
  };
}

export function getStageProgress(tasks: TaskWithCompletion[], stageId: number): { total: number; completed: number } {
  const stageTasks = tasks.filter(t => t.stage_id === stageId);
  return {
    total: stageTasks.length,
    completed: stageTasks.filter(t => t.completed).length,
  };
}

// 计算今天是第几周第几天（基于开始日期）
export function getTodayWeekAndDay(startDate: string): { week: number; day: number } {
  const start = new Date(startDate);
  const today = new Date();
  start.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  const diffMs = today.getTime() - start.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const week = Math.floor(diffDays / 7) + 1;
  const day = (diffDays % 7) + 1;
  return { week: Math.max(1, week), day: Math.max(1, day) };
}
