import { ComponentProps } from "react";
import { clsx } from "clsx";
import styles from "./SummarySection.module.scss";

type Props = ComponentProps<"section">;

export const SummarySection = (props: Props) => {
  return (
    <section {...props} className={clsx(styles.section, props.className)} />
  );
};
