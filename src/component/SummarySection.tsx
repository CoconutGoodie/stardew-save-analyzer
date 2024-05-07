import { ComponentProps, useState } from "react";
import { clsx } from "clsx";
import styles from "./SummarySection.module.scss";
import chevronRightSvg from "../assets/icon/chevron-right.svg";

type Props = ComponentProps<"section"> & {
  sectionTitle?: string;
  versions?: string[];
  collapsable?: boolean;
};

export const SummarySection = (props: Props) => {
  const { sectionTitle, collapsable, ...nativeProps } = props;

  const [open, setOpen] = useState(true);

  return (
    <section {...nativeProps} className={styles.section}>
      {sectionTitle && (
        <h1>
          {nativeProps.id && <a href={`#${nativeProps.id}`}>#</a>}

          <span>{sectionTitle}</span>

          {props.versions && (
            <span className={styles.versions}>
              {props.versions.map((version) => (
                <span key={version}>{version}</span>
              ))}
            </span>
          )}

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
