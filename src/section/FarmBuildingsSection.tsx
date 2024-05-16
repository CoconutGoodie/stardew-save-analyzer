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
      <BuildingPart
        key={`building-${index}`}
        name={building.type}
        capacity={building.capacity}
        iconSrc={FARM_BUILDING_SPRITES.resolve(snakeCase(building.type))}
        animals={building.animals.map((animal) => ({
          name: animal.name,
          lovePercentage: animal.love / 1000,
          wikiUrl: StardewWiki.getLink(animal.type.split(/\s+/g).at(-1)!),
          iconSrc: FARM_ANIMALS_SPRITES.resolve(snakeCase(animal.type)),
          iconHeight: building.type.endsWith("Barn") ? 42 : 32,
        }))}
      />
    )),

    props.gameSave.pets.length > 0 && (
      <BuildingPart
        key="pet_bowl"
        name="Pet Bowl"
        iconSrc={FARM_BUILDING_SPRITES.resolve("pet_bowl")}
        animals={props.gameSave.pets.map((pet) => ({
          name: pet.name,
          lovePercentage: pet.love / 2000,
          wikiUrl: StardewWiki.getLink(pet.type),
          iconSrc: FARM_ANIMALS_SPRITES.resolve(
            snakeCase(pet.type) + "_" + pet.breed
          ),
          iconHeight: 50,
        }))}
      />
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

/* ---------- */

const BuildingPart = (props: {
  name: string;
  iconSrc: string;
  capacity?: number;
  animals: {
    name: string;
    lovePercentage: number;
    iconSrc: string;
    iconHeight: number;
    wikiUrl: string;
  }[];
}) => {
  return (
    <div key="pets" className={styles.building}>
      <div className={styles.info}>
        <img width={70} height={70} src={props.iconSrc} />
        <span>{props.name}</span>
      </div>
      <div className={styles.animals}>
        {props.animals.map((animal) => (
          <a
            key={animal.name}
            target="_blank"
            href={animal.wikiUrl}
            className={styles.animal}
          >
            <span>{animal.name}</span>
            <img height={animal.iconHeight} src={animal.iconSrc} />
            <span>
              <img height={12} src={heartFilledPng} />{" "}
              {Math.floor(animal.lovePercentage * 100)}%
            </span>
          </a>
        ))}

        {props.capacity != null &&
          times(Math.max(0, props.capacity - props.animals.length), (i) => (
            <div key={i} className={clsx(styles.animal, styles.empty)}>
              <span>Empty</span>
              <img height={32} src={FARM_ANIMALS_SPRITES.resolve("empty")} />
              <span>
                <img height={12} src={heartFilledPng} /> -
              </span>
            </div>
          ))}
      </div>
    </div>
  );
};
