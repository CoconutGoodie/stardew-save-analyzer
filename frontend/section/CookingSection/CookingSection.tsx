import cookingPng from "~frontend/assets/icon/cooking.png";
import { AchievementDisplay } from "~frontend/component/AchievementDisplay/AchievementDisplay";
import { FarmerTag } from "~frontend/component/FarmerTag/FarmerTag";
import { FarmersRow } from "~frontend/component/FarmersRow/FarmersRow";
import { ImageObjective } from "~frontend/component/ImageObjective/ImageObjective";
import { ObjectiveOLD } from "~frontend/component/Objective/Objective";
import { Scrollbox } from "~frontend/component/Scrollbox/Scrollbox";
import { Section } from "~frontend/component/Section/Section";
import { STARDEW_BASE_COOKING_RECIPES } from "~frontend/const/StardewCooking";
import { STARDEW_CRAFTING_RECIPES } from "~frontend/const/StardewCrafting";
import { GameSave } from "~frontend/gamesave/GameSave";
import { useGoals_OLD } from "~frontend/hook/useGoals_OLD";
import { useSyncedScrollbar } from "~frontend/hook/useSyncedScrollbar";
import { StardewWiki } from "~frontend/util/StardewWiki";
import { snakeCase } from "case-anything";
import clsx from "clsx";
import { useState } from "react";
import { entries, keys, mapToObj, values } from "remeda";

import { COOKING_RECIPE_SPRITES } from "~frontend/const/Assets";
import styles from "./CookingSection.module.scss";

interface Props {
  gameSave: GameSave;
}

export const CookingSection = (props: Props) => {
  const [expanded, setExpanded] = useState(false);

  const { registerScrollableRef } = useSyncedScrollbar([expanded]);

  const farmers = props.gameSave.getAllFarmers();

  const { allDone } = useGoals_OLD({
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
    <Section
      id="cooking"
      sectionTitle="Cooking"
      sectionIcon={cookingPng}
      collapsable
      allDone={allDone}
    >
      <FarmersRow>
        {farmers.map((farmer) => {
          const farmerAchievements = props.gameSave.achievements[farmer.name];

          const totalUnlocked = values(STARDEW_BASE_COOKING_RECIPES).filter(
            (recipeName) => recipeName in farmer.cooking
          ).length;

          const totalCooked = values(STARDEW_BASE_COOKING_RECIPES).filter(
            (recipeName) => farmer.cooking.cookedRecipes[recipeName] > 0
          ).length;

          const moddedUnlocked = farmer.cooking.knownRecipes.difference(
            new Set(values(STARDEW_BASE_COOKING_RECIPES))
          ).size;

          return (
            <div key={farmer.name}>
              <FarmerTag farmer={farmer} />

              <div className={styles.objectives}>
                <ObjectiveOLD icon={<img height={16} src={cookingPng} />} done>
                  Unlocked <strong>{totalUnlocked}</strong> of{" "}
                  <strong>{keys(STARDEW_BASE_COOKING_RECIPES).length}</strong>{" "}
                  cooking recipes.
                </ObjectiveOLD>

                <ObjectiveOLD icon={<img height={16} src={cookingPng} />} done>
                  Cooked <strong>{totalCooked}</strong> of{" "}
                  <strong>{keys(STARDEW_BASE_COOKING_RECIPES).length}</strong>{" "}
                  different recipes.
                </ObjectiveOLD>

                {moddedUnlocked > 0 && (
                  <ObjectiveOLD
                    icon={<img height={16} src={cookingPng} />}
                    done
                  >
                    <strong>EXTRA</strong>: {moddedUnlocked} modded recipes are
                    also unlocked.
                  </ObjectiveOLD>
                )}
              </div>

              <Scrollbox
                scrollRef={registerScrollableRef}
                expanded={expanded}
                onExpanded={setExpanded}
                className={styles.recipesScrollbox}
              >
                <div
                  className={clsx(styles.recipes, expanded && styles.expanded)}
                >
                  {entries(STARDEW_BASE_COOKING_RECIPES).map(([_, recipe]) => (
                    <div
                      key={recipe}
                      className={clsx(
                        styles.recipe,
                        !farmer.cooking.knownRecipes.has(recipe) &&
                          styles.locked,
                        farmer.cooking.cookedRecipes[recipe] < 1 &&
                          styles.notCrafted
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
                          done={farmer.cooking.cookedRecipes[recipe] > 0}
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
                        <strong>
                          {keys(STARDEW_BASE_COOKING_RECIPES).length}
                        </strong>
                      </>
                    )}
                  </AchievementDisplay>
                ))}
              </div>
            </div>
          );
        })}
      </FarmersRow>
    </Section>
  );
};
