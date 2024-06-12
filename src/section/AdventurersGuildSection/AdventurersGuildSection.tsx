import fooPng from "@src/assets/icon/sword.png";
import { AchievementDisplay } from "@src/component/AchievementDisplay";
import { FarmerTag } from "@src/component/FarmerTag";
import { FarmersRow } from "@src/component/FarmersRow";
import { Objective } from "@src/component/Objective";
import { SummarySection } from "@src/component/SummarySection";
import { GameSave } from "@src/gamesave/GameSave";
import { useGoals } from "@src/hook/useGoals";
import { StardewWiki } from "@src/util/StardewWiki";
import { mapToObj } from "remeda";

import styles from "./AdventurersGuildSection.module.scss";
import { STARDEW_ERADICATION_GOALS } from "@src/const/StardewMonsters";
import { useSyncedScrollbar } from "@src/hook/useSyncedScrollbar";
import { useState } from "react";
import { Scrollbox } from "@src/component/Scrollbox";
import { MONSTER_SPRITES } from "@src/const/Assets";
import { snakeCase } from "case-anything";
import clsx from "clsx";

interface Props {
  gameSave: GameSave;
}

export const AdventurersGuildSection = (props: Props) => {
  const [expanded, setExpanded] = useState(false);

  const { registerScrollableRef: addScrollableRef } = useSyncedScrollbar([
    expanded,
  ]);

  const farmers = props.gameSave.getAllFarmers();

  const { allDone, goals } = useGoals({
    individuals: mapToObj(farmers, (farmer) => [
      farmer.name,
      {
        achievements: [],
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
      sectionTitle="Adventurer's Guild [WIP]"
      collapsable
      allDone={allDone}
    >
      <FarmersRow>
        {farmers.map((farmer) => {
          const farmerGoals = goals.individuals[farmer.name];

          return (
            <div key={farmer.name}>
              <FarmerTag farmer={farmer} />

              <div className={styles.objectives}>
                <Objective icon={<img height={16} src={fooPng} />} done>
                  Reached{" "}
                  <strong>level {farmer.deepestMineLevels.mountainMine}</strong>{" "}
                  of{" "}
                  <a href={StardewWiki.getLink("The_Mines")} target="_blank">
                    The Mines
                  </a>
                  .
                </Objective>

                <Objective icon={<img height={16} src={fooPng} />} done>
                  Reached{" "}
                  <strong>level {farmer.deepestMineLevels.skullCavern}</strong>{" "}
                  of{" "}
                  <a href={StardewWiki.getLink("Skull_Cavern")} target="_blank">
                    Skull Cavern
                  </a>
                  .
                </Objective>

                <Objective icon={<img height={16} src={fooPng} />} done>
                  Killed <strong>{farmer.monsterKills.totalKills}</strong>{" "}
                  monsters in total.
                </Objective>

                <Objective icon={<img height={16} src={fooPng} />} done>
                  Completed <strong>XX</strong> of{" "}
                  <strong>{STARDEW_ERADICATION_GOALS.length}</strong> Monster
                  Eradication goals.
                </Objective>
              </div>

              <Scrollbox
                scrollRef={addScrollableRef}
                expanded={expanded}
                onExpanded={setExpanded}
                className={styles.monsterScrollbox}
              >
                <div
                  className={clsx(styles.monsters, expanded && styles.expanded)}
                >
                  {STARDEW_ERADICATION_GOALS.map((goal) => (
                    <div key={goal.category} className={styles.monsterCategory}>
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
                              src={MONSTER_SPRITES.resolve(snakeCase(monster))}
                            />
                          </div>
                        ))}
                      </div>
                      <Objective className={styles.goal}>
                        Killed{" "}
                        {farmer.monsterKills.byEradicationGoal[goal.category]}/
                        {goal.amount}
                      </Objective>
                    </div>
                  ))}
                </div>
              </Scrollbox>

              <div className={styles.achievements}>
                <AchievementDisplay
                  title="The Bottom"
                  description="reach level 120 in the mines"
                />
                <AchievementDisplay
                  title="Protector of the Valley"
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
