import { Game, God, PantheonInfluenceState, PlayerState, DailyQuest } from './types';
import {
  AnubisIcon,
  FortunaIcon,
  HadesIcon,
  JanusIcon,
  LokiIcon,
  ZeusIcon,
  HecateIcon,
  MorriganIcon,
  CrownIcon,
  AnchorIcon,
  CardsIcon,
  AspirantIcon,
  AmbitionIcon,
  LegacyIcon,
  CreativityIcon,
} from './components/icons/MythicIcons';

export const USER_GOD_TEMPLATE: God = {
    id: 'user_god',
    name: 'The Ascended',
    title: 'Mortal Who Became Myth',
    lore: 'A mortal soul, through sheer will and an unfathomable hoard of souls, has carved their own place among the divine. Their legend is now written in the stars.',
    philosophy: 'Destiny is not a gift, but a prize to be seized.',
    color: 'primary', // A unique color
    globalEffectDescription: "A Mortal's Will: All 'Mortal' games have slightly better odds.",
    boons: [
        { devotionThreshold: 100, description: 'Boon of Ambition: Small chance on a loss for a partial refund of your wager.', effect: (payout, bet) => payout === 0 && Math.random() < 0.1 ? { modifiedPayout: bet * 0.5, message: "Your ambition refuses to accept this defeat." } : { modifiedPayout: payout, message: "" }},
        { devotionThreshold: 250, description: 'Boon of Creativity: Wins have a small chance to be slightly increased.', effect: (payout, bet) => payout > 0 && Math.random() < 0.15 ? { modifiedPayout: payout * 1.1, message: "A spark of inspiration enhances your reward." } : { modifiedPayout: payout, message: "" }}
    ],
    calamity: { triggerChance: 0.1, description: 'Curse of Hubris: Your mortal origins show; a win is reduced as the elder gods demand tribute.', effect: (payout, bet) => payout > 0 ? { modifiedPayout: payout * 0.8, message: "The old gods remind you of your place." } : { modifiedPayout: payout, message: "" }},
    ultimate: { name: "Mortal Will", description: "Force the outcome of your next game to be a win. This act of defiance costs 20% of your current Devotion to yourself.", cost: 1000, boonType: 'mortal_will', duration: 1 }
};


export const ASPIRANT_GOD: God = {
    id: 'aspirant',
    name: 'The Aspirant',
    title: 'Heir to Divinity',
    lore: 'A space in the pantheon remains vacant, a throne waiting for a mortal whose will is strong enough to seize it. This could be you.',
    philosophy: 'The greatest risk is to not take one at all.',
    color: 'secondary',
    globalEffectDescription: 'The throne is empty. The cosmos awaits a new ruler.',
    boons: [],
    calamity: { triggerChance: 0, description: '', effect: (p, b) => ({modifiedPayout: p, message: ''})},
    ultimate: { name: "Ascension", description: "Attain 10,000 Souls to claim this throne.", cost: 99999, boonType: 'payout_boost', duration: 0 }
};

export const PANTHEON: God[] = [
  {
    id: 'anubis',
    name: 'Anubis, Steward of Z',
    title: 'The Weigher of Hearts',
    lore: "At the behest of his eternal friend and patron, Z, Anubis has returned to the pantheon. He now weighs souls not against a feather, but against the principles of Z's grand design, ensuring the cosmic balance aligns with a new, inscrutable will.",
    philosophy: 'The heart reveals all. In the final judgment, there is no room for deceit, only the pure, unvarnished truth of the soul.',
    color: 'blue',
    globalEffectDescription: 'Order Reigns: All games have a slightly higher chance to win, but payouts are reduced.',
    boons: [
        { devotionThreshold: 100, description: 'Boon of Stability: Small losses are sometimes forgiven.', effect: (payout, bet) => payout === 0 && Math.random() < 0.1 ? { modifiedPayout: bet, message: "Anubis has balanced the scales, returning your stake." } : { modifiedPayout: payout, message: "" }},
        { devotionThreshold: 250, description: 'Boon of Judgement: Payouts are slightly increased.', effect: (payout, bet) => payout > 0 ? { modifiedPayout: payout * 1.05, message: "Your worth is proven. Anubis grants a bonus." } : { modifiedPayout: payout, message: "" }}
    ],
    calamity: { triggerChance: 0.1, description: 'Curse of Burden: A random portion of a win is confiscated as a tithe to the underworld.', effect: (payout, bet) => payout > 0 ? { modifiedPayout: payout * 0.75, message: "Anubis claims his due from your reckless win." } : { modifiedPayout: payout, message: "" }},
    ultimate: { name: "Final Judgment", description: "Your next loss is guaranteed to be forgiven, and your full wager returned.", cost: 1000, boonType: 'anubis_judgment', duration: 1 }
  },
   {
    id: 'hades',
    name: 'Hades',
    title: 'The Inevitable',
    lore: 'Hades, master of the underworld, sees all souls as eventual assets. He offers bargains to the desperate, knowing that all debts are eventually paid.',
    philosophy: 'Wealth is temporary, but debt is eternal. Play with my funds, mortal. The price is a small one... for now.',
    color: 'red',
    globalEffectDescription: 'Inevitable Debt: Players can take loans from Hades, but he will garnish a large portion of winnings until the debt is paid.',
    boons: [
        { devotionThreshold: 100, description: 'Boon of the Banker: Interest on your debt to Hades is slightly lower.', effect: (payout, bet) => ({ modifiedPayout: payout, message: "" }) }, // Handled in loan system
        { devotionThreshold: 250, description: "Boon of Envy: Small chance to steal a fraction of another player's (simulated) large win.", effect: (payout, bet) => payout > 0 && Math.random() < 0.05 ? { modifiedPayout: payout + 50, message: "Hades funnels the despair of another's loss into your pockets." } : { modifiedPayout: payout, message: "" }}
    ],
    calamity: { triggerChance: 0.1, description: 'Curse of Tartarus: A large win is immediately confiscated to pay off a larger portion of your debt.', effect: (payout, bet) => payout > 0 ? { modifiedPayout: 0, message: "Hades claims your entire win as tribute. Your debt shrinks, but your pockets are empty." } : { modifiedPayout: payout, message: "" }},
    ultimate: { name: "Soul Tithe", description: "For your next 5 games, gain a bonus 10% of your wager back, win or lose.", cost: 1200, boonType: 'hades_tithe', duration: 5 }
  },
  {
    id: 'fortuna',
    name: 'Fortuna',
    title: 'The Spinner of Fates',
    lore: 'Fortuna thrives on the thrill of the unknown. She rewards those who embrace pure luck and turn their fate over to her whims.',
    philosophy: 'Destiny is not written. It is spun. Embrace the chaos, for in uncertainty lies true opportunity.',
    color: 'rose',
    globalEffectDescription: 'Chaos Reigns: All games have a slightly lower chance to win, but a chance for a random soul jackpot on any wager.',
    boons: [
        { devotionThreshold: 100, description: 'Boon of Chance: You can sometimes win on a loss.', effect: (payout, bet) => payout === 0 && Math.random() < 0.05 ? { modifiedPayout: bet * 2, message: "Fortuna has spun the wheel in your favor unexpectedly!" } : { modifiedPayout: payout, message: "" }},
        { devotionThreshold: 250, description: 'Boon of Fortune: A chance for a jackpot payout on any win.', effect: (payout, bet) => payout > 0 && Math.random() < 0.02 ? { modifiedPayout: payout * 5, message: "JACKPOT! Fortuna's blessing rains upon you!" } : { modifiedPayout: payout, message: "" }}
    ],
    calamity: { triggerChance: 0.1, description: 'Curse of Misfortune: A win is turned into a loss as the wheel of fate turns against you.', effect: (payout, bet) => payout > 0 ? { modifiedPayout: 0, message: "Fortuna laughs as your luck runs dry." } : { modifiedPayout: payout, message: "" }},
    ultimate: { name: "Destiny Rewritten", description: "Activate this to reroll the outcome of your next loss.", cost: 1500, boonType: 'fortuna_rewrite', duration: 1 }
  },
  {
    id: 'janus',
    name: 'Janus',
    title: 'The Two-Faced',
    lore: 'Janus sees only beginnings and ends, choices and consequences. He respects bold decisions and the willingness to risk it all on a single outcome.',
    philosophy: 'Every moment is a doorway. Choose your path with conviction, for hesitation is the only true loss.',
    color: 'slate',
    globalEffectDescription: 'Thresholds are Sacred: All wagers have a small chance to be fully refunded on a loss.',
    boons: [
        { devotionThreshold: 100, description: 'Boon of Two Paths: On a win, you have a chance to double your winnings.', effect: (payout, bet) => payout > 0 && Math.random() < 0.1 ? { modifiedPayout: payout * 2, message: "Janus reveals the second face of victory!" } : { modifiedPayout: payout, message: "" }},
        { devotionThreshold: 250, description: 'Boon of Beginnings: The first bet of a session has a higher chance to win.', effect: (payout, bet) => ({ modifiedPayout: payout, message: "" }) } // Note: This effect would be handled in game logic
    ],
    calamity: { triggerChance: 0.1, description: 'Curse of Indecision: Your bet is halved, as are your potential winnings.', effect: (payout, bet) => ({ modifiedPayout: payout / 2, message: "Janus punishes your disloyalty. Your conviction falters." }) },
    ultimate: { name: "Second Chance", description: "Your next wager is free. Place a bet, and the souls will be refunded instantly.", cost: 800, boonType: 'janus_second_chance', duration: 1 }
  },
  {
    id: 'loki',
    name: 'Loki',
    title: 'The Trickster',
    lore: 'Loki is an agent of chaos. He delights in upsetting the established order and rewards cunning, high-risk plays that sow discord among his peers.',
    philosophy: 'The predictable world is a cage. True freedom is found in the unexpected, the clever lie, the game-changing prank.',
    color: 'green',
    globalEffectDescription: 'Mischief Reigns: All wins have a small chance of being nullified, and all losses have a small chance of becoming wins.',
    boons: [
        { devotionThreshold: 100, description: "Boon of Mischief: Losses have a chance to be refunded 'as a prank'.", effect: (payout, bet) => payout === 0 && Math.random() < 0.15 ? { modifiedPayout: bet, message: "Loki finds your loss hilarious and returns your stake." } : { modifiedPayout: payout, message: "" }},
        { devotionThreshold: 250, description: "Boon of Deception: A chance to steal a small bonus from another god's influence on a win.", effect: (payout, bet) => payout > 0 && Math.random() < 0.2 ? { modifiedPayout: payout + 25, message: "Loki siphons some belief from the pantheon for you." } : { modifiedPayout: payout, message: "" }}
    ],
    calamity: { triggerChance: 0.15, description: 'Curse of Betrayal: A portion of your winnings are given to the god you are playing against.', effect: (payout, bet) => payout > 0 ? { modifiedPayout: payout * 0.5, message: "Loki laughs as he gives your winnings away." } : { modifiedPayout: payout, message: "" }},
    ultimate: { name: "Grand Deception", description: "The outcome of your next game is secretly swapped (a win becomes a loss, a loss becomes a win).", cost: 1300, boonType: 'loki_deception', duration: 1 }
  },
  {
    id: 'zeus',
    name: 'Zeus',
    title: 'King of Olympus',
    lore: 'Zeus demands tribute. His power is fueled by grand, arrogant gestures. He rewards those who risk greatly and make audacious displays of their belief in him.',
    philosophy: 'Power is the only truth. Seize it, display it, and the cosmos will bend to your will. Modesty is for mortals.',
    color: 'yellow',
    globalEffectDescription: 'Hubris Reigns: Maximum bets are increased across all games, but so are minimums. High risk, high reward.',
    boons: [
        { devotionThreshold: 100, description: 'Boon of Hubris: The bigger the bet, the higher the payout multiplier.', effect: (payout, bet) => payout > 0 ? { modifiedPayout: payout * (1 + bet/1000), message: "Zeus rewards your audacity." } : { modifiedPayout: payout, message: "" }},
        { devotionThreshold: 250, description: 'Boon of Kings: A chance that smaller wins are elevated to a much higher payout.', effect: (payout, bet) => payout > 0 && payout < bet * 3 && Math.random() < 0.05 ? { modifiedPayout: payout * 3, message: "A king's ransom! Zeus elevates your status." } : { modifiedPayout: payout, message: "" }}
    ],
    calamity: { triggerChance: 0.1, description: 'Curse of Lightning: Your win is struck down, leaving you with nothing.', effect: (payout, bet) => payout > 0 ? { modifiedPayout: 0, message: "Insolence! Zeus strikes your winnings from your hands." } : { modifiedPayout: payout, message: "" }},
    ultimate: { name: "Wrath of Olympus", description: "Your next 3 wins have their payouts doubled.", cost: 2000, boonType: 'zeus_wrath', duration: 3 }
  },
  {
    id: 'hecate',
    name: 'Hecate',
    title: 'Keeper of the Crossroads',
    lore: 'Hecate waits at the intersection of fates, where all paths converge. Her magic is potent, her knowledge vast. She values intuition and the wisdom to see the unseen path.',
    philosophy: 'Every choice is a spell cast upon the future. See beyond the veil and choose with intention.',
    color: 'indigo',
    globalEffectDescription: 'Veil of Secrets: The outcome of any game has a small chance to be briefly obscured, building suspense.',
    boons: [
        { devotionThreshold: 100, description: "Boon of Foresight: Small losses are sometimes foreseen and halved.", effect: (payout, bet) => payout === 0 && Math.random() < 0.1 ? { modifiedPayout: bet / 2, message: "Hecate's vision softens the blow of fate." } : { modifiedPayout: payout, message: "" }},
        { devotionThreshold: 250, description: "Boon of Witchcraft: Wins have a chance to grant a small, permanent boost to your 'luck'.", effect: (payout, bet) => payout > 0 && Math.random() < 0.05 ? { modifiedPayout: payout * 1.1, message: "A whisper of power enhances your destiny." } : { modifiedPayout: payout, message: "" }}
    ],
    calamity: { triggerChance: 0.1, description: 'Curse of Crossed Paths: Your wager is mysteriously altered, up or down, after being placed.', effect: (payout, bet) => ({ modifiedPayout: payout * (Math.random() * 0.4 + 0.8), message: "Hecate's whim has twisted your offering." }) },
    ultimate: { name: "True Sight", description: "For your next choice-based game, the correct option will be briefly revealed to you.", cost: 1000, boonType: 'hecate_truesight', duration: 1 }
  },
  {
    id: 'morrigan',
    name: 'The Morrigan',
    title: 'The Phantom Queen',
    lore: 'The triple goddess of war, fate, and prophecy, The Morrigan is drawn to this divine conflict like a crow to a battlefield. She sees all possible outcomes and revels in the beautiful, bloody tapestry of fate.',
    philosophy: 'Victory is not found in strength, but in knowing where the battle is already won. Every choice is a thread in the web of what will be.',
    color: 'teal',
    globalEffectDescription: "Harbinger's Gaze: Any game has a small chance to reveal its outcome as 'Fated to Win' or 'Fated to Lose' just before the result.",
    boons: [
        { devotionThreshold: 100, description: "Boon of the Crow's Eye: Small chance to be warned of an impending loss, allowing you to withdraw half your stake before it's settled.", effect: (payout, bet) => payout === 0 && Math.random() < 0.05 ? { modifiedPayout: bet / 2, message: "The Morrigan's crow warns you of ruin, and you heed its call." } : { modifiedPayout: payout, message: "" }},
        { devotionThreshold: 250, description: "Boon of Battle-Fury: Wins have a small chance to 'chain', adding a bonus to the next immediate win.", effect: (payout, bet) => payout > 0 && Math.random() < 0.1 ? { modifiedPayout: payout * 1.2, message: "Victory fuels your fury! Your next triumph will be greater." } : { modifiedPayout: payout, message: "" }}
    ],
    calamity: { triggerChance: 0.1, description: 'Curse of Doom: A win is foreseen as a fated loss and is reversed, as a reminder that not all futures can be changed.', effect: (payout, bet) => payout > 0 ? { modifiedPayout: 0, message: "The Morrigan foresaw this hollow victory and has corrected fate." } : { modifiedPayout: payout, message: "" }},
    ultimate: { name: "The Reaping", description: "The crows will recover half of your wager from your next 3 losses.", cost: 1200, boonType: 'morrigan_reaping', duration: 3 }
  },
  ASPIRANT_GOD,
];

export const GAMES: Game[] = [
  // Anubis
  {
    id: 'anubis-scales', name: "Scales of Truth", Icon: AnubisIcon, godId: 'anubis', category: 'DIVINE',
    description: "Your heart is weighed against a principle of Z. A pure soul finds paradise, while a heavy heart is found wanting.",
    minBet: 1, maxBet: 10, winChance: 0.6, payoutMultiplier: 1.5, flavorText: "Is your soul lighter than a concept?"
  },
  {
    id: 'anubis-jars', name: "Canopic Jars", Icon: AnubisIcon, godId: 'anubis', category: 'DIVINE',
    description: "The four sons of Horus guard the viscera. Only one jar holds the heart. Follow it with your gaze if you can.",
    minBet: 5, maxBet: 25, winChance: 0.25, payoutMultiplier: 3.5, flavorText: "The sacred organs are hidden in plain sight."
  },
  {
    id: 'anubis-feast', name: "Ammit's Gamble", Icon: AnubisIcon, godId: 'anubis', category: 'DIVINE',
    description: "Roll dice to collect virtues. Collect five to win, but roll three sins and the Devourer, Ammit, claims your stake.",
    minBet: 10, maxBet: 50, winChance: 0.45, payoutMultiplier: 2, flavorText: "Will you feast, or become the feast?"
  },
  // Hades
  {
    id: 'hades-roll', name: "Hades' Underworld Roll", Icon: HadesIcon, godId: 'hades', category: 'DIVINE',
    description: "Cast the bones and let fate decide. Hades watches with interest, for every soul eventually passes through his gates.",
    minBet: 10, maxBet: 150, winChance: 0.40, payoutMultiplier: 2.2, flavorText: "The bones never lie, mortal."
  },
  {
    id: 'hades-styx', name: "Race on the Styx", Icon: HadesIcon, godId: 'hades', category: 'DIVINE',
    description: "Bet on one of five condemned souls to reach the other side of the Styx first. Some are swifter than others.",
    minBet: 5, maxBet: 30, winChance: 0.2, payoutMultiplier: 4, flavorText: "Choose your champion for the final crossing."
  },
  {
    id: 'hades-obol', name: "Charon's Obol", Icon: HadesIcon, godId: 'hades', category: 'DIVINE',
    description: "Charon reveals an ancient coin. Will the next one he draws from his pouch be of higher or lower value?",
    minBet: 1, maxBet: 20, winChance: 0.48, payoutMultiplier: 2, flavorText: "The ferryman always collects his due."
  },
  // Fortuna
  {
    id: 'fortuna-wheel', name: "Favor of Fortuna", Icon: FortunaIcon, godId: 'fortuna', category: 'DIVINE',
    description: "Spin the great wheel of fate. Fortune favors the bold, but her whims are ever-changing.",
    minBet: 5, maxBet: 50, winChance: 0.45, payoutMultiplier: 2, flavorText: "Embrace the chaos of chance."
  },
  {
    id: 'fortuna-dice', name: "Fickle Dice", Icon: FortunaIcon, godId: 'fortuna', category: 'DIVINE',
    description: "A simple roll of two dice. Bet on the outcome: high, low, odd, even, or the exact number. The simpler the bet, the smaller the reward.",
    minBet: 1, maxBet: 100, winChance: 0.49, payoutMultiplier: 2, flavorText: "She whispers numbers on the wind."
  },
  {
    id: 'fortuna-threads', name: "Threads of Fate", Icon: FortunaIcon, godId: 'fortuna', category: 'DIVINE',
    description: "Drop a soul into a lattice of pins. Where it lands, nobody knows. The most treacherous paths yield the greatest prizes.",
    minBet: 10, maxBet: 60, winChance: 0.2, payoutMultiplier: 5, flavorText: "Watch as your destiny unfolds."
  },
  // Janus
  {
    id: 'janus-coin', name: "Janus's Two-Faced Coin", Icon: JanusIcon, godId: 'janus', category: 'DIVINE',
    description: "Choose a side: Order or Chaos. Janus, the god of beginnings and ends, will reveal the consequence of your conviction.",
    minBet: 10, maxBet: 100, winChance: 0.48, payoutMultiplier: 2, flavorText: "Every choice is a new beginning."
  },
  {
    id: 'janus-doorways', name: "Doorways to Eternity", Icon: JanusIcon, godId: 'janus', category: 'DIVINE',
    description: "Behind one of three doors lies a great prize. Choose one. Janus will open an empty door. Do you stay, or switch?",
    minBet: 15, maxBet: 75, winChance: 0.33, payoutMultiplier: 2.8, flavorText: "A choice, a revelation, a final decision."
  },
  {
    id: 'janus-sands', name: "Sands of Time", Icon: JanusIcon, godId: 'janus', category: 'DIVINE',
    description: "A card is drawn from the past. Will the next card drawn from the future be higher or lower?",
    minBet: 5, maxBet: 50, winChance: 0.47, payoutMultiplier: 2, flavorText: "The future is built upon the past."
  },
  // Loki
  {
    id: 'loki-maze', name: "Loki's Maze of Mischief", Icon: LokiIcon, godId: 'loki', category: 'DIVINE',
    description: "Follow the soul, if you can. Loki shuffles the cups with a speed that deceives gods and mortals alike.",
    minBet: 15, maxBet: 75, winChance: 0.33, payoutMultiplier: 2.8, flavorText: "The quickest eye is easily deceived."
  },
  {
    id: 'loki-dagger', name: "Dagger's Edge", Icon: LokiIcon, godId: 'loki', category: 'DIVINE',
    description: "A multiplier rises, increasing your potential payout. Cash out before Loki decides the game is over and the dagger falls.",
    minBet: 10, maxBet: 100, winChance: 0.9, payoutMultiplier: 1.5, flavorText: "How long can you hold your nerve?"
  },
  {
    id: 'loki-ruse', name: "Shapeshifter's Ruse", Icon: LokiIcon, godId: 'loki', category: 'DIVINE',
    description: "Three cards are presented. Two are valuable, one is Loki in disguise. Find the highest value without finding the trickster.",
    minBet: 20, maxBet: 80, winChance: 0.66, payoutMultiplier: 1.4, flavorText: "All that glitters is not gold."
  },
  // Zeus
  {
    id: 'zeus-bolt', name: "Zeus's Bolt from the Blue", Icon: ZeusIcon, godId: 'zeus', category: 'DIVINE',
    description: "Harness the power of the heavens. Charge a bolt of pure lightning and unleash it at the moment of perfect power.",
    minBet: 20, maxBet: 200, winChance: 0.4, payoutMultiplier: 2.5, flavorText: "Only the audacious can wield such power."
  },
  {
    id: 'zeus-slots', name: "Olympian Slots", Icon: ZeusIcon, godId: 'zeus', category: 'DIVINE',
    description: "Spin the reels of Olympus. Match the icons of power. Align three lightning bolts for a truly divine payout.",
    minBet: 10, maxBet: 100, winChance: 0.25, payoutMultiplier: 3, flavorText: "A tribute to the king of the gods."
  },
  {
    id: 'zeus-titanomachy', name: "Titanomachy", Icon: ZeusIcon, godId: 'zeus', category: 'DIVINE',
    description: "Challenge a Titan to a duel of dice. Roll higher than the primordial beast to claim victory and spoils.",
    minBet: 25, maxBet: 150, winChance: 0.48, payoutMultiplier: 2, flavorText: "Relive the war that shook the cosmos."
  },
  // Hecate
  {
    id: 'hecate-crossroads', name: "Hecate's Crossroads", Icon: HecateIcon, godId: 'hecate', category: 'DIVINE',
    description: "Three torches, one true flame. Hecate obscures your vision. Trust your intuition to find the light.",
    minBet: 10, maxBet: 80, winChance: 0.33, payoutMultiplier: 2.8, flavorText: "Follow the guiding flame."
  },
  {
    id: 'hecate-roulette', name: "Moon Phase Roulette", Icon: HecateIcon, godId: 'hecate', category: 'DIVINE',
    description: "Place your wager on the phases of the moon: New, Waxing, Full, or Waning. Hecate will reveal the sky's true face.",
    minBet: 5, maxBet: 50, winChance: 0.25, payoutMultiplier: 3, flavorText: "The moon holds secrets for those who watch."
  },
  {
    id: 'hecate-scrying', name: "Scrying Pool", Icon: HecateIcon, godId: 'hecate', category: 'DIVINE',
    description: "Gaze into the pool as Hecate reveals a sequence of runes. Repeat the pattern from memory to prove your focus.",
    minBet: 1, maxBet: 30, winChance: 0.5, payoutMultiplier: 1.8, flavorText: "The future reveals itself in patterns."
  },
  // The Morrigan
  {
    id: 'morrigan-crows', name: "The Crow's Prophecy", Icon: MorriganIcon, godId: 'morrigan', category: 'DIVINE',
    description: "Three crows land before you. Two speak of ruin, one of victory. Heed the one that holds your fate.",
    minBet: 15, maxBet: 85, winChance: 0.33, payoutMultiplier: 2.8, flavorText: "Listen to the whispers on the wind."
  },
  {
    id: 'morrigan-battlefield', name: "Battlefield of Fate", Icon: MorriganIcon, godId: 'morrigan', category: 'DIVINE',
    description: "Wager on the outcome of a fated battle between two phantom armies. The odds are long, the rewards great.",
    minBet: 25, maxBet: 125, winChance: 0.4, payoutMultiplier: 2.3, flavorText: "The victor is already decided. Have you the eyes to see it?"
  },
  {
    id: 'morrigan-loom', name: "Weaver's Loom", Icon: MorriganIcon, godId: 'morrigan', category: 'DIVINE',
    description: "Pull a thread from the loom of fate. The longer the thread before it snaps, the greater the reward. Cash out before it's too late.",
    minBet: 10, maxBet: 100, winChance: 0.9, payoutMultiplier: 1.5, flavorText: "How far are you willing to pull on the strings of destiny?"
  },
  // User God Games
  {
    id: 'user-ambition', name: "Ladder of Ambition", Icon: AmbitionIcon, godId: 'user_god', category: 'DIVINE',
    description: "Climb a ladder of increasing risk and reward. The higher you climb, the greater the chance of falling.",
    minBet: 10, maxBet: 100, winChance: 0.85, payoutMultiplier: 1.6, flavorText: "Will your reach exceed your grasp?"
  },
  {
    id: 'user-creativity', name: "Spark of Creation", Icon: CreativityIcon, godId: 'user_god', category: 'DIVINE',
    description: "Combine elemental concepts to forge a masterpiece. The rarer the combination, the greater the payout.",
    minBet: 5, maxBet: 50, winChance: 0.3, payoutMultiplier: 3, flavorText: "From nothing, something new is born."
  },
  {
    id: 'user-legacy', name: "Echoes of Legacy", Icon: LegacyIcon, godId: 'user_god', category: 'DIVINE',
    description: "Bet on how future generations will remember a hero's tale. Will they be a Saint, a Conqueror, or Forgotten?",
    minBet: 20, maxBet: 150, winChance: 0.33, payoutMultiplier: 2.8, flavorText: "A story's end is only the beginning."
  },
  // Mortal Games
  {
    id: 'mortal-brag', name: "Three-Card Brag", Icon: CardsIcon, godId: null, category: 'MORTAL',
    description: "A classic test of nerve and luck from the mortal realm. Draw three cards and hope for a better hand than the house.",
    minBet: 5, maxBet: 100, winChance: 0.45, payoutMultiplier: 2, flavorText: "A simple game for complex souls."
  },
  {
    id: 'mortal-crown', name: "Crown & Anchor", Icon: AnchorIcon, godId: null, category: 'MORTAL',
    description: "A sailor's game of chance. Bet on one of six symbols. If the dice show your mark, you win. The more matches, the bigger the prize.",
    minBet: 1, maxBet: 50, winChance: 0.42, payoutMultiplier: 2.1, flavorText: "Will your luck hold on the high seas of fate?"
  },
  {
    id: 'mortal-spinneret', name: "Spinneret", Icon: CrownIcon, godId: null, category: 'MORTAL',
    description: "A spinning top marked with colors. Place your bet on where it will finally come to rest. A mesmerizing game of pure physics.",
    minBet: 2, maxBet: 20, winChance: 0.2, payoutMultiplier: 4.5, flavorText: "The world turns, and the top will fall."
  }
];

export const QUEST_POOL: Omit<DailyQuest, 'id' | 'currentValue' | 'isCompleted' | 'isClaimed'>[] = [
    { type: 'wager', description: "Wager 500 Souls in any game.", targetValue: 500, reward: 50 },
    { type: 'wager', description: "Wager 1000 Souls in any game.", targetValue: 1000, reward: 125 },
    { type: 'win', description: "Achieve victory 5 times.", targetValue: 5, reward: 75 },
    { type: 'win', description: "Achieve victory 10 times.", targetValue: 10, reward: 150 },
    { type: 'play_game', description: "Play a game in Zeus's name.", targetValue: 1, reward: 25, meta: 'zeus-bolt' },
    { type: 'play_game', description: "Play a game in Loki's name.", targetValue: 1, reward: 25, meta: 'loki-maze' },
    { type: 'play_game', description: "Play a game in Anubis' name.", targetValue: 1, reward: 25, meta: 'anubis-scales' },
    { type: 'play_game', description: "Play 3 games of chance from the mortal realm.", targetValue: 3, reward: 50, meta: 'mortal-brag' }, // This would need logic to check category
    { type: 'change_cult', description: "Pledge your devotion to a different god.", targetValue: 1, reward: 100 },
];


export const INITIAL_SOULS = 500;

export const INITIAL_PANTHEON_INFLUENCE: PantheonInfluenceState = {
  anubis: 100,
  hades: 100,
  fortuna: 100,
  janus: 100,
  loki: 100,
  zeus: 100,
  hecate: 100,
  morrigan: 100,
  aspirant: 10, // The Aspirant starts weak
};

export const INITIAL_PLAYER_STATE: PlayerState = {
  currentCultId: null,
  devotion: {},
  scornfulGods: [],
  debtToHades: 0,
  temporaryBoons: [],
  scorn: 0,
  ultimateCharge: {},
  personalizedGods: {},
  hasAscended: false,
  ascendedGodDetails: null,
  losingStreak: 0,
  peakSouls: INITIAL_SOULS,
};

export const THOTH_VOICE_NAME = 'Google UK English Male';