# Git 上传精细步骤

## 0. 你现在的状态

- 当前目录还不是 Git 仓库。
- 全局 Git 用户名和邮箱还没有配置。
- 当前机器上没有检测到现成的 GitHub SSH 公钥。

因此，最稳的首选方案是：

- 先用 HTTPS 推送到 GitHub
- 之后如果你想长期开发，再切换到 SSH

## 1. 使用已经生成好的干净上传包

干净上传包路径：

- `/Users/sid/Desktop/ian-codex-upload`

进入它：

```bash
cd /Users/sid/Desktop/ian-codex-upload
```

## 2. 初始化 Git 仓库

```bash
git init
git branch -M main
```

## 3. 配置 Git 身份

把下面两项换成你自己的 GitHub 信息：

```bash
git config user.name "你的GitHub用户名"
git config user.email "你的GitHub邮箱"
```

如果你想让所有项目都复用这套身份，可以加 `--global`：

```bash
git config --global user.name "你的GitHub用户名"
git config --global user.email "你的GitHub邮箱"
```

检查是否写入成功：

```bash
git config user.name
git config user.email
```

## 4. 首次提交

```bash
git add .
git status
git commit -m "Initial commit"
```

如果 `git status` 里出现 `node_modules` 或 `dist`，说明你没有在干净上传包目录里执行。

## 5. 在 GitHub 创建空仓库

在 GitHub 新建一个空仓库，建议仓库名二选一：

- `ian`
- `ian-dreamcore-site`

创建仓库时不要勾选：

- `Add a README file`
- `Add .gitignore`
- `Choose a license`

因为这些文件当前项目里已经有了。

## 6. 绑定远程仓库

优先使用 HTTPS：

```bash
git remote add origin https://github.com/<你的GitHub用户名>/<你的仓库名>.git
```

检查绑定结果：

```bash
git remote -v
```

## 7. 首次推送

```bash
git push -u origin main
```

如果 GitHub 让你认证：

- 浏览器登录 GitHub
- 按提示完成授权
- macOS 通常会用 Keychain 记住这次登录

## 8. 推送成功后复查

在仓库页确认这些内容已经上传：

- `src/`
- `public/`
- `AGENTS.md`
- `codex-upload-kit/`
- `.github/workflows/deploy-pages.yml`
- `package.json`

## 9. 如果以后还要重新生成干净上传包

回到原项目目录运行：

```bash
cd /Users/sid/Desktop/new
bash codex-upload-kit/create-clean-package.sh
```
