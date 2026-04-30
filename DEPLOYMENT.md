# 网球动作分析工具 - 部署指南

## 🚀 快速部署步骤

### 方法一：通过 Vercel CLI 部署（推荐）

#### 1. 安装 Vercel CLI
```bash
npm i -g vercel
```

#### 2. 登录 Vercel
```bash
vercel login
```
会提示您输入邮箱，然后点击邮箱中的验证链接。

#### 3. 部署项目
在项目根目录执行：
```bash
cd /Users/banbanzhang/WorkBuddy/20260430141519
vercel --prod
```

#### 4. 配置环境变量
部署时会自动读取 `vercel.json` 中的环境变量，包括：
- `ZHIPU_API_KEY`: 智谱AI API密钥（已配置）

#### 5. 绑定域名
部署成功后，在 Vercel 控制台操作：
1. 进入项目设置 → Domains
2. 添加您的域名
3. 按照提示在域名服务商处添加 Vercel 提供的 DNS 记录

---

### 方法二：通过 Vercel 网站部署（更简单）

#### 1. 推送代码到 Git 仓库
```bash
cd /Users/banbanzhang/WorkBuddy/20260430141519
git init
git add .
git commit -m "初始提交"
git remote add origin https://github.com/您的用户名/tennis-analysis.git
git push -u origin main
```

#### 2. 在 Vercel 网站导入项目
1. 访问 https://vercel.com
2. 点击 "Add New..." → "Project"
3. 选择您的 Git 仓库
4. 配置环境变量：
   - `ZHIPU_API_KEY`: `f5007dac92044ecb9fae83576cf963e7.OV15n8r4TC0jwJ9Z`
5. 点击 "Deploy"

#### 6. 绑定域名
在 Vercel 项目控制台：
1. 进入 "Settings" → "Domains"
2. 输入您的域名
3. 按照提示添加 DNS 记录：
   - 类型：`CNAME` 或 `ANAME`
   - 名称：`www` 或其他子域名
   - 指向：`cname.vercel-dns.com`

---

## 📋 部署前检查清单

- [ ] 代码已提交到 Git 仓库
- [ ] `vercel.json` 配置正确
- [ ] `.env.local` 中的敏感信息已添加到 Vercel 环境变量（不要提交到 Git）
- [ ] 域名已准备好，可以修改 DNS 设置

---

## 🔧 部署后验证

### 1. 检查环境变量
访问：`https://您的域名/api/analyze`（会返回405错误，这是正常的，说明API路由已部署）

### 2. 测试完整功能
1. 打开 `https://您的域名`
2. 上传测试视频
3. 检查分析结果是否正确显示

### 3. 检查智谱AI API调用
查看 Vercel 控制台的 Function Logs，确认API调用成功。

---

## 🌐 域名配置示例

假设您的域名是 `tennis.yourdomain.com`：

### 在域名服务商处添加记录：
| 类型 | 名称 | 值 | TTL |
|------|------|-----|-----|
| CNAME | www 或 tennis | cname.vercel-dns.com | 自动 |

### 在 Vercel 控制台添加域名：
1. Project Settings → Domains
2. 输入：`tennis.yourdomain.com`
3. 点击 "Add"

---

## 📊 监控和维护

### 查看日志
```bash
vercel logs tennis-analysis.vercel.app
```

### 回滚到之前版本
在 Vercel 控制台 → Deployments → 选择版本 → Rollback

### 更新部署
每次推送到 Git 主分支，Vercel 会自动重新部署。

---

## ⚠️ 重要提醒

1. **不要提交 `.env.local` 到 Git**
   已添加到 `.gitignore`（如果没有，请添加）

2. **智谱AI API 配额**
   检查您的 API 配额，避免超额使用。

3. **域名备案**（如果服务器在国内）
   如果您的域名指向国内服务器，需要完成 ICP 备案。

---

## 🎾 部署完成后

您的网球动作分析工具将可以通过以下方式访问：
- **生产环境**: `https://您的域名`
- **Vercel 默认域名**: `https://项目名.vercel.app`

---

## 🆘 常见问题

### Q: 部署后图片无法显示？
A: 检查 `public/` 目录下的文件是否正确上传。

### Q: 智谱AI API调用失败？
A: 检查 Vercel 环境变量是否正确配置。

### Q: 域名无法访问？
A: DNS 生效需要时间（最多48小时），请耐心等待。

---

**准备好部署了吗？我可以帮您执行这些步骤！**
