import craftingPng from "~frontend/assets/icon/crafting.png";
import { AchievementDisplay } from "~frontend/component/AchievementDisplay";
import { FarmerTag } from "~frontend/component/FarmerTag";
import { FarmersRow } from "~frontend/component/FarmersRow";
import { ImageObjective } from "~frontend/component/ImageObjective";
import { InfoText } from "~frontend/component/InfoText";
import { Objective } from "~frontend/component/Objective";
import { Scrollbox } from "~frontend/component/Scrollbox";
import { SummarySection } from "~frontend/component/SummarySection";
import { STARDEW_CRAFTING_RECIPES } from "~frontend/const/StardewCrafting";
import { GameSave } from "~frontend/gamesave/GameSave";
import { useGoals } from "~frontend/hook/useGoals";
import { useSyncedScrollbar } from "~frontend/hook/useSyncedScrollbar";
import { StardewWiki } from "~frontend/util/StardewWiki";
import { snakeCase } from "case-anything";
import clsx from "clsx";
import { useState } from "react";
import { mapToObj } from "remeda";

import { CRAFTING_RECIPE_SPRITES } from "~frontend/const/Assets";
import styles from "./CraftingSection.module.scss";

interface Props {
  gameSave: GameSave;
}

export const CraftingSection = (props: Props) => {
  const [expanded, setExpanded] = useState(false);

  const { registerScrollableRef } = useSyncedScrollbar([expanded]);

  const farmers = props.gameSave.getAllFarmers();

  const { allDone } = useGoals({
    individuals: mapToObj(farmers, (farmer) => [
      farmer.name,
      {
        achievements: [
          props.gameSave.achievements[farmer.name].diy,
          props.gameSave.achievements[farmer.name].artisan,
          props.gameSave.achievements[farmer.name].craftMaster,
        ],
      },
    ]),
  });

  return (
    <SummarySection
      id="crafting"
      sectionTitle="Crafting"
      sectionIcon={craftingPng}
      collapsable
      allDone={allDone}
    >
      <FarmersRow>
        {farmers.map((farmer) => {
          const farmerAchievements = props.gameSave.achievements[farmer.name];

          const totalUnlocked = STARDEW_CRAFTING_RECIPES.filter(
            (recipeName) => recipeName in farmer.craftedRecipes
          ).length;

          const totalCrafts = STARDEW_CRAFTING_RECIPES.filter(
            (recipeName) => farmer.craftedRecipes[recipeName] > 0
          ).length;

          return (
            <div key={farmer.name}>
              <FarmerTag farmer={farmer} />

              <div className={styles.objectives}>
                <Objective icon={<img height={16} src={craftingPng} />} done>
                  Unlocked <strong>{totalUnlocked}</strong> of{" "}
                  <strong>{STARDEW_CRAFTING_RECIPES.length}</strong> crafting
                  recipes.
                </Objective>

                <Objective icon={<img height={16} src={craftingPng} />} done>
                  Crafted <strong>{totalCrafts}</strong> of{" "}
                  <strong>{STARDEW_CRAFTING_RECIPES.length}</strong> different
                  recipes.
                </Objective>
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
                  {STARDEW_CRAFTING_RECIPES.map((recipe) => (
                    <div
                      key={recipe}
                      className={clsx(
                        styles.recipe,
                        !(recipe in farmer.craftedRecipes) && styles.locked,
                        farmer.craftedRecipes[recipe] === 0 && styles.notCrafted
                      )}
                    >
                      <a href={StardewWiki.getLink(recipe)} target="_blank">
                        <ImageObjective
                          width={32}
                          height={72}
                          src={CRAFTING_RECIPE_SPRITES.resolve(
                            snakeCase(recipe.replace(/-/g, " "))
                          )}
                          title={recipe}
                          done={farmer.craftedRecipes[recipe] > 0}
                        />
                      </a>
                    </div>
                  ))}
                </div>
              </Scrollbox>

              <InfoText>
                "
                <a target="_blank" href={StardewWiki.getLink("Wedding Ring")}>
                  Wedding Ring
                </a>
                " is only available in{" "}
                <a target="_blank" href={StardewWiki.getLink("Multiplayer")}>
                  Multiplayer
                </a>
                . It <strong>WON'T</strong> count towards any achievement.
                Therefore it is not shown in the list above.
              </InfoText>

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
                      src={craftingRecipeSprites.resolve("wedding_ring")}
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
