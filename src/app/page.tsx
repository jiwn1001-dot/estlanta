import FactionCard from "@/components/ui/FactionCard";
import Link from "next/link";

export const dynamic = 'force-dynamic';
import fs from 'fs';
import path from 'path';
import { unstable_noStore as noStore } from 'next/cache';

import { kv } from '@vercel/kv';

async function getSiteData() {
  noStore();
  try {
    let site = await kv.get('site');
    if (!site) {
      const sitePath = path.join(process.cwd(), 'src', 'data', 'site.json');
      site = JSON.parse(fs.readFileSync(sitePath, 'utf8'));
    }
    return site as any;
  } catch (e) {
    return { title: "Estlanta", subtitle: "강철과 살점, 매연과 네온이 교차하는 세계.\n당신의 존재가 역사를 다시 씁니다." };
  }
}

async function getFactions() {
  noStore();
  try {
    let factions = await kv.get('factions');
    if (!factions) {
      const factionsPath = path.join(process.cwd(), 'src', 'data', 'factions.json');
      factions = JSON.parse(fs.readFileSync(factionsPath, 'utf8'));
    }
    return factions as any;
  } catch (e) {
    return {};
  }
}

export default async function Home() {
  const siteData = await getSiteData();
  const factions = await getFactions();
  const factionKeys = Object.keys(factions);

  return (
    <main className="relative min-h-screen flex flex-col bg-[#050505] text-gray-200 selection:bg-gray-800">
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1a1a1a] via-[#050505] to-[#000]"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center flex-grow px-6 py-20 max-w-7xl mx-auto w-full">
        {/* Hero Section */}
        <header className="text-center mb-24 mt-10">
          <div className="inline-block mb-4">
            <span className="text-xs font-[family-name:var(--font-share-tech-mono)] tracking-[0.3em] text-gray-500 uppercase">
              System Initialization...
            </span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter uppercase font-[family-name:var(--font-cinzel)] text-transparent bg-clip-text bg-gradient-to-b from-gray-100 to-gray-600 drop-shadow-xl whitespace-pre-wrap">
            {siteData.title}
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-400 font-light leading-relaxed whitespace-pre-wrap">
            {siteData.subtitle}
          </p>
        </header>

        {/* Faction Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
          {factionKeys.map((key) => {
            const f = factions[key];
            return (
              <FactionCard
                key={key}
                title={f.name}
                subtitle={f.subtitle || key}
                description={f.shortDesc || "No description provided."}
                theme={f.theme as any}
                link={`/faction/${key}`}
              />
            );
          })}
        </div>

        {/* Action Links */}
        <div className="mt-24 flex gap-8 items-center font-[family-name:var(--font-share-tech-mono)] text-sm tracking-widest">
          <Link href="/archive" className="text-gray-400 hover:text-white transition-colors uppercase relative group">
            <span className="relative z-10">Access Full Archive</span>
            <span className="absolute -bottom-2 left-0 w-0 h-[1px] bg-white transition-all group-hover:w-full"></span>
          </Link>
          <span className="text-gray-800">|</span>
          <Link href="/admin" className="text-gray-700 hover:text-gray-300 transition-colors uppercase">
            Admin Override
          </Link>
        </div>
      </div>
    </main>
  );
}
