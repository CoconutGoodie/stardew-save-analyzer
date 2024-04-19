import { GameDate, GameSeason } from "../util/GameDate";

import springPng from "../assets/sprite/season/spring.png";
import summerPng from "../assets/sprite/season/summer.png";
import fallPng from "../assets/sprite/season/fall.png";
import winterPng from "../assets/sprite/season/winter.png";

import styles from "./GameDateDisplay.module.scss";

interface Props {
  date: GameDate;
}

const SEASON_META = {
  [GameSeason.Spring]: {
    iconSrc: springPng,
    color: "#FF8FE3",
  },
  [GameSeason.Summer]: {
    iconSrc: summerPng,
    color: "#FAFF24",
  },
  [GameSeason.Fall]: {
    iconSrc: fallPng,
    color: "#F17500",
  },
  [GameSeason.Winter]: {
    iconSrc: winterPng,
    color: "#B2F0FC",
  },
};

function toOrdinal(n: number) {
  if (n % 10 == 1 && n % 100 != 11) {
    return n + "st";
  }
  if (n % 10 == 2 && n % 100 != 12) {
    return n + "nd";
  }
  if (n % 10 == 3 && n % 100 != 13) {
    return n + "rd";
  }

  return n + "th";
}

export const GameDateDisplay = (props: Props) => {
  const seasonMeta = SEASON_META[props.date.season];

  return (
    <div className={styles.container} style={{ color: seasonMeta.color }}>
      {toOrdinal(props.date.day)} of {props.date.season}, Year {props.date.year}
      <img
        height={16}
        alt="Season of the Date"
        title={props.date.season}
        src={seasonMeta.iconSrc}
      />
    </div>
  );
};
