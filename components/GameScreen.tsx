import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Game, GamePhase, PlayerState, God, JanusPlayerChoice } from '../types';
import { getDivineCommentary } from '../services/geminiService';
import { PANTHEON, GAMES } from '../constants';
import { speechService } from './../services/speechService';
import { audioService } from './../services/audioService';
import { JanusChoice, JanusCoinFlipAnimation } from './game-animations/JanusCoinFlip';
import { LokiShellGameChoice, LokiShellGameAnimation } from './game-animations/LokiShellGame';
import { AnubisJudgement } from './game-animations/AnubisJudgement';
import { FortunaWheel } from './game-animations/FortunaWheel';
import { ZeusBolt } from './game-animations/ZeusBolt';
import { AnubisScales } from './game-animations/AnubisScales';
import { HecateCrossroadsChoice, HecateCrossroadsAnimation } from './game-animations/HecateCrossroads';
import { MorriganProphecyChoice, MorriganProphecyAnimation } from './game-animations/MorriganProphecy';
import { OlympianSlots } from './game-animations/OlympianSlots';
import { HadesUnderworldRoll } from './game-animations/HadesUnderworldRoll';
import DivineJudgementAnimation from './DivineJudgementAnimation';


interface GameScreenProps {
  game: Game;
  souls: number;
  onGameEnd: (payout: number, loss: number, game: Game, betAmount: number, volatileInfluenceShift?: { fromGodId: string, toGodId: string, amount: number }) => void;
  playerState: PlayerState;
  patronGod: God;
  dominantGodId: string | null;
  onBackToSanctum: () => void;
}

const DivineOverlay: React.FC<{ title: string; message: string; icon: React.FC<any>; color: string; }> = ({ title, message, icon: Icon, color }) => (
    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-theme-surface/80 backdrop-blur-sm border-2 rounded-lg shadow-2xl p-6 w-80 text-center z-50 animate-fade-in" style={{borderColor: color}}>
        <div className={`absolute -top-5 -left-5 w-20 h-20 bg-slate-800 rounded-full border-4 flex items-center justify-center`} style={{borderColor: color}}>
            <Icon className="w-12 h-12" style={{color: color}}/>
        </div>
        <p className="text-lg font-bold text-theme-secondary mt-12">{title}</p>
        <p className="text-xl italic text-white mt-2">"{message}"</p>
    </div>
);


const GameScreen: React.FC<GameScreenProps> = ({ game, souls, onGameEnd, playerState, patronGod, dominantGodId, onBackToSanctum }) => {
  const [phase, setPhase] = useState<GamePhase>('BETTING');
  const [bet, setBet] = useState(game.minBet);
  const [commentary, setCommentary] = useState('');
  const [error, setError] = useState('');
  const [eventData, setEventData] = useState<{message: string, god: God} | null>(null);
  const [gameResult, setGameResult] = useState<{isWin: boolean, finalPayout: number, isNearMiss: boolean} | null>(null);
  const [currentBetRange, setCurrentBetRange] = useState({ min: game.minBet, max: game.maxBet });
  const [playerChoice, setPlayerChoice] = useState<string | number | null>(null);

  useEffect(() => {
    let newMin = game.minBet;
    let newMax = game.maxBet;

    if (dominantGodId === 'zeus') {
      newMin = game.minBet * 1.5;
      newMax = game.maxBet * 1.5;
    }
    
    newMin = Math.round(Math.max(1, Math.min(souls > 1 ? Math.floor(souls) : newMin, newMin)));
    newMax = Math.round(newMax);

    setCurrentBetRange({ min: newMin, max: newMax });

    if (bet < newMin) {
        setBet(newMin);
    } else if (bet > newMax) {
        setBet(newMax);
    }
  }, [dominantGodId, game.minBet, game.maxBet, souls, game.id]);

  useEffect(() => {
    if (eventData) {
      const timer = setTimeout(() => setEventData(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [eventData]);

  const handleBetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '') {
        setBet(currentBetRange.min);
        return;
    }
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      setBet(Math.max(currentBetRange.min, Math.min(currentBetRange.max, numValue)));
    }
  };

  const showAndSpeakEvent = (message: string, god: God) => {
    speechService.speak(message);
    setEventData({ message, god });
  };
  
  const executeGameLogic = useCallback(async (choice?: string | number | null) => {
    
    let modifiedWinChance = game.winChance;
    let modifiedPayoutMultiplier = game.payoutMultiplier;

    const luckBoon = playerState.temporaryBoons.find(b => b.type === 'luck_increase');
    if (luckBoon) {
        modifiedWinChance *= luckBoon.potency;
        showAndSpeakEvent("Thoth's counsel guides your hand!", PANTHEON.find(g => g.id === 'janus')!);
        await new Promise(r => setTimeout(r, 2500));
    }

    if (dominantGodId === 'anubis') {
        modifiedWinChance *= 1.05;
        modifiedPayoutMultiplier *= 0.95;
    } else if (dominantGodId === 'fortuna') {
        modifiedWinChance *= 0.98;
    }

    let isWin = false;
    const roll = Math.random();

    switch (game.id) {
        case 'janus-coin':
            const janusRoll = Math.random() + (Date.now() % 1000) / 10000;
            const orderWins = janusRoll < modifiedWinChance; 
            isWin = (choice === 'Order' && orderWins) || (choice === 'Chaos' && !orderWins);
            break;
        case 'anubis-scales':
        case 'zeus-bolt':
        case 'fortuna-wheel':
        case 'hades-obol':
        case 'janus-sands':
        case 'zeus-titanomachy':
        case 'zeus-slots':
        case 'hades-roll':
        case 'morrigan-battlefield':
        case 'morrigan-loom':
            isWin = choice === 'win';
            break;
        case 'loki-maze':
        case 'hecate-crossroads':
        case 'anubis-jars':
        case 'loki-ruse':
        case 'janus-doorways': // Simplified logic for now
        case 'hades-styx':
        case 'hecate-roulette':
        case 'morrigan-crows':
            const winningCup = Math.floor(Math.random() * (game.id === 'hades-styx' ? 5 : game.id === 'hecate-roulette' ? 4 : 3));
            isWin = choice === winningCup;
            break;
        default:
            isWin = roll < modifiedWinChance;
    }

    const nearMissThreshold = modifiedWinChance + 0.05;
    const isNearMiss = !isWin && roll < nearMissThreshold;

    let finalPayout = isWin ? bet * modifiedPayoutMultiplier : 0;
    
    if (dominantGodId === 'loki' && Math.random() < 0.05) {
        isWin = !isWin;
        finalPayout = isWin ? bet * modifiedPayoutMultiplier : 0;
        showAndSpeakEvent("Loki's mischief has twisted fate!", PANTHEON.find(g => g.id === 'loki')!);
        await new Promise(r => setTimeout(r, 2500));
    }
    if (dominantGodId === 'fortuna' && Math.random() < 0.01) {
        const jackpot = Math.random() * 50 + 25;
        finalPayout += jackpot;
        showAndSpeakEvent(`Fortuna's wheel spins wild! A jackpot of ${jackpot.toFixed(0)} souls!`, PANTHEON.find(g => g.id === 'fortuna')!);
        await new Promise(r => setTimeout(r, 2500));
    }
    if (dominantGodId === 'janus' && !isWin && Math.random() < 0.1) {
        finalPayout = bet;
        showAndSpeakEvent(`Janus grants a new beginning. Your wager is returned.`, PANTHEON.find(g => g.id === 'janus')!);
        await new Promise(r => setTimeout(r, 2500));
    }

    const devotion = playerState.devotion[patronGod.id] || 0;
    const applicableBoons = patronGod.boons.filter(b => devotion >= b.devotionThreshold);
    for (const boon of applicableBoons) {
        const result = boon.effect(finalPayout, bet);
        if (result.message) {
            finalPayout = result.modifiedPayout;
            showAndSpeakEvent(result.message, patronGod);
            await new Promise(r => setTimeout(r, 2500));
        }
    }
    for (const godId of playerState.scornfulGods) {
        const scornfulGod = PANTHEON.find(g => g.id === godId);
        if (scornfulGod && Math.random() < scornfulGod.calamity.triggerChance) {
            const result = scornfulGod.calamity.effect(finalPayout, bet);
            finalPayout = result.modifiedPayout;
            showAndSpeakEvent(result.message, scornfulGod);
            await new Promise(r => setTimeout(r, 2500));
            break; 
        }
    }
    
    const payoutBoon = playerState.temporaryBoons.find(b => b.type === 'payout_boost');
    if (isWin && payoutBoon) {
        finalPayout *= payoutBoon.potency;
        showAndSpeakEvent("Thoth's wisdom magnifies your reward!", PANTHEON.find(g => g.id === 'janus')!);
        await new Promise(r => setTimeout(r, 2500));
    }
    
    const lossBoon = playerState.temporaryBoons.find(b => b.type === 'loss_forgiveness');
    if (!isWin && lossBoon) {
        finalPayout = bet; // Refund the bet
        showAndSpeakEvent("Thoth erases your misstep from the scrolls of fate.", PANTHEON.find(g => g.id === 'janus')!);
        await new Promise(r => setTimeout(r, 2500));
    }

    isWin = finalPayout >= bet;

    setGameResult({ isWin, finalPayout, isNearMiss });
    
    setPhase('JUDGMENT');

  }, [bet, game, dominantGodId, playerState, patronGod]);

  const handlePlay = () => {
    if (bet > souls) {
      setError("You can't wager more Souls than you possess.");
      return;
    }
    setError('');
    audioService.play('swoosh');
    setPhase('AWAITING_CHOICE');
  };

  const handleChoice = (choice: string | number) => {
    audioService.play('click');
    setPlayerChoice(choice);
    executeGameLogic(choice);
  };

  const handleAnimationEnd = useCallback(async () => {
    if (!gameResult) return;
    let { isWin, finalPayout, isNearMiss } = gameResult;
    let volatileInfluenceShift: { fromGodId: string, toGodId: string, amount: number } | undefined = undefined;

    // --- Path of Scorn Logic ---
    if (isWin && playerState.scorn > 0 && playerState.scornfulGods.length > 0) {
        const scornChance = Math.min(0.5, (playerState.scorn / 200) * 0.05);
        if (Math.random() < scornChance) {
            finalPayout *= 2; // Double the payout
            const mostScornfulGodId = playerState.scornfulGods[playerState.scornfulGods.length - 1];
            const mostScornfulGod = PANTHEON.find(g => g.id === mostScornfulGodId)!;
            volatileInfluenceShift = { fromGodId: patronGod.id, toGodId: mostScornfulGodId, amount: bet };
            showAndSpeakEvent(`An echo of betrayal empowers you, feeding ${mostScornfulGod.name}'s rage!`, mostScornfulGod);
            await new Promise(r => setTimeout(r, 2500));
        }
    }
    
    let commentaryPromise: Promise<string>;

    if (isWin) {
        audioService.play('win');
        if (finalPayout > bet * 5) {
            speechService.onBigWin();
            commentaryPromise = Promise.resolve("A victory of epic proportions!");
        } else {
            commentaryPromise = getDivineCommentary(game.name, 'WIN', bet, game.payoutMultiplier, 0.5);
        }
    } else {
        audioService.play('lose');
        if (isNearMiss) {
            speechService.onNearWin();
            commentaryPromise = getDivineCommentary(game.name, 'LOSS', bet, game.payoutMultiplier, 0.5);
        } else {
            speechService.onLoss();
            commentaryPromise = getDivineCommentary(game.name, 'LOSS', bet, game.payoutMultiplier, 0.5);
        }
    }
    
    setCommentary(await commentaryPromise);
    
    let lossAmount = isWin ? 0 : bet;
    const reapingBoon = playerState.temporaryBoons.find(b => b.type === 'morrigan_reaping');
    if (!isWin && reapingBoon) {
      lossAmount = bet * 0.5;
    }

    onGameEnd(finalPayout, lossAmount, game, bet, volatileInfluenceShift);
    setPhase('RESULT');

  }, [gameResult, bet, game, onGameEnd, playerState.scorn, playerState.scornfulGods, patronGod, playerState.temporaryBoons]);

  const handlePlayAgain = () => {
    audioService.play('click');
    setPhase('BETTING');
    setCommentary('');
    setBet(currentBetRange.min);
    setGameResult(null);
    setPlayerChoice(null);
  };
  
  const RenderContent = () => {
    switch (phase) {
        case 'BETTING':
            return (
                <div className="animate-fade-in">
                  <h3 className="text-2xl font-bold text-white mb-2">Make Your Offering</h3>
                  <p className="text-theme-muted mb-6">{game.flavorText}</p>
                   {playerState.temporaryBoons.length > 0 && (
                      <div className="bg-theme-primary/10 border border-theme-primary/50 rounded-lg p-3 text-center mb-4">
                          <p className="text-theme-primary font-bold text-sm">Active Boon</p>
                          <p className="text-theme-secondary text-xs italic">"{playerState.temporaryBoons[0].description}"</p>
                      </div>
                   )}
                  <div className="flex flex-col items-center justify-center gap-4 my-8">
                     <p className="text-xs text-theme-muted font-mono">
                        (Wager Range: {currentBetRange.min} - {currentBetRange.max})
                     </p>
                    <input
                      type="number" id="bet" value={bet} onChange={handleBetChange}
                      min={currentBetRange.min} max={currentBetRange.max} step={1}
                      className="w-48 bg-slate-900 border border-theme-border rounded-md p-3 text-2xl font-bold text-center focus:ring-2 focus:ring-theme-primary focus:outline-none appearance-none"
                    />
                  </div>
                  {error && <p className="text-theme-loss mb-4">{error}</p>}
                  <button onClick={handlePlay} className="w-full bg-theme-primary/90 text-theme-background font-bold py-3 px-6 rounded-lg text-lg tracking-wider uppercase hover:bg-theme-primary transition-colors duration-300 shadow-lg shadow-theme-primary/20 shimmer-button">
                    Play
                  </button>
                </div>
            );
        case 'AWAITING_CHOICE':
             if (game.id === 'janus-coin') return <JanusChoice onChoice={handleChoice as (choice: JanusPlayerChoice) => void} />;
             if (game.id === 'loki-maze' || game.id === 'anubis-jars') return <LokiShellGameChoice onChoice={handleChoice} game={game}/>;
             if (game.id === 'hecate-crossroads') return <HecateCrossroadsChoice onChoice={handleChoice} />;
             if (game.id === 'morrigan-crows') return <MorriganProphecyChoice onChoice={handleChoice} />;
             if (game.id === 'zeus-bolt') return <ZeusBolt onComplete={handleChoice} />;
             if (game.id === 'fortuna-wheel') return <FortunaWheel winChance={game.winChance} onComplete={handleChoice} />;
             if (game.id === 'anubis-scales') return <AnubisScales winChance={game.winChance} onComplete={handleChoice} />;
             if (game.id === 'zeus-slots') return <OlympianSlots winChance={game.winChance} payoutMultiplier={game.payoutMultiplier} onComplete={handleChoice} />;
             if (game.id === 'hades-roll') return <HadesUnderworldRoll onComplete={handleChoice} />;
             // Fallback for non-interactive games
             executeGameLogic();
             return <p>Loading game...</p>;
        case 'JUDGMENT':
             if (game.id === 'janus-coin' && playerChoice) return <JanusCoinFlipAnimation isWin={gameResult!.isWin} choice={playerChoice as JanusPlayerChoice} onAnimationEnd={handleAnimationEnd} />;
             if ((game.id === 'loki-maze' || game.id === 'anubis-jars') && playerChoice !== null) return <LokiShellGameAnimation isWin={gameResult!.isWin} choice={playerChoice as number} onAnimationEnd={handleAnimationEnd} game={game}/>;
             if (game.id === 'hecate-crossroads' && playerChoice !== null) return <HecateCrossroadsAnimation isWin={gameResult!.isWin} choice={playerChoice as number} onAnimationEnd={handleAnimationEnd} />;
             if (game.id === 'morrigan-crows' && playerChoice !== null) return <MorriganProphecyAnimation isWin={gameResult!.isWin} choice={playerChoice as number} onAnimationEnd={handleAnimationEnd} />;
             // Default judgment for non-interactive animations
             return <DivineJudgementAnimation isWin={gameResult!.isWin} patronGod={patronGod} onAnimationEnd={handleAnimationEnd} />;
        case 'RESULT':
            return (
                <div className="text-center animate-fade-in">
                    <h3 className={`text-4xl font-bold ${gameResult?.isWin ? 'text-theme-win' : 'text-theme-loss'} mb-4`}>
                        {gameResult?.isWin ? 'Divine Favor!' : 'Forsaken'}
                    </h3>
                    <p className="text-xl text-theme-secondary italic h-12 flex items-center justify-center">"{commentary}"</p>
                    <p className="text-lg text-theme-base mt-6">
                        {gameResult?.isWin ? `You won ` : `You lost `}
                        <span className={`font-bold ${gameResult?.isWin ? 'text-theme-win' : 'text-theme-loss'}`}>
                           {gameResult?.isWin ? gameResult?.finalPayout.toFixed(2) : (bet - (gameResult?.finalPayout || 0)).toFixed(2)} Souls
                        </span>.
                    </p>
                    <div className="flex gap-4 justify-center">
                        <button onClick={handlePlayAgain} className="mt-8 bg-theme-primary/90 text-theme-background font-bold py-2 px-6 rounded-md hover:bg-theme-primary transition-colors">
                            Play Again
                        </button>
                         <button onClick={onBackToSanctum} className="mt-8 bg-slate-700 text-slate-200 font-bold py-2 px-6 rounded-md hover:bg-slate-600 transition-colors">
                            Return to Sanctum
                        </button>
                    </div>
                </div>
            );
        default: return null;
    }
  }

  const colorMap: Record<string, string> = {
    amber: '#f59e0b',
    rose: '#f43f5e',
    slate: '#64748b',
    green: '#22c55e',
    yellow: '#facc15',
    blue: '#3b82f6',
    red: '#ef4444',
    indigo: '#6366f1',
    teal: '#14b8a6',
  };
  const iconColor = colorMap[patronGod.color] || '#ffffff';


  return (
    <>
      {eventData && <DivineOverlay title="A God Intervenes..." message={eventData.message} icon={GAMES.find(g => g.godId === eventData.god.id)!.Icon} color={eventData.god.color} />}
      <div className="container mx-auto px-4 md:px-8 py-8 flex justify-center items-start min-h-[calc(100vh-200px)]">
        <div className="bg-black/30 backdrop-blur-md rounded-lg shadow-2xl shadow-theme-primary/10 border border-theme-border/50 w-full max-w-2xl p-8">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-4">
              <game.Icon className="w-12 h-12" style={{color: iconColor}} />
              <h2 className="text-2xl font-bold text-white">{game.name}</h2>
            </div>
             <button onClick={onBackToSanctum} className="text-slate-400 hover:text-white transition-colors text-sm">
              &larr; Back to Sanctum
            </button>
          </div>
          
          <div className="min-h-[256px] flex items-center justify-center">
            <RenderContent />
          </div>

        </div>
      </div>
    </>
  );
};

export default GameScreen;