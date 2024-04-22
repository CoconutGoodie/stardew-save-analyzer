import { Achievement } from "../component/Achievement";
import { Currency } from "../component/Currency";
import { SummarySection } from "../component/SummarySection";
import { GameSave } from "../gamesave/GameSave";
import styles from "./MoneySection.module.scss";

interface Props {
  gameSave: GameSave;
}

export const MoneySection = (props: Props) => {
  const farmOverview = props.gameSave.getFarmOverview();
  const moneySummary = props.gameSave.getMoneySummary();

  const totalDigits = moneySummary.earnedTotal
    .toString()
    .padStart(9, " ")
    .split("");

  return (
    <SummarySection id="money" className={styles.section}>
      <h1>Money </h1>

      <div>
        In total, {farmOverview.farmName} Farm has earned{" "}
        <Currency amount={moneySummary.earnedTotal} />
      </div>

      <div className={styles.money}>
        <span className={styles.currency}>G</span>
        {totalDigits.map((digit, index) => (
          <span key={index} className={styles.digit}>
            {digit}
          </span>
        ))}
      </div>

      <div>
        {moneySummary.achievements.map((achievement) => {
          const achieved = achievement.goal <= moneySummary.earnedTotal;

          return (
            <Achievement
              key={achievement.title}
              title={achievement.title}
              achieved={achieved}
              description={
                <>
                  earn <Currency amount={achievement.goal} />
                </>
              }
            >
              {!achieved && (
                <span>
                  —{" "}
                  <Currency
                    amount={achievement.goal - moneySummary.earnedTotal}
                    unit="gold"
                  />{" "}
                  more to go
                </span>
              )}
            </Achievement>
          );
        })}
      </div>
    </SummarySection>
  );
};
