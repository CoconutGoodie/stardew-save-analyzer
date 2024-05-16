import { Objective } from "@src/component/Objective";
import { SummarySection } from "@src/component/SummarySection";
import { GameSave } from "@src/gamesave/GameSave";

import scarecrowPng from "@src/assets/icon/scarecrow.png";
import { mapToObj, sum, values } from "remeda";

import { ImageObjective } from "@src/component/ImageObjective";
import { InfoText } from "@src/component/InfoText";
import { STARDEW_RARECROW_IDS } from "@src/const/StardewRarecrows";
import { AssetRepositoryOLD } from "@src/util/AssetRepository";
import { StardewWiki } from "@src/util/StardewWiki";
import styles from "./RarecrowsSection.module.scss";
import { useGoals } from "@src/hook/useGoals";

interface Props {
  gameSave: GameSave;
}

const rarecrowSprites = new AssetRepositoryOLD<{ default: string }>(
  import.meta.glob("../assets/sprite/scarecrow/*.png", {
    eager: true,
  }),
  "../assets/sprite/scarecrow/",
  ".png"
);

export const RarecrowSection = (props: Props) => {
  const farmers = props.gameSave.getAllFarmers();

  const allCollected =
    // Either everyone got the letter
    farmers.every((farmer) => farmer.rarecrowSocietyMailed) ||
    // Or at least 1 of each Rarecrow is currently placed down across the Valley
    values(props.gameSave.rarecrowsPlaced).every((v) => v > 0);

  const totalPlaced = sum(values(props.gameSave.rarecrowsPlaced));

  const { goals, allDone } = useGoals({
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
      collapsable
      versions={["v1.4 Introduced"]}
      allDone={allDone}
    >
      <div className={styles.objectives}>
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
      </div>

      <div className={styles.rarecrows}>
        <a target="_blank" href={StardewWiki.getLink("Scarecrow")}>
          <ImageObjective
            done={farmers.some(
              (farmer) => farmer.craftedRecipes["Scarecrow"] > 0
            )}
            height={100}
            title="Scarecrow"
            src={rarecrowSprites.resolve("scarecrow")?.default ?? ""}
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
              done={
                allCollected || props.gameSave.rarecrowsPlaced[rarecrowId] > 0
              }
              height={100}
              title={`Rarecrow #${index + 1}`}
              src={
                rarecrowSprites.resolve(`rarecrow_${index + 1}`)?.default ?? ""
              }
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
            src={rarecrowSprites.resolve("deluxe_scarecrow")?.default ?? ""}
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
        <Objective done={allCollected}>
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
                values(props.gameSave.rarecrowsPlaced).filter((x) => x > 0)
                  .length
              }{" "}
              out of {STARDEW_RARECROW_IDS.length}
            </>
          )}
        </Objective>
        {props.gameSave.getAllFarmers().map((farmer) => (
          <Objective
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
          </Objective>
        ))}
      </div>
    </SummarySection>
  );
};
