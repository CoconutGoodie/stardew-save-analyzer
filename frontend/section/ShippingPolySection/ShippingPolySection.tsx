import binPng from "~frontend/assets/sprite/shipping/bin.png";
import { AchievementDisplay } from "~frontend/component/AchievementDisplay";
import { FarmersRow } from "~frontend/component/FarmersRow";
import { FarmerTag } from "~frontend/component/FarmerTag";
import { ImageObjective } from "~frontend/component/ImageObjective";
import { Objective } from "~frontend/component/Objective";
import { Scrollbox } from "~frontend/component/Scrollbox";
import { SummarySection } from "~frontend/component/SummarySection";
import { SHIPPABLE_SPRITES } from "~frontend/const/Assets";
import {
  STARDEW_SHIPPABLE_POLYCROPS,
  STARDEW_SHIPPABLES,
} from "~frontend/const/StardewShippables";
import { GameSave } from "~frontend/gamesave/GameSave";
import { useGoals } from "~frontend/hook/useGoals";
import { useSyncedScrollbar } from "~frontend/hook/useSyncedScrollbar";
import { mapIterator, reduceIterator } from "~frontend/util/iterator.utils";
import { StardewWiki } from "~frontend/util/StardewWiki";
import { snakeCase } from "case-anything";
import clsx from "clsx";
import { useState } from "react";
import { mapToObj, times } from "remeda";

import styles from "./ShippingPolySection.module.scss";

interface Props {
  gameSave: GameSave;
}

export const ShippingPolySection = (props: Props) => {
  const [expanded, setExpanded] = useState(false);

  const { registerScrollableRef } = useSyncedScrollbar([expanded]);

  const farmers = props.gameSave.getAllFarmers();

  const { allDone, goals } = useGoals({
    individuals: mapToObj(farmers, (farmer) => [
      farmer.name,
      {
        achievements: [props.gameSave.achievements[farmer.name].polyculture],
      },
    ]),
  });

  const renderProgress = (amount: number) => {
    return (
      <div className={styles.progress}>
        {times(Math.min(15, amount), (i) => (
          <div key={"filled" + i} data-filled />
        ))}
        {times(Math.max(0, 15 - amount), (i) => (
          <div key={"normal" + i} />
        ))}
      </div>
    );
  };

  return (
    <SummarySection
      id="shipping-polyculture"
      sectionTitle="Shipping - Polyculture"
      sectionIcon={binPng}
      collapsable
      allDone={allDone}
    >
      <FarmersRow>
        {farmers.map((farmer) => {
          const farmerAchievements = props.gameSave.achievements[farmer.name];

          const totalCount = STARDEW_SHIPPABLE_POLYCROPS.size;

          const shippedCount = reduceIterator(
            STARDEW_SHIPPABLE_POLYCROPS.values(),
            (shippableId, count) => {
              if (farmer.shippedItems[shippableId]?.amount >= 15) {
                return count + 1;
              }
              return count;
            },
            0
          );

          const shippedDistinctCount = reduceIterator(
            STARDEW_SHIPPABLE_POLYCROPS.values(),
            (shippableId, count) => {
              if (farmer.shippedItems[shippableId]?.amount >= 1) {
                return count + 1;
              }
              return count;
            },
            0
          );

          const shippedCropCount = reduceIterator(
            STARDEW_SHIPPABLE_POLYCROPS.values(),
            (shippableId, count) => {
              if (farmer.shippedItems[shippableId]?.amount >= 1) {
                return count + farmer.shippedItems[shippableId].amount;
              }
              return count;
            },
            0
          );

          return (
            <div key={farmer.name}>
              <FarmerTag farmer={farmer} />

              <div className={styles.objectives}>
                <Objective icon={<img height={16} src={binPng} />} done>
                  Shipped <strong>{shippedDistinctCount} different</strong>{" "}
                  crops under Polyculture Category.
                </Objective>
                <Objective icon={<img height={16} src={binPng} />} done>
                  Shipped <strong>{shippedCropCount} crops</strong> in total
                  under Polyculture Category.
                </Objective>
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
                  {mapIterator(
                    STARDEW_SHIPPABLE_POLYCROPS.values(),
                    (shippableId) => {
                      const shippableName = STARDEW_SHIPPABLES[shippableId];
                      const shipped = farmer.shippedItems[shippableId];

                      return (
                        <div
                          key={shippableId.toString()}
                          className={styles.shippedItem}
                          data-done={
                            farmer.shippedItems[shippableId]?.amount >= 15
                          }
                        >
                          <a
                            href={StardewWiki.getLink(shippableName)}
                            target="_blank"
                          >
                            <ImageObjective
                              height={54}
                              src={SHIPPABLE_SPRITES.resolve(
                                snakeCase(
                                  shippableName.replace(/-/g, " ") ?? ""
                                )
                              )}
                              title={shippableName}
                              done={shipped?.amount >= 15}
                            />
                          </a>
                          {renderProgress(shipped?.amount ?? 0)}
                          <span>
                            <em>{shippableName} Shipped:</em> {shipped?.amount ?? 0} /
                            15
                          </span>
                        </div>
                      );
                    }
                  )}
                </div>
              </Scrollbox>

              <div className={styles.achievements}>
                <AchievementDisplay
                  title={farmerAchievements.polyculture.title}
                  description={"ship 15 of each crop"}
                  achieved={farmerAchievements.polyculture.achieved}
                >
                  {!farmerAchievements.polyculture.achieved && (
                    <>
                      {" "}
                      — Shipped <strong>{shippedCount}</strong> out of{" "}
                      <strong>{totalCount}</strong> crops
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
