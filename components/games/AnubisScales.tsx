import React, { useState } from 'react';
import { GameComponentProps } from '../../types';
import GameWrapper from './GameWrapper';
import { audioService } from '../../services/audioService';

const AnubisScales: React.FC<GameComponentProps> = ({ god, wager, onWager, onGameResult }) => {
    const [wagerAmount, setWagerAmount] = useState(100);
    const [result, setResult] = useState<'win' | 'loss' | null>(null);
    const [isWeighing, setIsWeighing] = useState(false);

    const primaryColor = '#2563eb';

    const handleWeighSouls = () => {
        if (isWeighing || wagerAmount > wager) return;

        if (!onWager(wagerAmount)) {
            setResult('loss'); // Technically shouldn't happen, but good practice
            return;
        }

        setIsWeighing(true);
        audioService.play('suspense');

        setTimeout(() => {
            const isWin = Math.random() < 0.5; // 50% chance
            const winAmount = isWin ? wagerAmount * 2 : 0;
            
            onGameResult(wagerAmount, winAmount, god.id);
            setResult(isWin ? 'win' : 'loss');
            
            audioService.stop('suspense');
            audioService.play(isWin ? 'win' : 'lose');
            
            setIsWeighing(false);
        }, 3000); // 3-second dramatic pause
    };

    const handlePlayAgain = () => {
        setResult(null);
        setWagerAmount(100);
    };

    if (result) {
        return (
            <GameWrapper god={god}>
                <div className="text-center animate-fade-in flex flex-col items-center justify-center min-h-[300px]">
                    <h2 className={`text-5xl font-bold mb-4 ${result === 'win' ? 'text-theme-win' : 'text-theme-loss'}`}>
                        {result === 'win' ? 'Your Soul is Pure' : 'Your Soul is Heavy'}
                    </h2>
                    <p className="text-xl text-theme-muted mb-8">
                        {result === 'win' ? `You have won ${(wagerAmount * 2).toLocaleString()} souls.` : 'The Devourer claims your offering.'}
                    </p>
                    <button
                        onClick={handlePlayAgain}
                        className="py-3 px-8 text-lg font-bold rounded-lg shimmer-button"
                        style={{ backgroundColor: primaryColor, color: 'var(--color-background)' }}
                    >
                        Face Judgment Again
                    </button>
                </div>
            </GameWrapper>
        );
    }

    return (
        <GameWrapper god={god}>
            <div className="text-center flex flex-col items-center justify-center">
                <p className="text-theme-muted mb-6 max-w-md mx-auto">
                    Offer a portion of your essence. If your wager is found pure against the Feather of Ma'at, your reward will be doubled. If not, it will be consumed by the void.
                </p>

                <div className="my-8">
                    <label className="block text-theme-muted mb-2">Wager (Souls)</label>
                    <input
                        type="number"
                        min="10"
                        step="10"
                        value={wagerAmount}
                        onChange={(e) => setWagerAmount(Math.max(10, Math.min(wager, parseInt(e.target.value) || 0)))}
                        disabled={isWeighing}
                        className="w-48 text-center p-3 text-2xl font-bold rounded-lg bg-theme-surface border-2 border-theme-border focus:border-theme-primary transition duration-300 text-theme-secondary"
                    />
                </div>
                
                <button
                    onClick={handleWeighSouls}
                    disabled={isWeighing || wagerAmount <= 0 || wagerAmount > wager}
                    className="w-full max-w-sm py-4 text-2xl font-extrabold rounded-xl transition duration-300 transform disabled:opacity-50 disabled:cursor-not-allowed hover:scale-102 active:scale-98 shimmer-button"
                    style={{ backgroundColor: primaryColor, color: 'var(--color-background)', textShadow: '0 0 5px #000000' }}
                >
                    {isWeighing ? 'WEIGHING...' : `WAGER ${wagerAmount.toLocaleString()} SOULS`}
                </button>
            </div>
        </GameWrapper>
    );
};

export default AnubisScales;
