export enum Weather {
  Sun = "Sun",
  Rain = "Rain",
}

export enum FishCategory {
  Spring = "Spring",
  Summer = "Summer",
  Fall = "Fall",
  Winter = "Winter",
  NightMarket = "Night Market",
  GingerIsland = "Ginger Island",
  CrabPot = "Crab Pot",
  Other = "Other",
  Legendary = "Legendary",
  Legendary2 = "Legendary II",
}

export const STARDEW_FISH_CATEGORIES = {
  [FishCategory.Spring]: {
    accentColor: "#9EFF9B",
  },
  [FishCategory.Summer]: {
    accentColor: "#FFFF17",
  },
  [FishCategory.Fall]: {
    accentColor: "#429BA3",
  },
  [FishCategory.Winter]: {
    accentColor: "#429BA3",
  },
  [FishCategory.CrabPot]: {
    accentColor: "#429BA3",
  },
  [FishCategory.Other]: {
    accentColor: "#429BA3",
  },
  [FishCategory.Legendary]: {
    accentColor: "#429BA3",
  },
  [FishCategory.Legendary2]: {
    accentColor: "#429BA3",
  },
};

export const STARDEW_FISHES = {
  // "Fish" category
  152: {
    name: "Seaweed",
    masterAngler: true,
    categories: [FishCategory.Other],
  },
  153: {
    name: "Green Algae",
    masterAngler: true,
    categories: [FishCategory.Other],
  },
  157: {
    name: "White Algae",
    masterAngler: true,
    categories: [FishCategory.Other],
  },

  // "Fish -4" category
  128: {
    name: "Pufferfish",
    masterAngler: true,
    categories: [FishCategory.Summer, FishCategory.GingerIsland],
    weather: Weather.Sun,
  },
  129: {
    name: "Anchovy",
    masterAngler: true,
    categories: [FishCategory.Spring, FishCategory.Fall],
  },
  130: {
    name: "Tuna",
    masterAngler: true,
    categories: [
      FishCategory.Summer,
      FishCategory.Winter,
      FishCategory.GingerIsland,
    ],
  },
  // 131: {
  //   name: "Sardine",
  //   masterAngler: true,
  // },
  // 132: {
  //   name: "Bream",
  //   masterAngler: true,
  // },
  // 136: {
  //   name: "Largemouth Bass",
  //   masterAngler: true,
  // },
  // 137: {
  //   name: "Smallmouth Bass",
  //   masterAngler: true,
  // },
  // 138: {
  //   name: "Rainbow Trout",
  //   masterAngler: true,
  // },
  // 139: {
  //   name: "Salmon",
  //   masterAngler: true,
  // },
  // 140: {
  //   name: "Walleye",
  //   masterAngler: true,
  // },
  // 141: {
  //   name: "Perch",
  //   masterAngler: true,
  // },
  // 142: {
  //   name: "Carp",
  //   masterAngler: true,
  // },
  // 143: {
  //   name: "Catfish",
  //   masterAngler: true,
  // },
  // 144: {
  //   name: "Pike",
  //   masterAngler: true,
  // },
  // 145: {
  //   name: "Sunfish",
  //   masterAngler: true,
  // },
  // 146: {
  //   name: "Red Mullet",
  //   masterAngler: true,
  // },
  // 147: {
  //   name: "Herring",
  //   masterAngler: true,
  // },
  // 148: {
  //   name: "Eel",
  //   masterAngler: true,
  // },
  // 149: {
  //   name: "Octopus",
  //   masterAngler: true,
  // },
  // 150: {
  //   name: "Red Snapper",
  //   masterAngler: true,
  // },
  // 151: {
  //   name: "Squid",
  //   masterAngler: true,
  // },
  // 154: {
  //   name: "Sea Cucumber",
  //   masterAngler: true,
  // },
  // 155: {
  //   name: "Super Cucumber",
  //   masterAngler: true,
  // },
  // 156: {
  //   name: "Ghostfish",
  //   masterAngler: true,
  // },
  // 158: {
  //   name: "Stonefish",
  //   masterAngler: true,
  // },
  // 159: {
  //   name: "Crimsonfish",
  //   masterAngler: true,
  // },
  // 160: {
  //   name: "Angler",
  //   masterAngler: true,
  // },
  // 161: {
  //   name: "Ice Pip",
  //   masterAngler: true,
  // },
  // 162: {
  //   name: "Lava Eel",
  //   masterAngler: true,
  // },
  // 163: {
  //   name: "Legend",
  //   masterAngler: true,
  // },
  // 164: {
  //   name: "Sandfish",
  //   masterAngler: true,
  // },
  // 165: {
  //   name: "Scorpion Carp",
  //   masterAngler: true,
  // },
  // 682: {
  //   name: "Mutant Carp",
  //   masterAngler: true,
  // },
  // 698: {
  //   name: "Sturgeon",
  //   masterAngler: true,
  // },
  // 699: {
  //   name: "Tiger Trout",
  //   masterAngler: true,
  // },
  // 700: {
  //   name: "Bullhead",
  //   masterAngler: true,
  // },
  // 701: {
  //   name: "Tilapia",
  //   masterAngler: true,
  // },
  // 702: {
  //   name: "Chub",
  //   masterAngler: true,
  // },
  // 704: {
  //   name: "Dorado",
  //   masterAngler: true,
  // },
  // 705: {
  //   name: "Albacore",
  //   masterAngler: true,
  // },
  // 706: {
  //   name: "Shad",
  //   masterAngler: true,
  // },
  // 707: {
  //   name: "Lingcod",
  //   masterAngler: true,
  // },
  // 708: {
  //   name: "Halibut",
  //   masterAngler: true,
  // },
  // 715: {
  //   name: "Lobster",
  //   masterAngler: true,
  // },
  // 716: {
  //   name: "Crayfish",
  //   masterAngler: true,
  // },
  // 717: {
  //   name: "Crab",
  //   masterAngler: true,
  // },
  // 718: {
  //   name: "Cockle",
  //   masterAngler: true,
  // },
  // 719: {
  //   name: "Mussel",
  //   masterAngler: true,
  // },
  // 720: {
  //   name: "Shrimp",
  //   masterAngler: true,
  // },
  // 721: {
  //   name: "Snail",
  //   masterAngler: true,
  // },
  // 722: {
  //   name: "Periwinkle",
  //   masterAngler: true,
  // },
  // 723: {
  //   name: "Oyster",
  //   masterAngler: true,
  // },
  // 734: {
  //   name: "Woodskip",
  //   masterAngler: true,
  // },
  // 775: {
  //   name: "Glacierfish",
  //   masterAngler: true,
  // },
  // 795: {
  //   name: "Void Salmon",
  //   masterAngler: true,
  // },
  // 796: {
  //   name: "Slimejack",
  //   masterAngler: true,
  // },

  // // >= 1.3
  // 798: {
  //   name: "Midnight Squid",
  //   masterAngler: true,
  // },
  // 799: {
  //   name: "Spook Fish",
  //   masterAngler: true,
  // },
  // 800: {
  //   name: "Blobfish",
  //   masterAngler: true,
  // },

  // TODO
  // if (compareSemVer(saveInfo.version, "1.4") >= 0) {
  //   meta.recipes[269] = 'Midnight Carp';
  //   meta.recipes[267] = 'Flounder';
  // }

  // if (compareSemVer(saveInfo.version, "1.5") >= 0) {
  //   meta.recipes[836] = 'Stingray';
  //   meta.recipes[837] = 'Lionfish';
  //   meta.recipes[838] = 'Blue Discus';
  // }

  // if (compareSemVer(saveInfo.version, "1.6") >= 0) {
  //   meta.recipes["Goby"] = 'Goby';
  //   meta.recipes["CaveJelly"] = 'Cave Jelly';
  //   meta.recipes["RiverJelly"] = 'River Jelly';
  //   meta.recipes["SeaJelly"] = 'Sea Jelly';
  //   meta.recipes[372] = 'Clam';

  // Extended Family legendaries were added in 1.5 but not tracked until 1.6 because they are only
  // necessary for bobber unlocks
  //   meta.bobber[898] = 'Son of Crimsonfish';
  //   meta.bobber[899] = 'Ms. Angler';
  //   meta.bobber[900] = 'Legend II';
  //   meta.bobber[901] = 'Radioactive Carp';
  //   meta.bobber[902] = 'Glacierfish Jr.';
  // }
};
