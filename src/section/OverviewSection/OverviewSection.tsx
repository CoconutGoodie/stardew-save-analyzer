import clockPng from "@src/assets/icon/clock.png";
import favoritePng from "@src/assets/icon/favorite-thing.png";
import femalePng from "@src/assets/icon/female.png";
import malePng from "@src/assets/icon/male.png";
import mermaidPendantPng from "@src/assets/icon/mermaid-pendant.png";
import shrineOfChallengePng from "@src/assets/icon/shrine-of-challenge.png";
import skullAltarPng from "@src/assets/icon/skull-altar.png";
import { Currency } from "@src/component/Currency";
import { GameDateDisplay } from "@src/component/GameDateDisplay";
import { SummarySection } from "@src/component/SummarySection";
import { FARM_TYPE_SPRITES, NPC_SPRITES } from "@src/const/Assets";
import { GameSave } from "@src/gamesave/GameSave";
import { StardewWiki } from "@src/util/StardewWiki";
import { lowerCase } from "case-anything";
import clsx from "clsx";
import { Fragment } from "react/jsx-runtime";

import styles from "./OverviewSection.module.scss";

interface Props {
  gameSave: GameSave;
}

function formatDuration(duration: number): string {
  const days = Math.floor(duration / 86400000);
  const hours = Math.floor((duration % 86400000) / 3600000);
  const minutes = Math.floor((duration % 3600000) / 60000);

  const formattedDurationParts = [];

  if (days > 0) {
    formattedDurationParts.push(`${days} day${days !== 1 ? "s" : ""}`);
  }

  if (hours > 0) {
    formattedDurationParts.push(`${hours} hour${hours !== 1 ? "s" : ""}`);
  }

  if (minutes > 0) {
    formattedDurationParts.push(`${minutes} minute${minutes !== 1 ? "s" : ""}`);
  }

  if (formattedDurationParts.length === 0) {
    return "0 minutes";
  }

  return formattedDurationParts.join(", ");
}

export const OverviewSection = (props: Props) => {
  return (
    <SummarySection
      id="overview"
      sectionTitle="Overview"
      sectionIcon={clockPng}
    >
      <div className={styles.content}>
        <a href={StardewWiki.getLink("Farm_Maps", "Map_Types")} target="_blank">
          <div className={styles.farmType}>
            <img
              width={80}
              src={FARM_TYPE_SPRITES.resolve(
                lowerCase(props.gameSave.farmType).replace(/\s+/g, "-")
              )}
            />
            <span>({props.gameSave.farmType} Farm)</span>
          </div>
        </a>

        <div className={styles.column}>
          <h1>{props.gameSave.farmName} Farm</h1>
          <ul>
            <li>
              <div>
                Game Version:{" "}
                <span className={styles.gameVersion}>
                  v{props.gameSave.gameVersion}
                </span>
              </div>
            </li>
            <li>
              <div>
                Today is <GameDateDisplay date={props.gameSave.currentDate} />
              </div>
            </li>
            <li>
              <div>
                <img width={18} src={clockPng} />{" "}
                <em>{formatDuration(props.gameSave.playtime)}</em>
              </div>
            </li>
            {props.gameSave.mineShrineActive && (
              <li>
                <div>
                  <img width={18} src={shrineOfChallengePng} />{" "}
                  <span>
                    Shrine of Challenge:{" "}
                    <strong className={styles.mineActive}>active</strong>.
                  </span>
                </div>
              </li>
            )}
            {props.gameSave.skullShrineActive && (
              <li>
                <div>
                  <img width={18} src={skullAltarPng} />{" "}
                  <span>
                    Skull Shrine:{" "}
                    <strong className={styles.skullActive}>active</strong>.
                  </span>
                </div>
              </li>
            )}
          </ul>
        </div>

        <div className={styles.divider} />

        {props.gameSave.getAllFarmers().map((farmer, i, farmers) => (
          <Fragment key={farmer.name}>
            <div className={clsx(styles.column, styles.farmer)}>
              <h1>
                <img
                  height={20}
                  src={farmer.gender === "Female" ? femalePng : malePng}
                />{" "}
                {farmer.name}
              </h1>
              <ul>
                <li>
                  {farmer === props.gameSave.player
                    ? "Owner of the Farm"
                    : "Farmhand"}
                </li>
                <li>
                  <div>
                    Favorite: "<img width={14} src={favoritePng} />{" "}
                    <em>{farmer.favoriteThing}</em>"
                  </div>
                </li>
                <li>
                  <div>
                    <img width={14} src={clockPng} />{" "}
                    <em>{formatDuration(farmer.playtime)}</em>
                  </div>
                </li>
                {farmer.spouse && (
                  <li>
                    <div>
                      <img width={14} src={mermaidPendantPng} />
                      <span> Married to </span>
                      <a href={StardewWiki.getLink(farmer.spouse)}>
                        <img
                          width={14}
                          src={NPC_SPRITES.resolve(farmer.spouse.toLowerCase())}
                        />
                        <strong> {farmer.spouse}</strong>
                      </a>
                    </div>
                  </li>
                )}
                {farmer.qiGems > 0 && (
                  <li>
                    <div>
                      Qi Gems: <Currency amount={farmer.qiGems} unit="qiGems" />
                    </div>
                  </li>
                )}
                {farmer.qiCoins > 0 && (
                  <li>
                    <div>
                      Qi Coins:{" "}
                      <Currency amount={farmer.qiCoins} unit="qiCoins" />
                    </div>
                  </li>
                )}
              </ul>
            </div>

            {i !== farmers.length - 1 && <div className={styles.divider} />}
          </Fragment>
        ))}
      </div>
    </SummarySection>
  );
};
