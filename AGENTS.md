# AGENTS.md

本文件用于为后续在本仓库中工作的代码代理提供统一约束与执行说明。

这份文档刻意保持简洁、可执行，参考了以下公开实践与官方文档：

- AGENTS.md 开放格式：<https://agents.md/>
- GitHub Copilot 关于仓库自定义指令与 `AGENTS.md` 的说明：<https://docs.github.com/en/copilot/how-tos/configure-custom-instructions/add-repository-instructions>
- Anthropic 关于 `CLAUDE.md` / 项目 memory 的说明：<https://docs.anthropic.com/en/docs/claude-code/memory>

## 作用范围

- 本文件对整个仓库生效。
- 文档、注释、说明中优先使用仓库内相对路径。
- 不要在提交到仓库的文档里写入开发机绝对路径。

## 项目概览

- 技术栈：
  - Next.js 16 App Router
  - React 19
  - TypeScript
  - Tailwind CSS v4
  - `better-sqlite3`
  - `framer-motion`
  - `lucide-react`
- 项目目标：
  - 提供公开能力地图浏览
  - 提供管理员登录
  - 提供能力领域与能力点的后台维护

## 关键文件

- `app/page.tsx`：公开能力地图首页
- `app/login/page.tsx`：管理员登录页与首次登录改密
- `app/config/page.tsx`：后台配置页
- `app/hooks/useCapabilities.ts`：前端能力数据读取与变更入口
- `app/components/ConfigModal.tsx`：能力领域新增/编辑弹窗
- `app/components/ExplorePanel.tsx`：星球详情面板
- `app/components/ConfirmDialog.tsx`：危险操作确认弹窗
- `app/components/StatusNotice.tsx`：统一状态提示
- `app/api/capabilities/route.ts`：能力数据 CRUD API
- `app/api/auth/*.ts`：认证相关 API
- `app/types/index.ts`：共享领域模型定义
- `lib/db.ts`：SQLite 表结构与持久化逻辑
- `data/capability-map.db`：本地持久化数据文件

## 持久化规则

- 能力地图数据存储在 SQLite 中，不再依赖静态样例数据。
- 服务重启后，不允许清空、重建、重灌能力地图数据。
- 已存在的管理员密码在正常重启后必须保持不变。
- 样例能力数据自动注入逻辑已经移除，除非用户明确要求，不要重新引入。
- 旧的“恢复默认能力数据”接口已经移除，除非用户明确要求，不要重新创建。

## 管理员账号规则

- 当前 `lib/db.ts` 的行为是：
  - 只有在 `root` 用户不存在时，才创建默认管理员 `root`
  - 如果 `root` 已存在，不得在启动时覆盖其密码
- 因此：
  - 正常重启不会重置管理员密码
  - 全新空数据库仍会自动创建默认管理员
- 除非用户明确要求，否则不要修改这套行为。

## 数据模型

共享类型定义位于 `app/types/index.ts`。

- `Planet`：星域中的顶层节点
- `Territory`：星球下可编辑的能力领域
- `Facility`：能力领域下的能力点
  - 字段包含：`name`、`status`、可选 `link`

当前 `Facility.status` 可选值：

- `online`
- `dev`
- `plan`

## UI 与交互约束

- 保持当前视觉语言：
  - 太空 / 星图 / 星野背景
  - 玻璃态面板
  - 蓝 / 紫色强调色体系
- 修改交互时优先保证清晰度，不要为了“炫”破坏可用性。
- 移动端不能依赖 hover 才能完成关键操作。
- 危险操作不要使用浏览器原生 `confirm()`，统一使用 `ConfirmDialog`。
- 异步操作必须提供明显的加载、成功或失败反馈。
- 已有弹层、面板的键盘交互应尽量保留，例如 `Escape` 关闭。

## 表单约束

- 深色背景上的表单控件必须保持足够对比度。
- 深色主题里的 `select` 不要依赖浏览器默认样式，要显式设置下拉和选项样式。
- 写入链接前要进行基本校验。
- 保存前优先对文本做 `trim` 处理。

## 代码与结构约束

- 优先复用现有组件，不要重复造交互结构。
- 能力数据的读取与变更优先收敛在 `useCapabilities.ts`。
- 共享领域模型优先使用 `app/types/index.ts` 中的类型，不要随手写散乱对象。
- 对于数据库行结构或明确可定义的类型，不要回退到 `any`。
- 注释保持少而精，仅在真正有帮助时添加。
- 优先做针对性修改，不要无意义扩大重构范围。

## API 约束

当前能力数据 API：

- `GET /api/capabilities?galaxy=rd|digital`
- `POST /api/capabilities`
- `PUT /api/capabilities`
- `DELETE /api/capabilities?territoryId=...`

当前认证 API：

- `GET /api/auth/check`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `POST /api/auth/change-password`

说明：

- 能力数据写操作必须校验认证 Cookie。
- 当前不存在能力数据重置接口。

## 常用命令

### 本地开发

```powershell
npm.cmd run dev
```

### 代码检查

```powershell
npm.cmd run lint
```

### 生产构建校验

```powershell
npm.cmd run build
```

说明：

- 当前环境下 PowerShell 可能拦截 `npm`。
- 优先使用 `npm.cmd`，不要直接写 `npm`。

## 变更检查清单

完成修改前，至少检查以下事项：

1. 一起阅读相关页面、组件、Hook 和 API 路由，再开始改动。
2. 先判断是否会影响 SQLite 持久化或认证持久化。
3. 保持界面文案、状态提示和当前交互风格一致。
4. 运行 `npm.cmd run lint`。
5. 对于结构性改动，额外运行 `npm.cmd run build`。

## 明确禁止

- 不要重新加入启动时样例数据注入。
- 不要加入启动时重置管理员密码的逻辑。
- 未经明确要求，不要删除或替换 `data/capability-map.db`。
- 不要在仓库文档中写入开发机绝对路径。
- 除非确有必要，不要引入新的外部运行时依赖。

## 后续扩展建议

- 如果以后有子目录需要特殊规则，优先在对应目录附近新增局部 `AGENTS.md`。
- 根目录 `AGENTS.md` 保持精简，优先记录命令、约束、不变量和关键工作流。

