import checkmarkPng from "@src/assets/icon/checkmark.png";
import guntherPng from "@src/assets/sprite/museum/portrait.png";
import { AchievementDisplay } from "@src/component/AchievementDisplay";
import { ImageObjective } from "@src/component/ImageObjective";
import { SummarySection } from "@src/component/SummarySection";
import { ARTIFACT_SPRITES, MINERAL_SPRITES } from "@src/const/Assets";
import { STARDEW_ARTIFACTS, STARDEW_MINERALS } from "@src/const/StardewMuseum";
import { GameSave } from "@src/gamesave/GameSave";
import { useGoals } from "@src/hook/useGoals";
import { StardewWiki } from "@src/util/StardewWiki";
import { snakeCase } from "case-anything";
import { entries, keys } from "remeda";

import styles from "./MuseumSection.module.scss";

interface Props {
  gameSave: GameSave;
}

export const MuseumSection = (props: Props) => {
  const totalDonated =
    props.gameSave.museumPieces.artifacts.size +
    props.gameSave.museumPieces.minerals.size;

  const maxDonateCount =
    keys(STARDEW_ARTIFACTS).length + keys(STARDEW_MINERALS).length;

  const playerAchievements =
    props.gameSave.achievements[props.gameSave.player.name];

  const { allDone } = useGoals({
    global: {
      achievements: [
        playerAchievements.treasureTrove,
        playerAchievements.aCompleteCollection,
      ],
    },
  });

  return (
    <SummarySection
      id="museum"
      sectionTitle="Museum Collection"
      collapsable
      allDone={allDone}
    >
      <div className={styles.info}>
        <a href={StardewWiki.getLink("Gunther")} target="_blank">
          <img src={guntherPng} />
        </a>
        <ul>
          <li>
            <strong>{props.gameSave.museumPieces.minerals.size}</strong>{" "}
            <a href={StardewWiki.getLink("Minerals")} target="_blank">
              mineral(s)
            </a>{" "}
            were donated to the{" "}
            <a href={StardewWiki.getLink("Museum")} target="_blank">
              Museum Collection
            </a>
            .
          </li>
          <li>
            <strong>{props.gameSave.museumPieces.artifacts.size}</strong>{" "}
            <a href={StardewWiki.getLink("Artifacts")} target="_blank">
              artifact(s)
            </a>{" "}
            were donated to the{" "}
            <a href={StardewWiki.getLink("Museum")} target="_blank">
              Museum Collection
            </a>
            .
          </li>
          <li>
            In total, <strong>{totalDonated}</strong> items were donated to the{" "}
            <a href={StardewWiki.getLink("Museum")} target="_blank">
              Museum Collection
            </a>
            .
          </li>
        </ul>
      </div>

      <div className={styles.shelves}>
        <div className={styles.shelf}>
          <span className={styles.label}>
            <a href={StardewWiki.getLink("Minerals")} target="_blank">
              Minerals
            </a>{" "}
            — {props.gameSave.museumPieces.minerals.size} /{" "}
            {keys(STARDEW_MINERALS).length}{" "}
            {props.gameSave.museumPieces.minerals.size ===
              keys(STARDEW_MINERALS).length && (
              <img src={checkmarkPng} height={16} />
            )}
          </span>
          <div className={styles.items}>
            {entries(STARDEW_MINERALS).map(([mineralId, mineral]) => (
              <div key={mineralId} className={styles.item}>
                <a
                  href={StardewWiki.getLink(mineral.title.replace(/\s+/g, "_"))}
                  target="_blank"
                >
                  <ImageObjective
                    title={mineral.title}
                    src={MINERAL_SPRITES.resolve(
                      snakeCase(mineral.title).replace(/\(\)/g, "")
                    )}
                    done={props.gameSave.museumPieces.minerals.has(mineralId)}
                    width={36}
                    height={36}
                  />
                </a>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.shelf}>
          <span className={styles.label}>
            <a href={StardewWiki.getLink("Artifacts")} target="_blank">
              Artifacts
            </a>{" "}
            — {props.gameSave.museumPieces.artifacts.size} /{" "}
            {keys(STARDEW_ARTIFACTS).length}{" "}
            {props.gameSave.museumPieces.artifacts.size ===
              keys(STARDEW_ARTIFACTS).length && (
              <img src={checkmarkPng} height={16} />
            )}
          </span>
          <div className={styles.items}>
            {entries(STARDEW_ARTIFACTS).map(([artifactId, artifact]) => (
              <div key={artifactId} className={styles.item}>
                <a
                  href={StardewWiki.getLink(
                    artifact.title.replace(/\s+/g, "_")
                  )}
                  target="_blank"
                >
                  <ImageObjective
                    title={artifact.title}
                    src={ARTIFACT_SPRITES.resolve(
                      snakeCase(artifact.title).replace(/\(\)/g, "")
                    )}
                    done={props.gameSave.museumPieces.artifacts.has(artifactId)}
                    width={36}
                    height={36}
                  />
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.achievements}>
        <AchievementDisplay
          title={playerAchievements.treasureTrove.title}
          achieved={playerAchievements.treasureTrove.achieved}
          description="donate 40 items"
        >
          {!playerAchievements.treasureTrove.achieved && (
            <> — Donated {totalDonated} out of 40</>
          )}
        </AchievementDisplay>

        <AchievementDisplay
          title={playerAchievements.aCompleteCollection.title}
          achieved={playerAchievements.aCompleteCollection.achieved}
          description="complete the whole collection"
        >
          {!playerAchievements.aCompleteCollection.achieved && (
            <>
              {" "}
              — Donated {totalDonated} out of {maxDonateCount}
            </>
          )}
        </AchievementDisplay>
      </div>
    </SummarySection>
  );
};
