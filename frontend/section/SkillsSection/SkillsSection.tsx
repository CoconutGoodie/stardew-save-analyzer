import starPng from "~frontend/assets/icon/star.png";
import { AchievementDisplay } from "~frontend/component/AchievementDisplay/AchievementDisplay";
import { FarmerTag } from "~frontend/component/FarmerTag/FarmerTag";
import { FarmersRow } from "~frontend/component/FarmersRow/FarmersRow";
import { Section } from "~frontend/component/Section/Section";
import { PROFESSION_SPRITES, SKILL_SPRITES } from "~frontend/const/Assets";
import { GameSave } from "~frontend/gamesave/GameSave";
import { useGoals_OLD } from "~frontend/hook/useGoals_OLD";
import { StardewWiki } from "~frontend/util/StardewWiki";
import { thru } from "~frontend/util/utilities";
import { capitalCase, lowerCase } from "case-anything";
import { entries, mapToObj, prop } from "remeda";

import styles from "./SkillsSection.module.scss";
import { useGoals } from "~frontend/hook/useGoals";
import { SectionPart } from "~frontend/component/SectionPart/SectionPart";

interface Props {
  gameSave: GameSave;
}

export const SkillsSection = (props: Props) => {
  const farmers = props.gameSave.getAllFarmers();

  const goals = useGoals(() => ({
    individuals: props.gameSave.getAllFarmers().map((farmer) => ({
      farmer,
      achievements: [
        farmer.getAchievements().singularTalent,
        farmer.getAchievements().masterOfTheFiveWays,
      ],
    })),
  }));

  return (
    <Section
      id="skills"
      sectionTitle="Skills"
      sectionIcon={starPng}
      collapsable
      allDone={goals.allDone}
    >
      <FarmersRow className={styles.farmers}>
        {farmers.map((farmer) => (
          <div key={farmer.name}>
            <FarmerTag farmer={farmer}>
              <a
                href={StardewWiki.getLink("Skills", "Skill-Based_Title")}
                target="_blank"
              >
                ({farmer?.skillBasedTitle}{" "}
                <span>- Skill Lv. {farmer.skillLevelTotal / 2})</span>
              </a>
            </FarmerTag>

            <div className={styles.skills}>
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
                                  lowerCase(
                                    skill.professions?.[professionIndex]
                                  )
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
            </div>

            <SectionPart.Achievements
              achievements={goals.getFarmerGoals(farmer).achievements}
            />
          </div>
        ))}
      </FarmersRow>
    </Section>
  );
};
