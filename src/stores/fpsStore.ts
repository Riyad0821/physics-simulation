import { create } from 'zustand';

export type WeaponType = 'RIFLE' | 'PISTOL';

export interface WeaponState {
    type: WeaponType;
    damage: number;
    fireRate: number; // ms betweeen shots
    ammo: number;
    maxAmmo: number;
    reloading: boolean;
    lastFired: number;
}

interface FPSState {
    // Game Status
    gameState: 'MENU' | 'PLAYING' | 'GAME_OVER';
    level: number;
    score: number;
    
    // Player Status
    health: number;
    maxHealth: number;
    
    // Weapon Status
    activeWeapon: WeaponType;
    weapons: Record<WeaponType, WeaponState>;
    
    // Actions
    setGameState: (state: 'MENU' | 'PLAYING' | 'GAME_OVER') => void;
    addScore: (points: number) => void;
    takeDamage: (amount: number) => void;
    fireWeapon: () => boolean; // Returns true if fired
    reloadWeapon: () => void;
    finishReload: () => void;
    switchWeapon: (type: WeaponType) => void;
    resetGame: () => void;
}

const INITIAL_WEAPONS: Record<WeaponType, WeaponState> = {
    RIFLE: { type: 'RIFLE', damage: 20, fireRate: 100, ammo: 30, maxAmmo: 30, reloading: false, lastFired: 0 },
    PISTOL: { type: 'PISTOL', damage: 10, fireRate: 300, ammo: 12, maxAmmo: 12, reloading: false, lastFired: 0 }
};

export const useFPSStore = create<FPSState>((set, get) => ({
    gameState: 'MENU',
    level: 1,
    score: 0,
    health: 100,
    maxHealth: 100,
    activeWeapon: 'RIFLE',
    weapons: JSON.parse(JSON.stringify(INITIAL_WEAPONS)), // Deep copy

    setGameState: (state) => set({ gameState: state }),
    addScore: (points) => set((state) => ({ score: state.score + points })),
    takeDamage: (amount) => set((state) => ({ health: Math.max(0, state.health - amount) })),
    
    fireWeapon: () => {
        const state = get();
        const weapon = state.weapons[state.activeWeapon];
        const now = Date.now();
        
        if (weapon.reloading || weapon.ammo <= 0 || now - weapon.lastFired < weapon.fireRate) {
            return false;
        }
        
        // Update ammo
        const newWeapons = { ...state.weapons };
        newWeapons[state.activeWeapon] = {
            ...weapon,
            ammo: weapon.ammo - 1,
            lastFired: now
        };
        
        set({ weapons: newWeapons });
        return true;
    },
    
    reloadWeapon: () => {
        const state = get();
        const weapon = state.weapons[state.activeWeapon];
        if (weapon.reloading || weapon.ammo === weapon.maxAmmo) return;
        
        const newWeapons = { ...state.weapons };
        newWeapons[state.activeWeapon].reloading = true;
        set({ weapons: newWeapons });
        
        // Timeout handled by component effect usually, but we can assume simple logic for now
    },
    
    finishReload: () => {
        const state = get();
        const newWeapons = { ...state.weapons };
        const weapon = newWeapons[state.activeWeapon];
        
        weapon.ammo = weapon.maxAmmo;
        weapon.reloading = false;
        
        set({ weapons: newWeapons });
    },
    
    switchWeapon: (type) => set({ activeWeapon: type }),
    
    resetGame: () => set({
        gameState: 'MENU',
        level: 1,
        score: 0,
        health: 100,
        weapons: JSON.parse(JSON.stringify(INITIAL_WEAPONS))
    })
}));
