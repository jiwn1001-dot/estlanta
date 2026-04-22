import Link from "next/link";
import AdminAuth from "@/components/auth/AdminAuth";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuth>
      <div className="min-h-screen bg-[#050505] text-gray-200 flex font-sans">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-[#0a0a0a] border-r border-gray-800 flex flex-col shrink-0">
        <div className="p-6 border-b border-gray-800">
          <Link href="/" className="text-xl font-bold font-[family-name:var(--font-cinzel)] uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-500">
            Estlanta
          </Link>
          <div className="text-xs text-[var(--color-machine-neon)] font-[family-name:var(--font-share-tech-mono)] mt-2">
            ADMIN OVERRIDE ACTIVE
          </div>
        </div>

        <nav className="p-4 flex flex-col gap-2 flex-1">
          <Link href="/admin" className="p-3 bg-white/5 rounded text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors border-l-2 border-[var(--color-machine-neon)]">
            📝 콘텐츠 에디터
          </Link>
          <div className="p-3 rounded text-sm text-gray-600 cursor-not-allowed">
            🗂️ 세계관 위키 관리 (준비중)
          </div>
          <div className="p-3 rounded text-sm text-gray-600 cursor-not-allowed">
            👥 NPC 및 세력 설정 (준비중)
          </div>
          <div className="p-3 rounded text-sm text-gray-600 cursor-not-allowed">
            ⚙️ 시스템 설정 (준비중)
          </div>
        </nav>
        
        <div className="p-6 border-t border-gray-800 text-xs text-gray-600 font-[family-name:var(--font-share-tech-mono)]">
          Estlanta CMS v0.1.0<br/>
          System Normal
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 bg-[#111] overflow-y-auto">
        {children}
      </main>
    </div>
    </AdminAuth>
  );
}
