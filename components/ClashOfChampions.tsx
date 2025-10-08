import React, { useState, useMemo, useEffect } from 'react';
import { God } from '../types';
import { GAMES } from '../constants';
import { audioService } from '../services/audioService';

interface ClashOfChampionsProps {
  patronGod: God;
  enemyGod: God;
  onClashEnd: (isPlayerVictory: boolean) => void;
}

type Stance = 'Aggressive' | 'Deceptive' | 'Defensive';
type RoundResult = 'win' | 'loss' | 'tie' | null;

const MAX_HEALTH = 100;
const DAMAGE_AMOUNT = 34; // 3 hits to win

const stanceBeats: Record<Stance, Stance> = {
    'Aggressive': 'Deceptive',
    'Deceptive': 'Defensive',
    'Defensive': 'Aggressive'
};

const ChampionDisplay: React.FC<{ god: God, health: number, animation: string }> = ({ god, health, animation }) => {
    const GodIcon = useMemo(() => GAMES.find(g => g.godId === god.id)!.Icon, [god.id]);
    const startWidth = (health + DAMAGE_AMOUNT) / MAX_HEALTH * 100;
    const endWidth = health / MAX_HEALTH * 100;

    return (
        <div className="flex flex-col items-center gap-4 w-1/3">
            <div className="relative">
                <GodIcon 
                    className="w-32 h-32 transition-transform duration-300" 
                    style={{ color: god.color, filter: `drop-shadow(0 0 20px ${god.color})`, animation }} 
                />
            </div>
            <h3 className="text-2xl font-bold" style={{ color: god.color }}>{god.name}</h3>
            <div className="w-full bg-slate-800 rounded-full h-6 border-2 border-slate-600 p-1">
                <div 
                    className="h-full rounded-full transition-colors duration-500" 
                    style={{ 
                        backgroundColor: god.color,
                        width: `${health}%`,
                        // @ts-ignore
                        '--start-width': `${startWidth}%`,
                        '--end-width': `${endWidth}%`,
                        animation: animation.includes('hit') ? `health-bar-drain 0.5s ease-out forwards` : 'none'
                    }}
                />
            </div>
        </div>
    );
};

const ClashOfChampions: React.FC<ClashOfChampionsProps> = ({ patronGod, enemyGod, onClashEnd }) => {
    const [playerHealth, setPlayerHealth] = useState(MAX_HEALTH);
    const [enemyHealth, setEnemyHealth] = useState(MAX_HEALTH);
    const [round, setRound] = useState(1);
    const [playerChoice, setPlayerChoice] = useState<Stance | null>(null);
    const [enemyChoice, setEnemyChoice] = useState<Stance | null>(null);
    const [roundResult, setRoundResult] = useState<RoundResult>(null);
    const [isRoundAnimating, setIsRoundAnimating] = useState(false);
    const [message, setMessage] = useState("Choose your stance, Champion!");
    const [playerAnim, setPlayerAnim] = useState('');
    const [enemyAnim, setEnemyAnim] = useState('');

    const handleStanceSelect = (stance: Stance) => {
        if (isRoundAnimating) return;

        setIsRoundAnimating(true);
        setPlayerChoice(stance);

        const stances: Stance[] = ['Aggressive', 'Deceptive', 'Defensive'];
        const randomEnemyChoice = stances[Math.floor(Math.random() * stances.length)];
        setEnemyChoice(randomEnemyChoice);

        let result: RoundResult;
        if (stanceBeats[stance] === randomEnemyChoice) {
            result = 'win';
            setMessage(`${stance} overpowers ${randomEnemyChoice}! A direct hit!`);
            setEnemyHealth(h => Math.max(0, h - DAMAGE_AMOUNT));
            setPlayerAnim('champion-attack 0.5s ease-in-out');
            setEnemyAnim('champion-hit-shake 0.5s ease-in-out');
            audioService.play('win');
        } else if (stanceBeats[randomEnemyChoice] === stance) {
            result = 'loss';
            setMessage(`${randomEnemyChoice} counters your ${stance}! You are struck!`);
            setPlayerHealth(h => Math.max(0, h - DAMAGE_AMOUNT));
            setPlayerAnim('champion-hit-shake 0.5s ease-in-out');
            setEnemyAnim('champion-attack-enemy 0.5s ease-in-out');
            audioService.play('lose');
        } else {
            result = 'tie';
            setMessage(`Both champions chose ${stance}! The blows are parried!`);
            setPlayerAnim('champion-defend 0.5s ease-in-out');
            setEnemyAnim('champion-defend 0.5s ease-in-out');
            audioService.play('swoosh');
        }
        setRoundResult(result);
    };
    
    useEffect(() => {
        if (!isRoundAnimating) return;

        const timer = setTimeout(() => {
            if (playerHealth <= 0 || enemyHealth <= 0) {
                 const playerWon = enemyHealth <= 0;
                 setMessage(playerWon ? "Victory is yours! The pantheon shifts!" : "You have been defeated! Your patron is weakened!");
                 setTimeout(() => onClashEnd(playerWon), 2000);
            } else {
                setRound(r => r + 1);
                setPlayerChoice(null);
                setEnemyChoice(null);
                setRoundResult(null);
                setIsRoundAnimating(false);
                setMessage("Choose your next stance!");
                setPlayerAnim('');
                setEnemyAnim('');
            }
        }, 2000); // Duration of round announcements + animations

        return () => clearTimeout(timer);

    }, [isRoundAnimating, playerHealth, enemyHealth, onClashEnd]);


    return (
        <div className="container mx-auto px-4 md:px-8 py-12 animate-fade-in flex flex-col items-center justify-center min-h-[calc(100vh-89px)]">
            <div className="text-center mb-8">
                <h1 className="text-5xl font-black text-white tracking-tighter">CLASH OF CHAMPIONS</h1>
                <p className="text-2xl text-theme-primary mt-2">Round {round}</p>
            </div>

            <div className="w-full max-w-4xl flex items-start justify-around mb-8">
                <ChampionDisplay god={patronGod} health={playerHealth} animation={playerAnim} />
                <div className="text-5xl font-black text-theme-muted pt-20 animate-[pulse_2s_ease-in-out_infinite]">VS</div>
                <ChampionDisplay god={enemyGod} health={enemyHealth} animation={enemyAnim} />
            </div>
            
            <div className="h-16 flex items-center justify-center text-center">
                 <p className="text-xl text-slate-300 italic">{message}</p>
            </div>

            <div className="flex gap-6 mt-8">
                {(['Aggressive', 'Deceptive', 'Defensive'] as Stance[]).map(stance => (
                    <button 
                        key={stance}
                        onClick={() => handleStanceSelect(stance)}
                        disabled={isRoundAnimating}
                        className="bg-theme-surface border-2 border-theme-border text-theme-secondary font-bold py-3 px-8 rounded-lg text-lg tracking-wider uppercase hover:bg-theme-primary/20 hover:border-theme-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {stance}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ClashOfChampions;