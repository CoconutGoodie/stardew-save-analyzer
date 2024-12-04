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
import { keys, mapToObj, sum, times, values } from "remeda";
import { SHIPPABLE_SPRITES } from "@src/const/Assets";
import { snakeCase } from "case-anything";
import { ImageObjective } from "@src/component/ImageObjective";
import { StardewWiki } from "@src/util/StardewWiki";
import clsx from "clsx";
import { useGoals } from "@src/hook/useGoals";
import { AchievementDisplay } from "@src/component/AchievementDisplay";
import { reduceIterator } from "@src/util/iterator.utils";

interface Props {
  gameSave: GameSave;
}

export const ShippingPolySection = (props: Props) => {
  const [expanded, setExpanded] = useState(false);

  const { registerScrollableRef: addScrollableRef } = useSyncedScrollbar([
    expanded,
  ]);

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
                  crops under Polycrop Category.
                </Objective>
                <Objective icon={<img height={16} src={binPng} />} done>
                  Shipped <strong>{shippedCropCount} crops</strong> in total
                  under Polycrop Category.
                </Objective>
              </div>

              <Scrollbox
                scrollRef={addScrollableRef}
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
                  {[...STARDEW_SHIPPABLE_POLYCROPS.values()]
                    .map(
                      (shippableId) =>
                        [shippableId, farmer.shippedItems[shippableId]] as const
                    )
                    .map(([shippableId, shippable]) => (
                      <div
                        key={shippableId.toString()}
                        className={styles.shippedItem}
                        data-done={
                          farmer.shippedItems[shippableId]?.amount >= 15
                        }
                      >
                        <a
                          href={StardewWiki.getLink(shippable.name ?? "")}
                          target="_blank"
                        >
                          <ImageObjective
                            height={54}
                            src={SHIPPABLE_SPRITES.resolve(
                              snakeCase(
                                shippable.name?.replace(/-/g, " ") ?? ""
                              )
                            )}
                            title={shippable.name}
                            done={
                              farmer.shippedItems[shippableId]?.amount >= 15
                            }
                          />
                        </a>
                        {renderProgress(
                          farmer.shippedItems[shippableId]?.amount
                        )}
                        <span>
                          <em>{shippable.name} Shipped:</em>{" "}
                          {farmer.shippedItems[shippableId]?.amount} / 15
                        </span>
                      </div>
                    ))}
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
