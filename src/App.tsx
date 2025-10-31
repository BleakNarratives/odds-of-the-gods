// src/App.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { God, Game, PlayerState, GodId, Quest, ThothBoonType, Boon, DevLogEntry, ClashChallenge, Stance } from './types';
import { PANTHEON, GAMES } from './constants';
import { audioService } from './services/audioService';
import { speechService } from './services/speechService';
import IntroScreen from './components/IntroScreen';
import PantheonScreen from './components/PantheonScreen';
import SanctumScreen from './components/SanctumScreen';
import GameScreen from './GameScreen';
import Header from './components/Header';
import Footer from './components/Footer';
import MythicBackground from './components/MythicBackground';
import CashOutModal from './components/CashOutModal';
import SoulStoreModal from './components/SoulStoreModal';
import DailyBlessingModal from './components/DailyBlessingModal';
import ExploitWarningModal from './components/ExploitWarningModal';
import { ThothAudienceModal } from './components/ThothAudienceModal';
import NavSidebar from './components/NavSidebar';
import DailyQuestsModal from './components/DailyQuestsModal';
import ArchitectCommuneModal from './components/ArchitectCommuneModal';
import DevTools from './components/DevTools';
import AscensionModal from './components/AscensionModal';
import AccountScreen from './components/AccountScreen';
import SaveStateModal from './components/SaveStateModal';

type Screen = 'intro' | 'pantheon' | 'sanctum' | 'game' | 'account' | 'clash';

const App: React.FC = () => {
    const [screen, setScreen] = useState<Screen>('intro');
    const [activeGod, setActiveGod] = useState<God | null>(null);
    const [activeGame, setActiveGame] = useState<Game | null>(null);
    const [souls, setSouls] = useState(1000);
    const [soulUpdateClass, setSoulUpdateClass] = useState('');
    const [isCashOutOpen, setIsCashOutOpen] = useState(false);
    const [isSoulStoreOpen, setIsSoulStoreOpen] = useState(false);
    const [isDailyBlessingOpen, setIsDailyBlessingOpen] = useState(false);
    const [isExploitWarningOpen, setIsExploitWarningOpen] = useState(false);
    const [isThothAudienceOpen, setIsThothAudienceOpen] = useState(false);
    const [isNavSidebarOpen, setIsNavSidebarOpen] = useState(false);
    const [isQuestsOpen, setIsQuestsOpen] = useState(false);
    const [isArchitectCommuneOpen, setIsArchitectCommuneOpen] = useState(false);
    const [isDevToolsOpen, setIsDevToolsOpen] = useState(false);
    const [isAscensionModalOpen, setIsAscensionModalOpen] = useState(false);
    const [hasSaveState, setHasSaveState] = useState<boolean | null>(null);


    const initialPlayerState: PlayerState = {
        name: 'Mortal',
        accountTier: 'Mortal',
        currentCultId: null,
        godProgress: PANTHEON.reduce((acc, god) => ({ ...acc, [god.id]: { devotion: 0, gamesWon: 0 } }), {} as Record<GodId, { devotion: number, gamesWon: number }> ),
        activeBoons: [],
        quests: [],
        lastDailyBlessing: null,
        gamesPlayed: 0,
        totalWagered: 0,
        totalWon: 0,
        cheaterPoints: 0,
        hasSeenExploitWarning: false,
        clashes: [],
        fateMeter: 0,
        customGameAssets: {},
        psychicProfile: { dominance: 50, intuition: 50, aggression: 50 },
    };

    const [playerState, setPlayerState] = useState<PlayerState>(initialPlayerState);

    // Dev Log State
    const [devLogs, setDevLogs] = useState<DevLogEntry[]>([]);
    const logDevEvent = useCallback((message: string | any, data?: any) => {
        const timestamp = new Date().toLocaleTimeString();
        const entry = { timestamp, message: data ? { message, ...data } : message };
        setDevLogs(prev => [...prev, entry]);
    }, []);

    const handleEnter = () => {
        audioService.unlock();
        speechService.unlock();
        audioService.play('swoosh');
        audioService.playBGM();

        if (localStorage.getItem('gameState_souls')) {
            setHasSaveState(true);
        } else {
            setHasSaveState(false);
            setScreen('pantheon');
            checkDailyBlessing();
        }
    };

    const loadGameState = () => {
        const savedSouls = localStorage.getItem('gameState_souls');
        const savedPlayerState = localStorage.getItem('gameState_playerState');
        if (savedSouls && savedPlayerState) {
            setSouls(JSON.parse(savedSouls));
            setPlayerState(JSON.parse(savedPlayerState));
            logDevEvent("Game state loaded from localStorage.");
        }
        setHasSaveState(false);
        setScreen('pantheon');
    };

    const flushGameState = () => {
        localStorage.removeItem('gameState_souls');
        localStorage.removeItem('gameState_playerState');
        setSouls(1000);
        setPlayerState(initialPlayerState);
        logDevEvent("Game state flushed. Starting fresh.");
        setHasSaveState(false);
        setScreen('pantheon');
    };

    useEffect(() => {
        const saveState = () => {
            if (screen !== 'intro') {
                localStorage.setItem('gameState_souls', JSON.stringify(souls));
                localStorage.setItem('gameState_playerState', JSON.stringify(playerState));
            }
        };
        window.addEventListener('beforeunload', saveState);
        return () => {
            window.removeEventListener('beforeunload', saveState);
        };
    }, [souls, playerState, screen]);


    const checkDailyBlessing = () => {
        const today = new Date().toISOString().split('T')[0];
        if (playerState.lastDailyBlessing !== today) {
            setTimeout(() => setIsDailyBlessingOpen(true), 1500);
        }
    };

    const handleClaimBlessing = () => {
        const amount = 250;
        updateSouls(amount);
        const today = new Date().toISOString().split('T')[0];
        setPlayerState(p => ({ ...p, lastDailyBlessing: today }));
        setIsDailyBlessingOpen(false);
    };

    const updateSouls = (amount: number) => {
        setSouls(prev => {
            const newSouls = prev + amount;
            setSoulUpdateClass(amount > 0 ? 'text-theme-win' : 'text-theme-loss');
            setTimeout(() => setSoulUpdateClass(''), 1000);
            return newSouls;
        });
    };

    const handleWager = (amount: number): boolean => {
        if (souls < amount) {
            return false;
        }
        updateSouls(-amount);
        setPlayerState(p => ({ ...p, totalWagered: p.totalWagered + amount }));
        return true;
    };
    
    const handleGameResult = (wagered: number, won: number, godId: GodId, isCheating: boolean, wasCaught: boolean) => {
        const net = won - wagered;
        if (won > 0) {
            updateSouls(won);
        }

        setPlayerState(p => {
            const newProgress = { ...p.godProgress[godId] };
            if (won > wagered) {
                newProgress.devotion += 5;
                newProgress.gamesWon += 1;
            } else {
                newProgress.devotion = Math.max(0, newProgress.devotion - 1);
            }

            return {
                ...p,
                gamesPlayed: p.gamesPlayed + 1,
                totalWon: p.totalWon + won,
                godProgress: {
                    ...p.godProgress,
                    [godId]: newProgress
                }
            }
        });
    };

    const handleApplyBoon = (boonType: ThothBoonType, duration: number) => {
        const newBoon: Boon = { type: boonType, duration, potency: 1.5 }; // Example potency
        setPlayerState(p => ({ ...p, activeBoons: [...p.activeBoons, newBoon] }));
        logDevEvent(`Thoth granted boon: ${boonType} for ${duration} rounds.`);
    };
    
    const onSelectGod = (god: God) => {
        setActiveGod(god);
        setScreen('sanctum');
    };
    
    const onNavigateToGame = (game: Game) => {
        setActiveGame(game);
        setScreen('game');
    };

    const onJoinCult = (godId: GodId) => {
        setPlayerState(p => ({ ...p, currentCultId: godId }));
    }

    const onRaveToggle = () => {
      // Easter egg
    }

    const renderScreen = () => {
        switch (screen) {
            case 'intro':
                return <IntroScreen onEnter={handleEnter} />;
            case 'pantheon':
                return <PantheonScreen onSelectGod={onSelectGod} playerState={playerState} />;
            case 'sanctum':
                if (!activeGod) return <PantheonScreen onSelectGod={onSelectGod} playerState={playerState} />;
                return <SanctumScreen 
                            god={activeGod} 
                            onNavigateToHome={() => setScreen('pantheon')}
                            onNavigateToGame={onNavigateToGame}
                            onJoinCult={onJoinCult}
                            currentCultId={playerState.currentCultId}
                            devotionLevel={Math.floor(playerState.godProgress[activeGod.id].devotion / 20)}
                        />;
            case 'game':
                if (!activeGod || !activeGame) return <PantheonScreen onSelectGod={onSelectGod} playerState={playerState} />;
                return <GameScreen 
                            god={activeGod} 
                            game={activeGame}
                            souls={souls}
                            onNavigateToSanctum={() => setScreen('sanctum')}
                            onWager={handleWager}
                            onGameResult={handleGameResult}
                            playerState={playerState}
                            setPlayerState={setPlayerState}
                        />;
            case 'account':
                return <AccountScreen playerState={playerState} souls={souls} />;
            default:
                return <IntroScreen onEnter={handleEnter} />;
        }
    };
    
    return (
        <div className="bg-theme-background text-white min-h-screen font-sans">
            <MythicBackground />
            {screen !== 'intro' && (
                <Header 
                    souls={souls} 
                    onCashOutClick={() => setIsCashOutOpen(true)}
                    onReplenishClick={() => setIsSoulStoreOpen(true)}
                    showMenuButton={true}
                    onMenuClick={() => setIsNavSidebarOpen(true)}
                    onThothClick={() => setIsThothAudienceOpen(true)}
                    onQuestsClick={() => setIsQuestsOpen(true)}
                    unclaimedQuestsCount={playerState.quests.filter(q => q.progress >= q.target && !q.isClaimed).length}
                    soulUpdateClass={soulUpdateClass}
                    onArchitectClick={() => setIsArchitectCommuneOpen(true)}
                    onDevToolsClick={() => setIsDevToolsOpen(prev => !prev)}
                    onSurveyClick={() => {}}
                    isSurveyAvailable={false}
                    onRaveToggle={onRaveToggle}
                />
            )}
            <main className="relative z-10">
                {renderScreen()}
            </main>
            {screen !== 'intro' && <Footer />}

            {/* Modals */}
            <CashOutModal isOpen={isCashOutOpen} onClose={() => setIsCashOutOpen(false)} balance={souls} />
            <SoulStoreModal isOpen={isSoulStoreOpen} onClose={() => setIsSoulStoreOpen(false)} onPurchase={updateSouls} />
            <DailyBlessingModal isOpen={isDailyBlessingOpen} onClose={() => setIsDailyBlessingOpen(false)} onClaim={handleClaimBlessing} blessingAmount={250} />
            <ExploitWarningModal isOpen={isExploitWarningOpen} onClose={() => setIsExploitWarningOpen(false)} />
            <ThothAudienceModal isOpen={isThothAudienceOpen} onClose={() => setIsThothAudienceOpen(false)} onApplyBoon={handleApplyBoon} playerState={playerState} souls={souls} />
            <NavSidebar isOpen={isNavSidebarOpen} onClose={() => setIsNavSidebarOpen(false)} onNavigate={(s: Screen) => { setScreen(s); setIsNavSidebarOpen(false); }} onCashOutClick={() => {setIsCashOutOpen(true); setIsNavSidebarOpen(false);}} onReplenishClick={() => {setIsSoulStoreOpen(true); setIsNavSidebarOpen(false);}}/>
            <DailyQuestsModal isOpen={isQuestsOpen} onClose={() => setIsQuestsOpen(false)} playerState={playerState} setPlayerState={setPlayerState} onClaimReward={updateSouls} />
            <ArchitectCommuneModal isOpen={isArchitectCommuneOpen} onClose={() => setIsArchitectCommuneOpen(false)} logDevEvent={logDevEvent} />
            <AscensionModal isOpen={isAscensionModalOpen} onClose={() => setIsAscensionModalOpen(false)} tier="Demigod" />
            
            {hasSaveState && <SaveStateModal onContinue={loadGameState} onFlush={flushGameState} />}

            {isDevToolsOpen && <DevTools playerState={playerState} setPlayerState={setPlayerState} souls={souls} setSouls={setSouls} logDevEvent={logDevEvent} devLogs={devLogs} onClearLogs={() => setDevLogs([])} />}

        </div>
    );
};

export default App;
