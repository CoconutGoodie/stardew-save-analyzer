import { AchievementDisplay } from "@src/component/AchievementDisplay";
import { FarmerTag } from "@src/component/FarmerTag";
import { FarmersRow } from "@src/component/FarmersRow";
import { SummarySection } from "@src/component/SummarySection";
import { PROFESSION_SPRITES, SKILL_SPRITES } from "@src/const/Assets";
import { GameSave } from "@src/gamesave/GameSave";
import { useGoals } from "@src/hook/useGoals";
import { StardewWiki } from "@src/util/StardewWiki";
import { thru } from "@src/util/utilities";
import { capitalCase, lowerCase } from "case-anything";
import { entries, mapToObj } from "remeda";

import styles from "./SkillsSection.module.scss";

interface Props {
  gameSave: GameSave;
}

export const SkillsSection = (props: Props) => {
  const farmers = props.gameSave.getAllFarmers();

  const { allDone } = useGoals({
    individuals: mapToObj(farmers, (farmer) => [
      farmer.name,
      {
        achievements: [
          props.gameSave.achievements[farmer.name].singularTalent,
          props.gameSave.achievements[farmer.name].masterOfTheFiveWays,
        ],
      },
    ]),
  });

  return (
    <SummarySection
      id="skills"
      sectionTitle="Skills"
      collapsable
      allDone={allDone}
    >
      <FarmersRow className={styles.farmers}>
        {farmers.map((farmer) => (
          <div key={farmer.name} className={styles.farmer}>
            <FarmerTag farmer={farmer}>
              <a
                href={StardewWiki.getLink("Skills", "Skill-Based_Title")}
                target="_blank"
              >
                ({farmer?.skillBasedTitle}{" "}
                <span>- Skill Lv. {farmer.skillLevelTotal / 2})</span>
              </a>
            </FarmerTag>

            {entries(farmer.skills).map(([skillId, skill]) => (
              <div key={skillId} className={styles.skillRow}>
                <span>{capitalCase(skillId)}</span>

                <a
                  href={StardewWiki.getLink("Skills", capitalCase(skillId))}
                  target="_blank"
                >
                  <img width={20} src={SKILL_SPRITES.resolve(skillId)} />
                </a>

                <div className={styles.level}>
                  {Array.from({ length: 10 }).map((_, index) => {
                    const pipLevel = index + 1;
                    const isProfessionPip = pipLevel % 5 === 0;
                    const professionIndex = Math.floor(pipLevel / 5) - 1;
                    const pipClass = isProfessionPip
                      ? styles.largePip
                      : styles.pip;
                    const reached = pipLevel <= skill.level;
                    return (
                      <div
                        key={index}
                        className={pipClass}
                        style={{
                          opacity: reached ? 1 : 0.2,
                          filter: reached ? "" : "grayscale(1)",
                        }}
                      >
                        {isProfessionPip && reached && (
                          <a
                            href={StardewWiki.getLink(
                              "Skills",
                              capitalCase(skillId)
                            )}
                            target="_blank"
                          >
                            <img
                              width={20}
                              title={skill.professions[professionIndex]}
                              src={PROFESSION_SPRITES.resolve(
                                lowerCase(skill.professions?.[professionIndex])
                              )}
                            />
                          </a>
                        )}
                      </div>
                    );
                  })}
                </div>
                <h2>{skill.level}</h2>
              </div>
            ))}

            <div style={{ margin: "10px 0" }} />

            {thru(
              props.gameSave.achievements[farmer.name],
              (farmerAchievements) => (
                <>
                  <AchievementDisplay
                    title={farmerAchievements.singularTalent.title}
                    achieved={farmerAchievements.singularTalent.achieved}
                    description={<>reach Level 10 in a skill</>}
                  />

                  <AchievementDisplay
                    title={farmerAchievements.masterOfTheFiveWays.title}
                    achieved={farmerAchievements.masterOfTheFiveWays.achieved}
                    description={<>reach Level 10 in every skill</>}
                  />
                </>
              )
            )}
          </div>
        ))}
      </FarmersRow>
    </SummarySection>
  );
};
