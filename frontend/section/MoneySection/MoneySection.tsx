import { useGoals } from "~frontend/hook/useGoals";
import { AchievementDisplay } from "~frontend/component/AchievementDisplay";
import { Currency } from "~frontend/component/Currency";
import { SummarySection } from "~frontend/component/SummarySection";
import { GameSave } from "~frontend/gamesave/GameSave";

import goldPng from "~frontend/assets/icon/gold.png";

import styles from "./MoneySection.module.scss";
import { mapToObj, prop, sum } from "remeda";
import { thru } from "~frontend/util/utilities";

interface Props {
  gameSave: GameSave;
}

export const MoneySection = (props: Props) => {
  const farmers = props.gameSave.getAllFarmers();

  const { goals, allDone } = useGoals({
    global: {
      objectives: {
        builtGoldenClock: false, // TODO
      },
    },
    individuals: mapToObj(farmers, (farmer) => [
      farmer.name,
      {
        achievements: thru(farmer.getAchievements(), (achievements) => [
          achievements.greenhorn,
          achievements.cowpoke,
          achievements.homesteader,
          achievements.millionaire,
          achievements.legend,
        ]),
      },
    ]),
  });

  if (props.gameSave.separateWallets) {
    // TODO: Add separate wallets spot. And show individual farmers
    return (
      <SummarySection
        id="money"
        sectionTitle="Money"
        sectionIcon={goldPng}
        className={styles.section}
        collapsable
        allDone={allDone}
      >
        <p>[WIP] Separate Wallets Support</p>
      </SummarySection>
    );
  }

  const totalMoneyEarned = props.gameSave.separateWallets
    ? sum(farmers.map((farmer) => farmer.totalMoneyEarned))
    : props.gameSave.player.totalMoneyEarned;

  const currentMoney = props.gameSave.player.money;

  const totalDigits = currentMoney.toString().padStart(9, " ").split("");

  return (
    <SummarySection
      id="money"
      sectionTitle="Money"
      sectionIcon={goldPng}
      className={styles.section}
      collapsable
      allDone={allDone}
    >
      <div>
        In total, <strong>{props.gameSave.farmName} Farm</strong> has earned{" "}
        <Currency amount={totalMoneyEarned} />
      </div>

      <div className={styles.money}>
        <span className={styles.currency}>G</span>
        {totalDigits.map((digit, index) => (
          <span key={index} className={styles.digit}>
            {digit}
          </span>
        ))}
      </div>

      <div className={styles.achievements}>
        {goals.individuals[props.gameSave.player.name].achievements.map(
          (achievement) => {
            return (
              <AchievementDisplay
                key={achievement.title}
                title={achievement.title}
                achieved={achievement.achieved}
                description={
                  <>
                    earn <Currency amount={achievement.goal} />
                  </>
                }
              >
                {!achievement.achieved && (
                  <span>
                    —{" "}
                    <Currency
                      amount={achievement.goal - totalMoneyEarned}
                      unit="gold"
                    />{" "}
                    more to go
                  </span>
                )}
              </AchievementDisplay>
            );
          }
        )}
      </div>
    </SummarySection>
  );
};
