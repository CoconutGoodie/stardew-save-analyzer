import { lowerCase } from "case-anything";
import { Achievement } from "../component/Achievement";
import { SummarySection } from "../component/SummarySection";
import { AssetRepository } from "../util/AssetRepository";
import { GameSave } from "../util/GameSave";

import femalePng from "../assets/icon/female.png";
import malePng from "../assets/icon/male.png";

import styles from "./SkillsSection.module.scss";
import { StardewWiki } from "../util/StardewWiki";

interface Props {
  gameSave: GameSave;
}

const professionSprites = new AssetRepository<{ default: string }>(
  import.meta.glob("../assets/profession/*.png", { eager: true }),
  "../assets/profession/",
  ".png"
);

export const SkillsSection = (props: Props) => {
  const farmerNames = props.gameSave.getAllFarmerNames();

  return (
    <SummarySection id="skills">
      <h1>Skills</h1>

      <div
        className={styles.farmers}
        style={{ ["--farmerCount" as string]: farmerNames.length }}
      >
        {farmerNames.map((farmerName) => {
          const farmer = props.gameSave.getFarmer(farmerName);
          const skillAttributes =
            props.gameSave.getSkillAttributes(farmerName)!;

          return (
            <div className={styles.farmer}>
              <h1 className={styles.name}>
                <img src={farmer?.gender[0] === "Male" ? malePng : femalePng} />
                <span>{farmerName}</span>
                <a
                  href={StardewWiki.getLink("Skills", "Skill-Based_Title")}
                  target="_blank"
                >
                  <span>
                    ({skillAttributes.title} - Skill Lv.{" "}
                    {skillAttributes.skillLevel})
                  </span>
                </a>
              </h1>

              {skillAttributes.skills.map((skill) => (
                <div key={skill.title} className={styles.skill}>
                  <span>{skill.title}</span>
                  <img width={20} src={skill.iconSrc} />
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
                          className={pipClass}
                          style={{
                            opacity: reached ? 1 : 0.2,
                            filter: reached ? "" : "grayscale(1)",
                          }}
                        >
                          {isProfessionPip && reached && (
                            <a
                              href={StardewWiki.getLink("Skills", skill.title)}
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
                achieved={skillAttributes.skills.some(
                  (skill) => skill.level === 10
                )}
                description={<>Reach Level 10 in a skill</>}
              />

              <Achievement
                title={"Master of the Five Ways"}
                achieved={skillAttributes.skills.every(
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
