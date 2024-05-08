import { FarmerTag } from "@src/component/FarmerTag";
import { FarmersRow } from "@src/component/FarmersRow";
import { Objective } from "@src/component/Objective";
import { SummarySection } from "@src/component/SummarySection";
import { GameSave } from "@src/gamesave/GameSave";

import starPng from "@src/assets/sprite/skill/mastery/mastery_star.png";

import { ImageObjective } from "@src/component/ImageObjective";
import { STARDEW_MASTERY_LEVEL_EXP } from "@src/const/StardewMasteryLevels";
import { useGoals } from "@src/hook/useGoals";
import { AssetRepository } from "@src/util/AssetRepository";
import { StardewWiki } from "@src/util/StardewWiki";
import { capitalCase } from "case-anything";
import { keys, mapToObj, values } from "remeda";
import styles from "./MasteriesSection.module.scss";

interface Props {
  gameSave: GameSave;
}

const FORMAT = new Intl.NumberFormat("en-US");

const perkSprites = new AssetRepository<{ default: string }>(
  import.meta.glob("../assets/sprite/skill/mastery/*.png", { eager: true }),
  "../assets/sprite/skill/mastery/",
  ".png"
);

export const MasteriesSection = (props: Props) => {
  const farmers = props.gameSave.getAllFarmers();

  const { goals, allDone } = useGoals({
    farmers: mapToObj(farmers, (farmer) => [
      farmer.name,
      {
        objectives: {
          accessToCave: farmer.skillLevelTotal === 50,
          perksClaimed: farmer.masteries.perks,
          maxLevelReached:
            farmer.masteries.currentLevel >=
            STARDEW_MASTERY_LEVEL_EXP.length - 1,
        },
      },
    ]),
  });

  return (
    <SummarySection
      spoiler
      id="skill-masteries"
      sectionTitle="Skill Masteries"
      collapsable
      versions={["v1.6 Introduced"]}
      allDone={allDone}
    >
      <FarmersRow>
        {farmers.map((farmer) => {
          const expPercentage =
            farmer.masteries.currentLevel >= 5
              ? 1
              : farmer.masteries.currentExp / farmer.masteries.tnl;

          const farmerGoals = goals.farmers[farmer.name];

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
                {keys.strict(farmer.masteries.perks).map((perkName) => (
                  <a
                    key={perkName}
                    href={StardewWiki.getLink("Mastery_Cave", "Masteries")}
                    target="_blank"
                    title={capitalCase(perkName)}
                  >
                    <ImageObjective
                      done={farmerGoals.objectives!.perksClaimed[perkName]}
                      height={150}
                      src={perkSprites.resolve(perkName)?.default ?? ""}
                    />
                  </a>
                ))}
              </div>

              <div className={styles.objectives}>
                <Objective done={farmerGoals.objectives!.accessToCave}>
                  Gained access to{" "}
                  <a href={StardewWiki.getLink("Mastery_Cave")} target="_blank">
                    <strong>Mastery Cave</strong>
                  </a>
                  .
                </Objective>

                <Objective done={farmerGoals.objectives!.maxLevelReached}>
                  Reached maximum Mastery level.
                </Objective>

                <Objective
                  done={values(farmerGoals.objectives!.perksClaimed).every(
                    (claimed) => claimed
                  )}
                >
                  Every Mastery perk is claimed.
                </Objective>
              </div>
            </div>
          );
        })}
      </FarmersRow>
    </SummarySection>
  );
};
