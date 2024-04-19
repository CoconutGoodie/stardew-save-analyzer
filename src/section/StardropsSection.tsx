import { Achievement } from "../component/Achievement";
import { GameSave } from "../util/GameSave";
import stardropGif from "../assets/stardrop.gif";
import stardropPng from "../assets/stardrop.png";
import { SummarySection } from "../component/SummarySection";

import femalePng from "../assets/icon/female.png";
import malePng from "../assets/icon/male.png";

import styles from "./StardropsSection.module.scss";
import clsx from "clsx";
import { StardewWiki } from "../util/StardewWiki";

interface Props {
  gameSave: GameSave;
}

export const StardropsSection = (props: Props) => {
  const farmerNames = props.gameSave.getAllFarmerNames();

  return (
    <SummarySection id="stardrops">
      <h1>Stardrops</h1>

      <div
        style={{
          display: "grid",
          gap: 50,
          gridTemplateColumns: `repeat(${farmerNames.length}, 1fr)`,
        }}
      >
        {farmerNames.map((farmerName) => {
          const farmer = props.gameSave.getFarmer(farmerName);
          const stardrops = props.gameSave.getStardrops(farmerName)!;

          return (
            <div className={styles.farmer}>
              <h1 className={styles.name}>
                <img src={farmer?.gender[0] === "Male" ? malePng : femalePng} />
                <span>{farmerName}</span>
                {/* <span className={styles.progress}>
                  - ({stardrops.filter((stardrop) => stardrop.gathered).length}{" "}
                  out of {stardrops.length} gathered)
                </span> */}
              </h1>

              <div className={styles.starfruitList}>
                {stardrops.map((stardrop, index) => (
                  <div
                    className={clsx(
                      styles.starfruit,
                      stardrop.gathered && styles.gathered
                    )}
                  >
                    <a
                      href={StardewWiki.getLink("Stardrop", "Locations")}
                      target="_blank"
                    >
                      <img
                        width={35}
                        src={stardrop.gathered ? stardropGif : stardropPng}
                        title={`Stardrop #${index + 1}`}
                        style={{
                          filter: stardrop.gathered ? "" : "brightness(0.5)",
                          opacity: stardrop.gathered ? 1 : 0.65,
                        }}
                      />
                    </a>
                    <div className={styles.description}>
                      {stardrop.description}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 10 }}>
                <Achievement
                  title="Mystery Of The Stardrops"
                  description="Gather every Stardrop"
                  achieved={stardrops.every((stardrop) => stardrop.gathered)}
                >
                  {/* <span>
                    —{" "}
                    {stardrops.length -
                      stardrops.filter((stardrop) => stardrop.gathered)
                        .length}{" "}
                    more to go
                  </span> */}
                </Achievement>
              </div>
            </div>
          );
        })}
      </div>
    </SummarySection>
  );
};
