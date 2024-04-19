import { lowerCase } from "case-anything";
import { SummarySection } from "../component/SummarySection";
import { AssetRepository } from "../util/AssetRepository";
import { GameSave } from "../util/GameSave";
import { StardewWiki } from "../util/StardewWiki";

import femalePng from "../assets/icon/female.png";
import malePng from "../assets/icon/male.png";
import clockPng from "../assets/icon/clock.png";
import favoritePng from "../assets/icon/favorite-thing.png";
import gamepadPng from "../assets/icon/gamepad.png";

import styles from "./OverviewSection.module.scss";
import { GameDateDisplay } from "../component/GameDateDisplay";
import clsx from "clsx";

interface Props {
  gameSave: GameSave;
}

const farmTypesAssets = new AssetRepository<{ default: string }>(
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
  const farmOverview = props.gameSave.getFarmOverview();

  return (
    <SummarySection id="overview">
      <h1>Overview</h1>

      <div className={styles.content}>
        <a href={StardewWiki.getLink("Farm_Maps", "Map_Types")}>
          <div className={styles.farmType}>
            <img
              width={80}
              src={
                farmTypesAssets.resolve(
                  lowerCase(farmOverview.farmType).replace(/\s+/g, "-")
                )?.default
              }
            />
            <span>({farmOverview.farmType} Farm)</span>
          </div>
        </a>

        <div className={styles.column}>
          <h1>{farmOverview.farmName} Farm</h1>
          <span>
            Game Version:{" "}
            <span className={styles.gameVersion}>
              v{farmOverview.gameVersion}
            </span>
          </span>
          <span>
            Playtime: <img width={18} src={clockPng} />{" "}
            <em>{formatDuration(farmOverview.playtime)}</em>
          </span>
          <span>
            Today is <GameDateDisplay date={farmOverview.currentDate} />
          </span>
        </div>

        <div className={styles.divider} />

        <div className={styles.farmers}>
          <div className={clsx(styles.column, styles.farmer)}>
            <h1>
              <img
                height={20}
                src={
                  farmOverview.player.gender === "Female" ? femalePng : malePng
                }
              />{" "}
              {farmOverview.player.name}
            </h1>
            <ul>
              <li>Owner of the Farm</li>
              <li>
                <div>
                  Favorite thing is "<img width={14} src={favoritePng} />{" "}
                  <em>{farmOverview.player.favoriteThing}</em>"
                </div>
              </li>
              <li>
                <div>
                  Played for <img width={14} src={clockPng} />{" "}
                  <em>{formatDuration(farmOverview.player.playtime)}</em>
                </div>
              </li>
            </ul>
          </div>

          {farmOverview.farmhands.map((farmhand) => (
            <div
              key={farmhand.name}
              className={clsx(styles.column, styles.farmer)}
            >
              <h1>
                <img
                  height={20}
                  src={farmhand.gender === "Female" ? femalePng : malePng}
                />{" "}
                {farmhand.name}
              </h1>
              <ul>
                <li>Farmhand</li>
                <li>
                  <div>
                    Favorite thing is "<img width={14} src={favoritePng} />{" "}
                    <em>{farmhand.favoriteThing}</em>"
                  </div>
                </li>
                <li>
                  <div>
                    Played for <img width={14} src={clockPng} />{" "}
                    <em>{formatDuration(farmhand.playtime)}</em>
                  </div>
                </li>
              </ul>
            </div>
          ))}
        </div>
      </div>
    </SummarySection>
  );
};
