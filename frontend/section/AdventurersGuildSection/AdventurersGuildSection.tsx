import swordPng from "~frontend/assets/icon/sword.png";
import { AchievementDisplay } from "~frontend/component/AchievementDisplay";
import { FarmerTag } from "~frontend/component/FarmerTag";
import { FarmersRow } from "~frontend/component/FarmersRow/FarmersRow";
import { Objective } from "~frontend/component/Objective";
import { SummarySection } from "~frontend/component/SummarySection";
import { GameSave } from "~frontend/gamesave/GameSave";
import { useGoals } from "~frontend/hook/useGoals";
import { StardewWiki } from "~frontend/util/StardewWiki";
import { mapToObj, values } from "remeda";

import { Scrollbox } from "~frontend/component/Scrollbox";
import { MONSTER_SPRITES } from "~frontend/const/Assets";
import { STARDEW_ERADICATION_GOALS } from "~frontend/const/StardewMonsters";
import { useSyncedScrollbar } from "~frontend/hook/useSyncedScrollbar";
import { snakeCase } from "case-anything";
import clsx from "clsx";
import { useState } from "react";
import styles from "./AdventurersGuildSection.module.scss";

interface Props {
  gameSave: GameSave;
}

export const AdventurersGuildSection = (props: Props) => {
  const [expanded, setExpanded] = useState(false);

  const { registerScrollableRef } = useSyncedScrollbar([expanded]);

  const farmers = props.gameSave.getAllFarmers();

  const { allDone, goals } = useGoals({
    individuals: mapToObj(farmers, (farmer) => [
      farmer.name,
      {
        achievements: [
          props.gameSave.achievements[farmer.name].theBottom,
          props.gameSave.achievements[farmer.name].protectorOfTheValley,
        ],
        objectives: {
          gainAccessToGuild: {
            current: farmer.monsterKills.totalKills,
            goal: 1000,
          },
        },
      },
    ]),
  });

  return (
    <SummarySection
      id="adventurers-guild"
      sectionTitle="Adventurer's Guild"
      sectionIcon={swordPng}
      collapsable
      allDone={allDone}
    >
      <FarmersRow>
        {farmers.map((farmer) => {
          const farmerAchievements = props.gameSave.achievements[farmer.name];
          const farmerGoals = goals.individuals[farmer.name];

          return (
            <div key={farmer.name}>
              <FarmerTag farmer={farmer} />

              <div className={styles.objectives}>
                <Objective icon={<img height={16} src={swordPng} />} done>
                  Reached{" "}
                  <strong>level {farmer.deepestMineLevels.mountainMine}</strong>{" "}
                  of{" "}
                  <a href={StardewWiki.getLink("The_Mines")} target="_blank">
                    The Mines
                  </a>
                  .
                </Objective>

                <Objective icon={<img height={16} src={swordPng} />} done>
                  Reached{" "}
                  <strong>level {farmer.deepestMineLevels.skullCavern}</strong>{" "}
                  of{" "}
                  <a href={StardewWiki.getLink("Skull_Cavern")} target="_blank">
                    Skull Cavern
                  </a>
                  .
                </Objective>

                <Objective icon={<img height={16} src={swordPng} />} done>
                  Killed <strong>{farmer.monsterKills.totalKills}</strong>{" "}
                  monsters in total.
                </Objective>

                <Objective icon={<img height={16} src={swordPng} />} done>
                  Completed{" "}
                  <strong>
                    {
                      values(
                        farmerAchievements.protectorOfTheValley.goalsDone
                      ).filter(Boolean).length
                    }
                  </strong>{" "}
                  of <strong>{STARDEW_ERADICATION_GOALS.length}</strong> Monster
                  Eradication goals.
                </Objective>
              </div>

              <Scrollbox
                scrollRef={registerScrollableRef}
                expanded={expanded}
                onExpanded={setExpanded}
                className={styles.monsterScrollbox}
              >
                <div
                  className={clsx(styles.monsters, expanded && styles.expanded)}
                >
                  {STARDEW_ERADICATION_GOALS.map((goal) => {
                    const goalDone =
                      farmer.monsterKills.byEradicationGoal[goal.category] >=
                      goal.amount;

                    return (
                      <a
                        key={goal.category}
                        target="_blank"
                        href={StardewWiki.getLink(
                          "Adventurer's Guild",
                          goal.wikiId
                        )}
                        className={clsx(
                          styles.monsterCategory,
                          goalDone && styles.done
                        )}
                      >
                        <div className={styles.header}>
                          <span>{goal.category}</span>
                        </div>
                        <div className={styles.mobs}>
                          {Array.from(goal.validMonsters).map((monster) => (
                            <div key={monster} className={styles.mob}>
                              <img
                                width={32}
                                height={64}
                                title={monster}
                                src={MONSTER_SPRITES.resolve(
                                  snakeCase(monster)
                                )}
                              />
                            </div>
                          ))}
                        </div>
                        <Objective className={styles.goal} done={goalDone}>
                          {farmer.monsterKills.byEradicationGoal[goal.category]}
                          /{goal.amount} Killed
                        </Objective>
                      </a>
                    );
                  })}
                </div>
              </Scrollbox>

              <div className={styles.achievements}>
                <AchievementDisplay
                  title={farmerAchievements.theBottom.title}
                  achieved={farmerAchievements.theBottom.achieved}
                  description="reach level 120 in the mines"
                />
                <AchievementDisplay
                  title={farmerAchievements.protectorOfTheValley.title}
                  achieved={farmerAchievements.protectorOfTheValley.achieved}
                  description="complete Monster Eradication Goals"
                />
                <Objective
                  className={styles.objective}
                  done={
                    farmerGoals.objectiveStatus.gainAccessToGuild === "done"
                  }
                >
                  Gained access to the{" "}
                  <a
                    href={StardewWiki.getLink("Adventurer's_Guild")}
                    target="_blank"
                  >
                    <strong>Adventurer's Guild</strong>
                  </a>
                  .{" "}
                  {farmerGoals.objectiveStatus.gainAccessToGuild !== "done" && (
                    <>
                      — kill{" "}
                      {farmerGoals.objectives.gainAccessToGuild.goal -
                        farmerGoals.objectives.gainAccessToGuild.current}{" "}
                      more monsters.
                    </>
                  )}
                </Objective>
              </div>
            </div>
          );
        })}
      </FarmersRow>
    </SummarySection>
  );
};
