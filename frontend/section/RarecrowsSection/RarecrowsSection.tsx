import scarecrowPng from "~frontend/assets/icon/scarecrow.png";
import { ImageObjective } from "~frontend/component/ImageObjective";
import { InfoText } from "~frontend/component/InfoText";
import { ObjectiveOLD } from "~frontend/component/Objective/Objective";
import { SummarySection } from "~frontend/component/SummarySection";
import { RARECROW_SPRITES } from "~frontend/const/Assets";
import { STARDEW_RARECROW_IDS } from "~frontend/const/StardewRarecrows";
import { GameSave } from "~frontend/gamesave/GameSave";
import { useGoals_OLD } from "~frontend/hook/useGoals_OLD";
import { StardewWiki } from "~frontend/util/StardewWiki";
import { mapToObj, sum, values } from "remeda";

import styles from "./RarecrowsSection.module.scss";
import { SectionPart } from "~frontend/component/SectionPart/SectionPart";

interface Props {
  gameSave: GameSave;
}

export const RarecrowSection = (props: Props) => {
  const farmers = props.gameSave.getAllFarmers();

  const allCollected =
    // Either everyone got the letter
    farmers.every((farmer) => farmer.rarecrowSocietyMailed) ||
    // Or at least 1 of each Rarecrow is either currently placed down across the Valley
    // Or currently inside a chest across the Valley
    values(props.gameSave.allRarecrows).every((v) => v > 0);

  const totalPlaced = sum(values(props.gameSave.rarecrowsPlaced));

  const { goals, allDone } = useGoals_OLD({
    global: {
      objectives: {
        allCollected,
      },
    },
    individuals: mapToObj(farmers, (farmer) => [
      farmer.name,
      {
        objectives: {
          mailReceived: farmer.rarecrowSocietyMailed,
        },
      },
    ]),
  });

  return (
    <SummarySection
      id="rarecrow-society"
      sectionTitle="Rarecrow Society"
      sectionIcon={scarecrowPng}
      collapsable
      versions={["v1.4 Introduced"]}
      allDone={allDone}
    >
      <SectionPart.Statistics>
        <>
          In total, <strong>{totalPlaced}</strong> Rarecrow(s) are placed all
          across the Valley.
        </>
        <>
          Placed{" "}
          <strong>
            {values(props.gameSave.rarecrowsPlaced).filter((x) => x > 0).length}
          </strong>{" "}
          of <strong>{STARDEW_RARECROW_IDS.length}</strong> different
          Rarecrow(s) all across the Valley.
        </>
      </SectionPart.Statistics>

      {/* <div className={styles.objectives}>
        <Objective done icon={<img src={scarecrowPng} />}>
          In total, <strong>{totalPlaced}</strong> Rarecrow(s) are placed all
          across the Valley.
        </Objective>
        <Objective done icon={<img src={scarecrowPng} />}>
          Placed{" "}
          <strong>
            {values(props.gameSave.rarecrowsPlaced).filter((x) => x > 0).length}
          </strong>{" "}
          of <strong>{STARDEW_RARECROW_IDS.length}</strong> different
          Rarecrow(s) all across the Valley.
        </Objective>
      </div> */}

      <div className={styles.rarecrows}>
        <a target="_blank" href={StardewWiki.getLink("Scarecrow")}>
          <ImageObjective
            done={farmers.some(
              (farmer) => farmer.craftedRecipes["Scarecrow"] > 0
            )}
            height={100}
            title="Scarecrow"
            src={RARECROW_SPRITES.resolve("scarecrow")}
          />
        </a>

        <div className={styles.divider} />

        {STARDEW_RARECROW_IDS.map((rarecrowId, index) => (
          <a
            key={rarecrowId}
            target="_blank"
            href={StardewWiki.getLink("Scarecrow", "Rarecrows")}
          >
            <ImageObjective
              done={allCollected || props.gameSave.allRarecrows[rarecrowId] > 0}
              height={100}
              title={`Rarecrow #${index + 1}`}
              src={RARECROW_SPRITES.resolve(`rarecrow_${index + 1}`)}
            />
          </a>
        ))}

        <div className={styles.divider} />

        <a target="_blank" href={StardewWiki.getLink("Scarecrow")}>
          <ImageObjective
            done={values(goals.individuals).every(
              (ind) => ind.objectives.mailReceived
            )}
            height={100}
            title="Deluxe Scarecrow"
            src={RARECROW_SPRITES.resolve("deluxe_scarecrow")}
          />
        </a>
      </div>

      <InfoText className={styles.note}>
        Once every{" "}
        <a target="_blank" href={StardewWiki.getLink("Scarecrow", "Rarecrows")}>
          Rarecrow
        </a>{" "}
        is collected, at least one of each Rarecrow shall be placed down
        anywhere across the Valley (or on Ginger Island). Then, the next day,
        there will be <strong>approximately 90%</strong> chance to receive a
        mail from{" "}
        <a
          target="_blank"
          href={StardewWiki.getLink("Deluxe Scarecrow", "Letter")}
        >
          the Z. C. Rarecrow Society
        </a>{" "}
        rewarding you with the{" "}
        <a target="_blank" href={StardewWiki.getLink("Deluxe Scarecrow")}>
          Deluxe Scarecrow
        </a>{" "}
        recipe.
      </InfoText>

      <div className={styles.objectives}>
        <ObjectiveOLD done={allCollected}>
          Every{" "}
          <a
            target="_blank"
            href={StardewWiki.getLink("Scarecrow", "Rarecrows")}
          >
            <strong>Rarecrow</strong>
          </a>{" "}
          is collected.
          {!allCollected && (
            <>
              {" "}
              — Completed{" "}
              {
                values(props.gameSave.allRarecrows).filter((x) => x > 0).length
              }{" "}
              out of {STARDEW_RARECROW_IDS.length}
            </>
          )}
        </ObjectiveOLD>
        {props.gameSave.getAllFarmers().map((farmer) => (
          <ObjectiveOLD
            key={farmer.name}
            done={goals.individuals[farmer.name].objectives.mailReceived}
          >
            <strong>{farmer.name}</strong> received the mail from{" "}
            <a
              target="_blank"
              href={StardewWiki.getLink("Deluxe Scarecrow", "Letter")}
            >
              <strong>Z.C. Rarecrow Society</strong>
            </a>
            .
          </ObjectiveOLD>
        ))}
      </div>
    </SummarySection>
  );
};
