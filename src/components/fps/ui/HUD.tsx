'use client';

import { useFPSStore } from '@/stores/fpsStore';

export function HUD() {
  const health = useFPSStore((state) => state.health);
  const maxHealth = useFPSStore((state) => state.maxHealth);
  const score = useFPSStore((state) => state.score);
  const activeWeapon = useFPSStore((state) => state.activeWeapon);
  const weaponState = useFPSStore((state) => state.weapons[state.activeWeapon]);
  const gameState = useFPSStore((state) => state.gameState);

  if (gameState !== 'PLAYING' && gameState !== 'MENU') { // Show minimal HUD in menu? OR show nothing.
      // If we want to show HUD during play only:
      // if (gameState !== 'PLAYING') return null;
  }

  return (
    <div className="absolute inset-0 pointer-events-none select-none">
      {/* Crosshair */}
      <div className="absolute top-1/2 left-1/2 w-4 h-4 -ml-2 -mt-2 pointer-events-none">
        <div className="absolute top-1/2 left-0 w-full h-[2px] bg-white opacity-80" />
        <div className="absolute left-1/2 top-0 h-full w-[2px] bg-white opacity-80" />
      </div>

      {/* Stats Panel (Bottom Left) */}
      <div className="absolute bottom-8 left-8 flex flex-col gap-2">
        <div className="bg-black/50 p-4 rounded text-white backdrop-blur-sm">
            <h2 className="text-xl font-bold mb-1">HEALTH</h2>
            <div className="w-48 h-4 bg-gray-700 rounded-full overflow-hidden border border-gray-600">
                <div 
                    className="h-full bg-green-500" 
                    style={{ width: `${(health / maxHealth) * 100}%` }}
                />
            </div>
            <p className="text-sm mt-1">{health} / {maxHealth}</p>
        </div>
        
         <div className="bg-black/50 p-4 rounded text-white backdrop-blur-sm text-center">
            <h2 className="text-xl font-bold text-yellow-400">SCORE</h2>
            <p className="text-3xl font-mono">{score}</p>
        </div>
      </div>

      {/* Weapon Panel (Bottom Right) */}
      <div className="absolute bottom-8 right-8 bg-black/50 p-6 rounded text-white text-right backdrop-blur-sm">
         <h3 className="text-lg font-bold text-blue-400 mb-2">{activeWeapon}</h3>
         <p className="text-4xl font-mono">
            {weaponState.reloading ? 'RELOADING...' : `${weaponState.ammo} / ${weaponState.maxAmmo}`}
         </p>
         <p className="text-xs text-gray-400 mt-1">INFINITE RESERVES</p>
      </div>
      
      {/* Messages */}
      {gameState === 'MENU' && (
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-center bg-black/80 p-8 rounded-xl border border-white/20">
               <h1 className="text-4xl font-bold mb-4">FPS DEMO</h1>
               <p className="text-gray-300 mb-8">Click anywhere to start</p>
               <p className="text-sm text-gray-500">WASD to Move • Mouse to Look • Click to Shoot</p>
           </div>
      )}
    </div>
  );
}
