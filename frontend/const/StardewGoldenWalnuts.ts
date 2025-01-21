enum WalnutDiscoveryType {
  GOLDEN_COCONUT = "GOLDEN_COCONUT",
  FISHING = "FISHING",
  EXPLORATION = "EXPLORATION",
}

interface GoldenWalnutInfo {
  quantity: number;
  discoveryType: WalnutDiscoveryType;
  howToFind: string;
}

export const STARDEW_GOLDEN_WALNUTS: GoldenWalnutInfo[] = [
  {
    quantity: 1,
    discoveryType: WalnutDiscoveryType.GOLDEN_COCONUT,
    howToFind:
      "Golden Coconuts, which are found anywhere on Ginger Island, can be brought to the Blacksmith back in Stardew Valley to be opened. The first coconut that Clint opens produces a Golden Walnut.",
  },
];
