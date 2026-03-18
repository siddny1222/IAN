# 远程仓库地址怎么填

## 当前建议

基于当前机器状态：

- 没有现成的 GitHub SSH 公钥
- 当前目录还没建 Git 仓库

建议你先用 HTTPS。

## HTTPS 写法

模板：

```bash
https://github.com/<你的GitHub用户名>/<你的仓库名>.git
```

示例：

```bash
https://github.com/sid/ian-dreamcore-site.git
```

绑定命令：

```bash
git remote add origin https://github.com/<你的GitHub用户名>/<你的仓库名>.git
```

## SSH 写法

只有在你已经配置好 SSH key 并且 GitHub 里也添加过公钥时，才推荐用 SSH。

模板：

```bash
git@github.com:<你的GitHub用户名>/<你的仓库名>.git
```

示例：

```bash
git@github.com:sid/ian-dreamcore-site.git
```

## 如何检查远程填得对不对

```bash
git remote -v
```

正常会看到：

```bash
origin  https://github.com/<你的GitHub用户名>/<你的仓库名>.git (fetch)
origin  https://github.com/<你的GitHub用户名>/<你的仓库名>.git (push)
```

## 如果填错了

直接改，不需要重建仓库：

```bash
git remote set-url origin https://github.com/<你的GitHub用户名>/<你的仓库名>.git
```

或者切换成 SSH：

```bash
git remote set-url origin git@github.com:<你的GitHub用户名>/<你的仓库名>.git
```

## 如何判断仓库名填什么

推荐仓库名：

- 对外简洁：`ian`
- 更利于区分：`ian-dreamcore-site`

如果你准备部署 GitHub Pages，仓库名会影响默认子路径：

- 仓库名是 `ian`
- 那默认 `VITE_BASE_PATH` 就通常会是 `/ian/`

所以仓库名一旦定下，后面的 Pages 路径也会更稳定。
