import { lowerCase } from "case-anything";
import { SummarySection } from "../component/SummarySection";
import { AssetRepositoryOLD } from "../util/AssetRepository";
import { GameSave } from "../gamesave/GameSave";
import { StardewWiki } from "../util/StardewWiki";

import femalePng from "../assets/icon/female.png";
import malePng from "../assets/icon/male.png";
import clockPng from "../assets/icon/clock.png";
import favoritePng from "../assets/icon/favorite-thing.png";
import gamepadPng from "../assets/icon/gamepad.png";
import shrineOfChallengePng from "../assets/icon/shrine-of-challenge.png";
import skullAltarPng from "../assets/icon/skull-altar.png";

import styles from "./OverviewSection.module.scss";
import { GameDateDisplay } from "../component/GameDateDisplay";
import clsx from "clsx";
import { Currency } from "../component/Currency";
import { Fragment } from "react/jsx-runtime";

interface Props {
  gameSave: GameSave;
}

const farmTypesAssets = new AssetRepositoryOLD<{ default: string }>(
  import.meta.glob("../assets/sprite/farm-type/*.png", {
    eager: true,
  }),
  "../assets/sprite/farm-type/",
  ".png"
);

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
    <SummarySection id="overview" sectionTitle="Overview">
      <div className={styles.content}>
        <a href={StardewWiki.getLink("Farm_Maps", "Map_Types")} target="_blank">
          <div className={styles.farmType}>
            <img
              width={80}
              src={
                farmTypesAssets.resolve(
                  lowerCase(props.gameSave.farmType).replace(/\s+/g, "-")
                )?.default
              }
            />
            <span>({props.gameSave.farmType} Farm)</span>
          </div>
        </a>

        <div className={styles.column}>
          <h1>{props.gameSave.farmName} Farm</h1>
          <ul>
            <li>
              <p>
                Game Version:{" "}
                <span className={styles.gameVersion}>
                  v{props.gameSave.gameVersion}
                </span>
              </p>
            </li>
            <li>
              <p>
                Today is <GameDateDisplay date={props.gameSave.currentDate} />
              </p>
            </li>
            <li>
              <p>
                <img width={18} src={clockPng} />{" "}
                <em>{formatDuration(props.gameSave.playtime)}</em>
              </p>
            </li>
            {props.gameSave.mineShrineActive && (
              <li>
                <p>
                  <img width={18} src={shrineOfChallengePng} />{" "}
                  <span>
                    Shrine of Challenge:{" "}
                    <strong className={styles.challenge}>active</strong>.
                  </span>
                </p>
              </li>
            )}
            {props.gameSave.skullShrineActive && (
              <li>
                <p>
                  <img width={18} src={skullAltarPng} />{" "}
                  <span>
                    Skull Shrine:{" "}
                    <strong className={styles.challenge}>active</strong>.
                  </span>
                </p>
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
