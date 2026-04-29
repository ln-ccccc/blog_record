# blog_record

个人阅读库与提交式阅读记录（Readlog）。

## 目录结构

- `web/`：Next.js（App Router）前端项目
- `.trae/documents/`：PRD 与技术架构文档
- `ui-mockups/`：UI 草图与导出资源

## 本地启动

```bash
cd web
npm install
npm run dev
```

## Supabase 环境变量

在 `web/.env.local` 填写：

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

