export enum WeatherCondition {
  Sun = "Sun",
  Rain = "Rain",
  Wind = "Wind",
}

export enum FishCategory {
  Any_Season = "Any_Season",
  Spring = "Spring",
  Summer = "Summer",
  Fall = "Fall",
  Winter = "Winter",
  Night_Market = "Night_Market",
  The_Mines = "The_Mines",
  The_Desert = "The_Desert",
  Ginger_Island = "Ginger_Island",
  Crab_Pot = "Crab_Pot",
  Other = "Other",
  Legendary = "Legendary",
  Legendary_2 = "Legendary_2",
}

export interface Fish {
  name: string;
  categories: ValueOf<typeof FishCategory>[];
  weatherCondition?: WeatherCondition[];
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
  [FishCategory.Crab_Pot]: {
    accentColor: "#429BA3",
  },
  [FishCategory.Other]: {
    accentColor: "#429BA3",
  },
  [FishCategory.Legendary]: {
    accentColor: "#429BA3",
  },
  [FishCategory.Legendary_2]: {
    accentColor: "#429BA3",
  },
};

export const STARDEW_FISHES: Record<number, Fish> = {
  128: {
    name: "Pufferfish",
    categories: [FishCategory.Summer, FishCategory.Ginger_Island],
    weatherCondition: [WeatherCondition.Sun],
  },
  129: {
    name: "Anchovy",
    categories: [FishCategory.Spring, FishCategory.Fall],
  },
  130: {
    name: "Tuna",
    categories: [
      FishCategory.Summer,
      FishCategory.Winter,
      FishCategory.Ginger_Island,
    ],
  },
  131: {
    name: "Sardine",
    categories: [FishCategory.Spring, FishCategory.Fall, FishCategory.Winter],
  },
  132: {
    name: "Bream",
    categories: [FishCategory.Any_Season],
  },
  136: {
    name: "Largemouth Bass",
    categories: [FishCategory.Any_Season],
  },
  137: {
    name: "Smallmouth Bass",
    categories: [FishCategory.Spring, FishCategory.Fall],
  },
  138: {
    name: "Rainbow Trout",
    categories: [FishCategory.Summer],
    weatherCondition: [WeatherCondition.Sun],
  },
  139: {
    name: "Salmon",
    categories: [FishCategory.Fall],
  },
  140: {
    name: "Walleye",
    categories: [FishCategory.Fall, FishCategory.Winter],
    weatherCondition: [WeatherCondition.Rain],
  },
  141: {
    name: "Perch",
    categories: [FishCategory.Winter],
  },
  142: {
    name: "Carp",
    categories: [FishCategory.Any_Season],
  },
  143: {
    name: "Catfish",
    categories: [FishCategory.Spring, FishCategory.Fall, FishCategory.Summer],
    weatherCondition: [WeatherCondition.Rain],
  },
  144: {
    name: "Pike",
    categories: [FishCategory.Summer, FishCategory.Winter],
  },
  145: {
    name: "Sunfish",
    categories: [FishCategory.Spring, FishCategory.Summer],
    weatherCondition: [WeatherCondition.Sun, WeatherCondition.Wind],
  },
  146: {
    name: "Red Mullet",
    categories: [FishCategory.Summer, FishCategory.Winter],
  },
  147: {
    name: "Herring",
    categories: [FishCategory.Spring, FishCategory.Winter],
  },
  148: {
    name: "Eel",
    categories: [FishCategory.Spring, FishCategory.Fall],
    weatherCondition: [WeatherCondition.Rain],
  },
  149: {
    name: "Octopus",
    categories: [FishCategory.Summer],
  },
  150: {
    name: "Red Snapper",
    categories: [FishCategory.Summer, FishCategory.Fall, FishCategory.Winter],
    weatherCondition: [WeatherCondition.Rain],
  },
  151: {
    name: "Squid",
    categories: [FishCategory.Winter],
  },
  152: {
    name: "Seaweed",
    categories: [FishCategory.Other],
  },
  153: {
    name: "Green Algae",
    categories: [FishCategory.Other],
  },
  154: {
    name: "Sea Cucumber",
    categories: [FishCategory.Fall, FishCategory.Winter],
  },
  155: {
    name: "Super Cucumber",
    categories: [FishCategory.Summer, FishCategory.Fall],
  },
  156: {
    name: "Ghostfish",
    categories: [FishCategory.The_Mines],
  },
  157: {
    name: "White Algae",
    categories: [FishCategory.Other],
  },
  158: {
    name: "Stonefish",
    categories: [FishCategory.The_Mines],
  },
  159: {
    name: "Crimsonfish",
    categories: [FishCategory.Legendary, FishCategory.Summer],
  },
  // 160: {
  //   name: "Angler",
  //   masterAngler: true,
  // },
  161: {
    name: "Ice Pip",
    categories: [FishCategory.The_Mines],
  },
  162: {
    name: "Lava Eel",
    categories: [FishCategory.The_Mines],
  },
  163: {
    name: "Legend",
    categories: [FishCategory.Legendary],
  },
  164: {
    name: "Sandfish",
    categories: [FishCategory.The_Desert],
  },
  165: {
    name: "Scorpion Carp",
    categories: [FishCategory.The_Desert],
  },
  269: {
    name: "Midnight Carp",
    categories: [
      FishCategory.Fall,
      FishCategory.Winter,
      FishCategory.Ginger_Island,
    ],
  },
  267: {
    name: "Flounder",
    categories: [
      FishCategory.Spring,
      FishCategory.Summer,
      FishCategory.Ginger_Island,
    ],
  },
  // 682: {
  //   name: "Mutant Carp",
  //   masterAngler: true,
  // },
  698: {
    name: "Sturgeon",
    categories: [FishCategory.Summer, FishCategory.Winter],
  },
  699: {
    name: "Tiger Trout",
    categories: [FishCategory.Fall, FishCategory.Winter],
  },
  700: {
    name: "Bullhead",
    categories: [FishCategory.Any_Season],
  },
  701: {
    name: "Tilapia",
    categories: [
      FishCategory.Summer,
      FishCategory.Fall,
      FishCategory.Ginger_Island,
    ],
  },
  702: {
    name: "Chub",
    categories: [FishCategory.Any_Season],
  },
  704: {
    name: "Dorado",
    categories: [FishCategory.Summer],
  },
  705: {
    name: "Albacore",
    categories: [FishCategory.Fall, FishCategory.Winter],
  },
  706: {
    name: "Shad",
    categories: [FishCategory.Spring, FishCategory.Summer, FishCategory.Fall],
    weatherCondition: [WeatherCondition.Rain],
  },
  // 707: {
  //   name: "Lingcod",
  //   masterAngler: true,
  // },
  // 708: {
  //   name: "Halibut",
  //   masterAngler: true,
  // },
  715: {
    name: "Lobster",
    categories: [FishCategory.Crab_Pot],
  },
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
  798: {
    name: "Midnight Squid",
    categories: [FishCategory.Night_Market],
  },
  // 799: {
  //   name: "Spook Fish",
  //   masterAngler: true,
  // },
  // 800: {
  //   name: "Blobfish",
  //   masterAngler: true,
  // },

  // TODO
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

  900: {
    name: "Legend II",
    categories: [FishCategory.Legendary_2],
  },
};
