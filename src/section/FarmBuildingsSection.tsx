import { Scrollbox } from "@src/component/Scrollbox";
import { SummarySection } from "@src/component/SummarySection";
import { GameSave } from "@src/gamesave/GameSave";

import styles from "./FarmBuildingsSection.module.scss";
import { useState } from "react";
import { FARM_ANIMALS_SPRITES, FARM_BUILDING_SPRITES } from "@src/const/Assets";
import { snakeCase } from "case-anything";
import heartFilledPng from "@src/assets/icon/heart_filled.png";
import { sum, times } from "remeda";
import clsx from "clsx";
import { StardewWiki } from "@src/util/StardewWiki";

interface Props {
  gameSave: GameSave;
}

export const FarmBuildingsSection = (props: Props) => {
  const [expanded, setExpanded] = useState(false);

  const totalAnimalCount =
    props.gameSave.pets.length +
    sum(
      props.gameSave.animalBuildings.map((building) => building.animals.length)
    ) +
    sum(props.gameSave.fishPonds.map((pond) => pond.count));

  const partsJsx = [
    ...props.gameSave.animalBuildings.map((building, index) => (
      <div key={`building-${index}`} className={styles.building}>
        <div className={styles.info}>
          <img
            width={70}
            height={70}
            src={FARM_BUILDING_SPRITES.resolve(snakeCase(building.type))}
          />
          <span>{building.type}</span>
        </div>
        <div className={styles.animals}>
          {building.animals.map((animal) => (
            <a
              key={animal.name}
              target="_blank"
              href={StardewWiki.getLink(animal.type.split(/\s+/g).at(-1)!)}
              className={styles.animal}
            >
              <span>{animal.name}</span>
              <img
                height={building.type.endsWith("Barn") ? 42 : 32}
                src={FARM_ANIMALS_SPRITES.resolve(snakeCase(animal.type))}
              />
              <span>
                <img height={12} src={heartFilledPng} />{" "}
                {Math.floor((animal.love / 1000) * 100)}%
              </span>
            </a>
          ))}
          {times(
            Math.max(0, building.capacity - building.animals.length),
            (i) => (
              <div key={i} className={clsx(styles.animal, styles.empty)}>
                <span>Empty</span>
                <img
                  height={building.type.endsWith("Barn") ? 42 : 32}
                  src={FARM_ANIMALS_SPRITES.resolve("empty")}
                />
                <span>
                  <img height={12} src={heartFilledPng} /> -
                </span>
              </div>
            )
          )}
        </div>
      </div>
    )),

    props.gameSave.pets.length > 0 && (
      <div key="pets" className={styles.building}>
        <div className={styles.info}>
          <img
            width={70}
            height={60}
            src={FARM_BUILDING_SPRITES.resolve("pet_bowl")}
          />
          <span>Pet Bowl</span>
        </div>
        <div className={styles.animals}>
          {props.gameSave.pets.map((pet) => (
            <a
              key={pet.name}
              target="_blank"
              href={StardewWiki.getLink(pet.type)}
              className={styles.animal}
            >
              <span>{pet.name}</span>
              <img
                height={50}
                src={FARM_ANIMALS_SPRITES.resolve(
                  snakeCase(pet.type) + "_" + pet.breed
                )}
              />
              <span>
                <img height={12} src={heartFilledPng} />{" "}
                {Math.floor((pet.love / 2000) * 100)}%
              </span>
            </a>
          ))}
        </div>
      </div>
    ),
  ].filter((jsx) => !!jsx);

  return (
    <SummarySection
      sectionTitle="Farm Buildings [WIP]"
      className={styles.section}
      collapsable
    >
      <div>
        <strong>{props.gameSave.farmName} Farm</strong> is home to{" "}
        <strong>{totalAnimalCount}</strong> animal(s).
      </div>
      <Scrollbox
        scrollClassName={styles.scrollbox}
        expanded={expanded}
        onExpanded={setExpanded}
      >
        {partsJsx}
      </Scrollbox>
      {/* <div style={{ display: "flex", gap: 10 }}>
        <Scrollbox>
          <pre>{JSON.stringify(props.gameSave.pets, null, 2)}</pre>
        </Scrollbox>
        <Scrollbox>
          <pre>{JSON.stringify(props.gameSave.fishPonds, null, 2)}</pre>
        </Scrollbox>
        <Scrollbox>
          <pre>{JSON.stringify(props.gameSave.animalBuildings, null, 2)}</pre>
        </Scrollbox>
      </div> */}
    </SummarySection>
  );
};
