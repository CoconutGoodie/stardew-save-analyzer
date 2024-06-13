import cookingPng from "@src/assets/icon/cooking.png";
import { AchievementDisplay } from "@src/component/AchievementDisplay";
import { FarmerTag } from "@src/component/FarmerTag";
import { FarmersRow } from "@src/component/FarmersRow";
import { ImageObjective } from "@src/component/ImageObjective";
import { Objective } from "@src/component/Objective";
import { Scrollbox } from "@src/component/Scrollbox";
import { SummarySection } from "@src/component/SummarySection";
import { STARDEW_COOKING_RECIPES } from "@src/const/StardewCooking";
import { STARDEW_CRAFTING_RECIPES } from "@src/const/StardewCrafting";
import { GameSave } from "@src/gamesave/GameSave";
import { useGoals } from "@src/hook/useGoals";
import { useSyncedScrollbar } from "@src/hook/useSyncedScrollbar";
import { StardewWiki } from "@src/util/StardewWiki";
import { snakeCase } from "case-anything";
import clsx from "clsx";
import { useState } from "react";
import { entries, keys, mapToObj, values } from "remeda";

import { COOKING_RECIPE_SPRITES } from "@src/const/Assets";
import styles from "./CookingSection.module.scss";

interface Props {
  gameSave: GameSave;
}

export const CookingSection = (props: Props) => {
  const [expanded, setExpanded] = useState(false);

  const { registerScrollableRef: addScrollableRef } = useSyncedScrollbar([
    expanded,
  ]);

  const farmers = props.gameSave.getAllFarmers();

  const { allDone } = useGoals({
    individuals: mapToObj(farmers, (farmer) => [
      farmer.name,
      {
        achievements: [
          props.gameSave.achievements[farmer.name].cook,
          props.gameSave.achievements[farmer.name].sousChef,
          props.gameSave.achievements[farmer.name].gourmetChef,
        ],
      },
    ]),
  });

  return (
    <SummarySection
      id="cooking"
      sectionTitle="Cooking"
      sectionIcon={cookingPng}
      collapsable
      allDone={allDone}
    >
      <FarmersRow>
        {farmers.map((farmer) => {
          const farmerAchievements = props.gameSave.achievements[farmer.name];

          const totalUnlocked = values(STARDEW_COOKING_RECIPES).filter(
            (recipeName) => recipeName in farmer.cookedRecipes
          ).length;

          const totalCooked = values(STARDEW_COOKING_RECIPES).filter(
            (recipeName) => farmer.cookedRecipes[recipeName] > 0
          ).length;

          return (
            <div key={farmer.name}>
              <FarmerTag farmer={farmer} />

              <div className={styles.objectives}>
                <Objective icon={<img height={16} src={cookingPng} />} done>
                  Unlocked <strong>{totalUnlocked}</strong> of{" "}
                  <strong>{keys(STARDEW_COOKING_RECIPES).length}</strong>{" "}
                  cooking recipes.
                </Objective>

                <Objective icon={<img height={16} src={cookingPng} />} done>
                  Cooked <strong>{totalCooked}</strong> of{" "}
                  <strong>{keys(STARDEW_COOKING_RECIPES).length}</strong>{" "}
                  different recipes.
                </Objective>
              </div>

              <Scrollbox
                scrollRef={addScrollableRef}
                expanded={expanded}
                onExpanded={setExpanded}
                className={styles.recipesScrollbox}
              >
                <div
                  className={clsx(styles.recipes, expanded && styles.expanded)}
                >
                  {entries(STARDEW_COOKING_RECIPES).map(([_, recipe]) => (
                    <div
                      key={recipe}
                      className={clsx(
                        styles.recipe,
                        !(recipe in farmer.cookedRecipes) && styles.locked,
                        farmer.cookedRecipes[recipe] === 0 && styles.notCrafted
                      )}
                    >
                      <a href={StardewWiki.getLink(recipe)} target="_blank">
                        <ImageObjective
                          width={38}
                          height={38}
                          src={COOKING_RECIPE_SPRITES.resolve(
                            snakeCase(recipe.replace(/-/g, " "))
                          )}
                          title={recipe}
                          done={farmer.cookedRecipes[recipe] > 0}
                        />
                      </a>
                    </div>
                  ))}
                </div>
              </Scrollbox>

              <div className={styles.achievements}>
                {[
                  farmerAchievements.cook,
                  farmerAchievements.sousChef,
                  farmerAchievements.gourmetChef,
                ].map((achievement) => (
                  <AchievementDisplay
                    key={achievement.title}
                    title={achievement.title}
                    description={
                      achievement === farmerAchievements.craftMaster
                        ? "cook every recipe"
                        : `cook ${achievement.goal} different recipes`
                    }
                    achieved={achievement.achieved}
                  >
                    {!achievement.achieved && (
                      <>
                        {" "}
                        — Cooked <strong>{totalCooked}</strong> of{" "}
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
