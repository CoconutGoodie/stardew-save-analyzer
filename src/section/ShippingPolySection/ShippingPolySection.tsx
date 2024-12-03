import { SummarySection } from "@src/component/SummarySection";
import binPng from "@src/assets/sprite/shipping/bin.png";
import { GameSave } from "@src/gamesave/GameSave";
import { FarmersRow } from "@src/component/FarmersRow";
import { useState } from "react";
import { STARDEW_SHIPPABLE_POLYCROPS } from "@src/const/StardewShippables";
import { FarmerTag } from "@src/component/FarmerTag";

import styles from "./ShippingPolySection.module.scss";
import { Objective } from "@src/component/Objective";
import { Scrollbox } from "@src/component/Scrollbox";
import { useSyncedScrollbar } from "@src/hook/useSyncedScrollbar";
import { values } from "remeda";
import { SHIPPABLE_SPRITES } from "@src/const/Assets";
import { snakeCase } from "case-anything";

interface Props {
  gameSave: GameSave;
}

export const ShippingPolySection = (props: Props) => {
  const [expanded, setExpanded] = useState(false);

  const { registerScrollableRef: addScrollableRef } = useSyncedScrollbar([
    expanded,
  ]);

  const farmers = props.gameSave.getAllFarmers();

  return (
    <SummarySection
      id="shipping-polyculture"
      sectionTitle="Shipping - Polyculture"
      sectionIcon={binPng}
      collapsable
      // allDone={allDone}
    >
      <FarmersRow>
        {farmers.map((farmer) => {
          console.log(farmer.shippedItems);
          return (
            <div key={farmer.name}>
              <FarmerTag farmer={farmer} />

              <div className={styles.objectives}>
                {/* <Objective icon={<img height={16} src={binPng} />} done>
                  Shipped{" "}
                  <strong>{keys(farmer.shippedItems).length} different</strong>{" "}
                  items.
                </Objective>
                <Objective icon={<img height={16} src={binPng} />} done>
                  Shipped{" "}
                  <strong>
                    {sum(values(farmer.shippedItems).map((s) => s.amount))}{" "}
                    items
                  </strong>{" "}
                  in total.
                </Objective> */}
              </div>

              <Scrollbox
                scrollRef={addScrollableRef}
                expanded={expanded}
                onExpanded={setExpanded}
                className={styles.shippedItemsScrollbox}
              >
                <div className={styles.shippedItems}>
                  {[...STARDEW_SHIPPABLE_POLYCROPS.values()]
                    .map(
                      (shippableId) =>
                        [shippableId, farmer.shippedItems[shippableId]] as const
                    )
                    .map(([shippableId, shippable]) => (
                      <div
                        key={shippableId.toString()}
                        className={styles.shippedItem}
                      >
                        {/* {shippableId.toString()} -
                        {JSON.stringify(farmer.shippedItems[shippableId])} */}
                        <img
                          src={SHIPPABLE_SPRITES.resolve(
                            snakeCase(shippable.name?.replace(/-/g, " ") ?? "")
                          )}
                        />
                        <progress
                          value={farmer.shippedItems[shippableId].amount}
                          max={15}
                        />
                      </div>
                    ))}
                </div>
              </Scrollbox>
            </div>
          );
        })}
      </FarmersRow>
    </SummarySection>
  );
};
