export interface EradicationGoal {
  category: string;
  wikiId: string;
  amount: number;
  validMonsters: string[];
}

export const STARDEW_ERADICATION_GOALS: EradicationGoal[] = [
  {
    category: "Slimes",
    wikiId: "Slime",
    amount: 1000,
    validMonsters: ["Green Slime", "Frost Jelly", "Sludge", "Tiger Slime"],
  },
  {
    category: "Void Spirits",
    wikiId: "Void Spirit",
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
    wikiId: "Bat",
    amount: 200,
    validMonsters: ["Bat", "Frost Bat", "Lava Bat", "Iridium Bat"],
  },
  {
    category: "Skeletons",
    wikiId: "Skeleton",
    amount: 50,
    validMonsters: ["Skeleton", "Skeleton Mage"],
  },
  {
    category: "Cave Insects",
    wikiId: "Cave Insect",
    amount: 80,
    validMonsters: ["Bug", "Fly", "Grub"],
  },
  {
    category: "Duggies",
    wikiId: "Duggy",
    amount: 30,
    validMonsters: ["Duggy", "Magma Duggy"],
  },
  {
    category: "Dust Sprites",
    wikiId: "Dust Sprite",
    amount: 500,
    validMonsters: ["Dust Spirit"],
  },
  {
    category: "Rock Crabs",
    wikiId: "Rock Crab",
    amount: 60,
    validMonsters: ["Rock Crab", "Lava Crab", "Iridium Crab"],
  },
  {
    category: "Mummies",
    wikiId: "Mummy",
    amount: 60,
    validMonsters: ["Mummy"],
  },
  {
    category: "Pepper Rex",
    wikiId: "Pepper Rex",
    amount: 50,
    validMonsters: ["Pepper Rex"],
  },
  {
    category: "Serpents",
    wikiId: "Serpent",
    amount: 250,
    validMonsters: ["Serpent", "Royal Serpent"],
  },
  {
    category: "Magma Sprites",
    wikiId: "Magma Sprite",
    amount: 150,
    validMonsters: ["Magma Sprite", "Magma Sparker"],
  },
];
