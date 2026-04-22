import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';
import fs from 'fs';
import path from 'path';
import { unstable_noStore as noStore } from 'next/cache';

import { kv } from '@vercel/kv';

// 서버에서 직접 JSON 파일 또는 KV 읽기
async function getFactionData(id: string) {
  noStore();
  let factions;
  try {
    factions = await kv.get('factions') as any;
  } catch (e) {
    console.warn('KV not configured, using fallback');
  }
  if (!factions) {
    try {
      const dataFilePath = path.join(process.cwd(), 'src', 'data', 'factions.json');
      const fileData = fs.readFileSync(dataFilePath, 'utf8');
      factions = JSON.parse(fileData);
    } catch (e) {
      return null;
    }
  }
  return factions ? factions[id] : null;
}

export default async function FactionPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const data = await getFactionData(resolvedParams.id);

  if (!data) {
    notFound();
  }

  return (
    <main className={`min-h-screen ${data.bg} text-gray-200`}>
      <div className="max-w-6xl mx-auto px-6 py-16 flex flex-col md:flex-row gap-12">
        {/* Sidebar */}
        <aside className="w-full md:w-64 shrink-0">
          <Link href="/" className="inline-flex items-center text-sm text-gray-500 hover:text-white mb-12 transition-colors font-[family-name:var(--font-share-tech-mono)] uppercase">
            ← Return to Core
          </Link>
          
          <nav className="sticky top-12 flex flex-col gap-6">
            <h2 className={`text-2xl font-bold ${data.font} ${data.accent} border-b border-gray-800 pb-4`}>
              {data.name}
            </h2>
            <ul className={`flex flex-col gap-4 text-gray-400 font-[family-name:var(--font-share-tech-mono)] text-sm`}>
              <li>
                <a href="#synopsis" className="hover:text-white transition-colors">01. Synopsis</a>
              </li>
              <li>
                <a href="#chronology" className="hover:text-white transition-colors">02. Chronology</a>
              </li>
              <li>
                <a href="#roster" className="hover:text-white transition-colors">03. 등장인물</a>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Content Area */}
        <article className="flex-1 min-w-0 max-w-3xl flex flex-col gap-24 pt-8">
          <section id="synopsis" className="scroll-mt-24">
            <h3 className={`text-xs uppercase tracking-[0.3em] text-gray-500 mb-6 font-[family-name:var(--font-share-tech-mono)]`}>01 // Synopsis</h3>
            <div className={`p-8 rounded-lg bg-white/5 border ${data.border}/20 backdrop-blur-sm break-words`}>
              <div className="text-lg leading-relaxed text-gray-300 font-light space-y-6">
                {data.synopsis.map((block: any, idx: number) => (
                  <div key={idx} className="max-w-full">
                    {block.type === 'text' && (
                      <p className="whitespace-pre-wrap break-words">{block.content}</p>
                    )}
                    {block.type === 'image' && (
                      <img src={block.content} alt="Synopsis Image" className="max-w-full h-auto rounded border border-gray-700/50 mt-4 mb-4 object-contain" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section id="chronology" className="scroll-mt-24">
            <h3 className={`text-xs uppercase tracking-[0.3em] text-gray-500 mb-6 font-[family-name:var(--font-share-tech-mono)]`}>02 // Chronology</h3>
            <div className="relative border-l border-gray-800 ml-4 flex flex-col gap-8">
              {data.chronology.map((item: any, idx: number) => (
                <div key={idx} className="relative pl-8 break-words">
                  <div className={`absolute -left-1.5 top-1.5 w-3 h-3 rounded-full ${data.bg} border-2 ${data.border}`} />
                  <span className={`block text-sm font-bold mb-1 ${data.accent} ${data.font}`}>{item.year}</span>
                  <p className="text-gray-300 whitespace-pre-wrap break-words">{item.event}</p>
                  {item.image && (
                    <img src={item.image} alt="Chronology Image" className="mt-4 max-w-full md:max-w-md h-auto rounded border border-gray-800 object-contain" />
                  )}
                </div>
              ))}
            </div>
          </section>

          <section id="roster" className="scroll-mt-24">
            <h3 className={`text-xs uppercase tracking-[0.3em] text-gray-500 mb-6 font-[family-name:var(--font-share-tech-mono)]`}>03 // 등장인물</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {data.npcs.map((npc: any, idx: number) => (
                <div key={idx} className={`p-6 border-t border-l border-gray-800 bg-gradient-to-br from-white/5 to-transparent hover:border-l-${data.theme} transition-all duration-300 break-words flex flex-col`}>
                  {npc.image && (
                    <img src={npc.image} alt={npc.name} className="w-full h-48 object-cover rounded border border-gray-800 mb-4" />
                  )}
                  <h4 className={`text-xl font-bold mb-1 ${data.accent} ${data.font}`}>{npc.name}</h4>
                  <span className="text-xs text-gray-500 uppercase tracking-wider block mb-4 break-words">{npc.role}</span>
                  <p className="text-sm text-gray-400 whitespace-pre-wrap break-words flex-grow">{npc.desc}</p>
                </div>
              ))}
            </div>
          </section>
        </article>
      </div>
    </main>
  );
}
