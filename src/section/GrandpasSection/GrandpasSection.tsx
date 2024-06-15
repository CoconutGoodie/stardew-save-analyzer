import checkmarkPng from "@src/assets/icon/checkmark.png";
import candleFirePng from "@src/assets/sprite/grandpa/candle-fire.gif";
import grandpaGhostPng from "@src/assets/sprite/grandpa/ghost.png";
import grandpaPortraitPng from "@src/assets/sprite/grandpa/portrait.png";
import shrinePng from "@src/assets/sprite/grandpa/shrine.png";
import { Currency } from "@src/component/Currency";
import { GameDateDisplay } from "@src/component/GameDateDisplay";
import { Objective } from "@src/component/Objective";
import { SummarySection } from "@src/component/SummarySection";
import { GameSave } from "@src/gamesave/GameSave";
import { GameDate, GameSeason } from "@src/util/GameDate";
import clsx from "clsx";
import { sumBy } from "remeda";

import styles from "./GrandpasSection.module.scss";
import { InfoText } from "@src/component/InfoText";

interface Props {
  gameSave: GameSave;
}

const GHOST_RETURN_DATE = new GameDate(1, GameSeason.Spring, 3);

export const GrandpasEvaluationsSection = (props: Props) => {
  const grandpaReturned =
    props.gameSave.currentDate.canonicalDay >= GHOST_RETURN_DATE.canonicalDay;

  const grandpaScoreTotal = sumBy(
    props.gameSave.grandpasEvals.scoreSubjects,
    (subject) => (subject.earned ? subject.score : 0)
  );

  const nextCandlesLit = (() => {
    if (grandpaScoreTotal <= 3) return 1;
    if (grandpaScoreTotal <= 7) return 2;
    if (grandpaScoreTotal <= 11) return 3;
    return 4;
  })();

  return (
    <SummarySection
      id="grandpas-evaluations"
      sectionTitle="Grandpa's Evaluations [WIP]"
      sectionIcon={grandpaPortraitPng}
      collapsable
      className={styles.section}
      allDone={props.gameSave.grandpasEvals.candlesLit >= 4}
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
              props.gameSave.grandpasEvals.candlesLit > i && (
                <img
                  key={i}
                  width={20}
                  src={candleFirePng}
                  className={styles[`candle${i + 1}`]}
                />
              )
          )}
          <div className={styles.candleObjectives}>
            <Objective done={props.gameSave.grandpasEvals.candlesLit >= 1}>
              First candle is lit.
            </Objective>
            <Objective done={props.gameSave.grandpasEvals.candlesLit >= 2}>
              Second candle is lit.
            </Objective>
            <Objective done={props.gameSave.grandpasEvals.candlesLit >= 3}>
              Third candle is lit.
            </Objective>
            <Objective done={props.gameSave.grandpasEvals.candlesLit >= 4}>
              Fourth candle is lit.
            </Objective>
          </div>
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
              When Grandpa's ghost returns on{" "}
              <GameDateDisplay date={GHOST_RETURN_DATE} />, your score will be:
            </span>
          )}

          <ul>
            {props.gameSave.grandpasEvals.scoreSubjects.map(
              ({ earned, reason, score }, index) => (
                <li key={index} className={clsx(!earned && styles.unearned)}>
                  <strong>+ {score}</strong> for {reason}
                  {earned && (
                    <>
                      {" "}
                      <img src={checkmarkPng} />
                    </>
                  )}
                </li>
              )
            )}
          </ul>

          <hr />

          <ul>
            <li>
              Total Score: <strong>{grandpaScoreTotal}</strong>, which means{" "}
              <strong>{nextCandlesLit}</strong> candle(s) will be lit.
            </li>
          </ul>
        </div>

        {/* <InfoText>
          <strong>Achievements</strong> do not necessarily need to be achieved
          by <em>every player</em>, only <em>one player</em> achieving is enough
          for the score.
        </InfoText> */}

        <Objective className={styles.objective} done={grandpaReturned}>
          Grandpa's ghost has returned. (On{" "}
          <GameDateDisplay date={GHOST_RETURN_DATE} />)
        </Objective>

        <Objective
          className={styles.objective}
          done={props.gameSave.grandpasEvals.candlesLit === 4}
        >
          Grandpa's shrine got all the candles lit.{" "}
          {props.gameSave.grandpasEvals.candlesLit !== 4 && (
            <>— {4 - props.gameSave.grandpasEvals.candlesLit} more unlit</>
          )}
        </Objective>
      </div>
    </SummarySection>
  );
};
