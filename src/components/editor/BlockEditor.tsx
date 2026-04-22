"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function BlockEditor() {
  const router = useRouter();
  const [factions, setFactions] = useState<any>(null);
  const [siteData, setSiteData] = useState<any>(null);
  
  const [activeTab, setActiveTab] = useState<'main' | 'faction'>('faction');
  const [selectedId, setSelectedId] = useState<string>("");
  const [newFactionId, setNewFactionId] = useState<string>("");
  const [isAddingFaction, setIsAddingFaction] = useState(false);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch('/api/factions', { cache: 'no-store' }).then(res => res.json()),
      fetch('/api/site', { cache: 'no-store' }).then(res => res.json())
    ]).then(([factionsData, siteDataRes]) => {
      setFactions(factionsData);
      setSiteData(siteDataRes);
      
      const keys = Object.keys(factionsData);
      if (keys.length > 0) {
        setSelectedId(keys[0]);
      }
      setIsLoading(false);
    });
  }, []);

  if (isLoading || !factions || !siteData) {
    return <div className="p-12 text-gray-400">Loading Data...</div>;
  }

  const currentFaction = factions[selectedId];

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const [factionsRes, siteRes] = await Promise.all([
        fetch('/api/factions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(factions)
        }),
        fetch('/api/site', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(siteData)
        })
      ]);
      
      if (!factionsRes.ok) {
        const err = await factionsRes.json();
        throw new Error("Factions API: " + (err.error || factionsRes.statusText));
      }
      if (!siteRes.ok) {
        const err = await siteRes.json();
        throw new Error("Site API: " + (err.error || siteRes.statusText));
      }
      
      router.refresh();
      alert('저장되었습니다. 전체 페이지에 즉시 반영됩니다.');
    } catch (e: any) {
      alert('저장 실패: ' + e.message);
    }
    setIsSaving(false);
  };

  // --- Faction Management ---
  const handleAddNewFaction = () => {
    const id = newFactionId.trim().toLowerCase();
    if (!id) {
      alert("ID를 입력하세요.");
      return;
    }
    if (factions[id]) {
      alert("이미 존재하는 ID입니다.");
      return;
    }
    
    const updated = { ...factions };
    updated[id] = {
      name: "새 세력",
      subtitle: "New Faction",
      shortDesc: "새로운 세력에 대한 짧은 설명을 입력하세요.",
      theme: "machine",
      bg: "bg-[#050505]",
      accent: "text-white",
      border: "border-gray-500",
      font: "font-sans",
      synopsis: [{ type: "text", content: "여기에 시놉시스를 입력하세요." }],
      chronology: [],
      npcs: []
    };
    setFactions(updated);
    setSelectedId(id);
    setNewFactionId("");
    setIsAddingFaction(false);
  };

  const deleteFaction = () => {
    if (!window.confirm(`정말로 '${currentFaction.name}' 세력을 삭제하시겠습니까?`)) return;
    const updated = { ...factions };
    delete updated[selectedId];
    
    const remainingKeys = Object.keys(updated);
    setFactions(updated);
    if (remainingKeys.length > 0) {
      setSelectedId(remainingKeys[0]);
    } else {
      setSelectedId("");
    }
  };

  // --- Site Data ---
  const updateSiteData = (field: 'title' | 'subtitle', value: string) => {
    setSiteData({ ...siteData, [field]: value });
  };

  // --- Faction Meta ---
  const updateFactionMeta = (field: 'name' | 'subtitle' | 'shortDesc' | 'theme' | 'font', value: string) => {
    const updated = { ...factions };
    updated[selectedId][field] = value;
    setFactions(updated);
  };

  // --- Synopsis Blocks ---
  const addSynopsisBlock = (type: 'text' | 'image') => {
    const updated = { ...factions };
    updated[selectedId].synopsis.push({ type, content: "" });
    setFactions(updated);
  };
  const updateSynopsisBlock = (idx: number, content: string) => {
    const updated = { ...factions };
    updated[selectedId].synopsis[idx].content = content;
    setFactions(updated);
  };
  const removeSynopsisBlock = (idx: number) => {
    const updated = { ...factions };
    updated[selectedId].synopsis.splice(idx, 1);
    setFactions(updated);
  };

  // --- Chronology ---
  const addChronology = () => {
    const updated = { ...factions };
    updated[selectedId].chronology.push({ year: "", event: "", image: "" });
    setFactions(updated);
  };
  const updateChronology = (idx: number, field: 'year' | 'event' | 'image', value: string) => {
    const updated = { ...factions };
    updated[selectedId].chronology[idx][field] = value;
    setFactions(updated);
  };
  const removeChronology = (idx: number) => {
    const updated = { ...factions };
    updated[selectedId].chronology.splice(idx, 1);
    setFactions(updated);
  };

  // --- NPCs ---
  const addNpc = () => {
    const updated = { ...factions };
    updated[selectedId].npcs.push({ name: "", role: "", desc: "", image: "" });
    setFactions(updated);
  };
  const updateNpc = (idx: number, field: 'name' | 'role' | 'desc' | 'image', value: string) => {
    const updated = { ...factions };
    updated[selectedId].npcs[idx][field] = value;
    setFactions(updated);
  };
  const removeNpc = (idx: number) => {
    const updated = { ...factions };
    updated[selectedId].npcs.splice(idx, 1);
    setFactions(updated);
  };

  return (
    <div className="max-w-5xl mx-auto p-12 bg-[#111] min-h-screen text-gray-200">
      <div className="mb-8 pb-4 border-b border-gray-800 flex justify-between items-end flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold font-sans text-white mb-2">통합 콘텐츠 에디터</h1>
          <p className="text-sm text-gray-500">메인 화면 텍스트 및 세부 세력 정보 수정 (실시간 반영)</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex bg-gray-900 rounded p-1">
            <button 
              onClick={() => setActiveTab('main')}
              className={`px-4 py-1 text-sm rounded ${activeTab === 'main' ? 'bg-white text-black' : 'text-gray-400 hover:text-white'}`}
            >
              메인 설정
            </button>
            <button 
              onClick={() => setActiveTab('faction')}
              className={`px-4 py-1 text-sm rounded ${activeTab === 'faction' ? 'bg-white text-black' : 'text-gray-400 hover:text-white'}`}
            >
              세력 설정
            </button>
          </div>

          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-2 bg-red-900/80 text-white font-semibold rounded hover:bg-red-800 transition-colors disabled:opacity-50"
          >
            {isSaving ? "저장 중..." : "저장 및 배포"}
          </button>
        </div>
      </div>

      {activeTab === 'main' && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
          <section className="bg-white/5 p-6 rounded-lg border border-gray-800">
            <h2 className="text-xl font-bold text-white mb-6">메인 타이틀 설정</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-500 mb-1">사이트 이름</label>
                <input 
                  type="text" 
                  value={siteData.title}
                  onChange={(e) => updateSiteData('title', e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-gray-700 p-3 rounded text-xl text-white outline-none focus:border-red-500 font-bold"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">메인 슬로건 (서브타이틀)</label>
                <textarea 
                  value={siteData.subtitle}
                  onChange={(e) => updateSiteData('subtitle', e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-gray-700 p-3 rounded text-base text-gray-300 outline-none focus:border-red-500 resize-none h-24"
                />
              </div>
            </div>
          </section>
        </div>
      )}

      {activeTab === 'faction' && (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4">
          <div className="bg-white/5 p-4 rounded-lg border border-gray-800 flex gap-4 items-center justify-between">
            <div className="flex gap-4 items-center flex-1">
              <label className="text-sm text-gray-400 whitespace-nowrap">세력 선택:</label>
              <select 
                value={selectedId} 
                onChange={(e) => setSelectedId(e.target.value)}
                className="bg-[#0a0a0a] border border-gray-700 text-white p-2 rounded outline-none focus:border-red-500 w-full md:w-auto"
              >
                {Object.keys(factions).map(id => (
                  <option key={id} value={id}>{factions[id].name} ({id})</option>
                ))}
              </select>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setIsAddingFaction(true)} className="px-3 py-1 bg-blue-900/50 hover:bg-blue-900 border border-blue-700 rounded text-xs text-white transition-colors">+ 세력 추가</button>
              {selectedId && (
                <button onClick={deleteFaction} className="px-3 py-1 bg-red-900/20 hover:bg-red-900/50 border border-red-900/50 rounded text-xs text-red-500 transition-colors">삭제</button>
              )}
            </div>
          </div>

          {isAddingFaction && (
            <div className="bg-blue-900/20 border border-blue-800 p-4 rounded-lg flex items-center gap-4">
              <input 
                type="text" 
                value={newFactionId}
                onChange={(e) => setNewFactionId(e.target.value)}
                placeholder="새 세력 ID (영문소문자. 예: resistance)"
                className="bg-[#0a0a0a] border border-blue-700 p-2 rounded text-sm text-white outline-none focus:border-blue-500 flex-1"
              />
              <button onClick={handleAddNewFaction} className="px-4 py-2 bg-blue-600 text-white text-sm rounded font-bold hover:bg-blue-500">확인</button>
              <button onClick={() => setIsAddingFaction(false)} className="px-4 py-2 bg-gray-700 text-white text-sm rounded font-bold hover:bg-gray-600">취소</button>
            </div>
          )}

          {!selectedId ? (
            <div className="text-center py-20 text-gray-600">선택된 세력이 없습니다. 세력을 추가하거나 선택해 주세요.</div>
          ) : (
            <>
              {/* Faction Meta Section */}
              <section className="bg-white/5 p-6 rounded-lg border border-gray-800">
                <h2 className="text-xl font-bold text-white mb-6">메인 화면 카드 설정</h2>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-sm text-gray-500 mb-1">세력명</label>
                      <input type="text" value={currentFaction.name} onChange={(e) => updateFactionMeta('name', e.target.value)} className="w-full bg-[#0a0a0a] border border-gray-700 p-2 rounded text-white outline-none" />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm text-gray-500 mb-1">영문 서브타이틀</label>
                      <input type="text" value={currentFaction.subtitle || ""} onChange={(e) => updateFactionMeta('subtitle', e.target.value)} className="w-full bg-[#0a0a0a] border border-gray-700 p-2 rounded text-white outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">카드 짧은 설명</label>
                    <textarea value={currentFaction.shortDesc || ""} onChange={(e) => updateFactionMeta('shortDesc', e.target.value)} className="w-full bg-[#0a0a0a] border border-gray-700 p-2 rounded text-gray-300 outline-none h-16 resize-none" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-500 mb-1">테마 컬러 타입</label>
                      <select value={currentFaction.theme} onChange={(e) => updateFactionMeta('theme', e.target.value)} className="w-full bg-[#0a0a0a] border border-gray-700 p-2 rounded text-white outline-none">
                        <option value="machine">Machine (Cyan)</option>
                        <option value="outergod">Outer God (Crimson)</option>
                        <option value="newlondon">New London (Brass)</option>
                        <option value="escova">Escova (Neon Pink)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-500 mb-1">폰트 스타일</label>
                      <select value={currentFaction.font} onChange={(e) => updateFactionMeta('font', e.target.value)} className="w-full bg-[#0a0a0a] border border-gray-700 p-2 rounded text-white outline-none">
                        <option value="font-[family-name:var(--font-share-tech-mono)]">Mono (Cyberpunk)</option>
                        <option value="font-[family-name:var(--font-cinzel)]">Cinzel (Fantasy)</option>
                        <option value="font-serif">Serif (Steampunk)</option>
                        <option value="font-sans">Sans (Modern)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </section>

              {/* Synopsis Section */}
              <section className="bg-white/5 p-6 rounded-lg border border-gray-800">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-white">01. Synopsis (상세 페이지 시놉시스)</h2>
                  <div className="flex gap-2">
                    <button onClick={() => addSynopsisBlock('text')} className="px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded text-sm text-white transition-colors">+ 텍스트 추가</button>
                    <button onClick={() => addSynopsisBlock('image')} className="px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded text-sm text-blue-400 transition-colors">+ 이미지 추가</button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {currentFaction.synopsis.map((block: any, idx: number) => (
                    <div key={idx} className="relative group border border-gray-700/50 p-4 rounded bg-[#0a0a0a] hover:border-gray-500 transition-colors">
                      <button onClick={() => removeSynopsisBlock(idx)} className="absolute -top-3 -right-3 bg-red-900 text-white w-6 h-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs">X</button>
                      
                      {block.type === 'text' && (
                        <textarea
                          value={block.content}
                          onChange={(e) => updateSynopsisBlock(idx, e.target.value)}
                          placeholder="시놉시스 내용을 입력하세요..."
                          className="w-full bg-transparent border-none outline-none resize-none text-gray-300 leading-relaxed min-h-[100px]"
                        />
                      )}
                      {block.type === 'image' && (
                        <div className="flex flex-col gap-2">
                          <input 
                            type="text" 
                            value={block.content}
                            onChange={(e) => updateSynopsisBlock(idx, e.target.value)}
                            placeholder="이미지 URL을 입력하세요" 
                            className="w-full bg-[#111] border border-gray-700 p-2 rounded text-sm text-white outline-none focus:border-blue-500"
                          />
                          {block.content && (
                            <img src={block.content} alt="Preview" className="max-h-48 object-contain rounded border border-gray-800 self-start" />
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>

              {/* Chronology Section */}
              <section className="bg-white/5 p-6 rounded-lg border border-gray-800">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-white">02. Chronology (연대기)</h2>
                  <button onClick={addChronology} className="px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded text-sm text-white transition-colors">+ 연표 추가</button>
                </div>
                
                <div className="space-y-6">
                  {currentFaction.chronology.map((item: any, idx: number) => (
                    <div key={idx} className="flex flex-col gap-3 group relative border border-gray-700/50 p-4 rounded bg-[#0a0a0a] hover:border-gray-500 transition-colors">
                      <button onClick={() => removeChronology(idx)} className="absolute top-2 right-2 text-red-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity text-sm">삭제</button>
                      <div className="flex gap-4 items-start">
                        <input 
                          type="text" 
                          value={item.year}
                          onChange={(e) => updateChronology(idx, 'year', e.target.value)}
                          placeholder="연도 (예: 2084)"
                          className="w-32 bg-[#111] border border-gray-700 p-2 rounded text-sm text-white outline-none focus:border-gray-500 font-bold"
                        />
                        <textarea 
                          value={item.event}
                          onChange={(e) => updateChronology(idx, 'event', e.target.value)}
                          placeholder="사건 내용"
                          className="flex-1 bg-[#111] border border-gray-700 p-2 rounded text-sm text-gray-300 outline-none focus:border-gray-500 resize-none h-10 min-h-[40px]"
                        />
                      </div>
                      <div className="flex flex-col gap-2 w-full mt-2">
                        <input 
                          type="text" 
                          value={item.image || ""}
                          onChange={(e) => updateChronology(idx, 'image', e.target.value)}
                          placeholder="관련 이미지 URL (선택사항)" 
                          className="w-full bg-[#111] border border-gray-700 p-2 rounded text-sm text-blue-400 outline-none focus:border-blue-500"
                        />
                        {item.image && (
                          <img src={item.image} alt="Preview" className="max-h-32 object-contain rounded border border-gray-800 self-start mt-1" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* NPCs Section */}
              <section className="bg-white/5 p-6 rounded-lg border border-gray-800">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-white">03. 등장인물 (Characters)</h2>
                  <button onClick={addNpc} className="px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded text-sm text-white transition-colors">+ NPC 추가</button>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {currentFaction.npcs.map((npc: any, idx: number) => (
                    <div key={idx} className="relative border border-gray-700/50 p-4 rounded bg-[#0a0a0a] group hover:border-gray-500 transition-colors flex flex-col gap-3">
                      <button onClick={() => removeNpc(idx)} className="absolute top-2 right-2 text-red-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity text-sm z-10">삭제</button>
                      
                      <div className="flex flex-col gap-2 mb-2">
                        <input 
                          type="text" 
                          value={npc.image || ""}
                          onChange={(e) => updateNpc(idx, 'image', e.target.value)}
                          placeholder="캐릭터 프로필 이미지 URL (선택사항)" 
                          className="w-full bg-[#111] border border-gray-700 p-2 rounded text-xs text-blue-400 outline-none focus:border-blue-500"
                        />
                        {npc.image && (
                          <img src={npc.image} alt="Profile Preview" className="w-24 h-24 object-cover rounded border border-gray-700" />
                        )}
                      </div>

                      <input 
                        type="text" 
                        value={npc.name}
                        onChange={(e) => updateNpc(idx, 'name', e.target.value)}
                        placeholder="이름 (예: 프라임-01)"
                        className="w-full bg-transparent border-b border-gray-700 p-1 text-lg font-bold text-white outline-none focus:border-white"
                      />
                      <input 
                        type="text" 
                        value={npc.role}
                        onChange={(e) => updateNpc(idx, 'role', e.target.value)}
                        placeholder="직책 (예: 대사제)"
                        className="w-full bg-transparent border-b border-gray-700 p-1 text-xs text-gray-500 uppercase tracking-wider outline-none focus:border-gray-400"
                      />
                      <textarea 
                        value={npc.desc}
                        onChange={(e) => updateNpc(idx, 'desc', e.target.value)}
                        placeholder="인물 설명"
                        className="w-full bg-transparent border-none outline-none resize-none text-sm text-gray-400 h-20"
                      />
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}
        </div>
      )}
    </div>
  );
}
