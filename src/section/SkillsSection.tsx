import { lowerCase } from "case-anything";
import { Achievement } from "../component/Achievement";
import { SummarySection } from "../component/SummarySection";
import { AssetRepository } from "../util/AssetRepository";
import { GameSave } from "../util/GameSave";

import femalePng from "../assets/icon/female.png";
import malePng from "../assets/icon/male.png";

import styles from "./SkillsSection.module.scss";

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
          const skillAttribs = props.gameSave.getSkillAttributes(farmerName)!;

          return (
            <div className={styles.farmer}>
              <h1 className={styles.name}>
                <img src={farmer?.gender[0] === "Male" ? malePng : femalePng} />
                <span>{farmerName}</span>
                <a
                  href="https://stardewvalleywiki.com/Skills#Skill-Based_Title"
                  target="_blank"
                >
                  <span>({skillAttribs.title})</span>
                </a>
              </h1>

              {skillAttribs.skills.map((skill) => (
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
                              href={`https://stardewvalleywiki.com/Skills#${skill.title}`}
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
                achieved={skillAttribs.skills.some(
                  (skill) => skill.level === 10
                )}
                description={<>Reach Level 10 in a skill</>}
              />

              <Achievement
                title={"Master of the Five Ways"}
                achieved={skillAttribs.skills.every(
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
