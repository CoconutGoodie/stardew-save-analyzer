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

interface Props {
  gameSave: GameSave;
}

const craftingRecipeSprites = new AssetRepository<{ default: string }>(
  import.meta.glob("../assets/sprite/crafting/*.png", { eager: true }),
  "../assets/sprite/crafting/",
  ".png"
);

export const CraftingSection = (props: Props) => {
  return (
    <SummarySection sectionTitle="Crafting" collapsable>
      <FarmersRow>
        {props.gameSave.getAllFarmers().map((farmer) => {
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
                  Crafted <strong>{totalCrafts}</strong> different recipes.
                </Objective>
              </div>

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

              <div className={styles.achievements}>
                <AchievementDisplay title="X" />
                <AchievementDisplay title="Y" />
                <AchievementDisplay title="Z" />
              </div>

              <pre>{JSON.stringify(farmer.craftedRecipes, null, 2)}</pre>
            </div>
          );
        })}
      </FarmersRow>
    </SummarySection>
  );
};
