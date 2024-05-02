import { FarmerTag } from "@src/component/FarmerTag";
import { FarmersRow } from "@src/component/FarmersRow";
import { SummarySection } from "@src/component/SummarySection";
import { GameSave } from "@src/gamesave/GameSave";
import { AchievementDisplay } from "@src/component/AchievementDisplay";
import { times } from "remeda";

import bulletinBoardPng from "@src/assets/sprite/help-wanted/bulletin-board.png";
import questPng from "@src/assets/sprite/help-wanted/quest.png";

import styles from "./HelpWantedSection.module.scss";
import { Objective } from "@src/component/Objective";
import { StardewWiki } from "@src/util/StardewWiki";

interface Props {
  gameSave: GameSave;
}

export const HelpWantedSection = (props: Props) => {
  return (
    <SummarySection sectionTitle="Help Wanted Quests" collapsable>
      <FarmersRow>
        {props.gameSave.getAllFarmers().map((farmer) => (
          <div key={farmer.name}>
            <FarmerTag farmer={farmer} />

            <Objective
              className={styles.text}
              done
              icon={<img height={16} src={questPng} />}
            >
              Fulfilled <strong>{farmer.completedQuests}</strong> help
              request(s).
            </Objective>

            <div className={styles.info}>
              <a
                target="_blank"
                href={StardewWiki.getLink("Quests", "Help_Wanted_Quests")}
              >
                <img height={80} src={bulletinBoardPng} />
              </a>

              <div className={styles.requestsDone}>
                <div className={styles.notePapers}>
                  {times(Math.min(55, farmer.completedQuests), (i) => (
                    <img key={i} height={27} src={questPng} />
                  ))}
                  {farmer.completedQuests > 55 && <span>...</span>}
                </div>
              </div>
            </div>

            <div className={styles.achievements}>
              <AchievementDisplay
                title="Gofer"
                description="complete 10 help requests"
                achieved={farmer.completedQuests >= 10}
              >
                {farmer.completedQuests < 10 && (
                  <> — Helped {farmer.completedQuests} out of 10</>
                )}
              </AchievementDisplay>

              <AchievementDisplay
                title="A Big Help"
                description="complete 40 help requests"
                achieved={farmer.completedQuests >= 40}
              >
                {farmer.completedQuests < 40 && (
                  <> — Helped {farmer.completedQuests} out of 10</>
                )}
              </AchievementDisplay>
            </div>
          </div>
        ))}
      </FarmersRow>
    </SummarySection>
  );
};
