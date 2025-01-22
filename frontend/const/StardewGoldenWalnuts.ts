enum WalnutDiscoveryLocation {
  GENERAL = "GENERAL",
  ISLAND_EAST = "ISLAND_EAST",
  ISLAND_WEST = "ISLAND_WEST",
  ISLAND_SOUTH = "ISLAND_SOUTH",
  ISLAND_NORTH = "ISLAND_NORTH",
}

interface GoldenWalnutInfo {
  quantity: number;
  howToFind: string;
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

  [WalnutDiscoveryLocation.ISLAND_NORTH]: [],

  [WalnutDiscoveryLocation.ISLAND_WEST]: [],
} satisfies Record<WalnutDiscoveryLocation, GoldenWalnutInfo[]>;
