import { Currency } from "~frontend/component/Currency";
import { GameDateDisplay } from "~frontend/component/GameDateDisplay";
import { SummarySection } from "~frontend/component/SummarySection";
import { FARM_TYPE_SPRITES, NPC_SPRITES } from "~frontend/const/Assets";
import { GameSave } from "~frontend/gamesave/GameSave";
import { StardewWiki } from "~frontend/util/StardewWiki";
import { lowerCase } from "case-anything";
import clsx from "clsx";
import { Fragment } from "react/jsx-runtime";

import clockPng from "~frontend/assets/icon/clock.png";
import goldPng from "~frontend/assets/icon/gold.png";
import favoritePng from "~frontend/assets/icon/favorite-thing.png";
import femalePng from "~frontend/assets/icon/female.png";
import malePng from "~frontend/assets/icon/male.png";
import mermaidPendantPng from "~frontend/assets/icon/mermaid-pendant.png";
import shrineOfChallengePng from "~frontend/assets/icon/shrine-of-challenge.png";
import skullAltarPng from "~frontend/assets/icon/skull-altar.png";
import goldClockActivePng from "~frontend/assets/icon/gold-clock-active.png";
import goldClockInactivePng from "~frontend/assets/icon/gold-clock-inactive.png";

import styles from "./OverviewSection.module.scss";
import { SectionPart } from "~frontend/component/SectionPart/SectionPart";
import { FarmerTag } from "~frontend/component/FarmerTag";
import { FarmersRow } from "~frontend/component/FarmersRow/FarmersRow";

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
          <SectionPart.Statistics>
            <>
              Game Version:{" "}
              <span className={styles.gameVersion}>
                v{props.gameSave.gameVersion}
              </span>
            </>

            <>
              Today is <GameDateDisplay date={props.gameSave.currentDate} />
            </>

            <>
              <img width={18} src={clockPng} />{" "}
              <strong>{formatDuration(props.gameSave.playtime)}</strong> has
              been spent in this save.
            </>

            <>
              <img width={18} src={goldPng} /> Wallets are{" "}
              <strong>
                {props.gameSave.separateWallets ? "separated" : "shared"}
              </strong>
              .
            </>

            {props.gameSave.goldClock.isBuilt && (
              <>
                <img
                  width={18}
                  src={
                    props.gameSave.goldClock.active
                      ? goldClockActivePng
                      : goldClockInactivePng
                  }
                />{" "}
                Gold Clock is{" "}
                <strong
                  className={clsx(
                    props.gameSave.goldClock.active && styles.goldClockActive
                  )}
                >
                  {props.gameSave.goldClock.active ? "active" : "inactive"}
                </strong>
                .
              </>
            )}

            {props.gameSave.mineShrineActive && (
              <>
                <img width={18} src={shrineOfChallengePng} />{" "}
                <span>
                  Shrine of Challenge is{" "}
                  <strong className={styles.mineActive}>active</strong>.
                </span>
              </>
            )}

            {props.gameSave.skullShrineActive && (
              <>
                <img width={18} src={skullAltarPng} />{" "}
                <span>
                  Skull Shrine is{" "}
                  <strong className={styles.skullActive}>active</strong>.
                </span>
              </>
            )}
          </SectionPart.Statistics>
        </div>

        <div className={styles.divider} />

        <FarmersRow>
          {props.gameSave.getAllFarmers().map((farmer) => (
            <Fragment key={farmer.name}>
              <div className={clsx(styles.column, styles.farmer)}>
                <FarmerTag farmer={farmer} />

                <SectionPart.Statistics>
                  <>
                    {farmer === props.gameSave.player
                      ? "Owner of the Farm"
                      : "Farmhand"}
                  </>

                  <>
                    <img width={14} src={favoritePng} /> Favorite: "
                    <em>{farmer.favoriteThing}</em>"
                  </>

                  <>
                    <img width={14} src={clockPng} />{" "}
                    <strong>{formatDuration(farmer.playtime)}</strong> has been
                    spent in this save.
                  </>

                  {farmer.spouse && (
                    <>
                      <img width={14} src={mermaidPendantPng} />
                      <span> Married to </span>
                      <a
                        className={styles.spause}
                        href={StardewWiki.getLink(farmer.spouse)}
                      >
                        <img
                          width={14}
                          src={NPC_SPRITES.resolve(farmer.spouse.toLowerCase())}
                        />
                        <strong> {farmer.spouse}</strong>
                      </a>
                    </>
                  )}

                  {farmer.qiGems > 0 && (
                    <>
                      Qi Gems: <Currency amount={farmer.qiGems} unit="qiGems" />
                    </>
                  )}

                  {farmer.qiCoins > 0 && (
                    <>
                      Qi Coins:{" "}
                      <Currency amount={farmer.qiCoins} unit="qiCoins" />
                    </>
                  )}
                </SectionPart.Statistics>
              </div>

              {/* {i !== farmers.length - 1 && <div className={styles.divider} />} */}
            </Fragment>
          ))}
        </FarmersRow>
      </div>
    </SummarySection>
  );
};
