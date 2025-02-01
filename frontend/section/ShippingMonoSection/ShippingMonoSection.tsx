import binPng from "~frontend/assets/sprite/shipping/bin.png";
import { FarmersRow } from "~frontend/component/FarmersRow/FarmersRow";
import { ObjectiveOLD } from "~frontend/component/Objective/Objective";
import { SummarySection } from "~frontend/component/SummarySection";
import {
  STARDEW_SHIPPABLE_MONOCROPS,
  STARDEW_SHIPPABLES,
} from "~frontend/const/StardewShippables";
import { GameSave } from "~frontend/gamesave/GameSave";
import { useGoals_OLD } from "~frontend/hook/useGoals_OLD";
import { useSyncedScrollbar } from "~frontend/hook/useSyncedScrollbar";
import { mapIterator, reduceIterator } from "~frontend/util/iterator.utils";
import { useState } from "react";
import { mapToObj } from "remeda";
import starPng from "~frontend/assets/sprite/skill/mastery/mastery_star.png";

import styles from "./ShippingMonoSection.module.scss";
import { ImageObjective } from "~frontend/component/ImageObjective";
import { ACHIEVEMENT_SPRITES, SHIPPABLE_SPRITES } from "~frontend/const/Assets";
import { snakeCase } from "case-anything";
import { Scrollbox } from "~frontend/component/Scrollbox";
import clsx from "clsx";
import { StardewWiki } from "~frontend/util/StardewWiki";
import { AchievementDisplay } from "~frontend/component/AchievementDisplay";
import ColorScale from "color-scales";
import { FarmerTag } from "~frontend/component/FarmerTag";

interface Props {
  gameSave: GameSave;
}

const DonenessScales = new ColorScale(0, 1, ["#FF1F00", "#37BD81"]);

export const ShippingMonoSection = (props: Props) => {
  const [expanded, setExpanded] = useState(false);

  const { registerScrollableRef } = useSyncedScrollbar([expanded]);

  const farmers = props.gameSave.getAllFarmers();

  const { allDone, goals } = useGoals_OLD({
    individuals: mapToObj(farmers, (farmer) => [
      farmer.name,
      {
        achievements: [props.gameSave.achievements[farmer.name].monoculture],
      },
    ]),
  });

  return (
    <SummarySection
      id="shipping-monoculture"
      sectionTitle="Shipping - Monoculture"
      sectionIcon={binPng}
      collapsable
      allDone={allDone}
    >
      <FarmersRow>
        {farmers.map((farmer) => {
          const farmerAchievements = props.gameSave.achievements[farmer.name];

          const shippedDistinctCount = reduceIterator(
            STARDEW_SHIPPABLE_MONOCROPS.values(),
            (shippableId, count) => {
              if (farmer.shippedItems[shippableId]?.amount >= 1) {
                return count + 1;
              }
              return count;
            },
            0
          );

          const shippedCropCount = reduceIterator(
            STARDEW_SHIPPABLE_MONOCROPS.values(),
            (shippableId, count) => {
              if (farmer.shippedItems[shippableId]?.amount >= 1) {
                return count + farmer.shippedItems[shippableId].amount;
              }
              return count;
            },
            0
          );

          const mostSoldCrop = reduceIterator(
            STARDEW_SHIPPABLE_MONOCROPS.values(),
            (shippableId, crop) => {
              const curr = farmer.shippedItems[shippableId];
              if (curr == null) return crop;
              if (crop == null) return curr;
              if (curr.amount >= crop.amount) return curr;
              return crop;
            },
            null as (typeof farmer)["shippedItems"][string] | null
          );

          return (
            <div key={farmer.name}>
              <FarmerTag farmer={farmer} />

              <div className={styles.objectives}>
                {mostSoldCrop != null && (
                  <ObjectiveOLD icon={<img height={16} src={binPng} />} done>
                    Shipped <strong>{mostSoldCrop.name}</strong> at most.
                  </ObjectiveOLD>
                )}
                <ObjectiveOLD icon={<img height={16} src={binPng} />} done>
                  Shipped <strong>{shippedDistinctCount} different</strong>{" "}
                  crops under Monoculture Category.
                </ObjectiveOLD>
                <ObjectiveOLD icon={<img height={16} src={binPng} />} done>
                  Shipped <strong>{shippedCropCount} crops</strong> in total
                  under Monoculture Category.
                </ObjectiveOLD>
              </div>

              <div className={styles.showcase}>
                <ImageObjective
                  height={55}
                  src={ACHIEVEMENT_SPRITES.resolve("monoculture")}
                  title={"Monoculture"}
                  checkmarkInvisible
                  done
                />

                <div className={styles.info}>
                  <div className={styles.text}>
                    {mostSoldCrop != null && (
                      <ImageObjective
                        height={20}
                        src={SHIPPABLE_SPRITES.resolve(
                          snakeCase(mostSoldCrop.name?.replace(/-/g, " ") ?? "")
                        )}
                        title={mostSoldCrop.name}
                        checkmarkInvisible
                        done
                      />
                    )}
                    <span>
                      {mostSoldCrop?.name} {mostSoldCrop?.amount ?? 0} / 300{" "}
                    </span>
                  </div>

                  <div
                    className={styles.bar}
                    style={{
                      ["--percentage" as string]: `${Math.min(
                        ((mostSoldCrop?.amount ?? 0) / 300) * 100,
                        100
                      )}%`,
                    }}
                  />
                </div>
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
                    STARDEW_SHIPPABLE_MONOCROPS.values(),
                    (shippableId) => {
                      const shippableName = STARDEW_SHIPPABLES[shippableId];
                      const shipped = farmer.shippedItems[shippableId];

                      return (
                        <div
                          key={shippableId.toString()}
                          className={styles.shippedItem}
                        >
                          <a
                            href={StardewWiki.getLink(shippableName)}
                            target="_blank"
                          >
                            <ImageObjective
                              height={36}
                              src={SHIPPABLE_SPRITES.resolve(
                                snakeCase(
                                  shippableName.replace(/-/g, " ") ?? ""
                                )
                              )}
                              title={shippableName}
                              checkmarkInvisible
                              done
                            />
                          </a>
                          <span>{shippableName}</span>
                          <span>{shipped?.amount ?? 0} / 300</span>
                          <div
                            className={styles.doneness}
                            style={{
                              ["--color" as string]: DonenessScales.getColor(
                                (shipped?.amount ?? 0) / 300
                              ).toHexString(),
                            }}
                          >
                            {Math.min(
                              100,
                              Math.floor(((shipped?.amount ?? 0) / 300) * 100)
                            )}
                            %
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              </Scrollbox>

              <div className={styles.achievements}>
                <AchievementDisplay
                  title={farmerAchievements.monoculture.title}
                  description={"ship 300 of one crop"}
                  achieved={farmerAchievements.monoculture.achieved}
                >
                  {!farmerAchievements.monoculture.achieved && (
                    <>
                      {" "}
                      — Shipped <strong>{mostSoldCrop?.amount ?? 0}</strong> out
                      of <strong>300</strong>{" "}
                      {mostSoldCrop != null && mostSoldCrop.name}
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
