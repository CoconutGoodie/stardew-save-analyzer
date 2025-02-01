import { SummarySection } from "~frontend/component/SummarySection";
import { GameSave } from "~frontend/gamesave/GameSave";
import miniShippingBinPng from "~frontend/assets/icon/mini-shipping-bin.png";
import { useState } from "react";
import { useSyncedScrollbar } from "~frontend/hook/useSyncedScrollbar";
import { useGoals_OLD } from "~frontend/hook/useGoals_OLD";
import { FarmersRow } from "~frontend/component/FarmersRow/FarmersRow";
import { FarmerTag } from "~frontend/component/FarmerTag";
import { entries, keys, mapToObj, sum, times, values } from "remeda";
import { Scrollbox } from "~frontend/component/Scrollbox";
import { ObjectiveOLD } from "~frontend/component/Objective/Objective";
import binPng from "~frontend/assets/sprite/shipping/bin.png";

import styles from "./ShippingSection.module.scss";
import clsx from "clsx";
import {
  STARDEW_SHIPPABLE_MONOCROPS,
  STARDEW_SHIPPABLES,
} from "~frontend/const/StardewShippables";
import { ImageObjective } from "~frontend/component/ImageObjective";
import { SHIPPABLE_SPRITES } from "~frontend/const/Assets";
import { snakeCase } from "case-anything";
import { StardewWiki } from "~frontend/util/StardewWiki";
import { AchievementDisplay } from "~frontend/component/AchievementDisplay";

interface Props {
  gameSave: GameSave;
}

export const ShippingSection = (props: Props) => {
  const [expanded, setExpanded] = useState(false);

  const { registerScrollableRef } = useSyncedScrollbar([expanded]);

  const farmers = props.gameSave.getAllFarmers();

  const { allDone, goals } = useGoals_OLD({
    individuals: mapToObj(farmers, (farmer) => [
      farmer.name,
      {
        achievements: [props.gameSave.achievements[farmer.name].fullShipment],
      },
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
          const farmerAchievements = props.gameSave.achievements[farmer.name];

          const totalCount = keys(STARDEW_SHIPPABLES).length;

          const shippedCount = keys(STARDEW_SHIPPABLES).filter(
            (shippableId) => farmer.shippedItems[shippableId]?.amount > 0
          ).length;

          const completePercentage = shippedCount / totalCount;

          return (
            <div key={farmer.name}>
              <FarmerTag farmer={farmer} />

              <div className={styles.objectives}>
                <ObjectiveOLD icon={<img height={16} src={binPng} />} done>
                  Shipped{" "}
                  <strong>{keys(farmer.shippedItems).length} different</strong>{" "}
                  items.
                </ObjectiveOLD>
                <ObjectiveOLD icon={<img height={16} src={binPng} />} done>
                  Shipped{" "}
                  <strong>
                    {sum(values(farmer.shippedItems).map((s) => s.amount))}{" "}
                    items
                  </strong>{" "}
                  in total.
                </ObjectiveOLD>
              </div>

              <Scrollbox
                scrollRef={registerScrollableRef}
                expanded={expanded}
                onExpanded={setExpanded}
                className={styles.shippedItemsScrollbox}
              >
                <div
                  className={clsx(
                    styles.shippedItems,
                    expanded && styles.expanded
                  )}
                >
                  <div className={styles.bin}>
                    {Math.floor(completePercentage * 100)}%
                  </div>

                  {entries(STARDEW_SHIPPABLES).map(([id, shippableName]) => (
                    <div
                      key={id}
                      className={clsx(
                        styles.shippedItem,
                        !farmer.shippedItems[id] && styles.notShipped
                      )}
                    >
                      <a
                        href={StardewWiki.getLink(shippableName)}
                        target="_blank"
                      >
                        <ImageObjective
                          height={40}
                          src={SHIPPABLE_SPRITES.resolve(
                            snakeCase(shippableName.replace(/-/g, " "))
                          )}
                          title={shippableName}
                          done={farmer.shippedItems[id]?.amount > 0}
                        />
                      </a>
                    </div>
                  ))}
                </div>
              </Scrollbox>

              <div className={styles.achievements}>
                <AchievementDisplay
                  title={farmerAchievements.fullShipment.title}
                  description={"ship every item"}
                  achieved={farmerAchievements.fullShipment.achieved}
                >
                  {!farmerAchievements.fullShipment.achieved && (
                    <>
                      {" "}
                      — Shipped <strong>{shippedCount}</strong> out of{" "}
                      <strong>{totalCount}</strong>
                    </>
                  )}
                </AchievementDisplay>
              </div>
            </div>
          );
        })}
      </FarmersRow>
    </SummarySection>
  );
};
