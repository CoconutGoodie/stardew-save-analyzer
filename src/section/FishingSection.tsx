import { capitalCase, snakeCase } from "case-anything";
import { keys, sumBy } from "remeda";
import { FarmerTag } from "../component/FarmerTag";
import { SummarySection } from "../component/SummarySection";
import {
  FishCategory,
  STARDEW_FISHES,
  STARDEW_FISHES_BY_CATEGORIES,
} from "../const/StardewFishes";
import { GameSave } from "../gamesave/GameSave";
import { AssetRepository } from "../util/AssetRepository";

import { ImageObjective } from "@src/component/ImageObjective";
import { thru } from "@src/util/utilities";
import clsx from "clsx";
import { useState } from "react";
import { Fragment } from "react/jsx-runtime";
import checkmarkPng from "../assets/icon/checkmark.png";
import questPng from "../assets/icon/quest.png";
import fishPng from "../assets/sprite/skill/fishing.png";
import { AchievementDisplay } from "../component/AchievementDisplay";
import { Objective } from "../component/Objective";
import { StardewWiki } from "../util/StardewWiki";
import styles from "./FishingSection.module.scss";
import { FarmersRow } from "@src/component/FarmersRow";

interface Props {
  gameSave: GameSave;
}

const fishSprites = new AssetRepository<{ default: string }>(
  import.meta.glob("../assets/sprite/fish/*.png", { eager: true }),
  "../assets/sprite/fish/",
  ".png"
);

const backgroundSprites = new AssetRepository<{ default: string }>(
  import.meta.glob("../assets/background/fishing/*.png", { eager: true }),
  "../assets/background/fishing/",
  ".png"
);

export const FishingSection = (props: Props) => {
  const [compact, setCompact] = useState(false);

  const farmers = props.gameSave.getAllFarmers();

  const maxBobberCount = 1 + Math.floor(keys(STARDEW_FISHES).length / 2);

  return (
    <SummarySection id="fishing" sectionTitle="Fishing" collapsable>
      <FarmersRow>
        {farmers.map((farmer) => {
          const caughtFishCount = sumBy(farmer.caughtFish, (v) => v.amount);

          const caughtTypeCount = farmer.caughtFish.filter(
            (v) => v.amount > 0
          ).length;

          return (
            <div key={farmer.name} className={styles.farmer}>
              <FarmerTag farmer={farmer} />

              <Objective icon={<img width={20} src={fishPng} />} done>
                {farmer.name} has caught <strong>{caughtFishCount}</strong> fish
                in total.
              </Objective>
              <Objective icon={<img width={20} src={fishPng} />} done>
                {farmer.name} has caught <strong>{caughtTypeCount}</strong>{" "}
                different fish in total.
              </Objective>
              <Objective icon={<img width={20} src={fishPng} />} done>
                {farmer.name} has unlocked{" "}
                <strong>{farmer.unlockedBobberCount}</strong> bobber styles.
              </Objective>

              <button
                className={styles.compactBtn}
                onClick={() => setCompact((c) => !c)}
              >
                Toggle Compact View
              </button>

              <div className={styles.categories}>
                {keys(FishCategory).map((categoryId) => {
                  const fishes =
                    STARDEW_FISHES_BY_CATEGORIES[categoryId as FishCategory] ??
                    [];

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
                          still get you new{" "}
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
                          ["--background" as string]: `url(${
                            backgroundSprites.resolve(snakeCase(categoryId))
                              ?.default
                          })`,
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
                                      (v) => v.fishId === fish.id
                                    )?.amount ?? 0) > 0
                                  }
                                  src={
                                    fishSprites.resolve(snakeCase(fish.name))
                                      ?.default
                                  }
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
