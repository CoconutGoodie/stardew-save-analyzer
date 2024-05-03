import { FarmerTag } from "@src/component/FarmerTag";
import { FarmersRow } from "@src/component/FarmersRow";
import { Objective } from "@src/component/Objective";
import { SummarySection } from "@src/component/SummarySection";
import { GameSave } from "@src/gamesave/GameSave";

import craftingPng from "@src/assets/icon/crafting.png";
import { AchievementDisplay } from "@src/component/AchievementDisplay";
import { keys, values } from "remeda";

import styles from "./CraftingSection.module.scss";
import { STARDEW_CRAFTING_RECIPES } from "@src/const/StardewCrafting";
import clsx from "clsx";
import { ImageObjective } from "@src/component/ImageObjective";
import { AssetRepository } from "@src/util/AssetRepository";
import { snakeCase } from "case-anything";
import { StardewWiki } from "@src/util/StardewWiki";
import { useState } from "react";

interface Props {
  gameSave: GameSave;
}

const craftingRecipeSprites = new AssetRepository<{ default: string }>(
  import.meta.glob("../assets/sprite/crafting/*.png", { eager: true }),
  "../assets/sprite/crafting/",
  ".png"
);

export const CraftingSection = (props: Props) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <SummarySection sectionTitle="Crafting" collapsable>
      <FarmersRow>
        {props.gameSave.getAllFarmers().map((farmer) => {
          const farmerAchievements = props.gameSave.achievements[farmer.name];

          const totalCrafts = values(farmer.craftedRecipes).filter(
            (v) => v > 0
          ).length;

          return (
            <div key={farmer.name}>
              <FarmerTag farmer={farmer} />

              <div className={styles.objectives}>
                <Objective icon={<img height={16} src={craftingPng} />} done>
                  Unlocked <strong>{keys(farmer.craftedRecipes).length}</strong>{" "}
                  of <strong>{STARDEW_CRAFTING_RECIPES.length}</strong> crafting
                  recipes.
                </Objective>

                <Objective icon={<img height={16} src={craftingPng} />} done>
                  Crafted <strong>{totalCrafts}</strong> of{" "}
                  <strong>{STARDEW_CRAFTING_RECIPES.length}</strong> different
                  recipes.
                </Objective>
              </div>

              <div className={clsx(styles.view, expanded && styles.expanded)}>
                <button onClick={() => setExpanded((v) => !v)}>
                  {expanded ? "Collapse view" : "Expand view"}
                </button>

                <div className={styles.recipes}>
                  {STARDEW_CRAFTING_RECIPES.map((recipe) => (
                    <div
                      key={recipe}
                      className={clsx(
                        styles.recipe,
                        !(recipe in farmer.craftedRecipes) && styles.locked
                      )}
                    >
                      <a href={StardewWiki.getLink(recipe)} target="_blank">
                        <ImageObjective
                          width={32}
                          height={72}
                          src={
                            craftingRecipeSprites.resolve(
                              snakeCase(recipe.replace(/-/g, " "))
                            )?.default ?? ""
                          }
                          title={recipe}
                          done={farmer.craftedRecipes[recipe] > 0}
                        />
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              {/* <p>
                <em>
                  "Wedding Ring" is only available in{" "}
                  <a target="_blank" href={StardewWiki.getLink("Multiplayer")}>
                    <strong>Multiplayer</strong>
                  </a>
                  . It won't count towards the achievement, yet is still
                  displayed for convenience:
                </em>
              </p> */}

              {/* <div className={styles.recipes}>
                <div
                  className={clsx(
                    styles.recipe,
                    !("Wedding Ring" in farmer.craftedRecipes) && styles.locked
                  )}
                >
                  <a target="_blank" href={StardewWiki.getLink("Wedding Ring")}>
                    <ImageObjective
                      width={32}
                      height={72}
                      src={
                        craftingRecipeSprites.resolve("wedding_ring")
                          ?.default ?? ""
                      }
                      title={"Wedding Ring"}
                      done={farmer.craftedRecipes["Wedding Ring"] > 0}
                    />
                  </a>
                </div>
              </div> */}

              <div className={styles.achievements}>
                {[
                  farmerAchievements.diy,
                  farmerAchievements.artisan,
                  farmerAchievements.craftMaster,
                ].map((achievement) => (
                  <AchievementDisplay
                    key={achievement.title}
                    title={achievement.title}
                    description={
                      achievement === farmerAchievements.craftMaster
                        ? "craft every recipe"
                        : `craft ${achievement.goal} different recipes`
                    }
                    achieved={achievement.achieved}
                  >
                    {!achievement.achieved && (
                      <>
                        {" "}
                        — Crafted <strong>{totalCrafts}</strong> of{" "}
                        <strong>{STARDEW_CRAFTING_RECIPES.length}</strong>
                      </>
                    )}
                  </AchievementDisplay>
                ))}
              </div>
            </div>
          );
        })}
      </FarmersRow>
    </SummarySection>
  );
};
