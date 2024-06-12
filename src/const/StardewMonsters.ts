export interface EradicationGoal {
  category: string;
  amount: number;
  validMonsters: Set<string>;
}

export const STARDEW_ERADICATION_GOAL: EradicationGoal[] = [
  {
    category: "Slimes",
    amount: 1000,
    validMonsters: new Set([
      "Green Slime",
      "Frost Jelly",
      "Sludge",
      "Tiger Slime",
    ]),
  },
  {
    category: "Void Spirits",
    amount: 150,
    validMonsters: new Set([
      "Shadow Shaman",
      "Shadow Brute",
      "Shadow Sniper",
      "Shadow Guy",
      "Shadow Girl",
    ]),
  },
  {
    category: "Bats",
    amount: 200,
    validMonsters: new Set(["Bat", "Frost Bat", "Lava Bat", "Iridium Bat"]),
  },
  {
    category: "Skeletons",
    amount: 50,
    validMonsters: new Set(["Skeleton", "Skeleton Mage"]),
  },
  {
    category: "Cave Insects",
    amount: 80,
    validMonsters: new Set(["Bug", "Fly", "Grub"]),
  },
  {
    category: "Duggies",
    amount: 30,
    validMonsters: new Set(["Duggy", "Magma Duggy"]),
  },
  {
    category: "Dust Sprites",
    amount: 500,
    validMonsters: new Set(["Dust Spirit"]),
  },
  {
    category: "Rock Crabs",
    amount: 60,
    validMonsters: new Set(["Rock Crab", "Lava Crab", "Iridium Crab"]),
  },
  {
    category: "Mummies",
    amount: 60,
    validMonsters: new Set(["Mummy"]),
  },
  {
    category: "Pepper Rex",
    amount: 50,
    validMonsters: new Set(["Pepper Rex"]),
  },
  {
    category: "Serpents",
    amount: 250,
    validMonsters: new Set(["Serpent", "Royal Serpent"]),
  },
  {
    category: "Magma Sprites",
    amount: 150,
    validMonsters: new Set(["Magma Sprite", "Magma Sparker"]),
  },
];
