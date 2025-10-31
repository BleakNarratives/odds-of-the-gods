// src/components/FeatureFlag.tsx
import React from 'react';

// This is a placeholder. In a real app, this would check a feature flag service.
const featureFlags = {
    'astral-crossroads': false,
    'elysian-derby': false,
    'gift-shop': false,
};

type Feature = keyof typeof featureFlags;

interface FeatureFlagProps {
  name: Feature;
  children: React.ReactNode;
}

const FeatureFlag: React.FC<FeatureFlagProps> = ({ name, children }) => {
  if (featureFlags[name]) {
    return <>{children}</>;
  }
  return null;
};

export default FeatureFlag;
