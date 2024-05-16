import { AchievementDisplay } from "@src/component/AchievementDisplay";
import { FarmerTag } from "@src/component/FarmerTag";
import { FarmersRow } from "@src/component/FarmersRow";
import { SummarySection } from "@src/component/SummarySection";
import { GameSave } from "@src/gamesave/GameSave";
import { mapToObj, times } from "remeda";

import bulletinBoardPng from "@src/assets/sprite/help-wanted/bulletin-board.png";
import questPng from "@src/assets/sprite/help-wanted/quest.png";

import { InfoText } from "@src/component/InfoText";
import { Objective } from "@src/component/Objective";
import { useGoals } from "@src/hook/useGoals";
import { StardewWiki } from "@src/util/StardewWiki";
import styles from "./HelpWantedSection.module.scss";

interface Props {
  gameSave: GameSave;
}

export const HelpWantedSection = (props: Props) => {
  const farmers = props.gameSave.getAllFarmers();

  const { goals, allDone } = useGoals({
    individuals: mapToObj(farmers, (farmer) => [
      farmer.name,
      {
        achievements: [
          props.gameSave.achievements[farmer.name].gofer,
          props.gameSave.achievements[farmer.name].aBigHelp,
        ],
      },
    ]),
  });

  return (
    <SummarySection
      id="quests"
      sectionTitle={'"Help Wanted" Quests'}
      collapsable
      allDone={allDone}
    >
      <FarmersRow>
        {farmers.map((farmer) => {
          const farmerGoals = goals.individuals[farmer.name];

          return (
            <div key={farmer.name}>
              <FarmerTag farmer={farmer} />

              <div className={styles.stats}>
                <Objective done icon={<img height={16} src={questPng} />}>
                  Completed <strong>{farmer.totalCompletedQuests}</strong>{" "}
                  quests in total.
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
                Weekly "<a href="#special-orders">Special Order Quests</a>" and
                "<a href="#qi-special-orders">Mr. Qi's Special Orders</a>" also
                count towards the achievements, even though they are not
                specifically mentioned.
              </InfoText>

              <div className={styles.achievements}>
                {farmerGoals.achievements!.map((achievement) => (
                  <AchievementDisplay
                    key={achievement.title}
                    title={achievement.title}
                    description={`complete ${achievement.goal} help requests`}
                    achieved={farmer.totalCompletedQuests >= 10}
                  >
                    {!achievement.achieved && (
                      <> — Helped {achievement.completed} out of 10</>
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
