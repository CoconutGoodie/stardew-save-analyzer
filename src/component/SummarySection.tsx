import { ComponentProps, useState } from "react";
import { clsx } from "clsx";
import styles from "./SummarySection.module.scss";
import chevronRightSvg from "../assets/icon/chevron-right.svg";

type Props = ComponentProps<"section"> & {
  sectionTitle?: string;
  collapsable?: boolean;
};

export const SummarySection = (props: Props) => {
  const { sectionTitle, collapsable, ...nativeProps } = props;

  const [open, setOpen] = useState(true);

  return (
    <section {...nativeProps} className={styles.section}>
      {sectionTitle && (
        <h1>
          <span>{sectionTitle}</span>
          {collapsable && (
            <button
              className={clsx(open && styles.open)}
              onClick={() => setOpen((o) => !o)}
            >
              <img height={10} src={chevronRightSvg} />
            </button>
          )}
        </h1>
      )}

      <div
        className={clsx(styles.wrapper, !open && styles.open, props.className)}
      >
        {props.children}
      </div>
    </section>
  );
};
