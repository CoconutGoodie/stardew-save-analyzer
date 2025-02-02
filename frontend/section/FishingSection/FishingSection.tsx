import barbedHookPng from "~frontend/assets/icon/barbed_hook.png";
import checkmarkPng from "~frontend/assets/icon/checkmark.png";
import questPng from "~frontend/assets/icon/quest.png";
import { AchievementDisplay } from "~frontend/component/AchievementDisplay/AchievementDisplay";
import { FarmerTag } from "~frontend/component/FarmerTag/FarmerTag";
import { FarmersRow } from "~frontend/component/FarmersRow/FarmersRow";
import { ImageObjective } from "~frontend/component/ImageObjective/ImageObjective";
import { ObjectiveOLD } from "~frontend/component/Objective/Objective";
import { Scrollbox } from "~frontend/component/Scrollbox/Scrollbox";
import { Section } from "~frontend/component/Section/Section";
import { FISH_COVER_SPRITES, FISH_SPRITES } from "~frontend/const/Assets";
import {
  FishCategory,
  STARDEW_FISHES,
  STARDEW_FISHES_BY_CATEGORIES,
} from "~frontend/const/StardewFishes";
import { GameSave } from "~frontend/gamesave/GameSave";
import { useGoals_OLD } from "~frontend/hook/useGoals_OLD";
import { useSyncedScrollbar } from "~frontend/hook/useSyncedScrollbar";
import { StardewWiki } from "~frontend/util/StardewWiki";
import { thru } from "~frontend/util/utilities";
import { capitalCase, snakeCase } from "case-anything";
import clsx from "clsx";
import { useState } from "react";
import { Fragment } from "react/jsx-runtime";
import { keys, mapToObj, sumBy } from "remeda";

import styles from "./FishingSection.module.scss";

interface Props {
  gameSave: GameSave;
}

export const FishingSection = (props: Props) => {
  const [compact, setCompact] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const { registerScrollableRef } = useSyncedScrollbar([expanded]);

  const farmers = props.gameSave.getAllFarmers();

  const maxBobberCount = 1 + Math.floor(keys(STARDEW_FISHES).length / 2);

  const { allDone } = useGoals_OLD({
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
    <Section
      id="fishing"
      sectionTitle="Fishing"
      sectionIcon={barbedHookPng}
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

              <ObjectiveOLD icon={<img width={16} src={barbedHookPng} />} done>
                Caught <strong>{caughtFishCount}</strong> fish in total.
              </ObjectiveOLD>
              <ObjectiveOLD icon={<img width={16} src={barbedHookPng} />} done>
                Caught <strong>{caughtTypeCount}</strong> different fish in
                total.
              </ObjectiveOLD>
              <ObjectiveOLD icon={<img width={16} src={barbedHookPng} />} done>
                Unlocked <strong>{farmer.unlockedBobberCount}</strong> bobber
                style(s).
              </ObjectiveOLD>

              <Scrollbox
                scrollRef={registerScrollableRef}
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

              <ObjectiveOLD
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
              </ObjectiveOLD>
            </div>
          );
        })}
      </FarmersRow>
    </Section>
  );
};
