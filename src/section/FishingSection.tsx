import { capitalCase, snakeCase } from "case-anything";
import { entries, find, keys, thru } from "lodash";
import { FarmerTag } from "../component/FarmerTag";
import { SummarySection } from "../component/SummarySection";
import { Fish, FishCategory, STARDEW_FISHES } from "../const/StardewFishes";
import { GameSave } from "../gamesave/GameSave";
import { AssetRepository } from "../util/AssetRepository";

import clsx from "clsx";
import { useState } from "react";
import { Fragment } from "react/jsx-runtime";
import checkmarkPng from "../assets/icon/checkmark.png";
import questPng from "../assets/icon/quest.png";
import fishPng from "../assets/sprite/skill/fishing.png";
import { Achievement } from "../component/Achievement";
import { Objective } from "../component/Objective";
import { StardewWiki } from "../util/StardewWiki";
import styles from "./FishingSection.module.scss";
import { ImageObjective } from "@src/component/ImageObjective";

interface Props {
  gameSave: GameSave;
}

const FISHES_BY_CATEGORIES = entries(STARDEW_FISHES).reduce(
  (lookup, [fishId, fish]) => {
    (fish.categories as (keyof typeof FishCategory)[]).forEach((category) => {
      if (!lookup[category]) lookup[category] = [];
      lookup[category].push({ id: fishId, ...fish });
    });
    return lookup;
  },
  {} as Record<FishCategory, (Fish & { id: string })[]>
);

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

  const anglerFishes = entries(STARDEW_FISHES).filter(
    ([_, fish]) => !fish.categories.includes(FishCategory.Legendary_2)
  );

  return (
    <SummarySection id="fishing" sectionTitle="Fishing" collapsable>
      <div className={styles.farmers}>
        {farmers.map((farmer) => {
          const caughtFishCount = farmer.caughtFish.reduce(
            (total, fish) => total + fish.amount,
            0
          );

          const caughtTypeCount = farmer.caughtFish.filter(
            (fish) => fish.amount > 0
          ).length;

          const unlockedBobberCount = 1 + Math.floor(caughtTypeCount / 2);

          const maxBobberCount =
            1 + Math.floor(Object.keys(STARDEW_FISHES).length / 2);

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
                    const caughtFish = find(farmer.caughtFish, {
                      fishId: fish.id,
                    });
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
                          Quest. They still get you new{" "}
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
                                    (find(farmer.caughtFish, {
                                      fishId: fish.id,
                                    })?.amount ?? 0) > 0
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

              {thru(caughtTypeCount >= 10, (done) => (
                <Achievement
                  title="Fisherman"
                  achieved={done}
                  description="catch 10 different fish"
                >
                  {!done && <> — Completed {caughtTypeCount} out of 10</>}
                </Achievement>
              ))}

              {thru(caughtTypeCount >= 24, (done) => (
                <Achievement
                  title="Ol' Mariner"
                  achieved={done}
                  description="catch 24 different fish"
                >
                  {!done && <> — Completed {caughtTypeCount} out of 24</>}
                </Achievement>
              ))}

              {thru(
                caughtTypeCount >= Object.keys(STARDEW_FISHES).length,
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
                        {anglerFishes.length}
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
