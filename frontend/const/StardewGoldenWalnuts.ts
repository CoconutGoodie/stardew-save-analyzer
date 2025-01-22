enum WalnutDiscoveryLocation {
  GENERAL = "GENERAL",
  ISLAND_EAST = "ISLAND_EAST",
  ISLAND_WEST = "ISLAND_WEST",
  ISLAND_SOUTH = "ISLAND_SOUTH",
  ISLAND_NORTH = "ISLAND_NORTH",
}

interface GoldenWalnutInfo {
  id?: string;
  quantity: number;
  howToFind: string;
  details?: string[];
}

export const STARDEW_GOLDEN_WALNUTS = {
  [WalnutDiscoveryLocation.GENERAL]: [
    {
      quantity: 1,
      howToFind:
        "Golden Coconuts, which are found anywhere on Ginger Island, can be brought to the Blacksmith back in Stardew Valley to be opened. The first coconut that Clint opens produces a Golden Walnut.",
    },
    {
      quantity: 5,
      howToFind:
        "A maximum of five Golden Walnuts can be obtained by fishing anywhere on Ginger Island. Until five have been collected in this manner, each cast anywhere on the island gives a 15% chance to obtain a walnut.",
    },
  ],

  [WalnutDiscoveryLocation.ISLAND_EAST]: [
    {
      quantity: 1,
      howToFind:
        "A walnut in a bush is found in the jungle on the path towards Leo's hut.",
    },
    {
      quantity: 3,
      howToFind:
        "Place a Banana on the altar by the staircase to Leo's hut. A gorilla appears and rewards the player with 3 walnuts.",
    },
    {
      quantity: 1,
      howToFind: "Hit the tree inside Leo's hut with an axe.",
    },
    {
      quantity: 1,
      howToFind:
        "From the foot of the stairs to Leo's hut, follow the path eastward along a hidden passage to the Gem Bird Shrine. There is a walnut to the south of the shrine.",
    },
    {
      quantity: 5,
      howToFind:
        "	Complete the Gem Birds puzzle to receive 5 walnuts. Image shows a final gem being placed on the pedestals.",
    },
  ],

  [WalnutDiscoveryLocation.ISLAND_SOUTH]: [
    {
      quantity: 1,
      howToFind:
        "Go up the stairs to Island North, immediately turn east, then go south through a hidden route behind a tree to access the walnut bush visible on the upper cliff in Island South. Note that the Parrot Hint considers this walnut as being hidden in Island North.",
    },
    {
      quantity: 1,
      howToFind:
        "Go to the Island Southeast, accessible after the beach resort is built. The first time the player fishes in the starfish-shaped tide pool will yield a golden walnut.",
    },
    {
      quantity: 1,
      howToFind:
        "Go to the Island Southeast, which is accessible after the beach resort is built. Find a diamond of yellow starfish and dig up the center.",
    },
    {
      quantity: 5,
      howToFind:
        "On a rainy day, go to the Island Southeast, which is accessible after the Beach Resort is built. There will be a mermaid on a rock and a set of five rocks on the beach. Place a Flute Block under each set of stones on the shore, then tune them based on the number of stones above them. A large stone symbolizes 5, while a small stone symbolizes 1 (solution here). Once the blocks have been tuned correctly, run past them from left to right.",
    },
    {
      quantity: 3,
      howToFind:
        "On a non-rainy night after 8 PM on an even day, go to the Pirate Cove, which is accessible after the beach resort is built. Winning a round of darts will yield a prize of a walnut up to 3 times.",
    },
    {
      quantity: 1,
      howToFind:
        "Go to the Pirate Cove, which is accessible after the beach resort is built. Dig up the patch of exposed sand among the barrels east of the water.",
    },
  ],

  [WalnutDiscoveryLocation.ISLAND_NORTH]: [
    {
      quantity: 1,
      howToFind:
        "Atop the stairs at the Island North entrance, turn west and dig at the center of stone circle.",
    },
    {
      quantity: 1,
      howToFind:
        "Atop the stairs at the Island North entrance, turn west into the hidden passage to reach a grove with a walnut bush.",
    },
    {
      quantity: 1,
      howToFind:
        "Atop the stairs at the Island North entrance, move northeast to the grassy area and dig at the center of a circle of flowers.",
    },
    {
      quantity: 1,
      howToFind:
        "Atop the stairs at the Island North entrance, go northeast to the circle of flowers in the grassy area, then turn east and move onward to another grassy area. Dig at the center of the circle of stones.",
    },
    {
      quantity: 1,
      howToFind:
        "Southeast of the Island Field Office, find the patch of sand with unusual texture and dig for the buried golden walnut.",
    },
    {
      quantity: 1,
      howToFind:
        "Up the north steps of the dig site, dig at the center of the stone circle.",
    },
    {
      quantity: 1,
      howToFind:
        "Up the north steps of the dig site and west across the bridge, there is a walnut plant.",
    },
    {
      quantity: 2,
      howToFind:
        "Up the north steps of the dig site and east through the hidden passage in the cliff, the path emerges to a bridge eastward and two walnut plants beyond it.",
    },
    {
      quantity: 6,
      howToFind:
        "Complete the Large Animal collection at the Island Field Office.",
    },
    {
      quantity: 3,
      howToFind: "Complete the Snake collection at the Island Field Office.",
    },
    {
      quantity: 1,
      howToFind: "Donate a Mummified Frog to the Island Field Office.",
    },
    {
      quantity: 1,
      howToFind: "Donate a Mummified Bat to the Island Field Office.",
    },
    {
      quantity: 1,
      howToFind:
        "Finish Purple Flowers Island Survey to get 1 walnut. The correct number is 22.",
    },
    {
      quantity: 1,
      howToFind:
        "Finish Purple Starfish Island Survey to get 1 walnut. The correct number is 18.",
    },
    {
      quantity: 1,
      howToFind:
        "Southeast of the Volcano Dungeon's entrance, find the walnut plant hidden by a tree.",
    },
    {
      quantity: 1,
      howToFind:
        "Eastward from the Volcano Dungeon entrance, dig in the sand circled by two bushes and an arc of stones.",
    },
    {
      quantity: 1,
      howToFind:
        "Northeast of the Volcano Dungeon entrance, there is a curved tree protruding high from the side of the Volcano. The walnut hidden in that tree can be knocked down using a slingshot.",
    },
    {
      quantity: 1,
      howToFind:
        "Southwest of the Volcano Dungeon's entrance is a curved palm tree growing out of the cliff's side. Dig the tile that is visible just inside the loop of the palm tree. (Digging will produce nothing if the journal scrap has not yet been read.)",
    },
    {
      quantity: 1,
      howToFind:
        "Dig at the center of the circle of stones at the extreme northwest of the map, a location where Leo sometimes stands.",
    },
    {
      quantity: 1,
      howToFind:
        "At the extreme northwest of the map, west of the volcano, proceed west along the wall and a notch north through the hidden passage westward. There is a walnut in the secluded bush.",
    },
    {
      quantity: 2,
      howToFind:
        "When at the river of lava at the entrance of the Volcano Dungeon, use a Watering Can to make a long path westward. Extend the path southward to the landing near the river's end. Exit the volcano south into an open area with two bushes.",
    },
    {
      id: "VolcanoMining",
      quantity: 5,
      howToFind:
        "While in the Volcano Dungeon, 5 Golden Walnuts can be obtained by breaking rocks.",
    },
    {
      id: "VolcanoMonsterDrop",
      quantity: 5,
      howToFind:
        "While in the Volcano Dungeon, 5 Golden Walnuts can be obtained by killing enemies.",
    },
    {
      id: "VolcanoBarrel",
      quantity: 5,
      howToFind:
        "While in the Volcano Dungeon, 5 Golden Walnuts can be obtained by breaking metal crates.",
    },
    {
      id: "VolcanoNormalChest",
      quantity: 1,
      howToFind:
        "While in the Volcano Dungeon, 1 Golden Walnuts can be obtained by opening common chest.",
    },
    {
      id: "VolcanoRareChest",
      quantity: 1,
      howToFind:
        "While in the Volcano Dungeon, 1 Golden Walnuts can be obtained by opening rare chest.",
    },
    {
      quantity: 2,
      howToFind:
        "Reach the Forge. There is a walnut plant both at the forge's entrance and at its exit.",
    },
  ],

  [WalnutDiscoveryLocation.ISLAND_WEST]: [],
} satisfies Record<WalnutDiscoveryLocation, GoldenWalnutInfo[]>;
