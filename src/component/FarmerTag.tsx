import clsx from "clsx";
import { PropsWithChildren } from "react";
import { Farmer } from "../gamesave/Farmer";

import femalePng from "../assets/icon/female.png";
import malePng from "../assets/icon/male.png";

import styles from "./FarmerTag.module.scss";

interface Props extends PropsWithChildren {
  farmer: Farmer;
  className?: string;
}

export const FarmerTag = (props: Props) => {
  return (
    <h1 className={clsx(styles.tag, props.className)}>
      <img src={props.farmer.gender === "Male" ? malePng : femalePng} />
      <span>{props.farmer.name}</span>
      {props.children}
    </h1>
  );
};
