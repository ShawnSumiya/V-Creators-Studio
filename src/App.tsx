import { useState, useEffect } from 'react';
import { Lock, Unlock, Zap, Image, Video, Repeat, CheckCircle } from 'lucide-react';

// マジックリンク用のトークン（定数）
const AUTH_TOKEN = "v-studio-access-2025";

// 各ツールのURL（適宜書き換えてください）
const TOOLS = {
  crop: "https://image-crop-tool-ten.vercel.app", // Tool 1
  optimizer: "https://file-size-optimizer.vercel.app", // Tool 2
  loop: "https://vtuber-loop-generator.vercel.app", // Tool 3 (仮)
};

function App() {
  const [licenseKey, setLicenseKey] = useState("");
  const [status, setStatus] = useState<{
    isAuthenticated: boolean;
    plan: 'ALL' | 'CROP' | 'OPT' | 'LOOP' | null;
    unlocked: { crop: boolean; optimizer: boolean; loop: boolean };
  }>({
    isAuthenticated: false,
    plan: null,
    unlocked: { crop: false, optimizer: false, loop: false },
  });

  // 初回ロード時にLocalStorageをチェック
  useEffect(() => {
    const savedPlan = localStorage.getItem('vstudio_plan');
    if (savedPlan) {
      unlockTools(savedPlan);
    }
  }, []);

  const unlockTools = (planString: string) => {
    let newUnlocked = { crop: false, optimizer: false, loop: false };
    let planType: any = null;

    if (planString.startsWith('ALL-') || planString === 'ALL') {
      newUnlocked = { crop: true, optimizer: true, loop: true };
      planType = 'ALL';
    } else if (planString.startsWith('CROP-') || planString === 'CROP') {
      newUnlocked = { crop: true, optimizer: false, loop: false };
      planType = 'CROP';
    } else if (planString.startsWith('OPT-') || planString === 'OPT') {
      newUnlocked = { crop: false, optimizer: true, loop: false };
      planType = 'OPT';
    } else if (planString.startsWith('LOOP-') || planString === 'LOOP') {
      newUnlocked = { crop: false, optimizer: false, loop: true };
      planType = 'LOOP';
    }

    if (planType) {
      setStatus({ isAuthenticated: true, plan: planType, unlocked: newUnlocked });
      localStorage.setItem('vstudio_plan', planType); // 永続化
    } else {
      alert("無効なライセンスキーです");
    }
  };

  const handleAuth = () => {
    unlockTools(licenseKey);
  };

  const handleLogout = () => {
    localStorage.removeItem('vstudio_plan');
    setStatus({ isAuthenticated: false, plan: null, unlocked: { crop: false, optimizer: false, loop: false } });
    setLicenseKey("");
  };

  // ツールカードコンポーネント
  const ToolCard = ({ 
    title, desc, icon: Icon, isUnlocked, url, color 
  }: { title: string, desc: string, icon: any, isUnlocked: boolean, url: string, color: string }) => (
    <div className={`relative p-6 rounded-2xl border transition-all duration-300 ${
      isUnlocked 
        ? `bg-surface border-${color} shadow-[0_0_15px_rgba(168,85,247,0.2)] hover:scale-105` 
        : 'bg-slate-900/50 border-slate-700 opacity-70 grayscale'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-full bg-slate-800 ${isUnlocked ? `text-${color}` : 'text-slate-500'}`}>
          <Icon size={24} />
        </div>
        {isUnlocked ? <Unlock size={20} className="text-green-400" /> : <Lock size={20} className="text-slate-500" />}
      </div>
      <h3 className="text-xl font-bold mb-2 text-slate-100">{title}</h3>
      <p className="text-slate-400 text-sm mb-6 h-12">{desc}</p>
      
      {isUnlocked ? (
        <a 
          href={`${url}/?auth=${AUTH_TOKEN}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className={`block w-full text-center py-3 rounded-lg font-bold transition-colors bg-${color} hover:bg-opacity-80 text-white shadow-lg`}
          style={{ backgroundColor: color === 'primary' ? '#a855f7' : color === 'secondary' ? '#06b6d4' : '#f43f5e' }}
        >
          起動する
        </a>
      ) : (
        <button disabled className="w-full py-3 rounded-lg font-bold bg-slate-800 text-slate-500 cursor-not-allowed">
          ロック中
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-background via-slate-900 to-black">
      
      {/* Header */}
      <header className="text-center mb-12">
        <div className="inline-flex items-center justify-center p-3 mb-4 rounded-2xl bg-gradient-to-r from-primary to-secondary">
          <Zap size={32} className="text-white" />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent mb-2">
          V-Creators Studio
        </h1>
        <p className="text-slate-400">VTuber素材制作のための、究極の時短ツールキット</p>
      </header>

      {/* Authentication Area */}
      {!status.isAuthenticated ? (
        <div className="w-full max-w-md bg-surface p-8 rounded-2xl border border-slate-700 shadow-2xl mb-12">
          <label className="block text-sm font-medium text-slate-400 mb-2">ライセンスキーを入力</label>
          <div className="flex gap-2">
            <input 
              type="text" 
              value={licenseKey}
              onChange={(e) => setLicenseKey(e.target.value)}
              placeholder="例: ALL-xxxx-xxxx"
              className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
            <button 
              onClick={handleAuth}
              className="bg-primary hover:bg-purple-600 text-white font-bold px-6 py-3 rounded-lg transition-colors"
            >
              認証
            </button>
          </div>
          <p className="text-xs text-slate-500 mt-4 text-center">
            キーをお持ちでないですか？ <a href="#" className="text-secondary hover:underline">BOOTHで購入する</a>
          </p>
        </div>
      ) : (
        <div className="w-full max-w-md flex items-center justify-between bg-surface/50 p-4 rounded-xl border border-green-500/30 mb-12">
          <div className="flex items-center gap-3">
            <CheckCircle className="text-green-400" size={20} />
            <div>
              <p className="text-xs text-slate-400">ステータス</p>
              <p className="font-bold text-green-400">認証済み: {status.plan}プラン</p>
            </div>
          </div>
          <button onClick={handleLogout} className="text-xs text-slate-500 hover:text-white underline">
            ログアウト
          </button>
        </div>
      )}

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
        <ToolCard 
          title="Image Crop Tool" 
          desc="大量の表情差分を一括で透明化・トリミング。もう手作業はいりません。"
          icon={Image}
          isUnlocked={status.unlocked.crop}
          url={TOOLS.crop}
          color="secondary"
        />
        <ToolCard 
          title="File Size Optimizer" 
          desc="4K画質を維持したまま、EtsyやDiscordの容量制限にピタリと合わせます。"
          icon={Video}
          isUnlocked={status.unlocked.optimizer}
          url={TOOLS.optimizer}
          color="primary"
        />
        <ToolCard 
          title="Loop Generator" 
          desc="短い動画素材から、配信画面用のシームレスなループ背景を自動生成。"
          icon={Repeat}
          isUnlocked={status.unlocked.loop}
          url={TOOLS.loop}
          color="accent"
        />
      </div>

      <footer className="mt-16 text-slate-600 text-sm">
        © 2025 V-Creators Studio. All rights reserved.
      </footer>
    </div>
  );
}

export default App;
