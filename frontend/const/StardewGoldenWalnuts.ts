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

  [WalnutDiscoveryLocation.ISLAND_NORTH]: [],

  [WalnutDiscoveryLocation.ISLAND_SOUTH]: [],

  [WalnutDiscoveryLocation.ISLAND_WEST]: [],
} satisfies Record<WalnutDiscoveryLocation, GoldenWalnutInfo[]>;
