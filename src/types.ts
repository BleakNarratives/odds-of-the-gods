// src/types.ts
import React from 'react';

export type GodId = 'zeus' | 'hades' | 'loki' | 'fortuna' | 'anubis' | 'thoth' | 'janus' | 'hecate' | 'morrigan' | 'sterculius' | 'aspirant' | 'user_god';

export interface God {
  id: GodId;
  name: string;
  title: string;
  lore: string;
  color: string;
  influence: number;
}

export interface Game {
    id: string;
    name: string;
    description: string;
    flavorText: string;
    godId: GodId;
    Icon: React.FC<any>;
    Component: React.FC<GameComponentProps>;
    minBet: number;
    maxBet: number;
    payoutMultiplier: number;
    winChance: number;
}

export interface GameComponentProps {
    god: God;
    game: Game;
    wager: number; // This is the player's total soul balance
    onWager: (amount: number) => boolean;
    onGameResult: (wagered: number, won: number, godId: GodId, isCheating: boolean, wasCaught: boolean) => void;
    playerState: PlayerState;
    setPlayerState: React.Dispatch<React.SetStateAction<PlayerState>>;
}


export interface PlayerState {
    name: string;
    accountTier: 'Mortal' | 'Demigod' | 'Deity';
    currentCultId: GodId | null;
    godProgress: Record<GodId, { devotion: number; gamesWon: number }>;
    activeBoons: Boon[];
    quests: Quest[];
    lastDailyBlessing: string | null; // ISO date string
    gamesPlayed: number;
    totalWagered: number;
    totalWon: number;
    cheaterPoints: number; // For Anubis's gaze tracking
    hasSeenExploitWarning: boolean;
    clashes: ClashChallenge[];
    fateMeter: number;
    customGameAssets: Record<string, Record<string, string>>; // gameId -> assetId -> imageBase64
    psychicProfile: PsychicProfile;
}

export interface PsychicProfile {
    dominance: number; // 0-100
    intuition: number; // 0-100
    aggression: number; // 0-100
}

export type ThothBoonType = 'payout_boost' | 'luck_increase' | 'loss_forgiveness';

export interface Boon {
    type: ThothBoonType;
    duration: number; // number of game rounds remaining
    potency: number; // e.g., 1.2 for a 20% boost
}

export interface Quest {
    id: string;
    description: string;
    godId: GodId;
    target: number;
    progress: number;
    reward: number;
    isClaimed: boolean;
}

export interface ChatMessage {
    role: 'user' | 'model' | 'system_error' | 'system_override';
    content: string;
}

export type JanusPlayerChoice = 'Order' | 'Chaos';

export interface SurveyQuestion {
    question: string;
    answers: string[];
}

export type Stance = 'Aggressive' | 'Deceptive' | 'Defensive';

export interface ClashChallenge {
  id: string;
  challengerId: string;
  challengerName: string;
  challengerGodId: GodId;
  wager: number;
  stance: Stance;
  isResolved: boolean;
  winnerId?: string;
  truceOffered?: boolean;
}

export interface DevLogEntry {
    timestamp: string;
    message: string | any;
}
