import { SummarySection } from "../component/SummarySection";
import { GameSave } from "@src/gamesave/GameSave";

import grandpaPortraitPng from "@src/assets/sprite/grandpa/portrait.png";
import grandpaGhostPng from "@src/assets/sprite/grandpa/ghost.png";
import shrinePng from "@src/assets/sprite/grandpa/shrine.png";
import candleFirePng from "@src/assets/sprite/grandpa/candle-fire.gif";
import checkmarkPng from "@src/assets/icon/checkmark.png";

import styles from "./GrandpasSection.module.scss";
import { Objective } from "@src/component/Objective";
import { GameDate, GameSeason } from "@src/util/GameDate";
import { GameDateDisplay } from "@src/component/GameDateDisplay";
import clsx from "clsx";
import { Currency } from "@src/component/Currency";
import { useMemo } from "react";

interface Props {
  gameSave: GameSave;
}

const GHOST_RETURN_DATE = new GameDate(3, GameSeason.Spring, 1);

export const GrandpasEvaluationsSection = (props: Props) => {
  const grandpaReturned =
    props.gameSave.currentDate.canonicalDay >= GHOST_RETURN_DATE.canonicalDay;

  const nextCandlesLit = (() => {
    if (props.gameSave.grandpaScoreTotal <= 3) return 1;
    if (props.gameSave.grandpaScoreTotal <= 7) return 2;
    if (props.gameSave.grandpaScoreTotal <= 11) return 3;
    return 4;
  })();

  return (
    <SummarySection
      sectionTitle="Grandpa's Evaluations"
      collapsable
      className={styles.section}
    >
      <div>
        <div className={styles.shrine}>
          <img width={150} src={shrinePng} />
          <img
            height={100}
            src={grandpaGhostPng}
            className={clsx(styles.grandpa, grandpaReturned && styles.returned)}
          />
          {Array.from({ length: 4 }).map(
            (_, i) =>
              props.gameSave.grandpaShrineCandlesLit > i && (
                <img
                  key={i}
                  width={20}
                  src={candleFirePng}
                  className={styles[`candle${i + 1}`]}
                />
              )
          )}
        </div>
        <div className={styles.eval}>
          <img
            src={grandpaPortraitPng}
            className={clsx(
              styles.grandpaPortrait,
              grandpaReturned && styles.returned
            )}
          />

          {grandpaReturned ? (
            <span>
              Next time you bring <Currency amount={1} unit="diamonds" /> to the
              shrine, your score shall be:
            </span>
          ) : (
            <span>
              When Grandpa's ghost returns at{" "}
              <GameDateDisplay date={GHOST_RETURN_DATE} />, your score will be:
            </span>
          )}

          <ul>
            {props.gameSave.grandpaScorePoints.map(
              ({ earned, reason, score }, index) =>
                earned ? (
                  <li key={index}>
                    <strong>+ {score}</strong> for {reason}{" "}
                    <img src={checkmarkPng} />
                  </li>
                ) : (
                  <li key={index} className={styles.unearned}>
                    <strong>+ {score}</strong> for {reason}
                  </li>
                )
            )}
            <hr />
            <li>
              Total Score: <strong>{props.gameSave.grandpaScoreTotal}</strong>,
              which means <strong>{nextCandlesLit}</strong> candle(s) will be
              lit.
            </li>
          </ul>
        </div>

        <Objective className={styles.objective} done={grandpaReturned}>
          Grandpa's ghost has returned (at{" "}
          <GameDateDisplay date={GHOST_RETURN_DATE} />)
        </Objective>

        <Objective
          className={styles.objective}
          done={props.gameSave.grandpaShrineCandlesLit === 4}
        >
          Grandpa's shrine got all the candles lit.{" "}
          {props.gameSave.grandpaShrineCandlesLit !== 4 && (
            <>— {4 - props.gameSave.grandpaShrineCandlesLit} more unlit</>
          )}
        </Objective>
      </div>
    </SummarySection>
  );
};
