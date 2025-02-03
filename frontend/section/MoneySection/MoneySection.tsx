import { sum } from "remeda";
import { Currency } from "~frontend/component/Currency/Currency";
import { Section } from "~frontend/component/Section/Section";
import { SectionPart } from "~frontend/component/SectionPart/SectionPart";
import { GameSave } from "~frontend/gamesave/GameSave";
import { useGoals } from "~frontend/hook/useGoals";

import goldPng from "~frontend/assets/icon/gold.png";

import styles from "./MoneySection.module.scss";
import { StardewWiki } from "~frontend/util/StardewWiki";

interface Props {
  gameSave: GameSave;
}

export const MoneySection = (props: Props) => {
  const farmers = props.gameSave.getAllFarmers();

  const goals = useGoals(() => ({
    global: {
      objectives: [
        {
          id: "goldClock",
          type: "triggerable",
          triggered: props.gameSave.goldClock.isBuilt,
          description: (
            <>
              <a target="_blank" href={StardewWiki.getLink("Gold_Clock")}>
                <strong>Gold Clock</strong>
              </a>{" "}
              has been built for <Currency amount={10000000} unit="gold" />.
            </>
          ),
        },
      ],
    },
    individuals: props.gameSave.getAllFarmers().map((farmer) => ({
      farmer,
      achievements: [
        farmer.getAchievements().greenhorn,
        farmer.getAchievements().cowpoke,
        farmer.getAchievements().homesteader,
        farmer.getAchievements().millionaire,
        farmer.getAchievements().legend,
      ],
    })),
  }));

  if (props.gameSave.separateWallets) {
    farmers.forEach((farmer) => {
      console.log(farmer.money);
    });

    // TODO: Add separate wallets spot. And show individual farmers
    return (
      <Section
        id="money"
        sectionTitle="Money"
        sectionIcon={goldPng}
        className={styles.section}
        collapsable
        allDone={goals.allDone}
      >
        <p>[WIP] Separate Wallets Support</p>
      </Section>
    );
  }

  const totalMoneyEarned = props.gameSave.separateWallets
    ? sum(farmers.map((farmer) => farmer.totalMoneyEarned))
    : props.gameSave.player.totalMoneyEarned;

  const currentMoney = props.gameSave.player.money;

  const totalDigits = currentMoney.toString().padStart(9, " ").split("");

  return (
    <Section
      id="money"
      sectionTitle="Money"
      sectionIcon={goldPng}
      collapsable
      allDone={goals.allDone}
    >
      <SectionPart.Statistics>
        <>
          Earnings are{" "}
          <a target="_blank" href={StardewWiki.getLink("Multiplayer", "Money")}>
            <strong>
              {props.gameSave.separateWallets
                ? "separated individually"
                : "shared between Farmers"}
            </strong>
          </a>{" "}
          in <strong>{props.gameSave.farmName} Farm</strong>
        </>

        {!props.gameSave.separateWallets && (
          <>
            <strong>{props.gameSave.farmName} Farm</strong> has earned{" "}
            <Currency amount={totalMoneyEarned} /> in total.
          </>
        )}
      </SectionPart.Statistics>

      <div className={styles.money}>
        <span className={styles.currency}>G</span>
        {totalDigits.map((digit, index) => (
          <span key={index} className={styles.digit}>
            {digit}
          </span>
        ))}
      </div>

      <SectionPart.Achievements
        achievements={goals.farmerGoals(props.gameSave.player).achievements}
      />

      <SectionPart.Objectives objectives={goals.globalGoals.objectives} />
    </Section>
  );
};
