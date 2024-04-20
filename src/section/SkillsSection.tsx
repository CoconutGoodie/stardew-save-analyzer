import { capitalCase, lowerCase } from "case-anything";
import { Achievement } from "../component/Achievement";
import { SummarySection } from "../component/SummarySection";
import { AssetRepository } from "../util/AssetRepository";
import { GameSave } from "../gamesave/GameSave";

import femalePng from "../assets/icon/female.png";
import malePng from "../assets/icon/male.png";

import styles from "./SkillsSection.module.scss";
import { StardewWiki } from "../util/StardewWiki";
import { entries, values } from "lodash";

interface Props {
  gameSave: GameSave;
}

const skillSprites = new AssetRepository<{ default: string }>(
  import.meta.glob("../assets/sprite/skill/*.png", { eager: true }),
  "../assets/sprite/skill/",
  ".png"
);

const professionSprites = new AssetRepository<{ default: string }>(
  import.meta.glob("../assets/sprite/profession/*.png", { eager: true }),
  "../assets/sprite/profession/",
  ".png"
);

export const SkillsSection = (props: Props) => {
  const farmers = props.gameSave
    .getAllFarmerNames()
    .map((name) => props.gameSave.getFarmer(name));

  return (
    <SummarySection id="skills">
      <h1>Skills</h1>

      <div
        className={styles.farmers}
        style={{ ["--farmerCount" as string]: farmers.length }}
      >
        {farmers.map((farmer) => {
          if (!farmer) return;

          return (
            <div key={farmer.name} className={styles.farmer}>
              <h1 className={styles.name}>
                <img src={farmer.gender === "Male" ? malePng : femalePng} />
                <span>{farmer.name}</span>
                <a
                  href={StardewWiki.getLink("Skills", "Skill-Based_Title")}
                  target="_blank"
                >
                  ({farmer?.skillBasedTitle}{" "}
                  <span>- Skill Lv. {farmer.skillLevelTotal / 2})</span>
                </a>
              </h1>

              {entries(farmer.skills).map(([skillId, skill]) => (
                <div key={skillId} className={styles.skill}>
                  <span>{capitalCase(skillId)}</span>

                  <a
                    href={StardewWiki.getLink("Skills", capitalCase(skillId))}
                    target="_blank"
                  >
                    <img
                      width={20}
                      src={skillSprites.resolve(skillId)?.default}
                    />
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
                                src={
                                  professionSprites.resolve(
                                    lowerCase(
                                      skill.professions?.[professionIndex]
                                    )
                                  )?.default
                                }
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

              <Achievement
                title={"Singular Talent"}
                achieved={values(farmer.skills).some(
                  (skill) => skill.level === 10
                )}
                description={<>Reach Level 10 in a skill</>}
              />

              <Achievement
                title={"Master of the Five Ways"}
                achieved={values(farmer.skills).every(
                  (skill) => skill.level === 10
                )}
                description={<>Reach Level 10 in every skill</>}
              />
            </div>
          );
        })}
      </div>
    </SummarySection>
  );
};
