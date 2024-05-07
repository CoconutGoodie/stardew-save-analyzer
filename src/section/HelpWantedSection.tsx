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
import { InfoText } from "@src/component/InfoText";

interface Props {
  gameSave: GameSave;
}

export const HelpWantedSection = (props: Props) => {
  return (
    <SummarySection sectionTitle="Quests" collapsable>
      <FarmersRow>
        {props.gameSave.getAllFarmers().map((farmer) => (
          <div key={farmer.name}>
            <FarmerTag farmer={farmer} />

            <div className={styles.stats}>
              <Objective done icon={<img height={16} src={questPng} />}>
                Completed <strong>{farmer.totalCompletedQuests}</strong> quests
                in total.
              </Objective>

              <Objective done icon={<img height={16} src={questPng} />}>
                Fulfilled <strong>{farmer.billboardCompletedQuests}</strong>{" "}
                "Help Wanted" quest(s) off <strong>Bulletin Board</strong>.
              </Objective>
            </div>

            <div className={styles.info}>
              <a
                target="_blank"
                href={StardewWiki.getLink("Quests", "Help_Wanted_Quests")}
              >
                <img height={80} src={bulletinBoardPng} />
              </a>

              <div className={styles.requestsDone}>
                <div className={styles.notePapers}>
                  {times(Math.min(55, farmer.totalCompletedQuests), (i) => (
                    <img key={i} height={27} src={questPng} />
                  ))}
                  {farmer.totalCompletedQuests > 55 && <span>...</span>}
                </div>
              </div>
            </div>

            <InfoText>
              Weekly "<a href="#special-orders">Special Order Quests</a>" and "
              <a href="#qi-special-orders">Mr. Qi's Special Orders</a>" also
              count towards the achievements, even though achievements only
              mention completion of "<em>Help Wanted</em>" quests.
            </InfoText>

            <div className={styles.achievements}>
              {/* TODO: Extract to Achievements class */}
              <AchievementDisplay
                title="Gofer"
                description="complete 10 help requests"
                achieved={farmer.totalCompletedQuests >= 10}
              >
                {farmer.totalCompletedQuests < 10 && (
                  <> — Helped {farmer.totalCompletedQuests} out of 10</>
                )}
              </AchievementDisplay>

              <AchievementDisplay
                title="A Big Help"
                description="complete 40 help requests"
                achieved={farmer.totalCompletedQuests >= 40}
              >
                {farmer.totalCompletedQuests < 40 && (
                  <> — Helped {farmer.totalCompletedQuests} out of 10</>
                )}
              </AchievementDisplay>
            </div>
          </div>
        ))}
      </FarmersRow>
    </SummarySection>
  );
};
