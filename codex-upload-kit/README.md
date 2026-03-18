# Codex Upload Kit

这个目录是给当前项目做 GitHub + Codex cloud 上线准备的操作包。

包含内容：

- `GIT-UPLOAD-STEPS.md`
  从本地项目到 GitHub 仓库的精细步骤。
- `REMOTE-URL-GUIDE.md`
  远程仓库地址应该怎么填，以及 SSH / HTTPS 怎么选。
- `CODEX-CLOUD-ENV.md`
  适合这个 Vite + React 项目的 Codex cloud environment 配置文本。
- `LOCAL-AGENT-RULES.md`
  本地对话规则文件 `AGENTS.md` 的使用方法。
- `create-clean-package.sh`
  生成干净上传包的脚本。

根目录还有一个已经可用的项目级规则文件：

- `AGENTS.md`

生成后的干净上传包默认放在：

- `/Users/sid/Desktop/ian-codex-upload`

这个上传包会排除：

- `node_modules/`
- `dist/`
- `.git/`
- `.DS_Store`

当前项目已复查 `public/` 素材引用，结果为 0 个未引用素材。
