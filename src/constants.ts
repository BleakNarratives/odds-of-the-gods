// src/constants.ts
import { God, Game } from './types';
import * as Icons from './components/icons/MythicIcons';

// Import game components
import ZeusDice from './components/games/ZeusDice';
import HadesUnderworldRoll from './components/games/HadesUnderworldRoll';
import FortunaDice from './components/games/FortunaDice';
import LokiCardFlip from './components/games/LokiCardFlip';
import AnubisScales from './components/games/AnubisScales';
import AnubisJars from './components/games/AnubisJars';
import AmmitsGamble from './components/games/AmmitsGamble';
import HadesSlots from './components/games/HadesSlots';
import FortunaWheel from './components/games/FortunaWheel';
import JanusCoinFlip from './components/games/JanusCoinFlip';
import HecateCrossroads from './components/games/HecateCrossroads';
import MorriganProphecy from './components/games/MorriganProphecy';
import HadesRoulette from './components/games/HadesRoulette';
import SterculiusCrapShoot from './components/games/SterculiusCrapShoot';


export const PANTHEON: God[] = [
  { id: 'zeus', name: 'Zeus', title: 'King of Olympus', lore: 'The god of sky and thunder, his favor is as brilliant and fleeting as a bolt of lightning.', color: 'yellow', influence: 25 },
  { id: 'hades', name: 'Hades', title: 'Lord of the Underworld', lore: 'Ruler of the dead and all the riches below the earth. His games are grim, but the rewards are substantial.', color: 'red', influence: 20 },
  { id: 'loki', name: 'Loki', title: 'The Trickster God', lore: 'A master of deceit and illusion. Nothing is as it seems in his games of chance and cunning.', color: 'green', influence: 15 },
  { id: 'fortuna', name: 'Fortuna', title: 'Goddess of Luck', lore: 'She spins the wheel of fate, bestowing fortune and ruin with equal caprice. Her favor is sought by all.', color: 'rose', influence: 18 },
  { id: 'anubis', name: 'Anubis', title: 'The Weigher of Hearts', lore: 'Guardian of the afterlife, he judges the purity of a soul. His games are a test of worth, not just luck.', color: 'blue', influence: 12 },
  { id: 'janus', name: 'Janus', title: 'God of Beginnings & Endings', lore: 'With two faces, he sees both past and future. His games are about the duality of choice.', color: 'slate', influence: 10 },
  { id: 'hecate', name: 'Hecate', title: 'Goddess of Crossroads & Magic', lore: 'She holds the keys to the mysteries, offering choices where intuition is your only guide.', color: 'indigo', influence: 8 },
  { id: 'morrigan', name: 'Morrigan', title: 'Phantom Queen of Fate', lore: 'A harbinger of destiny, her crows carry prophecies of victory and doom.', color: 'teal', influence: 7 },
  { id: 'sterculius', name: 'Sterculius', title: 'God of Filth and Manure', lore: 'A forgotten, malodorous deity of agriculture and... waste. His games are crude, but he has a strange cult following.', color: 'amber', influence: 2 },
];

export const GAMES: Game[] = [
    { id: 'zeus-dice', name: "Olympian Dice", description: "Challenge the King of Gods. Roll higher than him to win his favor.", flavorText: "Let's see if your luck is as loud as my thunder.", godId: 'zeus', Icon: Icons.ZeusIcon, Component: ZeusDice, minBet: 50, maxBet: 5000, payoutMultiplier: 2, winChance: 0.48 },
    { id: 'hades-underworld-roll', name: "Underworld Roll", description: "Cast two dice against the Lord of the Dead. A higher roll escapes his grasp with riches. Ties go to the house.", flavorText: "The souls of the damned are my currency. Can you afford to play?", godId: 'hades', Icon: Icons.HadesIcon, Component: HadesUnderworldRoll, minBet: 100, maxBet: 10000, payoutMultiplier: 2, winChance: 0.47 },
    { id: 'hades-slots', name: "Abyssal Slots", description: "Spin the five reels of torment and treasure. Line up the souls of heroes and gods to claim a bounty from the depths.", flavorText: "Even in darkness, fortunes can be found... or lost forever.", godId: 'hades', Icon: Icons.HadesIcon, Component: HadesSlots, minBet: 20, maxBet: 2000, payoutMultiplier: 1, winChance: 0.25 },
    { id: 'hades-roulette', name: "Stygian Roulette", description: "Place your bet on the wheel of suffering. Will your number rise from the River Styx, or will it be washed away?", flavorText: "Every spin is a turn of fate in my realm.", godId: 'hades', Icon: Icons.HadesIcon, Component: HadesRoulette, minBet: 25, maxBet: 1000, payoutMultiplier: 1, winChance: 0.4 },
    { id: 'fortuna-dice', name: "Dice of Fate", description: "Roll against the Goddess of Luck herself. She may grant you the power to twist fate, for a price.", flavorText: "Fortune favors the bold. Are you bold, little mortal?", godId: 'fortuna', Icon: Icons.FortunaIcon, Component: FortunaDice, minBet: 50, maxBet: 2500, payoutMultiplier: 2, winChance: 0.49 },
    { id: 'fortuna-wheel', name: "Wheel of Fortune", description: "A classic game of chance. Spin the wheel and hope it lands on a winning segment.", flavorText: "Let's see where my wheel takes your destiny today.", godId: 'fortuna', Icon: Icons.FortunaIcon, Component: FortunaWheel, minBet: 10, maxBet: 1000, payoutMultiplier: 2, winChance: 0.4 },
    { id: 'loki-flip', name: "Loki's Gambit", description: "Loki hides a prize under one of three cups. Can you follow his trickery and find it?", flavorText: "Keep your eyes on the prize... if you can. Heh.", godId: 'loki', Icon: Icons.LokiIcon, Component: LokiCardFlip, minBet: 20, maxBet: 2000, payoutMultiplier: 3, winChance: 0.33 },
    { id: 'anubis-scales-new', name: "Weighing of the Heart", description: "Anubis weighs your wager against the feather of Ma'at. If your heart is pure (and lucky), your wager is doubled.", flavorText: "Your soul is on my scales. Let us see if it is heavy with sin.", godId: 'anubis', Icon: Icons.AnubisIcon, Component: AnubisScales, minBet: 100, maxBet: 5000, payoutMultiplier: 2, winChance: 0.5 },
    { id: 'anubis-jars-new', name: "Canopic Jars", description: "Choose one of three sacred jars. One contains the heart, the others are empty. Find the heart to triple your wager.", flavorText: "What will you find within? Preservation, or emptiness?", godId: 'anubis', Icon: Icons.AnubisIcon, Component: AnubisJars, minBet: 50, maxBet: 1500, payoutMultiplier: 3, winChance: 0.33 },
    { id: 'ammits-gamble-new', name: "Ammit's Gamble", description: "Roll a die. Fives virtues win, three sins lose. A game of attrition before the Devourer.", flavorText: "Are you virtuous enough to escape the jaws of oblivion?", godId: 'anubis', Icon: Icons.AnubisIcon, Component: AmmitsGamble, minBet: 20, maxBet: 1000, payoutMultiplier: 2.5, winChance: 0.45 },
    { id: 'janus-coin', name: "Two-Faced Coin", description: "Bet on Order or Chaos. Janus flips his coin, deciding the fate of your wager.", flavorText: "Past or future? Win or lose? It's all the same to me.", godId: 'janus', Icon: Icons.JanusIcon, Component: JanusCoinFlip, minBet: 10, maxBet: 10000, payoutMultiplier: 2, winChance: 0.495 },
    { id: 'hecate-crossroads', name: "Hecate's Crossroads", description: "Choose one of three torches at the crossroads. Only one holds the true flame.", flavorText: "Trust your intuition. Magic, or misdirection?", godId: 'hecate', Icon: Icons.HecateIcon, Component: HecateCrossroads, minBet: 20, maxBet: 2000, payoutMultiplier: 3, winChance: 0.33 },
    { id: 'morrigan-crows', name: "The Morrigan's Crows", description: "Three crows carry prophecies. One speaks of fortune, the others of ruin. Choose wisely.", flavorText: "My children see all. What fate will they share with you?", godId: 'morrigan', Icon: Icons.MorriganIcon, Component: MorriganProphecy, minBet: 20, maxBet: 2000, payoutMultiplier: 3, winChance: 0.33 },
    { id: 'sterculius-crapshoot', name: "Sterculius' Crap Shoot", description: "A foul-smelling, but straightforward game of craps. Don't think too hard about what the dice are made of.", flavorText: "Heh. Crap shoot. Get it? Just roll the damn things.", godId: 'sterculius', Icon: Icons.FlyIcon, Component: SterculiusCrapShoot, minBet: 1, maxBet: 500, payoutMultiplier: 2, winChance: 0.49 },
];


export const FATE_METER_MAX = 1000;
