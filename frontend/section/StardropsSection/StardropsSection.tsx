import checkmarkPng from "~frontend/assets/icon/checkmark.png";
import stardropGif from "~frontend/assets/stardrop.gif";
import stardropPng from "~frontend/assets/stardrop.png";
import stardropIconPng from "~frontend/assets/icon/stardrop.png";
import { AchievementDisplay } from "~frontend/component/AchievementDisplay";
import { FarmerTag } from "~frontend/component/FarmerTag";
import { FarmersRow } from "~frontend/component/FarmersRow/FarmersRow";
import { ObjectiveOLD } from "~frontend/component/Objective/Objective";
import { SummarySection } from "~frontend/component/SummarySection";
import { GameSave } from "~frontend/gamesave/GameSave";
import { useGoals_OLD } from "~frontend/hook/useGoals_OLD";
import { StardewWiki } from "~frontend/util/StardewWiki";
import { thru } from "~frontend/util/utilities";
import clsx from "clsx";
import { mapToObj } from "remeda";

import styles from "./StardropsSection.module.scss";

interface Props {
  gameSave: GameSave;
}

export const StardropsSection = (props: Props) => {
  const farmers = props.gameSave.getAllFarmers();

  const { allDone } = useGoals_OLD({
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
      sectionIcon={stardropIconPng}
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
                  <ObjectiveOLD
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
                  </ObjectiveOLD>
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
