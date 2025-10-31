// src/components/GiftShopScreen.tsx
import React from 'react';

const GiftShopScreen: React.FC = () => {
    return (
        <div className="container mx-auto p-8 text-center">
            <h1 className="text-4xl font-bold">The Gift Shop at the End of the Universe</h1>
            <p className="text-theme-muted mt-4">Redeem your real-world winnings for cosmic trinkets and divine merchandise.</p>
            <div className="mt-8 p-10 border-2 border-dashed border-theme-border rounded-lg">
                <p className="text-slate-500">Coming soon...</p>
            </div>
        </div>
    );
};

export default GiftShopScreen;
