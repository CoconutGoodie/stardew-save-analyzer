import { SummarySection } from "@src/component/SummarySection";
import { GameSave } from "@src/gamesave/GameSave";
import miniShippingBinPng from "@src/assets/icon/mini-shipping-bin.png";
import { useState } from "react";
import { useSyncedScrollbar } from "@src/hook/useSyncedScrollbar";
import { useGoals } from "@src/hook/useGoals";
import { FarmersRow } from "@src/component/FarmersRow";
import { FarmerTag } from "@src/component/FarmerTag";
import { entries, keys, mapToObj, sum, times, values } from "remeda";
import { Scrollbox } from "@src/component/Scrollbox";
import { Objective } from "@src/component/Objective";
import binPng from "@src/assets/sprite/shipping/bin.png";

import styles from "./ShippingSection.module.scss";

interface Props {
  gameSave: GameSave;
}

export const ShippingSection = (props: Props) => {
  const [expanded, setExpanded] = useState(false);

  const { registerScrollableRef: addScrollableRef } = useSyncedScrollbar([
    expanded,
  ]);

  const farmers = props.gameSave.getAllFarmers();

  const { allDone, goals } = useGoals({
    individuals: mapToObj(farmers, (farmer) => [
      farmer.name,
      {},
      // {
      //   achievements: [
      //     props.gameSave.achievements[farmer.name].theBottom,
      //     props.gameSave.achievements[farmer.name].protectorOfTheValley,
      //   ],
      //   objectives: {
      //     gainAccessToGuild: {
      //       current: farmer.monsterKills.totalKills,
      //       goal: 1000,
      //     },
      //   },
      // },
    ]),
  });

  return (
    <SummarySection
      id="shipping"
      sectionTitle="Shipping - Full Shipment"
      sectionIcon={binPng}
      collapsable
      allDone={allDone}
    >
      <FarmersRow>
        {farmers.map((farmer) => {
          return (
            <div key={farmer.name}>
              <FarmerTag farmer={farmer} />

              <div className={styles.objectives}>
                <Objective icon={<img height={16} src={binPng} />} done>
                  Shipped{" "}
                  <strong>{keys(farmer.shippedItems).length} different</strong>{" "}
                  items.
                </Objective>
                <Objective icon={<img height={16} src={binPng} />} done>
                  Shipped{" "}
                  <strong>{sum(values(farmer.shippedItems))} items</strong> in
                  total.
                </Objective>
              </div>

              <Scrollbox
                scrollRef={addScrollableRef}
                expanded={expanded}
                onExpanded={setExpanded}
                className={styles.shippedItemsScrollbox}
              >
                <div className={styles.shippedItems}>
                  <img width={100} src={binPng} />

                  {times(20, (i) => (
                    <div className={styles.item}>{i}</div>
                  ))}
                </div>
              </Scrollbox>

              {/* <div>
                <pre>{JSON.stringify(farmer.shippedItems, null, 2)}</pre>
              </div> */}
            </div>
          );
        })}
      </FarmersRow>
    </SummarySection>
  );
};
