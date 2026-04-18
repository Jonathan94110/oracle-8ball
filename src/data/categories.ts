import type { Category } from "../types";

export const BUILTIN_CATEGORIES: Category[] = [
  {
    id: "builtin:classic",
    name: "Classic",
    builtin: true,
    phrases: [
      "Autobots, roll out",
      "Till all are one",
      "One shall stand, one shall fall",
      "More than meets the eye",
      "The Matrix has chosen",
      "Prime approves",
      "Not today, Decepticon",
      "Signals unclear, shake again",
      "The spark says yes",
      "The spark says no"
    ]
  },
  {
    id: "builtin:buy",
    name: "Should I buy this?",
    builtin: true,
    phrases: [
      "Worth every credit",
      "Overpriced — wait for the sale",
      "Buy it before someone else does",
      "Your energon reserves say no",
      "A wise acquisition",
      "Tempting, but walk away",
      "The collector within demands it",
      "Save for the real grail",
      "Buy two — one to keep sealed",
      "Return it to the shelf"
    ]
  },
  {
    id: "builtin:faction",
    name: "Autobot or Decepticon?",
    builtin: true,
    phrases: [
      "Pure Autobot spark",
      "Decepticon through and through",
      "Neutral — like a Mini-Con",
      "Autobot with a dark past",
      "Decepticon trying to reform",
      "Wielder of the Matrix",
      "Loyal to Megatron",
      "Quintesson puppet",
      "Maximal descendant",
      "Predacon bloodline"
    ]
  },
  {
    id: "builtin:battle",
    name: "Battle strategy",
    builtin: true,
    phrases: [
      "Transform and attack",
      "Hold formation",
      "Retreat and regroup",
      "Call for reinforcements",
      "Flank from the left",
      "Fire at will",
      "Shield the weak",
      "Strike the leader",
      "Wait for their move",
      "Engage stealth mode"
    ]
  }
];

export function pickPhrase(phrases: string[], exclude?: string): string {
  if (phrases.length === 0) return "The Oracle is silent";
  const pool =
    exclude && phrases.length > 1 ? phrases.filter((p) => p !== exclude) : phrases;
  return pool[Math.floor(Math.random() * pool.length)];
}
