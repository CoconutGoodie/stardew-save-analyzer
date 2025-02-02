import { capitalCase } from "case-anything";
import { entries, values } from "remeda";
import starPng from "~frontend/assets/sprite/skill/mastery/mastery_star.png";
import { FarmerTag } from "~frontend/component/FarmerTag";
import { FarmersRow } from "~frontend/component/FarmersRow/FarmersRow";
import { ImageObjective } from "~frontend/component/ImageObjective";
import { Objective } from "~frontend/component/Objective/Objective";
import { SummarySection } from "~frontend/component/SummarySection";
import { PERK_SPRITES } from "~frontend/const/Assets";
import { STARDEW_MASTERY_LEVEL_EXP } from "~frontend/const/StardewMasteryLevels";
import { GameSave } from "~frontend/gamesave/GameSave";
import { useGoals } from "~frontend/hook/useGoals";
import { StardewWiki } from "~frontend/util/StardewWiki";

import styles from "./MasteriesSection.module.scss";
import { SectionPart } from "~frontend/component/SectionPart/SectionPart";

interface Props {
  gameSave: GameSave;
}

const FORMAT = new Intl.NumberFormat("en-US");

export const MasteriesSection = (props: Props) => {
  const farmers = props.gameSave.getAllFarmers();

  const goals = useGoals(() => ({
    individuals: farmers.map((farmer) => ({
      farmer,
      objectives: [
        {
          type: "triggerable",
          triggered: values(farmer.skills).every((skill) => skill.level >= 10),
          description: (
            <>
              Gained access to{" "}
              <a href={StardewWiki.getLink("Mastery_Cave")} target="_blank">
                <strong>Mastery Cave</strong>
              </a>
              .
            </>
          ),
          hint: () => (
            <>
              {values(farmer.skills).filter((skill) => skill.level < 10).length}{" "}
              more Skills to max.
            </>
          ),
        },
        {
          type: "progressive",
          current: farmer.masteries.currentLevel,
          goal: STARDEW_MASTERY_LEVEL_EXP.length - 1,
          description: <>Reached maximum Mastery level.</>,
          hint: ({ goal, current }) => <>{goal - current} more left.</>,
        },
        {
          type: "progressive",
          current: values(farmer.masteries.perks).filter((claimed) => claimed)
            .length,
          goal: values(farmer.masteries.perks).length,
          description: <>Every Mastery perk is claimed.</>,
          hint: ({ goal, current }) => <>{goal - current} more left.</>,
        },
      ],
    })),
  }));

  return (
    <SummarySection
      spoiler
      id="skill-masteries"
      sectionTitle="Skill Masteries"
      sectionIcon={starPng}
      collapsable
      versions={["v1.6 Introduced"]}
      allDone={goals.allDone}
    >
      <FarmersRow>
        {farmers.map((farmer) => {
          const expPercentage =
            farmer.masteries.currentLevel >= 5
              ? 1
              : farmer.masteries.currentExp / farmer.masteries.tnl;

          return (
            <div key={farmer.name}>
              <FarmerTag farmer={farmer} />

              <div className={styles.levelInfo}>
                <img src={starPng} />
                <span className={styles.level}>
                  {farmer.masteries.currentLevel}
                </span>
                <div className={styles.exp}>
                  <span>
                    {farmer.masteries.currentLevel >= 5
                      ? "MAX LEVEL"
                      : `${FORMAT.format(
                          farmer.masteries.currentExp
                        )} / ${FORMAT.format(farmer.masteries.tnl)} EXP`}
                  </span>
                  <div
                    className={styles.bar}
                    style={{
                      ["--percentage" as string]: `${expPercentage * 100}%`,
                    }}
                  />
                </div>
              </div>

              <div className={styles.perks}>
                {entries
                  .strict(farmer.masteries.perks)
                  .map(([perkName, claimed]) => (
                    <a
                      key={perkName}
                      href={StardewWiki.getLink("Mastery_Cave", "Masteries")}
                      target="_blank"
                      title={capitalCase(perkName)}
                    >
                      <ImageObjective
                        done={claimed}
                        height={150}
                        src={PERK_SPRITES.resolve(perkName)}
                      />
                    </a>
                  ))}
              </div>

              <SectionPart.Objectives
                objectives={goals.farmerGoals(farmer).objectives}
              />
            </div>
          );
        })}
      </FarmersRow>
    </SummarySection>
  );
};
