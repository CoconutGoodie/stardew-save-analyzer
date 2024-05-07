import { PropsWithChildren } from "react";

import exclamationPng from "@src/assets/icon/exclamation.png";
import styles from "./InfoText.module.scss";

export const InfoText = (props: PropsWithChildren) => {
  return (
    <div className={styles.wrapper}>
      <img height={15} src={exclamationPng} />
      <p className={styles.text}>{props.children}</p>
    </div>
  );
};
