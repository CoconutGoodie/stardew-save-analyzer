import bulletinBoardPng from "~frontend/assets/sprite/help-wanted/bulletin-board.png";
import questPng from "~frontend/assets/sprite/help-wanted/quest.png";
import { AchievementDisplay } from "~frontend/component/AchievementDisplay/AchievementDisplay";
import { FarmerTag } from "~frontend/component/FarmerTag/FarmerTag";
import { FarmersRow } from "~frontend/component/FarmersRow/FarmersRow";
import { InfoText } from "~frontend/component/InfoText/InfoText";
import { ObjectiveOLD } from "~frontend/component/Objective/Objective";
import { Section } from "~frontend/component/Section/Section";
import { GameSave } from "~frontend/gamesave/GameSave";
import { useGoals_OLD } from "~frontend/hook/useGoals_OLD";
import { StardewWiki } from "~frontend/util/StardewWiki";
import { mapToObj, times } from "remeda";

import styles from "./HelpWantedSection.module.scss";
import { useGoals } from "~frontend/hook/useGoals";
import { SectionPart } from "~frontend/component/SectionPart/SectionPart";

interface Props {
  gameSave: GameSave;
}

export const HelpWantedSection = (props: Props) => {
  const farmers = props.gameSave.getAllFarmers();

  const goals = useGoals(() => ({
    individuals: props.gameSave.getAllFarmers().map((farmer) => ({
      farmer,
      achievements: [
        farmer.getAchievements().gofer,
        farmer.getAchievements().aBigHelp,
      ],
    })),
  }));

  return (
    <Section
      id="quests"
      sectionTitle={'"Help Wanted" Quests'}
      sectionIcon={questPng}
      collapsable
      allDone={goals.allDone}
    >
      <FarmersRow>
        {farmers.map((farmer) => {
          return (
            <div key={farmer.name}>
              <FarmerTag farmer={farmer} />

              <SectionPart.Statistics>
                <>
                  Completed <strong>{farmer.totalCompletedQuests}</strong>{" "}
                  quests in total.
                </>

                <>
                  Fulfilled <strong>{farmer.billboardCompletedQuests}</strong>{" "}
                  "Help Wanted" quest(s) off <strong>Bulletin Board</strong>.
                </>
              </SectionPart.Statistics>

              <div className={styles.info}>
                <a
                  target="_blank"
                  className={styles.bulletinBoard}
                  href={StardewWiki.getLink("Quests", "Help_Wanted_Quests")}
                >
                  <img height={85} src={bulletinBoardPng} />
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

              <SectionPart.Achievements
                achievements={goals.farmerGoals(farmer).achievements}
              />

              {/* <div className={styles.achievements}>
                {goals.individuals[farmer.name].achievements.map(
                  (achievement) => (
                    <AchievementDisplay
                      key={achievement.title}
                      title={achievement.title}
                      description={`complete ${achievement.goal} help requests`}
                      achieved={achievement.achieved}
                    >
                      {!achievement.achieved && (
                        <>
                          {" "}
                          — Helped {achievement.completed} out of{" "}
                          {achievement.goal}
                        </>
                      )}
                    </AchievementDisplay>
                  )
                )}
              </div> */}
            </div>
          );
        })}
      </FarmersRow>
    </Section>
  );
};
