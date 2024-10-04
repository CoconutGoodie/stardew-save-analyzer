export const STARDEW_SHIPPABLES: Record<PropertyKey, string> = {
  16: "Wild Horseradish",
  18: "Daffodil",
  20: "Leek",
  22: "Dandelion",
  24: "Parsnip",
  78: "Cave Carrot",
  88: "Coconut",
  90: "Cactus Fruit",
  92: "Sap",
  174: "Large Egg (White)",
  176: "Egg (White)",
  180: "Egg (Brown)",
  182: "Large Egg (Brown)",
  184: "Milk",
  186: "Large Milk",
  188: "Green Bean",
  190: "Cauliflower",
  192: "Potato",
  248: "Garlic",
  250: "Kale",
  252: "Rhubarb",
  254: "Melon",
  256: "Tomato",
  257: "Morel",
  258: "Blueberry",
  259: "Fiddlehead Fern",
  260: "Hot Pepper",
  262: "Wheat",
  264: "Radish",
  266: "Red Cabbage",
  268: "Starfruit",
  270: "Corn",
  272: "Eggplant",
  274: "Artichoke",
  276: "Pumpkin",
  278: "Bok Choy",
  280: "Yam",
  281: "Chanterelle",
  282: "Cranberries",
  283: "Holly",
  284: "Beet",
  296: "Salmonberry",
  300: "Amaranth",
  303: "Pale Ale",
  304: "Hops",
  305: "Void Egg",
  306: "Mayonnaise",
  307: "Duck Mayonnaise",
  308: "Void Mayonnaise",
  330: "Clay",
  334: "Copper Bar",
  335: "Iron Bar",
  336: "Gold Bar",
  337: "Iridium Bar",
  338: "Refined Quartz",
  340: "Honey",
  342: "Pickles",
  344: "Jelly",
  346: "Beer",
  348: "Wine",
  350: "Juice",
  // 372: "Clam", // 1.6: Clam moved from Items Shipped to Fishing collection.
  376: "Poppy",
  378: "Copper Ore",
  380: "Iron Ore",
  382: "Coal",
  384: "Gold Ore",
  386: "Iridium Ore",
  388: "Wood",
  390: "Stone",
  392: "Nautilus Shell",
  393: "Coral",
  394: "Rainbow Shell",
  396: "Spice Berry",
  397: "Sea Urchin",
  398: "Grape",
  399: "Spring Onion",
  400: "Strawberry",
  402: "Sweet Pea",
  404: "Common Mushroom",
  406: "Wild Plum",
  408: "Hazelnut",
  410: "Blackberry",
  412: "Winter Root",
  414: "Crystal Fruit",
  416: "Snow Yam",
  417: "Sweet Gem Berry",
  418: "Crocus",
  420: "Red Mushroom",
  421: "Sunflower",
  422: "Purple Mushroom",
  424: "Cheese",
  426: "Goat Cheese",
  428: "Cloth",
  430: "Truffle",
  432: "Truffle Oil",
  433: "Coffee Bean",
  436: "Goat Milk",
  438: "Large Goat Milk",
  440: "Wool",
  442: "Duck Egg",
  444: "Duck Feather",
  446: "Rabbit's Foot",
  454: "Ancient Fruit",
  459: "Mead",
  591: "Tulip",
  593: "Summer Spangle",
  595: "Fairy Rose",
  597: "Blue Jazz",
  613: "Apple",
  634: "Apricot",
  635: "Orange",
  636: "Peach",
  637: "Pomegranate",
  638: "Cherry",
  684: "Bug Meat",
  709: "Hardwood",
  724: "Maple Syrup",
  725: "Oak Resin",
  726: "Pine Tar",
  766: "Slime",
  767: "Bat Wing",
  768: "Solar Essence",
  769: "Void Essence",
  771: "Fiber",
  787: "Battery Pack",

  // >= 1.4
  807: "Dinosaur Mayonnaise",
  812: "Roe",
  445: "Caviar",
  814: "Squid Ink",
  815: "Tea Leaves",
  447: "Aged Roe",
  614: "Green Tea",
  271: "Unmilled Rice",

  // >= 1.5
  91: "Banana",
  289: "Ostrich Egg",
  829: "Ginger",
  830: "Taro Root",
  832: "Pineapple",
  834: "Mango",
  848: "Cinder Shard",
  851: "Magma Cap",
  881: "Bone Fragment",
  909: "Radioactive Ore",
  910: "Radioactive Bar",

  // >= 1.6
  Moss: "Moss",
  MysticSyrup: "Mystic Syrup",
  Raisins: "Raisins",
  DriedFruit: "Dried Fruit",
  DriedMushrooms: "Dried Mushrooms",
  Carrot: "Carrot",
  SummerSquash: "Summer Squash",
  Broccoli: "Broccoli",
  Powdermelon: "Powdermelon",
  SmokedFish: "Smoked Fish",
};

/** @see https://stardewvalleywiki.com/Achievements#Notes */
export const STARDEW_SHIPPABLE_POLYCROPS = new Set<PropertyKey>([
  /* From Category "Basic -75" */
  24, // "Parsnip"
  188, // "Green Bean"
  190, // "Cauliflower"
  192, // "Potato"
  248, // "Garlic"
  250, // "Kale"
  256, // "Tomato"
  262, // "Wheat"
  264, // "Radish"
  266, // "Red Cabbage"
  270, // "Corn"
  272, // "Eggplant"
  274, // "Artichoke"
  276, // "Pumpkin"
  278, // "Bok Choy"
  280, // "Yam"
  284, // "Beet"
  300, // "Amaranth"
  304, // "Hops"

  /* From Category "Basic -79 */
  252, // "Rhubarb"
  254, // "Melon"
  258, // "Blueberry"
  260, // "Hot Pepper"
  268, // "Starfruit"
  282, // "Cranberries"
  398, // "Grape"
  400, // "Strawberry"

  // Other
  433, // "Coffee Bean"
]);

/** @see https://stardewvalleywiki.com/Achievements#Notes */
export const STARDEW_SHIPPABLE_MONOCROPS = new Set<PropertyKey>([
  ...STARDEW_SHIPPABLE_POLYCROPS.values(),
  454, // "Ancient Fruit"
  591, // "Tulip"
  593, // "Summer Spangle"
  595, // "Fairy Rose"
  597, // "Blue Jazz"
]);
