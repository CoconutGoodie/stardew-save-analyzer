import stardropGif from "../assets/stardrop.gif";
import stardropPng from "../assets/stardrop.png";
import { Achievement } from "../component/Achievement";
import { SummarySection } from "../component/SummarySection";
import { GameSave } from "../gamesave/GameSave";

import checkmarkPng from "../assets/icon/checkmark.png";

import clsx from "clsx";
import { FarmerTag } from "../component/FarmerTag";
import { Objective } from "../component/Objective";
import { StardewWiki } from "../util/StardewWiki";
import styles from "./StardropsSection.module.scss";
import { thru } from "@src/util/utilities";

interface Props {
  gameSave: GameSave;
}

export const StardropsSection = (props: Props) => {
  return (
    <SummarySection id="stardrops" sectionTitle="Stardrops" collapsable>
      <div className={styles.farmers}>
        {props.gameSave.getAllFarmers().map((farmer) => {
          const gatheredStardropCount = farmer.stardrops.filter(
            (stardrop) => stardrop.gathered
          ).length;

          return (
            <div key={farmer.name} className={styles.farmer}>
              <FarmerTag farmer={farmer} />

              <div className={styles.stardropList}>
                {farmer.stardrops.map((stardrop, index) => (
                  <Objective
                    key={index}
                    done={stardrop.gathered}
                    className={clsx(
                      styles.stardrop,
                      stardrop.gathered && styles.gathered
                    )}
                    icon={
                      <a
                        href={StardewWiki.getLink("Stardrop", "Locations")}
                        target="_blank"
                      >
                        <img
                          width={35}
                          className={styles.stardrop}
                          src={stardrop.gathered ? stardropGif : stardropPng}
                          title={`Stardrop #${index + 1}`}
                        />
                      </a>
                    }
                  >
                    <div className={styles.description}>
                      {stardrop.description}{" "}
                      {stardrop.gathered && (
                        <img width={14} src={checkmarkPng} />
                      )}
                    </div>
                  </Objective>
                ))}
              </div>

              <div style={{ marginTop: 10 }}>
                {thru(
                  props.gameSave.achievements[farmer.name],
                  (achievements) => (
                    <Achievement
                      title={achievements.mysteryOfTheStardrops.title}
                      description="gather every Stardrop"
                      achieved={achievements.mysteryOfTheStardrops.achieved}
                    >
                      <span>
                        — Missing{" "}
                        {farmer.stardrops.length - gatheredStardropCount} more
                      </span>
                    </Achievement>
                  )
                )}
              </div>
            </div>
          );
        })}
      </div>
    </SummarySection>
  );
};
