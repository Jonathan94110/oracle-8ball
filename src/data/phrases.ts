export const phrases: string[] = [
  "Autobots, roll out",
  "Till all are one",
  "One shall stand, one shall fall",
  "More than meets the eye",
  "The Matrix has chosen",
  "Freedom is the right of all sentient beings",
  "Transform and prevail",
  "Decepticons, attack",
  "Megatron would be displeased",
  "Consult the AllSpark",
  "Cybertron stirs",
  "The spark says yes",
  "The spark says no",
  "Signals unclear, shake again",
  "Prime approves",
  "Not today, Decepticon",
  "The Oracle sees victory",
  "The Oracle sees ruin",
  "Energon reserves low — try later",
  "Roll the dice, warrior",
  "Patience, young bot",
  "Unicron whispers otherwise",
  "Vector Sigma confirms it",
  "The relic chamber agrees",
  "Ancient circuits say yes"
];

export function pickPhrase(exclude?: string): string {
  const pool = exclude ? phrases.filter((p) => p !== exclude) : phrases;
  return pool[Math.floor(Math.random() * pool.length)];
}
