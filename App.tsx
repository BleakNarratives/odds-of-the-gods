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
import { Game, PantheonInfluenceState, PlayerState, God, ThothBoonType, TemporaryBoon, DailyQuest, AscendedGodDetails, ProvidenceEvent } from './types';
import { INITIAL_SOULS, INITIAL_PANTHEON_INFLUENCE, INITIAL_PLAYER_STATE, PANTHEON, GAMES, USER_GOD_TEMPLATE, QUEST_POOL } from './constants';
import { speechService } from './services/speechService';
import { audioService } from './services/audioService';

type Screen = 'PANTHEON' | 'SANCTUM' | 'GAME' | 'WAR' | 'MORTAL_GAMES' | 'CLASH';

const DAILY_BLESSING_AMOUNT = 100;
const ASCENSION_COST = 10000;

// --- Divine Providence Research Parameters ---
const PROVIDENCE_CRITICAL_LOSS_STREAK = 5;
const PROVIDENCE_SOUL_POVERTY_THRESHOLD = 0.1; // 10% of peak wealth

// --- State Persistence ---
const loadGameState = () => {
  try {
    const serializedState = localStorage.getItem('oddsOfGodsGameState');
    if (serializedState === null) {
      return undefined;
    }
    const loadedState = JSON.parse(serializedState);
    const pState = loadedState.playerState || {};
    // Ensure all nested objects that might be added later exist
    pState.personalizedGods = pState.personalizedGods || {};
    pState.hasAscended = pState.hasAscended || false;
    pState.ascendedGodDetails = pState.ascendedGodDetails || null;
    pState.losingStreak = pState.losingStreak || 0;
    pState.peakSouls = pState.peakSouls || loadedState.souls || INITIAL_SOULS;
    // Clean up deprecated fields from older versions
    delete pState.piety;
    delete pState.lastProvidenceTime;

    loadedState.playerState = pState;
    return loadedState;
  } catch (err) {
    console.error("Could not load game state", err);
    return undefined;
  }
};

const getInitialScreen = (state: any): Screen => {
  if (!state?.hasEntered) return 'PANTHEON';
  // If reloaded while in a game, reset to a safe screen
  if (state.screen === 'GAME' || state.screen === 'CLASH') {
    return 'SANCTUM';
  }
  return state.screen || 'PANTHEON';
};


function App() {
  const persistedState = useMemo(() => loadGameState(), []);

  const [hasEntered, setHasEntered] = useState(persistedState?.hasEntered ?? false);
  const [screen, setScreen] = useState<Screen>(getInitialScreen(persistedState));
  const [souls, setSouls] = useState(persistedState?.souls ?? INITIAL_SOULS);
  const [playerState, setPlayerState] = useState<PlayerState>(persistedState?.playerState ?? INITIAL_PLAYER_STATE);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [isCashOutModalOpen, setIsCashOutModalOpen] = useState(false);
  const [isDailyBlessingModalOpen, setIsDailyBlessingModalOpen] = useState(false);
  const [isDailyQuestsModalOpen, setIsDailyQuestsModalOpen] = useState(false);
  const [isSoulStoreModalOpen, setIsSoulStoreModalOpen] = useState(false);
  const [isExploitWarningModalOpen, setIsExploitWarningModalOpen] = useState(false);
  const [isThothAudienceOpen, setIsThothAudienceOpen] = useState(false);
  const [isPersonalizeModalOpen, setIsPersonalizeModalOpen] = useState(false);
  const [isAscensionModalOpen, setIsAscensionModalOpen] = useState(false);
  const [isArchitectModalOpen, setIsArchitectModalOpen] = useState(false);
  const [isProvidenceModalOpen, setIsProvidenceModalOpen] = useState(false);
  const [providenceEvent, setProvidenceEvent] = useState<ProvidenceEvent | null>(null);
  const [godToPersonalize, setGodToPersonalize] = useState<God | null>(null);
  const [pantheonInfluence, setPantheonInfluence] = useState<PantheonInfluenceState>(persistedState?.pantheonInfluence ?? INITIAL_PANTHEON_INFLUENCE);
  const [dominantGodId, setDominantGodId] = useState<string | null>(null);
  const [hasClaimedToday, setHasClaimedToday] = useState(() => new Date().toDateString() === localStorage.getItem('lastVisitDate'));
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isGazeTrackerActive, setIsGazeTrackerActive] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [dailyQuests, setDailyQuests] = useState<DailyQuest[]>([]);
  const [soulUpdateClass, setSoulUpdateClass] = useState('');
  
  // --- Game State Persistence ---
  useEffect(() => {
    if (!hasEntered) {
      // Clear old state if user is back at the intro screen
      localStorage.removeItem('oddsOfGodsGameState');
      return;
    }
    try {
      const gameState = {
        hasEntered,
        screen,
        souls,
        playerState,
        pantheonInfluence,
      };
      const serializedState = JSON.stringify(gameState);
      localStorage.setItem('oddsOfGodsGameState', serializedState);
    } catch (err) {
      console.error("Failed to save game state:", err);
    }
  }, [hasEntered, screen, souls, playerState, pantheonInfluence]);


  // --- Quest Management ---
  const generateNewQuests = useCallback(() => {
    const shuffled = [...QUEST_POOL].sort(() => 0.5 - Math.random());
    const newQuests = shuffled.slice(0, 3).map((q, index) => ({
      ...q,
      id: `${Date.now()}-${index}`,
      currentValue: 0,
      isCompleted: false,
      isClaimed: false,
    }));
    return newQuests;
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
      if (savedQuests) {
        setDailyQuests(JSON.parse(savedQuests));
      } else {
         const newQuests = generateNewQuests();
         setDailyQuests(newQuests);
         localStorage.setItem('dailyQuests', JSON.stringify(newQuests));
      }
    }
  }, [generateNewQuests]);
  
  const updateQuestProgress = useCallback((type: 'wager' | 'win' | 'play_game' | 'change_cult', value: number | string) => {
    setDailyQuests(prevQuests => {
        const updatedQuests = prevQuests.map(quest => {
            if (quest.type === type && !quest.isCompleted) {
                let newProgress = quest.currentValue;
                if (quest.type === 'play_game' && quest.meta === value) {
                    newProgress += 1;
                } else if (typeof value === 'number' && quest.type !== 'play_game') {
                    newProgress += value;
                } else if (quest.type === 'change_cult') {
                    newProgress += 1;
                }
                
                const isCompleted = newProgress >= quest.targetValue;
                return { ...quest, currentValue: newProgress, isCompleted };
            }
            return quest;
        });
        localStorage.setItem('dailyQuests', JSON.stringify(updatedQuests));
        return updatedQuests;
    });
  }, []);

  const claimQuestReward = (questId: string) => {
    setDailyQuests(prevQuests => {
      const questToClaim = prevQuests.find(q => q.id === questId);
      if (questToClaim && questToClaim.isCompleted && !questToClaim.isClaimed) {
        setSouls(s => s + questToClaim.reward);
        audioService.play('win');
        const updatedQuests = prevQuests.map(q => 
          q.id === questId ? { ...q, isClaimed: true } : q
        );
        localStorage.setItem('dailyQuests', JSON.stringify(updatedQuests));
        return updatedQuests;
      }
      return prevQuests;
    });
  };

  const claimAllQuests = () => {
    setDailyQuests(prevQuests => {
      let totalReward = 0;
      const updatedQuests = prevQuests.map(q => {
        if (q.isCompleted && !q.isClaimed) {
          totalReward += q.reward;
          return { ...q, isClaimed: true };
        }
        return q;
      });

      if (totalReward > 0) {
        setSouls(s => s + totalReward);
        audioService.play('big-win');
        localStorage.setItem('dailyQuests', JSON.stringify(updatedQuests));
      }
      return updatedQuests;
    });
  };


  // --- Core App Logic ---
  useEffect(() => {
    const unlockAudio = () => {
      speechService.unlock();
      audioService.unlock();
      audioService.playBGM();
      window.removeEventListener('click', unlockAudio);
      window.removeEventListener('touchend', unlockAudio);
    };
    window.addEventListener('click', unlockAudio);
    window.addEventListener('touchend', unlockAudio);
    return () => {
        window.removeEventListener('click', unlockAudio);
        window.removeEventListener('touchend', unlockAudio);
    };
  }, []);

  const logDevEvent = useCallback((message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`[DRONE LOG - ${timestamp}] ${message}`);
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFullscreen = !!document.fullscreenElement;
      setIsGazeTrackerActive(isFullscreen);
      logDevEvent(`Lurfy's Drone ${isFullscreen ? 'ACTIVATED' : 'DEACTIVATED'} (Fullscreen ${isFullscreen ? 'entered' : 'exited'})`);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [logDevEvent]);

  useEffect(() => {
    if (!hasEntered) return;
    if (!hasClaimedToday) {
        setIsDailyBlessingModalOpen(true);
    }
  }, [hasClaimedToday, hasEntered]);

  useEffect(() => {
    if (!pantheonInfluence) return;
    const newDominantGodId = Object.entries(pantheonInfluence).reduce((a, b) => a[1] > b[1] ? a : b)[0];
    const fullPantheon = playerState.hasAscended ? [...PANTHEON, USER_GOD_TEMPLATE] : PANTHEON;

    if (newDominantGodId && newDominantGodId !== dominantGodId) {
      const newDominantGod = fullPantheon.find(g => g.id === newDominantGodId);
      if (newDominantGod) {
        speechService.onDominionChange(newDominantGod.name);
        setDominantGodId(newDominantGodId);
      }
    }
  }, [pantheonInfluence, dominantGodId, playerState.hasAscended]);
  
  const changeScreen = useCallback((newScreen: Screen) => {
    if (screen === newScreen) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setScreen(newScreen);
      // Wait for the new screen to render, then animate it in
      setTimeout(() => setIsTransitioning(false), 50);
    }, 700); // Corresponds to cosmic-rift-out animation duration
  }, [screen]);

  const handleEnter = () => {
    audioService.play('swoosh');
    setHasEntered(true);
  };

  const handleClaimBlessing = () => {
    setSouls(prev => prev + DAILY_BLESSING_AMOUNT);
    localStorage.setItem('lastVisitDate', new Date().toDateString());
    setIsDailyBlessingModalOpen(false);
    setHasClaimedToday(true);
    audioService.play('win');
  };

  const handlePurchaseSouls = (amount: number) => {
    setSouls(prev => prev + amount);
    setIsSoulStoreModalOpen(false);
    audioService.play('win');
  };

  const handleSelectCult = (godId: string) => {
    audioService.play('swoosh');
    if (playerState.currentCultId && playerState.currentCultId !== godId) {
      speechService.onBetrayal();
      updateQuestProgress('change_cult', 1);
    }
    setPlayerState(prev => {
      const isBetrayal = prev.currentCultId && prev.currentCultId !== godId;
      const newScornful = isBetrayal
        ? [...new Set([...prev.scornfulGods, prev.currentCultId!])] 
        : prev.scornfulGods;

      const filteredScornful = newScornful.filter(id => id !== godId);
      const newScorn = isBetrayal ? prev.scorn + 100 : prev.scorn;

      return {
        ...prev,
        currentCultId: godId,
        scornfulGods: filteredScornful,
        scorn: newScorn,
      };
    });
    changeScreen('SANCTUM');
  };

  const handleSelectGame = (game: Game) => {
    audioService.play('swoosh');
    setSelectedGame(game);
    changeScreen('GAME');
  };

  const handleNavigateToSanctum = () => {
    audioService.play('click');
    setSelectedGame(null);
    changeScreen('SANCTUM');
    setIsNavOpen(false);
  };
  
  const handleNavigateToPantheon = () => {
    audioService.play('click');
    changeScreen('PANTHEON');
    setIsNavOpen(false);
  };

  const handleNavigateToWar = () => {
    audioService.play('swoosh');
    changeScreen('WAR');
    setIsNavOpen(false);
  };

  const handleBecomeChampion = () => {
      if (!currentGod || !dominantGodId || currentGod.id === dominantGodId) return;
      const devotion = playerState.devotion[currentGod.id] || 0;
      if (devotion < 1000) return; // Champion threshold
      
      audioService.play('big-win');
      changeScreen('CLASH');
  };

  const handleClashEnd = (isPlayerVictory: boolean) => {
    if (!currentGod || !dominantGodId) return;

    const winnerId = isPlayerVictory ? currentGod.id : dominantGodId;
    const loserId = isPlayerVictory ? dominantGodId : currentGod.id;

    if(isPlayerVictory) {
      setSouls(s => s + 500); // Champion's reward
      audioService.play('big-win');
    } else {
      audioService.play('lose');
    }

    setPantheonInfluence(prev => {
      const newInfluence = { ...prev };
      const influenceToShift = newInfluence[loserId] * 0.25; // 25% shift!
      
      newInfluence[loserId] = Math.max(1, newInfluence[loserId] - influenceToShift);
      newInfluence[winnerId] += influenceToShift;

      return newInfluence;
    });

    // Reset champion status by 'spending' the devotion
    setPlayerState(prev => ({
        ...prev,
        devotion: {
            ...prev.devotion,
            [currentGod.id]: 0,
        },
    }));

    changeScreen('SANCTUM');
  };

  const handleNavigateToMortalGames = () => {
    audioService.play('click');
    changeScreen('MORTAL_GAMES');
    setIsNavOpen(false);
  };

  const handleCashOut = () => {
    audioService.play('click');
    setIsCashOutModalOpen(true);
  };
  
  const handleReplenish = () => {
    audioService.play('click');
    setIsSoulStoreModalOpen(true);
  };
  
  const handleOpenThothAudience = () => {
    audioService.play('swoosh');
    setIsThothAudienceOpen(true);
  };

  const handlePersonalizeClick = (god: God) => {
    setGodToPersonalize(god);
    setIsPersonalizeModalOpen(true);
  };

  const handlePersonalizeGod = (godId: string, imageBase64: string) => {
    setPlayerState(prev => ({
      ...prev,
      personalizedGods: {
        ...prev.personalizedGods,
        [godId]: imageBase64,
      }
    }));
    setIsPersonalizeModalOpen(false);
    audioService.play('big-win');
  };
  
  const handleAscendClick = () => {
    if (souls >= ASCENSION_COST) {
        setIsAscensionModalOpen(true);
    }
  };

  const handleAscension = (details: AscendedGodDetails) => {
    setSouls(s => s - ASCENSION_COST);
    setPlayerState(prev => ({
        ...prev,
        hasAscended: true,
        ascendedGodDetails: details,
    }));
    setPantheonInfluence(prev => {
        const newInfluence = {...prev};
        const aspirantInfluence = newInfluence['aspirant'];
        delete newInfluence['aspirant'];
        newInfluence['user_god'] = aspirantInfluence;
        return newInfluence;
    });
    setIsAscensionModalOpen(false);
    audioService.play('big-win');
    speechService.speak("A mortal has seized divinity! A new power enters the Pantheon!");
  };

  const currentGod = useMemo(() => {
    if (!playerState.currentCultId) return null;
    if (playerState.currentCultId === 'user_god' && playerState.hasAscended && playerState.ascendedGodDetails) {
        return {
            ...USER_GOD_TEMPLATE,
            name: playerState.ascendedGodDetails.name,
            title: playerState.ascendedGodDetails.title,
            philosophy: playerState.ascendedGodDetails.philosophy,
        };
    }
    return PANTHEON.find(god => god.id === playerState.currentCultId) || null;
  }, [playerState.currentCultId, playerState.hasAscended, playerState.ascendedGodDetails]);


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

  const handleActivateUltimate = (godId: string) => {
    const fullPantheon = playerState.hasAscended ? [...PANTHEON, USER_GOD_TEMPLATE] : PANTHEON;
    const god = fullPantheon.find(g => g.id === godId);
    if (!god || !god.ultimate) return;

    const currentCharge = playerState.ultimateCharge[godId] || 0;
    if (currentCharge >= god.ultimate.cost) {
        audioService.play('big-win');
        applyThothBoon(god.ultimate.boonType, god.ultimate.duration);
        
        let devotionCost = 0;
        if (god.ultimate.boonType === 'mortal_will') {
            devotionCost = (playerState.devotion[god.id] || 0) * 0.20;
        }

        setPlayerState(prev => ({
            ...prev,
            ultimateCharge: {
                ...prev.ultimateCharge,
                [godId]: 0, // Reset charge
            },
            devotion: {
                ...prev.devotion,
                [god.id]: (prev.devotion[god.id] || 0) - devotionCost,
            }
        }));
    }
  };
  
 const handleClaimProvidence = () => {
    if (!providenceEvent) return;
    
    setPlayerState(prev => {
        let newBoons = [...prev.temporaryBoons];
        if (providenceEvent.boon) {
            newBoons.push(providenceEvent.boon);
        }
        return {
            ...prev,
            temporaryBoons: newBoons,
            losingStreak: 0, // Reset streak after claiming
        };
    });
    
    if (providenceEvent.soulGrant) {
        setSouls(s => s + providenceEvent.soulGrant!);
    }
    
    setIsProvidenceModalOpen(false);
    setProvidenceEvent(null);
    audioService.play('big-win');
  };

  const onGameScreenEnd = (payout: number, loss: number, game: Game, betAmount: number, volatileInfluenceShift?: { fromGodId: string, toGodId: string, amount: number }) => {
    const soulChange = payout - loss;
    const newSouls = souls + soulChange;
    setSouls(newSouls);

    setSoulUpdateClass(soulChange > 0 ? 'soul-update-win' : 'soul-update-loss');
    setTimeout(() => setSoulUpdateClass(''), 800);
    
    // Quest Progress
    updateQuestProgress('wager', betAmount);
    if (payout > 0) updateQuestProgress('win', 1);
    updateQuestProgress('play_game', game.id);

    const godIdForInfluence = game.godId ?? currentGod?.id;
    if (!godIdForInfluence) return;

    setPantheonInfluence(prev => {
      const newInfluence = { ...prev };
      const otherGods = Object.keys(newInfluence).filter(id => id !== godIdForInfluence);
      
      const influenceChange = betAmount * 0.5;
      if (payout > 0) {
        newInfluence[godIdForInfluence] = (newInfluence[godIdForInfluence] || 0) + influenceChange;
        const lossPerGod = influenceChange / otherGods.length;
        otherGods.forEach(id => {
          newInfluence[id] = Math.max(1, newInfluence[id] - lossPerGod);
        });
      } else {
        newInfluence[godIdForInfluence] = Math.max(1, newInfluence[godIdForInfluence] - influenceChange);
        const gainPerGod = influenceChange / otherGods.length;
        otherGods.forEach(id => {
          newInfluence[id] += gainPerGod;
        });
      }
      return newInfluence;
    });

    setPlayerState(prev => {
      const newDevotion = { ...prev.devotion };
      const newUltimateCharge = { ...prev.ultimateCharge };
      const devotionChange = betAmount * 0.25;
      const chargeChange = betAmount * 0.1; // Ultimate charge rate

      if(currentGod?.id) {
        newDevotion[currentGod.id] = (newDevotion[currentGod.id] || 0) + devotionChange;
        newUltimateCharge[currentGod.id] = (newUltimateCharge[currentGod.id] || 0) + chargeChange;
      }

      const updatedBoons = prev.temporaryBoons
        .map(boon => ({ ...boon, turnsRemaining: boon.turnsRemaining - 1 }))
        .filter(boon => boon.turnsRemaining > 0);
        
      const newLosingStreak = payout > loss ? 0 : prev.losingStreak + 1;
      const newPeakSouls = Math.max(prev.peakSouls, newSouls);

      return { ...prev, devotion: newDevotion, temporaryBoons: updatedBoons, ultimateCharge: newUltimateCharge, losingStreak: newLosingStreak, peakSouls: newPeakSouls };
    });
    
    // --- Divine Providence Check (Emergency Protocol Version) ---
    const updatedPlayerState = { ...playerState, losingStreak: payout > loss ? 0 : playerState.losingStreak + 1, peakSouls: Math.max(playerState.peakSouls, newSouls) };
    const isStruggling = updatedPlayerState.losingStreak >= PROVIDENCE_CRITICAL_LOSS_STREAK || (newSouls < updatedPlayerState.peakSouls * PROVIDENCE_SOUL_POVERTY_THRESHOLD);
    
    if (isStruggling && !isProvidenceModalOpen) {
        const interventions = [
            { type: 'soul_boost', godId: 'fortuna'},
            { type: 'loss_forgiveness', godId: 'anubis'},
            { type: 'payout_boost', godId: 'janus'}
        ];

        const randomIntervention = interventions[Math.floor(Math.random() * interventions.length)];
        const interveningGod = PANTHEON.find(g => g.id === randomIntervention.godId)!;
        let event: ProvidenceEvent;

        const messages: Record<string, string> = {
            fortuna: "Fortuna pities your struggle. She offers a sliver of her boundless luck to restore your essence.",
            anubis: "Anubis has weighed your repeated failures. He offers a chance to balance the scales in your favor.",
            janus: "Janus, seeing your repeated endings, offers a chance for a new, more prosperous beginning."
        };

        switch (randomIntervention.type) {
            case 'soul_boost':
                event = { god: interveningGod, message: messages[interveningGod.id], soulGrant: 50 };
                break;
            case 'loss_forgiveness':
                event = { god: interveningGod, message: messages[interveningGod.id], boon: { type: 'anubis_judgment', turnsRemaining: 1, description: "Your next loss will be forgiven.", potency: 1 } };
                break;
            default: // payout_boost
                event = { god: interveningGod, message: messages[interveningGod.id], boon: { type: 'payout_boost', turnsRemaining: 3, description: "Your next 3 payouts are increased.", potency: 1.5 } };
                break;
        }
         setProvidenceEvent(event);
         setIsProvidenceModalOpen(true);
    }


     if(volatileInfluenceShift) {
        setPantheonInfluence(prev => {
            const newInfluence = {...prev};
            newInfluence[volatileInfluenceShift.fromGodId] = Math.max(1, newInfluence[volatileInfluenceShift.fromGodId] - volatileInfluenceShift.amount);
            newInfluence[volatileInfluenceShift.toGodId] = (newInfluence[volatileInfluenceShift.toGodId] || 0) + volatileInfluenceShift.amount;
            return newInfluence;
        });
    }
    
    // Navigate back to sanctum after game ends
    changeScreen('SANCTUM');
  }


  const renderMainContent = () => {
    const fullPantheon = playerState.hasAscended ? [...PANTHEON, USER_GOD_TEMPLATE] : PANTHEON;

    if (!currentGod) {
      // This case should only be hit when screen is PANTHEON
      return <PantheonScreen onSelectCult={handleSelectCult} playerState={playerState} onPersonalizeClick={handlePersonalizeClick} onAscendClick={handleAscendClick} souls={souls} />;
    }
    switch (screen) {
      case 'SANCTUM':
        return <Sanctum god={currentGod} playerState={playerState} onSelectGame={handleSelectGame} onNavigateToWar={handleNavigateToWar} influence={pantheonInfluence} dominantGodId={dominantGodId} onActivateUltimate={handleActivateUltimate} />;
      case 'GAME':
        if (!selectedGame) {
          // This can happen if the page is reloaded.
          // We redirect to sanctum in getInitialScreen, but as a fallback:
          changeScreen('SANCTUM');
          return null;
        }
        return <GameScreen game={selectedGame} souls={souls} onGameEnd={onGameScreenEnd} playerState={playerState} patronGod={currentGod} dominantGodId={dominantGodId} onBackToSanctum={handleNavigateToSanctum} />;
      case 'WAR':
        return <GodsOfWar playerState={playerState} influence={pantheonInfluence} onReturnToSanctum={handleNavigateToSanctum} patronGod={currentGod} onBecomeChampion={handleBecomeChampion} />;
      case 'CLASH':
        const dominantGod = fullPantheon.find(g => g.id === dominantGodId);
        if (!dominantGod) return null; // Should not happen
        return <ClashOfChampions patronGod={currentGod} enemyGod={dominantGod} onClashEnd={handleClashEnd} />;
      case 'MORTAL_GAMES':
        return <MortalGamesScreen onSelectGame={handleSelectGame} patronGod={currentGod} />;
      case 'PANTHEON':
      default:
        return <PantheonScreen onSelectCult={handleSelectCult} playerState={playerState} onPersonalizeClick={handlePersonalizeClick} onAscendClick={handleAscendClick} souls={souls} />;
    }
  };

  const showSidebar = !!currentGod;
  const unclaimedQuests = dailyQuests.filter(q => q.isCompleted && !q.isClaimed).length;

  if (!hasEntered) {
    return (
        <>
            <MythicBackground />
            <IntroScreen onEnter={handleEnter} />
        </>
    );
  }

  return (
    <div className="bg-theme-background text-theme-base min-h-screen relative">
      <div className={`page-transition-overlay ${isTransitioning ? 'active-out' : ''}`}></div>
      <MythicBackground />
      <Header 
        souls={souls}
        onCashOutClick={handleCashOut} 
        onReplenishClick={handleReplenish}
        showMenuButton={showSidebar}
        onMenuClick={() => setIsNavOpen(!isNavOpen)}
        onThothClick={handleOpenThothAudience}
        onQuestsClick={() => setIsDailyQuestsModalOpen(true)}
        unclaimedQuestsCount={unclaimedQuests}
        soulUpdateClass={soulUpdateClass}
        onArchitectClick={() => setIsArchitectModalOpen(true)}
      />
      
      <div className={isTransitioning ? 'opacity-0' : 'animate-fade-in'}>
        {!showSidebar ? (
          <main className="relative z-10">
            <PantheonScreen onSelectCult={handleSelectCult} playerState={playerState} onPersonalizeClick={handlePersonalizeClick} onAscendClick={handleAscendClick} souls={souls} />
          </main>
        ) : (
          <div className="flex">
            <NavSidebar 
              currentGod={currentGod!} 
              onNavigateToPantheon={handleNavigateToPantheon}
              onNavigateToSanctum={handleNavigateToSanctum}
              onNavigateToMortalGames={handleNavigateToMortalGames}
              isOpen={isNavOpen}
              onClose={() => setIsNavOpen(false)}
              activeScreen={screen}
            />
            <main className="relative z-10 flex-grow">
              {renderMainContent()}
            </main>
          </div>
        )}
      </div>

      <Footer onFairPlayClick={() => setIsExploitWarningModalOpen(true)} playerState={playerState} />

      <CashOutModal isOpen={isCashOutModalOpen} onClose={() => setIsCashOutModalOpen(false)} balance={souls} />
      <DailyBlessingModal 
        isOpen={isDailyBlessingModalOpen} 
        onClose={() => {
            setIsDailyBlessingModalOpen(false);
            localStorage.setItem('lastVisitDate', new Date().toDateString());
            setHasClaimedToday(true);
        }}
        onClaim={handleClaimBlessing}
        blessingAmount={DAILY_BLESSING_AMOUNT}
      />
      <DailyQuestsModal
        isOpen={isDailyQuestsModalOpen}
        onClose={() => setIsDailyQuestsModalOpen(false)}
        quests={dailyQuests}
        onClaim={claimQuestReward}
        onClaimAll={claimAllQuests}
      />
      <SoulStoreModal
        isOpen={isSoulStoreModalOpen}
        onClose={() => setIsSoulStoreModalOpen(false)}
        onPurchase={handlePurchaseSouls}
      />
      <ExploitWarningModal 
        isOpen={isExploitWarningModalOpen}
        onClose={() => setIsExploitWarningModalOpen(false)}
      />
      <ThothAudienceModal
        isOpen={isThothAudienceOpen}
        onClose={() => setIsThothAudienceOpen(false)}
        onApplyBoon={applyThothBoon}
        playerState={playerState}
        souls={souls}
      />
      {godToPersonalize && (
        <PersonalizeGodModal
            isOpen={isPersonalizeModalOpen}
            onClose={() => setIsPersonalizeModalOpen(false)}
            god={godToPersonalize}
            onPersonalize={handlePersonalizeGod}
        />
      )}
      <AscensionModal
        isOpen={isAscensionModalOpen}
        onClose={() => setIsAscensionModalOpen(false)}
        onAscend={handleAscension}
      />
       <ArchitectCommuneModal
        isOpen={isArchitectModalOpen}
        onClose={() => setIsArchitectModalOpen(false)}
      />
       <DivineProvidenceModal
        isOpen={isProvidenceModalOpen}
        onClose={() => setIsProvidenceModalOpen(false)}
        onClaim={handleClaimProvidence}
        event={providenceEvent}
       />
      
      {isGazeTrackerActive && <GazeTracker onBehaviorLog={logDevEvent} />}
    </div>
  );
}

export default App;