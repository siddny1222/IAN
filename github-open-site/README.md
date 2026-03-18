# GitHub 开放网站搭建包

这个文件夹放的是把当前网站公开到 GitHub 上时最需要看的资料和模板。

包含内容：

- `README.md`
  这份说明。
- `.env.example`
  本地或自定义构建时可用的环境变量示例。
- `deploy-pages.yml.example`
  GitHub Pages 工作流模板。
- `CNAME.example`
  自定义域名示例。
- `REVIEW-SUMMARY.md`
  这次代码复查、性能优化和低性能适配的总结。

最短上线流程：

1. 把项目推到 GitHub 仓库。
2. 保留项目里的 [deploy-pages.yml](/Users/sid/Desktop/new/.github/workflows/deploy-pages.yml)。
3. 在 GitHub 仓库 `Settings -> Pages` 里把部署方式设为 `GitHub Actions`。
4. 推送到 `main` 分支后，Actions 会自动构建并发布。

默认行为：

- 仓库页会自动使用 `/{仓库名}/` 作为 `base path`。
- 默认使用 `HashRouter`，这样在 GitHub Pages 上最稳，不需要额外服务器重写。

如果你想改成自定义域名或根域部署：

1. 在 GitHub 仓库的 `Settings -> Secrets and variables -> Actions -> Variables` 里新建：
   - `VITE_BASE_PATH=/`
   - `VITE_ROUTER_MODE=hash`
2. 如果你有自己的域名，把 `CNAME.example` 改名为 `CNAME`，内容改成你的域名后放到 `public/`。

本地模拟 GitHub Pages 构建：

```bash
VITE_BASE_PATH=/your-repo-name/ VITE_ROUTER_MODE=hash npm run build
```
