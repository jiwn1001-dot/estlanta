import Link from "next/link";
import FactionCard from "@/components/ui/FactionCard";
import fs from 'fs';
import path from 'path';

async function getFactions() {
  try {
    const factionsPath = path.join(process.cwd(), 'src', 'data', 'factions.json');
    return JSON.parse(fs.readFileSync(factionsPath, 'utf8'));
  } catch (e) {
    return {};
  }
}

export default async function ArchivePage() {
  const factions = await getFactions();
  const factionKeys = Object.keys(factions);

  return (
    <main className="min-h-screen bg-[#050505] text-gray-200 py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-16">
          <Link href="/" className="inline-flex items-center text-sm text-gray-500 hover:text-white mb-8 transition-colors font-[family-name:var(--font-share-tech-mono)] uppercase">
            ← Return to Core
          </Link>
          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-widest uppercase font-[family-name:var(--font-cinzel)] text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-600">
            Full Archive
          </h1>
          <p className="text-gray-400 font-[family-name:var(--font-share-tech-mono)] text-sm uppercase tracking-widest">
            Database Access Granted. Select a sector.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
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
      </div>
    </main>
  );
}
