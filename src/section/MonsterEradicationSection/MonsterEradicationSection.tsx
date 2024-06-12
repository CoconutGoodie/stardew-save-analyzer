import fooPng from "@src/assets/icon/sword.png";
import { FarmerTag } from "@src/component/FarmerTag";
import { FarmersRow } from "@src/component/FarmersRow";
import { Objective } from "@src/component/Objective";
import { SummarySection } from "@src/component/SummarySection";
import { GameSave } from "@src/gamesave/GameSave";
import { useGoals } from "@src/hook/useGoals";
import { StardewWiki } from "@src/util/StardewWiki";

import styles from "./MonsterEradicationSection.module.scss";

interface Props {
  gameSave: GameSave;
}

export const MonsterEradicationSection = (props: Props) => {
  const farmers = props.gameSave.getAllFarmers();

  const { allDone } = useGoals({});

  return (
    <SummarySection
      id="monsters"
      sectionTitle="Monster Eradication [WIP]"
      collapsable
      allDone={allDone}
    >
      <FarmersRow>
        {farmers.map((farmer) => {
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
                  Killed <strong>XXXX</strong> monsters in total.
                </Objective>

                <Objective icon={<img height={16} src={fooPng} />} done>
                  Completed <strong>XX</strong> of <strong>YY</strong> Monster
                  Eradication goals.
                </Objective>
              </div>
            </div>
          );
        })}
      </FarmersRow>
    </SummarySection>
  );
};
