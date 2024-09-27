import { SummarySection } from "@src/component/SummarySection";
import { GameSave } from "@src/gamesave/GameSave";
import miniShippingBinPng from "@src/assets/icon/mini-shipping-bin.png";

interface Props {
  gameSave: GameSave;
}

export const ShippingSection = (props: Props) => {
  return (
    <SummarySection
      id="shipping"
      sectionTitle="Shipping"
      sectionIcon={miniShippingBinPng}
      collapsable
      // allDone={allDone}
    >
      WIP
    </SummarySection>
  );
};


