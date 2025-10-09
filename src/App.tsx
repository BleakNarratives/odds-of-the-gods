// src/App.tsx

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import Header from './components/Header';
import PantheonScreen from './components/PantheonScreen';
import Sanctum from './components/Sanctum';
import GameScreen from './components/GameScreen';
import GodsOfWar from './components/GodsOfWar';
import ClashOfChampions from './components/ClashOfChampions';
import Footer from './components/Footer';
import MythicBackground from './components/MythicBackground';
import CashOutModal from './components/CashOutModal';
import DailyBlessingModal from './components/DailyBlessingModal';
import DailyQuestsModal from './components/DailyQuestsModal';
import SoulStoreModal from './components/SoulStoreModal';
import NavSidebar from './components/NavSidebar';
import ExploitWarningModal from './components/ExploitWarningModal';
import GazeTracker from './components/GazeTracker';
import { ThothAudienceModal } from './components/ThothAudienceModal';
import IntroScreen from './components/IntroScreen';
import MortalGamesScreen from './components/MortalGamesScreen';
import PersonalizeGodModal from './components/PersonalizeGodModal';
import AscensionModal from './components/AscensionModal';
import ArchitectCommuneModal from './components/ArchitectCommuneModal';
import DivineProvidenceModal from './components/DivineProvidenceModal';
import Dashboard from './components/Dashboard';
import DevLog from './components/DevLog';
import DevTools from './components/DevTools';
import { Game, PantheonInfluenceState, PlayerState, God, ThothBoonType, TemporaryBoon, DailyQuest, AscendedGodDetails, ProvidenceEvent, DevLogEntry, DevToolsActions, GodId } from './types';
import { INITIAL_SOULS, INITIAL_PANTHEON_INFLUENCE, INITIAL_PLAYER_STATE, PANTHEON, GAMES, USER_GOD_TEMPLATE, QUEST_POOL } from './constants';
import { speechService } from './services/speechService';
import { audioService } from './services/audioService';

type Screen = 'PANTHEON' | 'SANCTUM' | 'GAME' | 'WAR' | 'MORTAL_GAMES' | 'CLASH' | 'DASHBOARD';

const DAILY_BLESSING_AMOUNT = 100;
const ASCENSION_COST = 10000;

// --- Divine Providence Research Parameters ---
const PROVIDENCE_CRITICAL_LOSS_STREAK = 5;
const PROVIDENCE_SOUL_POVERTY_THRESHOLD = 0.1; // 10% of peak wealth

// --- State Persistence ---
const loadGameState = () => {
  try {
    const serializedState = localStorage.getItem('oddsOfGodsGameState');
    if (serializedState === null) return undefined;
    const loadedState = JSON.parse(serializedState);
    const pState = loadedState.playerState || {};
    pState.personalizedGods = pState.personalizedGods || {};
    pState.hasAscended = pState.hasAscended || false;
    pState.ascendedGodDetails = pState.ascendedGodDetails || null;
    pState.losingStreak = pState.losingStreak || 0;
    pState.peakSouls = pState.peakSouls || loadedState.souls || INITIAL_SOULS;
    pState.stats = pState.stats || { totalWagered: 0, totalWins: 0, totalLosses: 0, soulsWon: 0, soulsLost: 0 };
    loadedState.playerState = pState;
    return loadedState;
  } catch (err) {
    console.error("Could not load game state", err);
    return undefined;
  }
};

const getInitialScreen = (state: any): Screen => {
  if (!state?.hasEntered) return 'PANTHEON';
  if (['GAME', 'CLASH', 'DASHBOARD'].includes(state.screen)) return 'SANCTUM';
  return state.screen || 'PANTHEON';
};

function App() {
  const persistedState = useMemo(() => loadGameState(), []);

  const [hasEntered, setHasEntered] = useState(persistedState?.hasEntered ?? false);
  const [screen, setScreen] = useState<Screen>(getInitialScreen(persistedState));
  const [souls, setSouls] = useState(persistedState?.souls ?? INITIAL_SOULS);
  const [playerState, setPlayerState] = useState<PlayerState>(persistedState?.playerState ?? INITIAL_PLAYER_STATE);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  
  // Modal States
  const [openModal, setOpenModal] = useState<string | null>(null);
  const [providenceEvent, setProvidenceEvent] = useState<ProvidenceEvent | null>(null);
  const [godToPersonalize, setGodToPersonalize] = useState<God | null>(null);
  
  const [pantheonInfluence, setPantheonInfluence] = useState<PantheonInfluenceState>(persistedState?.pantheonInfluence ?? INITIAL_PANTHEON_INFLUENCE);
  const [dominantGodId, setDominantGodId] = useState<GodId | null>(null);
  const [hasClaimedToday, setHasClaimedToday] = useState(() => new Date().toDateString() === localStorage.getItem('lastVisitDate'));
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [dailyQuests, setDailyQuests] = useState<DailyQuest[]>([]);
  const [soulUpdateClass, setSoulUpdateClass] = useState('');
  const [devLogs, setDevLogs] = useState<DevLogEntry[]>([]);
  
  // Dev Tools & Trackers
  const [isDevLogOpen, setIsDevLogOpen] = useState(false);
  const [isDevToolsOpen, setIsDevToolsOpen] = useState(false);
  const [isGazeTrackerActive, setIsGazeTrackerActive] = useState(false);

  const logDevEvent = useCallback((message: string, data: any = {}) => {
    const timestamp = new Date().toLocaleTimeString();
    const logMessage = `${message} ${Object.keys(data).length > 0 ? JSON.stringify(data) : ''}`;
    console.log(`[DEV LOG - ${timestamp}] ${logMessage}`);
    setDevLogs(prev => [...prev.slice(-49), { timestamp, message: logMessage }]);
  }, []);
  
  // --- Game State Persistence ---
  useEffect(() => {
    if (!hasEntered) {
      localStorage.removeItem('oddsOfGodsGameState');
      return;
    }
    const gameState = { hasEntered, screen, souls, playerState, pantheonInfluence };
    localStorage.setItem('oddsOfGodsGameState', JSON.stringify(gameState));
  }, [hasEntered, screen, souls, playerState, pantheonInfluence]);


  // --- Quest Management ---
  const generateNewQuests = useCallback(() => {
    const shuffled = [...QUEST_POOL].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3).map((q, i) => ({ ...q, id: `${Date.now()}-${i}`, currentValue: 0, isCompleted: false, isClaimed: false }));
  }, []);

  useEffect(() => {
    const today = new Date().toDateString();
    const lastQuestDate = localStorage.getItem('lastQuestDate');
    if (lastQuestDate !== today) {
      const newQuests = generateNewQuests();
      setDailyQuests(newQuests);
      localStorage.setItem('dailyQuests', JSON.stringify(newQuests));
      localStorage.setItem('lastQuestDate', today);
    } else {
      const savedQuests = localStorage.getItem('dailyQuests');
      setDailyQuests(savedQuests ? JSON.parse(savedQuests) : generateNewQuests());
    }
  }, [generateNewQuests]);
  
  const updateQuestProgress = useCallback((type: 'wager' | 'win' | 'play_game' | 'change_cult', value: number | string) => {
    setDailyQuests(prevQuests => {
        const updatedQuests = prevQuests.map(quest => {
            if (quest.type === type && !quest.isCompleted) {
                let newProgress = quest.currentValue;
                if (quest.type === 'play_game' && quest.meta === value) newProgress += 1;
                else if (typeof value === 'number' && quest.type !== 'play_game') newProgress += value;
                else if (quest.type === 'change_cult') newProgress += 1;
                
                return { ...quest, currentValue: newProgress, isCompleted: newProgress >= quest.targetValue };
            }
            return quest;
        });
        localStorage.setItem('dailyQuests', JSON.stringify(updatedQuests));
        return updatedQuests;
    });
  }, []);

  const claimQuestReward = (questId: string) => {
    setDailyQuests(prevQuests => {
      const quest = prevQuests.find(q => q.id === questId);
      if (quest?.isCompleted && !quest.isClaimed) {
        setSouls(s => s + quest.reward);
        audioService.play('win');
        const updated = prevQuests.map(q => q.id === questId ? { ...q, isClaimed: true } : q);
        localStorage.setItem('dailyQuests', JSON.stringify(updated));
        return updated;
      }
      return prevQuests;
    });
  };

  const claimAllQuests = () => {
    let totalReward = 0;
    const updatedQuests = dailyQuests.map(q => {
      if (q.isCompleted && !q.isClaimed) {
        totalReward += q.reward;
        return { ...q, isClaimed: true };
      }
      return q;
    });

    if (totalReward > 0) {
      setSouls(s => s + totalReward);
      audioService.play('big-win');
      setDailyQuests(updatedQuests);
      localStorage.setItem('dailyQuests', JSON.stringify(updatedQuests));
    }
  };


  // --- Core App Logic ---
  useEffect(() => {
    const unlockAudio = () => {
      speechService.unlock();
      audioService.unlock();
      audioService.playBGM();
      window.removeEventListener('click', unlockAudio);
    };
    window.addEventListener('click', unlockAudio, { once: true });
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'L') setIsDevLogOpen(p => !p);
      if (e.ctrlKey && e.shiftKey && e.key === 'D') setIsDevToolsOpen(p => !p);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFull = !!document.fullscreenElement;
      setIsGazeTrackerActive(isFull && playerState.currentCultId === 'anubis');
      logDevEvent(`Fullscreen ${isFull ? 'entered' : 'exited'}. GazeTracker is ${isFull && playerState.currentCultId === 'anubis' ? 'ACTIVE' : 'INACTIVE'}`);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [logDevEvent, playerState.currentCultId]);

  useEffect(() => {
    if (hasEntered && !hasClaimedToday) {
        setOpenModal('dailyBlessing');
    }
  }, [hasClaimedToday, hasEntered]);

  useEffect(() => {
    if (!pantheonInfluence) return;
    const newDomId = Object.entries(pantheonInfluence).reduce((a, b) => a[1] > b[1] ? a : b)[0] as GodId;
    if (newDomId && newDomId !== dominantGodId) {
      const newDomGod = PANTHEON.find(g => g.id === newDomId);
      if (newDomGod) {
        speechService.onDominionChange(newDomGod.name);
        setDominantGodId(newDomId);
      }
    }
  }, [pantheonInfluence, dominantGodId]);
  
  const changeScreen = useCallback((newScreen: Screen) => {
    if (screen === newScreen) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setScreen(newScreen);
      setIsTransitioning(false);
    }, 700);
  }, [screen]);

  const handleEnter = () => {
    audioService.play('swoosh');
    setHasEntered(true);
    setScreen('PANTHEON');
  };

  const handleSelectCult = (godId: GodId) => {
    if (playerState.currentCultId && playerState.currentCultId !== godId) {
      speechService.onBetrayal();
      updateQuestProgress('change_cult', 1);
    }
    setPlayerState(prev => {
      const isBetrayal = !!prev.currentCultId && prev.currentCultId !== godId;
      return {
        ...prev,
        currentCultId: godId,
        scornfulGods: isBetrayal ? [...new Set([...prev.scornfulGods, prev.currentCultId!])] : prev.scornfulGods.filter(id => id !== godId),
        scorn: isBetrayal ? prev.scorn + 100 : prev.scorn,
      };
    });
    changeScreen('SANCTUM');
  };

  const handleSelectGame = (game: Game) => {
    setSelectedGame(game);
    changeScreen('GAME');
  };

  const handleNavigateToSanctum = () => {
    setSelectedGame(null);
    changeScreen('SANCTUM');
    setIsNavOpen(false);
  };
  
  const handleNavigateToPantheon = () => changeScreen('PANTHEON');
  const handleNavigateToWar = () => changeScreen('WAR');
  const handleNavigateToMortalGames = () => changeScreen('MORTAL_GAMES');
  const handleNavigateToDashboard = () => changeScreen('DASHBOARD');

  const currentGod = useMemo(() => {
    if (!playerState.currentCultId) return null;
    if (playerState.currentCultId === 'user_god' && playerState.hasAscended && playerState.ascendedGodDetails) {
        return { ...USER_GOD_TEMPLATE, ...playerState.ascendedGodDetails };
    }
    return PANTHEON.find(god => god.id === playerState.currentCultId) || null;
  }, [playerState]);

  const applyThothBoon = (boonType: ThothBoonType, duration: number) => {
    const descriptions: Record<ThothBoonType, string> = {
      payout_boost: `Thoth's insight boosts your payouts for ${duration} rounds.`,
      luck_increase: `Thoth has skewed fate in your favor for ${duration} rounds.`,
      loss_forgiveness: `Thoth will erase ${duration} of your next losses.`,
      zeus_wrath: `Zeus's Wrath: Your next ${duration} wins are doubled!`,
      anubis_judgment: `Anubis's Judgment: Your next loss is forgiven.`,
      loki_deception: `Loki's Deception: The outcome of your next game will be swapped!`,
      hades_tithe: `Hades's Tithe: Gain a bonus from all wagers for ${duration} games.`,
      fortuna_rewrite: `Fortuna's Rewrite: You can reroll the outcome of your next loss.`,
      janus_second_chance: `Janus's Second Chance: Your next bet is free.`,
      hecate_truesight: `Hecate's Truesight: The true path will be revealed in your next game of choice.`,
      morrigan_reaping: `The Morrigan's crows will recover half your wager from your next ${duration} losses.`,
      mortal_will: `Your Mortal Will asserts itself, guaranteeing a win.`
    };
    const newBoon: TemporaryBoon = {
        type: boonType,
        turnsRemaining: duration,
        description: descriptions[boonType],
        potency: 1.5 // Example: 50% boost
    };
    setPlayerState(prev => ({
        ...prev,
        temporaryBoons: [...prev.temporaryBoons, newBoon],
    }));
  };

  const handlePersonalizeGod = (godId: string, imageBase64: string) => {
    setPlayerState(prev => ({
      ...prev,
      personalizedGods: {
        ...prev.personalizedGods,
        [godId]: imageBase64,
      }
    }));
    setOpenModal(null);
    setGodToPersonalize(null);
    audioService.play('win');
  };

  const handleWager = (amount: number): boolean => {
    if (souls >= amount) {
        setSouls(prev => prev - amount);
        updateQuestProgress('wager', amount);
        return true;
    }
    setOpenModal('exploitWarning');
    audioService.play('lose');
    return false;
  };

  const handleGameResult = (wagered: number, won: number, godId: GodId) => {
    const newSouls = souls + won;
    setSouls(newSouls);

    setSoulUpdateClass(won > 0 ? 'soul-update-win' : 'soul-update-loss');
    setTimeout(() => setSoulUpdateClass(''), 800);
      
    if (won > 0) updateQuestProgress('win', 1);
    if(selectedGame) updateQuestProgress('play_game', selectedGame.id);
      
    const godIdForInfluence = godId ?? currentGod?.id;
    if (!godIdForInfluence) {
        changeScreen('SANCTUM');
        return;
    }
  
    setPlayerState(prev => {
      const isWin = won > 0;
      const newDevotion = { ...prev.devotion };
      if (isWin) {
        newDevotion[godId] = (newDevotion[godId] || 0) + 1;
      }
      
      const newStats = { ...prev.stats };
      newStats.totalWagered += wagered;
      if (isWin) newStats.totalWins += 1;
      else newStats.totalLosses += 1;
      newStats.soulsWon += won;
      newStats.soulsLost += isWin ? 0 : wagered;

      return {
        ...prev,
        devotion: newDevotion,
        stats: newStats,
        losingStreak: isWin ? 0 : prev.losingStreak + 1,
        peakSouls: Math.max(prev.peakSouls, newSouls),
      };
    });
    changeScreen('SANCTUM');
  };

  const devToolsActions: DevToolsActions = {
    onSetSouls: setSouls,
    onAddSouls: (amount) => setSouls(s => s + amount),
    onSetDevotion: (godId, amount) => setPlayerState(p => ({...p, devotion: {...p.devotion, [godId]: amount }})),
    onCompleteAllQuests: () => setDailyQuests(prev => prev.map(q => ({ ...q, currentValue: q.targetValue, isCompleted: true }))),
    onResetPlayerState: () => {
      if (window.confirm("Are you sure? This will reset all data and reload.")) {
        localStorage.clear();
        window.location.reload();
      }
    },
  };

  const renderMainContent = () => {
    if (!hasEntered) return <IntroScreen onEnter={handleEnter} />;
    
    switch (screen) {
      case 'SANCTUM':
        return currentGod ? <Sanctum god={currentGod} playerState={playerState} onSelectGame={handleSelectGame} onNavigateToWar={handleNavigateToWar} influence={pantheonInfluence} dominantGodId={dominantGodId} onActivateUltimate={()=>{}} /> : <PantheonScreen onSelectCult={handleSelectCult} playerState={playerState} onPersonalizeClick={setGodToPersonalize} onAscendClick={() => setOpenModal('ascension')} souls={souls} />;
      case 'GAME':
        return selectedGame && currentGod ? (
            <GameScreen 
                game={selectedGame} 
                souls={souls} 
                onWager={handleWager}
                onGameResult={handleGameResult}
                god={currentGod} 
                onNavigateToSanctum={() => handleNavigateToSanctum()}
            />
        ) : null;
      case 'DASHBOARD':
        return <Dashboard playerState={playerState} pantheonInfluence={pantheonInfluence} />;
      case 'MORTAL_GAMES':
        return currentGod ? <MortalGamesScreen onSelectGame={handleSelectGame} patronGod={currentGod} /> : null;
       default:
        return <PantheonScreen onSelectCult={handleSelectCult} playerState={playerState} onPersonalizeClick={setGodToPersonalize} onAscendClick={() => setOpenModal('ascension')} souls={souls} />;
    }
  };

  return (
    <div className="bg-theme-background text-theme-base min-h-screen relative">
      <div className={`page-transition-overlay ${isTransitioning ? 'active-out' : ''}`} />
      <MythicBackground />
      {hasEntered && <Header souls={souls} onCashOutClick={() => setOpenModal('cashOut')} onReplenishClick={() => setOpenModal('soulStore')} showMenuButton={!!currentGod} onMenuClick={() => setIsNavOpen(!isNavOpen)} onThothClick={() => setOpenModal('thothAudience')} onQuestsClick={() => setOpenModal('dailyQuests')} unclaimedQuestsCount={dailyQuests.filter(q=>q.isCompleted && !q.isClaimed).length} soulUpdateClass={soulUpdateClass} onArchitectClick={() => setOpenModal('architectCommune')} onDevToolsClick={() => setIsDevToolsOpen(true)} />}
      
      <div className={isTransitioning ? 'opacity-0' : 'animate-fade-in'}>
        <div className="flex">
          {hasEntered && currentGod && <NavSidebar currentGod={currentGod} onNavigateToPantheon={handleNavigateToPantheon} onNavigateToSanctum={handleNavigateToSanctum} onNavigateToMortalGames={handleNavigateToMortalGames} onNavigateToDashboard={handleNavigateToDashboard} isOpen={isNavOpen} onClose={() => setIsNavOpen(false)} activeScreen={screen} />}
          <main className="relative z-10 flex-grow">{renderMainContent()}</main>
        </div>
      </div>

      <Footer onFairPlayClick={() => setOpenModal('exploitWarning')} playerState={playerState} />

      <CashOutModal isOpen={openModal === 'cashOut'} onClose={() => setOpenModal(null)} balance={souls} />
      <DailyBlessingModal isOpen={openModal === 'dailyBlessing'} onClose={() => { setOpenModal(null); setHasClaimedToday(true); }} onClaim={() => { setSouls(s => s + DAILY_BLESSING_AMOUNT); setOpenModal(null); setHasClaimedToday(true); audioService.play('win'); }} blessingAmount={DAILY_BLESSING_AMOUNT} />
      <DailyQuestsModal isOpen={openModal === 'dailyQuests'} onClose={() => setOpenModal(null)} quests={dailyQuests} onClaim={claimQuestReward} onClaimAll={claimAllQuests} />
      <SoulStoreModal isOpen={openModal === 'soulStore'} onClose={() => setOpenModal(null)} onPurchase={(amount) => setSouls(s => s + amount)} />
      <ExploitWarningModal isOpen={openModal === 'exploitWarning'} onClose={() => setOpenModal(null)} />
      <ThothAudienceModal isOpen={openModal === 'thothAudience'} onClose={() => setOpenModal(null)} onApplyBoon={applyThothBoon} playerState={playerState} souls={souls} />
      {godToPersonalize && <PersonalizeGodModal isOpen={openModal === 'personalize'} onClose={() => { setOpenModal(null); setGodToPersonalize(null); }} god={godToPersonalize} onPersonalize={handlePersonalizeGod} />}
      <AscensionModal isOpen={openModal === 'ascension'} onClose={() => setOpenModal(null)} onAscend={() => {}} />
      <ArchitectCommuneModal isOpen={openModal === 'architectCommune'} onClose={() => setOpenModal(null)} />
      <DivineProvidenceModal isOpen={openModal === 'providence'} onClose={() => setOpenModal(null)} onClaim={()=>{}} event={providenceEvent} />
      
      {isGazeTrackerActive && <GazeTracker onBehaviorLog={logDevEvent} />}
      {isDevLogOpen && <DevLog logs={devLogs} onClose={() => setIsDevLogOpen(false)} onClear={() => setDevLogs([])} />}
      <DevTools isOpen={isDevToolsOpen} onClose={() => setIsDevToolsOpen(false)} actions={devToolsActions} />
    </div>
  );
}

export default App;