import checkmarkPng from "~frontend/assets/icon/checkmark.png";
import guntherPng from "~frontend/assets/sprite/museum/portrait.png";
import prismaticPng from "~frontend/assets/sprite/museum/minerals/prismatic_shard.png";
import { AchievementDisplay } from "~frontend/component/AchievementDisplay/AchievementDisplay";
import { ImageObjective } from "~frontend/component/ImageObjective/ImageObjective";
import { Section } from "~frontend/component/Section/Section";
import { ARTIFACT_SPRITES, MINERAL_SPRITES } from "~frontend/const/Assets";
import {
  STARDEW_ARTIFACTS,
  STARDEW_MINERALS,
} from "~frontend/const/StardewMuseum";
import { GameSave } from "~frontend/gamesave/GameSave";
import { useGoals_OLD } from "~frontend/hook/useGoals_OLD";
import { StardewWiki } from "~frontend/util/StardewWiki";
import { snakeCase } from "case-anything";
import { entries, keys } from "remeda";

import styles from "./MuseumSection.module.scss";
import { Tooltip } from "~frontend/component/Tooltip/Tooltip";

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

  const { allDone } = useGoals_OLD({
    global: {
      achievements: [
        playerAchievements.treasureTrove,
        playerAchievements.aCompleteCollection,
      ],
    },
  });

  return (
    <Section
      id="museum"
      sectionTitle="Museum Collection"
      sectionIcon={prismaticPng}
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
            In total, <strong>{totalDonated}</strong> out of{" "}
            <strong>{maxDonateCount}</strong> item(s) were donated to the{" "}
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
                <Tooltip.Root>
                  <Tooltip.Trigger>
                    <a
                      href={StardewWiki.getLink(
                        mineral.title.replace(/\s+/g, "_")
                      )}
                      target="_blank"
                    >
                      <ImageObjective
                        title={"Click to open in Wiki"}
                        src={MINERAL_SPRITES.resolve(
                          snakeCase(mineral.title).replace(/\(\)/g, "")
                        )}
                        done={props.gameSave.museumPieces.minerals.has(
                          mineralId
                        )}
                        width={36}
                        height={36}
                      />
                    </a>
                  </Tooltip.Trigger>

                  <Tooltip.Content>{mineral.title}</Tooltip.Content>
                </Tooltip.Root>
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
                <Tooltip.Root>
                  <Tooltip.Trigger>
                    <a
                      href={StardewWiki.getLink(
                        artifact.title.replace(/\s+/g, "_")
                      )}
                      target="_blank"
                    >
                      <ImageObjective
                        title={"Click to open in Wiki"}
                        src={ARTIFACT_SPRITES.resolve(
                          snakeCase(artifact.title).replace(/\(\)/g, "")
                        )}
                        done={props.gameSave.museumPieces.artifacts.has(
                          artifactId
                        )}
                        width={36}
                        height={36}
                      />
                    </a>
                  </Tooltip.Trigger>

                  <Tooltip.Content>{artifact.title}</Tooltip.Content>
                </Tooltip.Root>
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
            <> — {40 - totalDonated} more left</>
          )}
        </AchievementDisplay>

        <AchievementDisplay
          title={playerAchievements.aCompleteCollection.title}
          achieved={playerAchievements.aCompleteCollection.achieved}
          description="complete the whole collection"
        >
          {!playerAchievements.aCompleteCollection.achieved && (
            <> — {maxDonateCount - totalDonated} more left</>
          )}
        </AchievementDisplay>
      </div>
    </Section>
  );
};
