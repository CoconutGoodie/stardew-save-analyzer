import { times } from "remeda";
import { ImageObjective } from "~frontend/component/ImageObjective";
import { SummarySection } from "~frontend/component/SummarySection";
import { GameSave } from "~frontend/gamesave/GameSave";
import { STARDEW_GOLDEN_WALNUTS } from "~frontend/const/StardewGoldenWalnuts";

import goldenWalnutPng from "~frontend/assets/icon/golden-walnut.png";

import styles from "./GoldenWalnutsSection.module.scss";
import { Tooltip } from "~frontend/component/Tooltip/Tooltip";

interface Props {
  gameSave: GameSave;
}

export function GoldenWalnutsSection(props: Props) {
  return (
    <SummarySection
      id="golden-walnuts"
      sectionTitle="Golden Walnuts"
      sectionIcon={goldenWalnutPng}
      // className={styles.section}
      collapsable
      // allDone={allDone}
    >
      <div className={styles.walnuts}>
        {/* {STARDEW_GOLDEN_WALNUTS.map((walnutInfo, i) =>
          times(walnutInfo.quantity, (j) => (
            <ImageObjective
              key={`${i} - ${j}`}
              done
              src={goldenWalnutPng}
              height={38}
            />
          ))
        )} */}
        {times(130, (i) => (
          <Tooltip.Root key={i}>
            <Tooltip.Trigger>
              <ImageObjective done src={goldenWalnutPng} height={38} />
            </Tooltip.Trigger>

            <Tooltip.Content>
              <img src={goldenWalnutPng} />
              <p>
                I am the tooltip for <strong>Walnut#{i}</strong>
              </p>
            </Tooltip.Content>
          </Tooltip.Root>
        ))}
      </div>
    </SummarySection>
  );
}
