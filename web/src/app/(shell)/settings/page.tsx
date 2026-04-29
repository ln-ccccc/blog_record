export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-[760px] pb-20 md:pb-0">
      <div className="rounded-2xl border border-border bg-surface p-6 shadow-[var(--shadow)]">
        <div className="text-sm font-semibold text-foreground">设置</div>
        <div className="mt-3 grid gap-2 text-sm font-medium leading-7 text-[color:var(--color-muted)]">
          <div>主题：右上角按钮切换亮色/暗色（会记住偏好）</div>
          <div>登录：使用 Supabase GitHub OAuth（未配置时页面处于演示模式）</div>
          <div className="rounded-2xl border border-border bg-background p-4 font-mono text-xs text-foreground">
            NEXT_PUBLIC_SUPABASE_URL
            <br />
            NEXT_PUBLIC_SUPABASE_ANON_KEY
          </div>
        </div>
      </div>
    </div>
  );
}

