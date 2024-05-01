import { capitalCase, snakeCase } from "case-anything";
import { entries, keys, sumBy, values } from "remeda";
import { FarmerTag } from "../component/FarmerTag";
import { SummarySection } from "../component/SummarySection";
import {
  FISHES_BY_CATEGORIES,
  FishCategory,
  STARDEW_FISHES,
} from "../const/StardewFishes";
import { GameSave } from "../gamesave/GameSave";
import { AssetRepository } from "../util/AssetRepository";

import { ImageObjective } from "@src/component/ImageObjective";
import { thru } from "@src/util/utilities";
import clsx from "clsx";
import { useMemo, useState } from "react";
import { Fragment } from "react/jsx-runtime";
import checkmarkPng from "../assets/icon/checkmark.png";
import questPng from "../assets/icon/quest.png";
import fishPng from "../assets/sprite/skill/fishing.png";
import { Achievement } from "../component/Achievement";
import { Objective } from "../component/Objective";
import { StardewWiki } from "../util/StardewWiki";
import styles from "./FishingSection.module.scss";

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

  const achievementFishes = useMemo(() => {
    return new Set(
      entries(STARDEW_FISHES)
        .filter(
          ([_, fish]) => !fish.categories.includes(FishCategory.Legendary_2)
        )
        .map(([fishId]) => fishId)
    );
  }, []);

  const maxBobberCount = 1 + Math.floor(keys(STARDEW_FISHES).length / 2);

  return (
    <SummarySection id="fishing" sectionTitle="Fishing" collapsable>
      <div className={styles.farmers}>
        {farmers.map((farmer) => {
          const caughtFishCount = sumBy(farmer.caughtFish, (v) => v.amount);

          const caughtTypeCount = farmer.caughtFish.filter(
            (v) => v.amount > 0
          ).length;

          const achievementCoughtTypeCount = farmer.caughtFish.filter(
            (v) => v.amount > 0 && achievementFishes.has(v.fishId)
          ).length;

          const unlockedBobberCount = 1 + Math.floor(caughtTypeCount / 2);

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
                <strong>{unlockedBobberCount}</strong> bobber styles.
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
                    FISHES_BY_CATEGORIES[categoryId as FishCategory] ?? [];

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
                                  noOutline={compact}
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

              <Achievement
                title="Mother Catch"
                achieved={caughtFishCount >= 100}
                description="catch 100 total fish"
              />

              {thru(achievementCoughtTypeCount >= 10, (done) => (
                <Achievement
                  title="Fisherman"
                  achieved={done}
                  description="catch 10 different fish"
                >
                  {!done && <> — Completed {caughtTypeCount} out of 10</>}
                </Achievement>
              ))}

              {thru(achievementCoughtTypeCount >= 24, (done) => (
                <Achievement
                  title="Ol' Mariner"
                  achieved={done}
                  description="catch 24 different fish"
                >
                  {!done && <> — Completed {caughtTypeCount} out of 24</>}
                </Achievement>
              ))}

              {thru(
                achievementCoughtTypeCount >= keys(STARDEW_FISHES).length,
                (done) => (
                  <Achievement
                    title="Master Angler"
                    achieved={done}
                    description="catch every fish"
                  >
                    {!done && (
                      <>
                        {" "}
                        — Completed {caughtTypeCount} out of{" "}
                        {achievementFishes.size}
                      </>
                    )}
                  </Achievement>
                )
              )}

              <Objective
                className={styles.objective}
                done={unlockedBobberCount >= maxBobberCount}
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
                    — Completed {unlockedBobberCount} out of {maxBobberCount}
                  </>
                )}
              </Objective>
            </div>
          );
        })}
      </div>
    </SummarySection>
  );
};
