import { capitalCase, snakeCase } from "case-anything";
import { keys, mapToObj, sumBy } from "remeda";
import { FarmerTag } from "../component/FarmerTag";
import { SummarySection } from "../component/SummarySection";
import {
  FishCategory,
  STARDEW_FISHES,
  STARDEW_FISHES_BY_CATEGORIES,
} from "../const/StardewFishes";
import { GameSave } from "../gamesave/GameSave";

import { FarmersRow } from "@src/component/FarmersRow";
import { ImageObjective } from "@src/component/ImageObjective";
import { thru } from "@src/util/utilities";
import clsx from "clsx";
import { useState } from "react";
import { Fragment } from "react/jsx-runtime";
import checkmarkPng from "../assets/icon/checkmark.png";
import questPng from "../assets/icon/quest.png";
import { AchievementDisplay } from "../component/AchievementDisplay";
import { Objective } from "../component/Objective";
import { StardewWiki } from "../util/StardewWiki";
import styles from "./FishingSection.module.scss";

import barbedHookPng from "@src/assets/icon/barbed_hook.png";
import { Scrollbox } from "@src/component/Scrollbox";
import { FISH_COVER_SPRITES, FISH_SPRITES } from "@src/const/Assets";
import { useGoals } from "@src/hook/useGoals";
import { useSyncedScrollbar } from "@src/hook/useSyncedScrollbar";

interface Props {
  gameSave: GameSave;
}

export const FishingSection = (props: Props) => {
  const [compact, setCompact] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const { registerScrollableRef: addScrollableRef } = useSyncedScrollbar([
    expanded,
  ]);

  const farmers = props.gameSave.getAllFarmers();

  const maxBobberCount = 1 + Math.floor(keys(STARDEW_FISHES).length / 2);

  const { allDone } = useGoals({
    individuals: mapToObj(farmers, (farmer) => [
      farmer.name,
      {
        achievements: [
          props.gameSave.achievements[farmer.name].motherCatch,
          props.gameSave.achievements[farmer.name].fisherman,
          props.gameSave.achievements[farmer.name].olMariner,
          props.gameSave.achievements[farmer.name].masterAngler,
        ],
        objectives: {
          collectEveryBobberStyle: {
            current: farmer.unlockedBobberCount,
            goal: maxBobberCount,
          },
        },
      },
    ]),
  });

  return (
    <SummarySection
      id="fishing"
      sectionTitle="Fishing"
      collapsable
      allDone={allDone}
    >
      <FarmersRow>
        {farmers.map((farmer) => {
          const caughtFishCount = sumBy(farmer.caughtFish, (v) => v.amount);

          const caughtTypeCount = farmer.caughtFish.filter(
            (v) => v.amount > 0
          ).length;

          return (
            <div key={farmer.name} className={styles.farmer}>
              <FarmerTag farmer={farmer} />

              <Objective icon={<img width={16} src={barbedHookPng} />} done>
                Caught <strong>{caughtFishCount}</strong> fish in total.
              </Objective>
              <Objective icon={<img width={16} src={barbedHookPng} />} done>
                Caught <strong>{caughtTypeCount}</strong> different fish in
                total.
              </Objective>
              <Objective icon={<img width={16} src={barbedHookPng} />} done>
                Unlocked <strong>{farmer.unlockedBobberCount}</strong> bobber
                style(s).
              </Objective>

              <Scrollbox
                scrollRef={addScrollableRef}
                expanded={expanded}
                onExpanded={setExpanded}
                className={styles.categoriesScrollbox}
              >
                <div
                  className={clsx(
                    styles.categories,
                    expanded && styles.expanded
                  )}
                >
                  {keys(FishCategory).map((categoryId) => {
                    const fishes =
                      STARDEW_FISHES_BY_CATEGORIES[
                        categoryId as FishCategory
                      ] ?? [];

                    const totalCaught = fishes.reduce((total, fish) => {
                      const caughtFish = farmer.caughtFish.find(
                        (caughFish) => caughFish.fishId === fish.id
                      );
                      if (!caughtFish) return total;
                      return total + 1;
                    }, 0);

                    return (
                      <Fragment key={categoryId}>
                        {categoryId === FishCategory.Legendary_2 && (
                          <em style={{ marginTop: 10 }}>
                            Following ones are only available during Qi's{" "}
                            <a
                              href={StardewWiki.getLink(
                                "Quests",
                                "Extended_Family"
                              )}
                              target="_blank"
                            >
                              <strong>Extended Fish Family</strong>
                            </a>{" "}
                            Quest. They won't count towards the achievement, yet
                            they will still get you new{" "}
                            <a
                              href={StardewWiki.getLink(
                                "Fish_Shop",
                                "Bobber_Machine"
                              )}
                              target="_blank"
                            >
                              <strong>bobber styles</strong>
                            </a>{" "}
                            though:
                          </em>
                        )}

                        <div
                          className={clsx(
                            styles.category,
                            compact && styles.compact
                          )}
                          style={{
                            ["--background" as string]: `url(${FISH_COVER_SPRITES.resolve(
                              snakeCase(categoryId)
                            )})`,
                          }}
                        >
                          <a href={StardewWiki.getLink("Fish")} target="_blank">
                            <h1>
                              {capitalCase(categoryId)
                                .replace(/_/g, " ")
                                .replace("2", "II")}
                            </h1>

                            {thru(totalCaught >= fishes.length, (done) => (
                              <span
                                className={clsx(
                                  styles.counts,
                                  done && styles.done
                                )}
                              >
                                {totalCaught} / {fishes.length}{" "}
                                {
                                  <img
                                    height={12}
                                    src={done ? checkmarkPng : questPng}
                                  />
                                }
                              </span>
                            ))}
                          </a>

                          <div
                            className={clsx(
                              styles.fishes,
                              compact && styles.compact
                            )}
                          >
                            {fishes.map((fish) => (
                              <a
                                key={fish.id}
                                href={StardewWiki.getLink(fish.name)}
                                target="_blank"
                              >
                                <div className={styles.fish}>
                                  <ImageObjective
                                    width={compact ? 24 : 36}
                                    title={`${fish.name}`}
                                    done={
                                      (farmer.caughtFish.find(
                                        ({ fishId }) => fishId === fish.id
                                      )?.amount ?? 0) > 0
                                    }
                                    src={FISH_SPRITES.resolve(
                                      snakeCase(fish.name)
                                    )}
                                  />
                                </div>
                              </a>
                            ))}
                          </div>
                        </div>
                      </Fragment>
                    );
                  })}
                </div>
              </Scrollbox>

              {thru(
                props.gameSave.achievements[farmer.name],
                (farmerAchievements) => (
                  <>
                    <AchievementDisplay
                      title={farmerAchievements.motherCatch.title}
                      achieved={farmerAchievements.motherCatch.achieved}
                      description="catch 100 total fish"
                    />

                    <AchievementDisplay
                      title={farmerAchievements.fisherman.title}
                      achieved={farmerAchievements.fisherman.achieved}
                      description={`catch ${farmerAchievements.fisherman.goal} different fish`}
                    >
                      {!farmerAchievements.fisherman.achieved && (
                        <>
                          {" "}
                          — Completed {farmerAchievements.fisherman.caught} out
                          of {farmerAchievements.fisherman.goal}
                        </>
                      )}
                    </AchievementDisplay>

                    <AchievementDisplay
                      title={farmerAchievements.olMariner.title}
                      achieved={farmerAchievements.olMariner.achieved}
                      description={`catch ${farmerAchievements.olMariner.goal} different fish`}
                    >
                      {!farmerAchievements.olMariner.achieved && (
                        <>
                          {" "}
                          — Completed {farmerAchievements.olMariner.caught} out
                          of {farmerAchievements.olMariner.goal}
                        </>
                      )}
                    </AchievementDisplay>

                    <AchievementDisplay
                      title={farmerAchievements.masterAngler.title}
                      achieved={farmerAchievements.masterAngler.achieved}
                      description="catch every fish"
                    >
                      {!farmerAchievements.masterAngler.achieved && (
                        <>
                          {" "}
                          — Completed {
                            farmerAchievements.masterAngler.caught
                          }{" "}
                          out of {farmerAchievements.masterAngler.goal}
                        </>
                      )}
                    </AchievementDisplay>
                  </>
                )
              )}

              <Objective
                className={styles.objective}
                done={farmer.unlockedBobberCount >= maxBobberCount}
              >
                Every "
                <a
                  href={StardewWiki.getLink("Fish_Shop", "Bobber_Machine")}
                  target="_blank"
                >
                  <strong>Bobber Style</strong>
                </a>
                " is unlocked.
                {caughtTypeCount < Object.keys(STARDEW_FISHES).length && (
                  <>
                    {" "}
                    — Completed {farmer.unlockedBobberCount} out of{" "}
                    {maxBobberCount}
                  </>
                )}
              </Objective>
            </div>
          );
        })}
      </FarmersRow>
    </SummarySection>
  );
};
