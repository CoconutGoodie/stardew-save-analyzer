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

interface Props {
  gameSave: GameSave;
}

export const AdventurersGuildSection = (props: Props) => {
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
                  Completed <strong>XX</strong> of <strong>YY</strong> Monster
                  Eradication goals.
                </Objective>
              </div>

              <div className={styles.monsters}>WIP</div>

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
