import { FarmerTag } from "@src/component/FarmerTag";
import { FarmersRow } from "@src/component/FarmersRow";
import { Objective } from "@src/component/Objective";
import { SummarySection } from "@src/component/SummarySection";
import { GameSave } from "@src/gamesave/GameSave";

import starPng from "@src/assets/sprite/skill/mastery/mastery_star.png";

import { ImageObjective } from "@src/component/ImageObjective";
import styles from "./MasteriesSection.module.scss";
import { StardewWiki } from "@src/util/StardewWiki";
import { AssetRepository } from "@src/util/AssetRepository";
import { STARDEW_MASTERY_LEVEL_EXP } from "@src/const/StardewMasteryLevels";
import { entries, keys, values } from "remeda";
import { capitalCase } from "case-anything";

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
  return (
    <SummarySection sectionTitle="Masteries" collapsable>
      <FarmersRow>
        {props.gameSave.getAllFarmers().map((farmer) => {
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
                {entries(farmer.masteries.perks).map(([perkName, hasPerk]) => (
                  <a
                    key={perkName}
                    href={StardewWiki.getLink("Mastery_Cave", "Masteries")}
                    target="_blank"
                    title={capitalCase(perkName)}
                  >
                    <ImageObjective
                      done={hasPerk}
                      height={150}
                      src={perkSprites.resolve(perkName)?.default ?? ""}
                    />
                  </a>
                ))}
              </div>

              <div className={styles.objectives}>
                <Objective done={farmer.skillLevelTotal === 50}>
                  Gained access to{" "}
                  <a href={StardewWiki.getLink("Mastery_Cave")} target="_blank">
                    <strong>Mastery Cave</strong>
                  </a>
                  .
                </Objective>

                <Objective
                  done={
                    farmer.masteries.currentLevel >=
                    STARDEW_MASTERY_LEVEL_EXP.length - 1
                  }
                >
                  Reached maximum Mastery level.
                </Objective>

                <Objective
                  done={values(farmer.masteries.perks).every((perk) => perk)}
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
