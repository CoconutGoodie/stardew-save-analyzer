export interface EradicationGoal {
  category: string;
  amount: number;
  validMonsters: string[];
}

export const STARDEW_ERADICATION_GOALS: EradicationGoal[] = [
  {
    category: "Slimes",
    amount: 1000,
    validMonsters: ["Green Slime", "Frost Jelly", "Sludge", "Tiger Slime"],
  },
  {
    category: "Void Spirits",
    amount: 150,
    validMonsters: [
      "Shadow Shaman",
      "Shadow Brute",
      "Shadow Sniper",
      // "Shadow Guy",
      // "Shadow Girl",
    ],
  },
  {
    category: "Bats",
    amount: 200,
    validMonsters: ["Bat", "Frost Bat", "Lava Bat", "Iridium Bat"],
  },
  {
    category: "Skeletons",
    amount: 50,
    validMonsters: ["Skeleton", "Skeleton Mage"],
  },
  {
    category: "Cave Insects",
    amount: 80,
    validMonsters: ["Bug", "Fly", "Grub"],
  },
  {
    category: "Duggies",
    amount: 30,
    validMonsters: ["Duggy", "Magma Duggy"],
  },
  {
    category: "Dust Sprites",
    amount: 500,
    validMonsters: ["Dust Spirit"],
  },
  {
    category: "Rock Crabs",
    amount: 60,
    validMonsters: ["Rock Crab", "Lava Crab", "Iridium Crab"],
  },
  {
    category: "Mummies",
    amount: 60,
    validMonsters: ["Mummy"],
  },
  {
    category: "Pepper Rex",
    amount: 50,
    validMonsters: ["Pepper Rex"],
  },
  {
    category: "Serpents",
    amount: 250,
    validMonsters: ["Serpent", "Royal Serpent"],
  },
  {
    category: "Magma Sprites",
    amount: 150,
    validMonsters: ["Magma Sprite", "Magma Sparker"],
  },
];
