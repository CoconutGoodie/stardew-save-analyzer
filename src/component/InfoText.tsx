import { PropsWithChildren } from "react";
import clsx from "clsx";

import blueChickenPng from "@src/assets/icon/blue_chicken.png";
import styles from "./InfoText.module.scss";

interface Props extends PropsWithChildren {
  className?: string;
}

export const InfoText = (props: Props) => {
  return (
    <div className={clsx(styles.wrapper, props.className)}>
      <img height={20} src={blueChickenPng} />
      <p className={styles.text}>{props.children}</p>
    </div>
  );
};
