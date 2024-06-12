import checkmarkPng from "@src/assets/icon/checkmark.png";
import stardropGif from "@src/assets/stardrop.gif";
import stardropPng from "@src/assets/stardrop.png";
import { AchievementDisplay } from "@src/component/AchievementDisplay";
import { FarmerTag } from "@src/component/FarmerTag";
import { FarmersRow } from "@src/component/FarmersRow";
import { Objective } from "@src/component/Objective";
import { SummarySection } from "@src/component/SummarySection";
import { GameSave } from "@src/gamesave/GameSave";
import { useGoals } from "@src/hook/useGoals";
import { StardewWiki } from "@src/util/StardewWiki";
import { thru } from "@src/util/utilities";
import clsx from "clsx";
import { mapToObj } from "remeda";

import styles from "./StardropsSection.module.scss";

interface Props {
  gameSave: GameSave;
}

export const StardropsSection = (props: Props) => {
  const farmers = props.gameSave.getAllFarmers();

  const { allDone } = useGoals({
    individuals: mapToObj(farmers, (farmer) => [
      farmer.name,
      {
        achievements: [
          props.gameSave.achievements[farmer.name].mysteryOfTheStardrops,
        ],
      },
    ]),
  });

  return (
    <SummarySection
      id="stardrops"
      sectionTitle="Stardrops"
      collapsable
      allDone={allDone}
    >
      <FarmersRow>
        {farmers.map((farmer) => {
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
                          className={styles.stardropIcon}
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
                    <AchievementDisplay
                      title={achievements.mysteryOfTheStardrops.title}
                      description="gather every Stardrop"
                      achieved={achievements.mysteryOfTheStardrops.achieved}
                    >
                      {!achievements.mysteryOfTheStardrops.achieved && (
                        <>
                          {" "}
                          — {farmer.stardrops.length -
                            gatheredStardropCount}{" "}
                          more left
                        </>
                      )}
                    </AchievementDisplay>
                  )
                )}
              </div>
            </div>
          );
        })}
      </FarmersRow>
    </SummarySection>
  );
};
