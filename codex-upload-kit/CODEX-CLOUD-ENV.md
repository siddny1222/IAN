# Codex Cloud Environment 配置文本

下面这套配置适合当前项目：

- 前端栈是 `Vite + React + TypeScript`
- 依赖管理是 `npm`
- 站点需要保留 GitHub Pages 子路径兼容
- 代码里已经有 `AGENTS.md`、构建命令和低性能适配逻辑

## 推荐环境名称

```text
ian-web-main
```

## 推荐运行时版本

```text
Node.js: 22
```

## Setup Script

把下面这段原样贴到 Codex cloud 的 `Setup script`：

```bash
npm ci
```

## Maintenance Script

把下面这段原样贴到 Codex cloud 的 `Maintenance script`：

```bash
if [ -f package-lock.json ]; then
  npm ci --prefer-offline --no-audit
fi
```

## Environment Variables

如果你的 GitHub 仓库名还没定，先用占位值，创建完仓库后再改：

```text
CI=1
VITE_ROUTER_MODE=hash
VITE_BASE_PATH=/YOUR_REPO_NAME/
```

如果你的仓库名最后定成 `ian`，那就改成：

```text
CI=1
VITE_ROUTER_MODE=hash
VITE_BASE_PATH=/ian/
```

## Secrets

当前项目默认不需要额外 secrets。

只有在你未来接入第三方 API、私有包源或监控平台时，才需要新增 secrets。

## Agent Internet Access

推荐默认配置：

- Agent internet access: `Off`

原因：

- Setup script 本身就有联网能力，足够安装依赖。
- 这个项目大多数任务是本地代码修改、构建、样式和性能优化，不需要让 agent 在任务阶段随便出网。

如果你要让 Codex 做在线文档检索或 GitHub 问题追踪，推荐改成：

- Agent internet access: `On`
- Allowlist preset: `Common dependencies`
- Extra domains:
  - `developers.openai.com`
  - `docs.github.com`
  - `github.com`
  - `githubusercontent.com`
- Allowed HTTP methods:
  - `GET`
  - `HEAD`
  - `OPTIONS`

## 建议放进任务里的固定要求

你可以把下面这段作为任务前缀，复制到 Codex cloud 对话里：

```text
Follow the repository AGENTS.md. Keep dreamcore and surreal immersion intact. Preserve GitHub Pages compatibility, hash routing, and low-performance fallbacks. Run npm run build and npm run lint before finishing.
```

## 精细化使用步骤

1. 打开 [Codex](https://chatgpt.com/codex)。
2. 连接 GitHub 账号。
3. 选择你刚刚上传的仓库。
4. 打开 `Settings` 或环境配置页面，新建一个 environment。
5. 运行时版本选 `Node.js 22`。
6. 把上面的 `Setup Script` 粘进去。
7. 把上面的 `Maintenance Script` 粘进去。
8. 填入环境变量，尤其是 `VITE_BASE_PATH` 和 `VITE_ROUTER_MODE`。
9. 默认把 agent internet access 设成 `Off`。
10. 保存 environment。
11. 回到任务页面，选择仓库、分支和这个 environment。
12. 发任务时，把“固定要求”那段放在提示词最前面。
13. 等 Codex 跑完后，先看 diff，再看 build/lint 结果，再决定是否开 PR。

## 适合这个项目的任务模板

### 模板 1：视觉优化

```text
Follow the repository AGENTS.md. Keep dreamcore and surreal immersion intact. Preserve GitHub Pages compatibility, hash routing, and low-performance fallbacks. Run npm run build and npm run lint before finishing.

Refine the typography and motion layering on the home page without reducing immersion. Keep low-end devices on the lite path.
```

### 模板 2：性能优化

```text
Follow the repository AGENTS.md. Keep dreamcore and surreal immersion intact. Preserve GitHub Pages compatibility, hash routing, and low-performance fallbacks. Run npm run build and npm run lint before finishing.

Optimize the heaviest media paths and reduce transfer cost without flattening the surreal visual style. Prefer static fallbacks and route-level lazy loading over removing effects.
```

### 模板 3：Bug 修复

```text
Follow the repository AGENTS.md. Keep dreamcore and surreal immersion intact. Preserve GitHub Pages compatibility, hash routing, and low-performance fallbacks. Run npm run build and npm run lint before finishing.

Find and fix the most important runtime or deployment bugs, then summarize the exact files changed and any remaining risks.
```
