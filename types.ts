import React from 'react';

export interface God {
  id: string;
  name: string;
  title: string;
  lore: string;
  color: string;
  philosophy: string;
  boons: Boon[];
  calamity: Calamity;
  globalEffectDescription: string;
  ultimate: UltimatePower;
}

export interface Game {
  id:string;
  name: string;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
  description: string;
  minBet: number;
  maxBet: number;
  winChance: number;
  payoutMultiplier: number;
  flavorText: string;
  godId: string | null;
  category: 'DIVINE' | 'MORTAL';
}

export type GamePhase =
  | 'BETTING'
  | 'AWAITING_CHOICE'
  | 'JUDGMENT'
  | 'RESULT';

export type JanusPlayerChoice = 'Order' | 'Chaos';

export interface DivineInfluence {
  god: God;
  type: 'blessing' | 'taunt';
  message: string;
}

export type PantheonInfluenceState = Record<string, number>;

export interface Boon {
    devotionThreshold: number;
    description: string;
    effect: (payout: number, bet: number) => { modifiedPayout: number; message: string };
}

export interface Calamity {
    triggerChance: number;
    description: string;
    effect: (payout: number, bet: number) => { modifiedPayout: number; message: string };
}

export type ThothBoonType = 
    | 'payout_boost' 
    | 'luck_increase' 
    | 'loss_forgiveness'
    | 'zeus_wrath'
    | 'anubis_judgment'
    | 'loki_deception'
    | 'hades_tithe'
    | 'fortuna_rewrite'
    | 'janus_second_chance'
    | 'hecate_truesight'
    | 'morrigan_reaping'
    | 'mortal_will';

export interface TemporaryBoon {
    type: ThothBoonType;
    turnsRemaining: number;
    description: string;
    potency: number; // e.g., 1.5 for a 50% boost
}

export interface UltimatePower {
    name: string;
    description: string;
    cost: number; // Amount of charge needed to activate
    boonType: ThothBoonType;
    duration: number; // Number of turns the effect lasts
}

export interface AscendedGodDetails {
    name: string;
    title: string;
    philosophy: string;
    image: string; // base64
}

export interface PlayerState {
    currentCultId: string | null;
    devotion: Record<string, number>;
    scornfulGods: string[];
    debtToHades: number;
    temporaryBoons: TemporaryBoon[];
    scorn: number;
    ultimateCharge: Record<string, number>;
    personalizedGods: Record<string, string>; // godId -> base64 image string
    hasAscended: boolean;
    ascendedGodDetails: AscendedGodDetails | null;
    losingStreak: number;
    peakSouls: number;
}

export interface DailyQuest {
    id: string;
    type: 'wager' | 'win' | 'play_game' | 'change_cult';
    description: string;
    targetValue: number;
    currentValue: number;
    reward: number;
    isCompleted: boolean;
    isClaimed: boolean;
    meta?: string; // e.g., game ID for 'play_game' quests
}

export type ChatRole = 'user' | 'model' | 'system_error';

export interface ChatMessage {
    role: ChatRole;
    content: string;
}

export type ProvidenceEvent = {
    god: God;
    message: string;
    boon?: TemporaryBoon;
    soulGrant?: number;
};