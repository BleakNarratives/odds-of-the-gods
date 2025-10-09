import React from 'react';

interface WagerSliderProps {
    min: number;
    max: number;
    value: number;
    onChange: (value: number) => void;
    souls: number;
    color: string;
}

const WagerSlider: React.FC<WagerSliderProps> = ({ min, max, value, onChange, souls, color }) => {
    const maxWager = Math.min(max, souls);
    const isDisabled = souls < min;
    const percentage = maxWager > min ? ((value - min) / (maxWager - min)) * 100 : 0;

    const sliderStyle: React.CSSProperties = {
        '--slider-color': color,
        '--slider-percentage': `${percentage}%`,
    } as React.CSSProperties;

    return (
        <div className="w-full max-w-sm mx-auto" style={sliderStyle}>
            <div className="flex justify-between items-center text-theme-muted text-sm mb-2">
                <span>Wager</span>
                <span className="font-bold text-lg text-white">{value.toLocaleString()} Souls</span>
            </div>
            <input
                type="range"
                min={min}
                max={maxWager}
                step={Math.max(1, Math.floor((maxWager - min) / 100))}
                value={value}
                onChange={(e) => onChange(parseInt(e.target.value, 10))}
                disabled={isDisabled}
                className="wager-slider"
            />
            <div className="flex justify-between text-xs text-theme-muted mt-1">
                <span>{min}</span>
                <span>{maxWager.toLocaleString()}</span>
            </div>
            {isDisabled && <p className="text-center text-theme-loss text-sm mt-2">Not enough souls to wager.</p>}
        </div>
    );
};

export default WagerSlider;
