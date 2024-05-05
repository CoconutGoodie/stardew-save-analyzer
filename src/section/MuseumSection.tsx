import { SummarySection } from "@src/component/SummarySection";
import { STARDEW_ARTIFACTS, STARDEW_MINERALS } from "@src/const/StardewMuseum";
import { GameSave } from "@src/gamesave/GameSave";
import { entries, keys } from "remeda";

import guntherPng from "@src/assets/sprite/museum/portrait.png";
import { ImageObjective } from "@src/component/ImageObjective";
import { AssetRepository } from "@src/util/AssetRepository";
import { StardewWiki } from "@src/util/StardewWiki";
import { lowerCase, snakeCase } from "case-anything";
import checkmarkPng from "@src/assets/icon/checkmark.png";
import styles from "./MuseumSection.module.scss";
import { Objective } from "@src/component/Objective";
import { AchievementDisplay } from "@src/component/AchievementDisplay";

interface Props {
  gameSave: GameSave;
}

const artifactSprites = new AssetRepository<{ default: string }>(
  import.meta.glob("../assets/sprite/museum/artifacts/*.png", { eager: true }),
  "../assets/sprite/museum/artifacts/",
  ".png"
);

const mineralSprites = new AssetRepository<{ default: string }>(
  import.meta.glob("../assets/sprite/museum/minerals/*.png", { eager: true }),
  "../assets/sprite/museum/minerals/",
  ".png"
);

export const MuseumSection = (props: Props) => {
  const totalDonated =
    props.gameSave.museumPieces.artifacts.size +
    props.gameSave.museumPieces.minerals.size;

  const maxDonateCount =
    keys(STARDEW_ARTIFACTS).length + keys(STARDEW_MINERALS).length;

  const playerAchievements =
    props.gameSave.achievements[props.gameSave.player.name];

  return (
    <SummarySection sectionTitle="Museum" collapsable>
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
                    src={
                      mineralSprites.resolve(
                        snakeCase(mineral.title).replace(/\(\)/g, "")
                      )?.default ?? ""
                    }
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
                    src={
                      artifactSprites.resolve(
                        snakeCase(artifact.title).replace(/\(\)/g, "")
                      )?.default ?? ""
                    }
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
