import heartFilledPng from "@src/assets/icon/heart_filled.png";
import { Scrollbox } from "@src/component/Scrollbox";
import { SummarySection } from "@src/component/SummarySection";
import {
  FARM_ANIMALS_SPRITES,
  FARM_BUILDING_SPRITES,
  FISH_SPRITES,
} from "@src/const/Assets";
import { GameSave } from "@src/gamesave/GameSave";
import { StardewWiki } from "@src/util/StardewWiki";
import { snakeCase } from "case-anything";
import clsx from "clsx";
import { useState } from "react";
import { sum, times } from "remeda";

import styles from "./FarmBuildingsSection.module.scss";

interface Props {
  gameSave: GameSave;
}

export const FarmBuildingsSection = (props: Props) => {
  const [expanded, setExpanded] = useState(false);

  const totalAnimalCount =
    props.gameSave.pets.length +
    props.gameSave.stables.length +
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

    ...props.gameSave.fishPonds.map((pond, index) => (
      <BuildingPart
        key={`pond-${index}`}
        name={`${pond.fish} Pond`}
        capacity={pond.capacity}
        iconSrc={FARM_BUILDING_SPRITES.resolve("fish_pond")}
        emptyIconSrc={FISH_SPRITES.resolve(snakeCase(pond.fish))}
        animals={times(pond.count, () => ({
          iconHeight: 40,
          iconSrc: FISH_SPRITES.resolve(snakeCase(pond.fish)),
          wikiUrl: StardewWiki.getLink(pond.fish),
        }))}
      />
    )),

    props.gameSave.stables.length > 0 && (
      <BuildingPart
        key="stable"
        name="Stable"
        iconSrc={FARM_BUILDING_SPRITES.resolve("stable")}
        animals={props.gameSave.stables.map(() => ({
          wikiUrl: StardewWiki.getLink("Horse"),
          iconSrc: FARM_ANIMALS_SPRITES.resolve("horse"),
          iconHeight: 70,
        }))}
      />
    ),

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
      sectionTitle="Farm Buildings"
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
    </SummarySection>
  );
};

/* ---------- */

const BuildingPart = (props: {
  name: string;
  iconSrc: string;
  emptyIconSrc?: string;
  capacity?: number;
  animals: {
    name?: string;
    lovePercentage?: number;
    iconSrc: string;
    iconHeight: number;
    wikiUrl: string;
  }[];
}) => {
  return (
    <div key="pets" className={styles.building}>
      <div className={styles.info}>
        <img width={70} src={props.iconSrc} />
        <span>{props.name}</span>
        {props.capacity && (
          <span>
            {props.animals.length} / {props.capacity}
          </span>
        )}
      </div>
      <div className={styles.animals}>
        {props.animals.map((animal, i) => (
          <a
            key={animal.name + "_" + i}
            target="_blank"
            href={animal.wikiUrl}
            className={styles.animal}
          >
            {animal.name && <span>{animal.name}</span>}
            <img height={animal.iconHeight} src={animal.iconSrc} />
            {animal.lovePercentage != null && (
              <span>
                <img height={12} src={heartFilledPng} />{" "}
                {Math.floor(animal.lovePercentage * 100)}%
              </span>
            )}
          </a>
        ))}

        {props.capacity != null &&
          times(Math.max(0, props.capacity - props.animals.length), (i) => (
            <div
              key={"empty-" + i}
              className={clsx(styles.animal, styles.empty)}
            >
              <img
                height={32}
                src={
                  props.emptyIconSrc ?? FARM_ANIMALS_SPRITES.resolve("empty")
                }
              />
            </div>
          ))}
      </div>
    </div>
  );
};
