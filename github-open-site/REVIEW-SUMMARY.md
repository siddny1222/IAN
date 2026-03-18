# 网站复查与优化总结

## 已修复 / 已优化

- 移除了未使用的 `gsap` 依赖，减少依赖体积与构建负担。
- 去掉了页面刷新时强制跳回首页的逻辑，避免深链被错误打断。
- 所有媒体预热逻辑改为兼容 `BASE_URL`，解决 GitHub Pages 子路径部署时的资源失效风险。
- 首页素材墙改成“仅激活卡片播放动态媒体”，避免同时解码多个视频。
- 增加了 `AdaptiveMedia` 统一媒体层，给重 GIF / 视频提供静态回退。
- 增加了性能画像系统，会根据 `prefers-reduced-motion`、`saveData`、网络状态、CPU 并发和内存自动切换 `full / lite` 模式。
- 低性能模式下会自动：
  - 关闭自定义光标
  - 关闭部分噪声层、故障层、俄文漂浮层
  - 把高成本 GIF / 视频替换成静态帧
  - 降低阴影、滤镜和动画负担
- 构建配置增加了 `base` 环境变量支持和基础分包策略，适配 GitHub Pages。
- 只保留首页真正会用到的 `assetArchive` 元数据，减少无效文本和标签进入前端包。
- 删除了不再需要的 `.mov` 冗余素材，统一回到 `mp4 / webm` 运行链路。

## 已清理

- 删除未引用的 `src/assets/`
- 删除未引用的 `src/App.css`
- 删除未引用的 `public/icons.svg`
- 删除未引用的 `public/media/illustrations/old-television-set.png`
- 删除未引用的 `public/media/IMG_2431.jpg`
- 删除不再使用的 `public/media/ian-main-hero.mov`
- 删除不再使用的 `public/media/clouds-timelapse.mov`
- 删除仓库里的调试截图、Playwright 缓存、临时缩略图和测试输出目录
- 删除项目中的 `.DS_Store`
- 当前扫描结果：`NO_UNUSED_ASSETS_FOUND`

## 当前低性能方案

- `full`：
  保留完整梦核、故障、漂浮、噪声和视频层。
- `lite`：
  保留整体氛围和构图，但把高成本动态媒体替换为静态帧，并缩减最重的动画与混合层。

## 建议的后续素材优化

这轮已经把运行时策略接好了，但如果你想继续把性能推到更极致，下一步最值得做的是重新压缩这些原素材：

- `public/media/ian-glitch-installation.gif`
- `public/media/111.gif`
- `public/media/222.gif`
- `public/media/ian-noise-veil.gif`

最佳方向：

- 大 GIF 改为 `mp4/webm + poster`
- 超大 JPG 统一导出多尺寸版本
- 纹理图压成更轻的 webp / avif
