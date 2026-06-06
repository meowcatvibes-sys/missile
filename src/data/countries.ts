export interface Country {
  id: string;
  name: string;
  path: string;
  center: { x: number; y: number };
  population: string;
  gdp: string;
  funFact: string;
  damageDescription: string;
  alliances: string[];
  retaliationStrength: number; // shield damage dealt (5–25)
}

export interface RetaliationResult {
  attacker: Country;
  damage: number;
  message: string;
}

// Retaliation messages per country
const retaliationMessages: Record<string, string> = {
  us: "The Pentagon's dead-man switch activates. Freedom was never free.",
  ca: "Canada retaliates — and they're NOT sorry this time.",
  mx: "Mexican cartels launch their own 'special package.'",
  br: "Brazil fires back. The Amazon burns brighter than ever.",
  ar: "Argentina screams '¡GOOOL!' as their missile launches.",
  uk: "MI6 had a contingency. God save whoever's left.",
  fr: "France retaliates with nuclear baguettes. Oui, really.",
  de: "German engineering: the missile arrives exactly on time.",
  it: "Italy fires back. Mamma mia, that's a spicy warhead.",
  es: "Spain retaliates during siesta. Even napping, they're dangerous.",
  ru: "Russia's dead hand protocol activates. Goodbye, everyone.",
  cn: "China responds with overwhelming force. The dragon awakens.",
  jp: "Japan launches a counter-strike. This time, they're ready.",
  kr: "South Korea retaliates. K-pop stans were the sleeper agents all along.",
  in: "India responds. They did the needful... with nuclear warheads.",
  au: "Australia fires back. The kangaroos carry the launch codes.",
  eg: "Egypt retaliates. The Sphinx saw this coming 4,000 years ago.",
  ng: "Nigeria strikes back. The prince's fortune was a missile fund.",
  za: "South Africa retaliates with a vuvuzela-powered warhead.",
  sa: "Saudi Arabia fires an oil-fueled ICBM. Prices? Still going up.",
  tr: "Turkey retaliates. Constantinople remembers.",
  ir: "Iran launches. The carpets couldn't fly, but the missiles can.",
  th: "Thailand fires back. Pad Thai? More like Rad Thai.",
  id: "Indonesia retaliates from 17,000 islands simultaneously.",
  pk: "Pakistan launches a counter-strike. Match cancelled: nuclear apocalypse.",
  no: "Norway retaliates. Vikings would be proud.",
  se: "Sweden fires back. Assembly instructions NOT included.",
  pl: "Poland retaliates. This time, history won't repeat itself.",
  co: "Colombia fires back. The coffee cartel had missile silos.",
  nz: "New Zealand retaliates. Hobbits don't forgive easily.",
};

// SVG viewBox is 1000 x 500 (simplified Mercator-ish projection)
// Paths are simplified outlines for visual clarity
export const countries: Country[] = [
  {
    id: "us",
    name: "United States",
    path: "M 130,160 L 150,155 165,150 180,148 200,145 220,148 240,150 260,148 265,155 270,165 268,175 260,185 250,190 248,200 250,210 245,215 235,212 220,210 210,215 200,210 190,208 180,210 170,205 160,200 150,195 140,190 135,180 130,170 Z",
    center: { x: 200, y: 180 },
    population: "331 million",
    gdp: "$25.5 trillion",
    funFact: "Has more guns than people",
    damageDescription: "Hollywood is gone. No more superhero movies. The world mourns... or celebrates?",
    alliances: ["uk", "ca", "fr", "de", "jp", "kr", "au"],
    retaliationStrength: 25,
  },
  {
    id: "ca",
    name: "Canada",
    path: "M 120,100 L 140,95 160,90 180,88 200,85 220,87 240,90 260,92 270,100 280,105 275,115 270,125 265,135 260,140 250,145 240,148 220,145 200,142 180,145 165,148 150,152 140,148 130,140 125,130 120,120 Z",
    center: { x: 200, y: 118 },
    population: "38 million",
    gdp: "$2.1 trillion",
    funFact: "Apologized to the missile on impact",
    damageDescription: "All the maple syrup reserves have been vaporized. Tim Hortons is no more.",
    alliances: ["us", "uk", "fr", "de"],
    retaliationStrength: 10,
  },
  {
    id: "mx",
    name: "Mexico",
    path: "M 140,210 L 155,205 170,208 185,212 195,218 200,225 205,232 210,238 200,245 190,248 180,250 170,248 160,242 155,235 148,228 142,220 Z",
    center: { x: 175, y: 228 },
    population: "128 million",
    gdp: "$1.3 trillion",
    funFact: "The tacos... they're gone",
    damageDescription: "The world's taco supply has been obliterated. This is the real catastrophe.",
    alliances: ["us", "co", "br"],
    retaliationStrength: 8,
  },
  {
    id: "br",
    name: "Brazil",
    path: "M 280,280 L 300,265 320,260 335,262 345,270 350,280 348,295 345,310 340,325 330,335 315,340 300,338 288,330 278,320 272,310 270,298 275,288 Z",
    center: { x: 310, y: 300 },
    population: "214 million",
    gdp: "$1.9 trillion",
    funFact: "The Amazon was already on fire anyway",
    damageDescription: "The Amazon rainforest is now the Amazon parking lot. Carnival is permanently cancelled.",
    alliances: ["ru", "cn", "in", "za", "ar"],
    retaliationStrength: 12,
  },
  {
    id: "ar",
    name: "Argentina",
    path: "M 270,340 L 280,335 290,338 295,345 292,358 288,370 285,385 280,395 275,405 268,395 265,380 262,365 260,355 265,345 Z",
    center: { x: 278, y: 368 },
    population: "45 million",
    gdp: "$632 billion",
    funFact: "Messi was evacuated just in time",
    damageDescription: "The steak capital of the world is well-done. Very, very well-done.",
    alliances: ["br", "co", "mx"],
    retaliationStrength: 7,
  },
  {
    id: "uk",
    name: "United Kingdom",
    path: "M 440,125 L 445,118 450,115 455,118 458,125 456,132 452,138 448,140 444,138 440,132 Z",
    center: { x: 449, y: 128 },
    population: "67 million",
    gdp: "$3.1 trillion",
    funFact: "The Queen's corgis were safely evacuated",
    damageDescription: "Tea time has been cancelled indefinitely. The queue to the afterlife is very orderly.",
    alliances: ["us", "fr", "de", "ca", "au"],
    retaliationStrength: 20,
  },
  {
    id: "fr",
    name: "France",
    path: "M 440,148 L 450,142 460,140 468,145 470,155 465,162 458,168 450,170 442,165 438,158 Z",
    center: { x: 455, y: 155 },
    population: "67 million",
    gdp: "$2.8 trillion",
    funFact: "They surrendered before impact",
    damageDescription: "The Eiffel Tower is now modern art. Baguettes are just toast.",
    alliances: ["us", "uk", "de", "es", "it"],
    retaliationStrength: 18,
  },
  {
    id: "de",
    name: "Germany",
    path: "M 468,130 L 478,125 488,128 492,135 490,145 485,152 478,155 470,152 465,145 465,138 Z",
    center: { x: 478, y: 140 },
    population: "83 million",
    gdp: "$4.1 trillion",
    funFact: "The beer supply is the real casualty",
    damageDescription: "Oktoberfest is permanently over. German engineering couldn't engineer a defense.",
    alliances: ["us", "uk", "fr", "pl", "no", "se"],
    retaliationStrength: 15,
  },
  {
    id: "it",
    name: "Italy",
    path: "M 478,158 L 482,155 488,160 490,168 488,175 485,182 480,188 476,185 474,178 475,170 Z",
    center: { x: 482, y: 172 },
    population: "60 million",
    gdp: "$2.0 trillion",
    funFact: "Pizza was the last thing seen in the blast",
    damageDescription: "Italy is now boot-shaped rubble. The pizza oven of the world has been turned off forever.",
    alliances: ["fr", "de", "es", "tr"],
    retaliationStrength: 12,
  },
  {
    id: "es",
    name: "Spain",
    path: "M 425,162 L 435,158 445,160 450,168 448,175 442,180 435,182 428,178 422,172 Z",
    center: { x: 436, y: 170 },
    population: "47 million",
    gdp: "$1.4 trillion",
    funFact: "The bulls finally got their revenge",
    damageDescription: "Siesta is now permanent. The running of the bulls has become the flying of the bulls.",
    alliances: ["fr", "it", "uk", "de"],
    retaliationStrength: 10,
  },
  {
    id: "ru",
    name: "Russia",
    path: "M 520,60 L 560,55 600,50 650,48 700,50 740,55 780,60 800,70 810,80 800,95 790,108 770,115 750,118 720,120 690,118 660,115 630,118 600,120 570,118 550,115 530,110 520,100 515,88 518,75 Z",
    center: { x: 660, y: 85 },
    population: "144 million",
    gdp: "$1.8 trillion",
    funFact: "In Soviet Russia, nuke launches YOU",
    damageDescription: "Vodka reserves have contaminated the groundwater. It's actually an improvement.",
    alliances: ["cn", "in", "ir", "br"],
    retaliationStrength: 25,
  },
  {
    id: "cn",
    name: "China",
    path: "M 700,145 L 720,138 740,135 760,138 775,145 780,155 778,168 772,178 760,185 748,188 735,185 722,180 712,172 705,162 Z",
    center: { x: 742, y: 162 },
    population: "1.4 billion",
    gdp: "$17.7 trillion",
    funFact: "The Great Wall didn't help",
    damageDescription: "Global supply chains have collapsed. Your next Amazon delivery is delayed by... forever.",
    alliances: ["ru", "pk", "ir", "br"],
    retaliationStrength: 24,
  },
  {
    id: "jp",
    name: "Japan",
    path: "M 808,155 L 812,148 818,145 822,150 824,158 820,165 815,170 810,168 806,162 Z",
    center: { x: 815, y: 158 },
    population: "125 million",
    gdp: "$4.9 trillion",
    funFact: "Not again...",
    damageDescription: "Anime production has ceased. Gamers worldwide hold a candlelight vigil.",
    alliances: ["us", "kr", "au", "in"],
    retaliationStrength: 15,
  },
  {
    id: "kr",
    name: "South Korea",
    path: "M 790,162 L 795,158 800,160 802,166 800,172 796,175 792,172 790,168 Z",
    center: { x: 796, y: 166 },
    population: "52 million",
    gdp: "$1.8 trillion",
    funFact: "K-pop fans are the real WMD",
    damageDescription: "Samsung and K-pop gone in one flash. The internet has lost its main character.",
    alliances: ["us", "jp", "au"],
    retaliationStrength: 14,
  },
  {
    id: "in",
    name: "India",
    path: "M 680,190 L 700,182 715,185 725,195 728,208 725,222 718,235 708,242 698,238 688,228 682,218 678,208 676,198 Z",
    center: { x: 703, y: 212 },
    population: "1.4 billion",
    gdp: "$3.4 trillion",
    funFact: "Tech support lines are down worldwide",
    damageDescription: "The world's IT infrastructure collapses. Every computer shows 'please do the needful' one last time.",
    alliances: ["ru", "jp", "br", "fr"],
    retaliationStrength: 20,
  },
  {
    id: "au",
    name: "Australia",
    path: "M 780,320 L 800,310 825,308 845,312 860,320 865,335 860,350 850,360 835,365 815,362 798,358 785,350 778,340 Z",
    center: { x: 822, y: 338 },
    population: "26 million",
    gdp: "$1.7 trillion",
    funFact: "The spiders survived. They always do.",
    damageDescription: "The wildlife was already trying to kill everyone. The nuke was just redundant.",
    alliances: ["us", "uk", "jp", "kr", "nz"],
    retaliationStrength: 12,
  },
  {
    id: "eg",
    name: "Egypt",
    path: "M 520,195 L 532,190 542,192 545,200 542,210 538,218 530,220 522,215 518,208 Z",
    center: { x: 532, y: 205 },
    population: "104 million",
    gdp: "$476 billion",
    funFact: "The pyramids are now pyramid-shaped craters",
    damageDescription: "Aliens are furious their landing pads have been destroyed.",
    alliances: ["sa", "tr", "ng"],
    retaliationStrength: 10,
  },
  {
    id: "ng",
    name: "Nigeria",
    path: "M 470,250 L 482,245 492,248 496,256 492,265 486,270 478,268 472,262 Z",
    center: { x: 482, y: 258 },
    population: "218 million",
    gdp: "$477 billion",
    funFact: "The prince's email fortune was lost",
    damageDescription: "Millions of unclaimed inheritance emails will go unsent. A truly tragic loss.",
    alliances: ["za", "eg", "sa"],
    retaliationStrength: 8,
  },
  {
    id: "za",
    name: "South Africa",
    path: "M 510,355 L 525,348 538,350 545,358 542,368 535,375 525,378 515,375 508,368 Z",
    center: { x: 526, y: 362 },
    population: "60 million",
    gdp: "$405 billion",
    funFact: "The vuvuzelas finally went silent",
    damageDescription: "Diamond mines are now just... mines. The world's vuvuzela supply is mercifully gone.",
    alliances: ["br", "in", "ng", "ru"],
    retaliationStrength: 9,
  },
  {
    id: "sa",
    name: "Saudi Arabia",
    path: "M 570,195 L 585,188 600,190 608,198 605,210 598,220 588,225 578,222 568,215 565,205 Z",
    center: { x: 588, y: 206 },
    population: "35 million",
    gdp: "$1.1 trillion",
    funFact: "Oil prices went to infinity",
    damageDescription: "Gas prices hit $999/gallon. Everyone is now riding bicycles.",
    alliances: ["eg", "pk", "tr"],
    retaliationStrength: 15,
  },
  {
    id: "tr",
    name: "Turkey",
    path: "M 530,152 L 545,148 558,150 568,155 565,162 558,168 548,170 538,168 530,162 Z",
    center: { x: 549, y: 160 },
    population: "85 million",
    gdp: "$906 billion",
    funFact: "Istanbul is now Constantinople again... sort of",
    damageDescription: "The bridge between Europe and Asia is now a bridge between nothing and nothing.",
    alliances: ["de", "it", "sa", "uk"],
    retaliationStrength: 14,
  },
  {
    id: "ir",
    name: "Iran",
    path: "M 595,165 L 610,158 625,160 632,168 630,178 624,185 615,188 605,185 598,178 Z",
    center: { x: 614, y: 174 },
    population: "87 million",
    gdp: "$368 billion",
    funFact: "The carpets did not fly away in time",
    damageDescription: "Persian carpets are now abstract art. Very, very abstract.",
    alliances: ["ru", "cn", "pk"],
    retaliationStrength: 18,
  },
  {
    id: "th",
    name: "Thailand",
    path: "M 735,225 L 742,218 748,222 750,230 748,238 742,242 736,238 733,232 Z",
    center: { x: 742, y: 230 },
    population: "72 million",
    gdp: "$536 billion",
    funFact: "Pad Thai is now Sad Thai",
    damageDescription: "Every massage parlor in the world just closed. Street food scene? More like street gone scene.",
    alliances: ["cn", "jp", "id"],
    retaliationStrength: 8,
  },
  {
    id: "id",
    name: "Indonesia",
    path: "M 755,270 L 770,265 790,268 810,272 820,278 815,285 800,288 780,285 765,282 755,278 Z",
    center: { x: 788, y: 276 },
    population: "275 million",
    gdp: "$1.3 trillion",
    funFact: "17,000 islands, now 0 islands",
    damageDescription: "Thousands of islands turned into one big underwater crater. Bali is now scuba-only.",
    alliances: ["au", "th", "in"],
    retaliationStrength: 10,
  },
  {
    id: "pk",
    name: "Pakistan",
    path: "M 650,178 L 662,172 672,175 678,182 676,192 670,198 662,200 654,196 648,188 Z",
    center: { x: 663, y: 186 },
    population: "230 million",
    gdp: "$376 billion",
    funFact: "Cricket match cancelled due to nuclear apocalypse",
    damageDescription: "The cricket world cup is permanently postponed. A moment of silence for biryani.",
    alliances: ["cn", "sa", "ir", "tr"],
    retaliationStrength: 20,
  },
  {
    id: "no",
    name: "Norway",
    path: "M 465,85 L 472,78 480,82 484,90 480,98 474,102 468,98 463,92 Z",
    center: { x: 474, y: 90 },
    population: "5 million",
    gdp: "$579 billion",
    funFact: "The fjords are now just... fissures",
    damageDescription: "The world's happiest country is now the world's most vaporized country.",
    alliances: ["se", "uk", "de", "us"],
    retaliationStrength: 8,
  },
  {
    id: "se",
    name: "Sweden",
    path: "M 482,78 L 490,72 498,76 500,86 498,96 492,102 486,98 482,90 Z",
    center: { x: 491, y: 88 },
    population: "10 million",
    gdp: "$586 billion",
    funFact: "IKEA assembly instructions survived the blast",
    damageDescription: "ABBA's music echoes through the wasteland. Meatballs rain from the sky.",
    alliances: ["no", "de", "uk", "pl"],
    retaliationStrength: 8,
  },
  {
    id: "pl",
    name: "Poland",
    path: "M 492,128 L 502,124 510,128 512,136 508,142 500,145 494,142 490,136 Z",
    center: { x: 502, y: 134 },
    population: "38 million",
    gdp: "$700 billion",
    funFact: "Still hasn't received reparations",
    damageDescription: "The pierogi reserves have been lost. Again. History really does repeat itself.",
    alliances: ["de", "uk", "us", "se"],
    retaliationStrength: 12,
  },
  {
    id: "co",
    name: "Colombia",
    path: "M 235,248 L 248,242 258,245 262,254 258,262 250,266 242,264 235,258 Z",
    center: { x: 249, y: 254 },
    population: "51 million",
    gdp: "$343 billion",
    funFact: "Coffee production halted worldwide",
    damageDescription: "The world wakes up without coffee. Productivity drops to zero. Civilization collapses.",
    alliances: ["mx", "br", "ar", "us"],
    retaliationStrength: 7,
  },
  {
    id: "nz",
    name: "New Zealand",
    path: "M 878,375 L 884,368 890,372 892,380 888,386 882,388 876,384 Z",
    center: { x: 884, y: 378 },
    population: "5 million",
    gdp: "$247 billion",
    funFact: "Middle-earth is no more",
    damageDescription: "Hobbits worldwide are displaced. Mordor had better building codes.",
    alliances: ["au", "uk", "us"],
    retaliationStrength: 5,
  },
];

export const getRandomDamagePercent = (): number => {
  return Math.floor(Math.random() * 30) + 70; // 70-99%
};

export const getCasualtyEstimate = (population: string): string => {
  const numMatch = population.match(/([\d.]+)\s*(billion|million)/);
  if (!numMatch) return "Unknown";
  const num = parseFloat(numMatch[1]);
  const unit = numMatch[2];
  const casualties = num * (Math.random() * 0.3 + 0.5); // 50-80% casualties
  return `${casualties.toFixed(1)} ${unit}`;
};

export const getChaosIncrease = (): number => {
  return Math.floor(Math.random() * 8) + 5; // 5-12% increase per nuke
};

/**
 * After nuking a country, check if any surviving ally retaliates.
 * Chance = base 20% + (chaosLevel * 0.5)%, capped at 85%.
 * Returns null if no retaliation, or a RetaliationResult.
 */
export const calculateRetaliation = (
  nukedCountry: Country,
  nukedCountries: string[],
  chaosLevel: number,
): RetaliationResult | null => {
  // Find surviving allies
  const survivingAllies = nukedCountry.alliances
    .map((id) => countries.find((c) => c.id === id))
    .filter((c): c is Country => c !== undefined && !nukedCountries.includes(c.id));

  if (survivingAllies.length === 0) return null;

  // Retaliation chance scales with chaos
  const baseChance = 0.20;
  const chaosBonus = chaosLevel * 0.005;
  const chance = Math.min(baseChance + chaosBonus, 0.85);

  if (Math.random() > chance) return null;

  // Pick a random surviving ally to retaliate
  const attacker = survivingAllies[Math.floor(Math.random() * survivingAllies.length)];

  // Damage scales slightly with chaos too
  const damageMultiplier = 1 + (chaosLevel / 200);
  const damage = Math.round(attacker.retaliationStrength * damageMultiplier);

  const message = retaliationMessages[attacker.id] || `${attacker.name} retaliates with a devastating counter-strike!`;

  return { attacker, damage, message };
};
