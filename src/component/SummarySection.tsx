import {
  ComponentProps,
  ComponentRef,
  useEffect,
  useRef,
  useState,
} from "react";
import { clsx } from "clsx";
import styles from "./SummarySection.module.scss";

import chevronRightSvg from "@src/assets/icon/chevron-right.svg";
import eyeOpenSvg from "@src/assets/icon/eye-open.svg";
import eyeClosedSvg from "@src/assets/icon/eye-closed.svg";
import { useResizeObserver } from "usehooks-ts";

type Props = ComponentProps<"section"> & {
  sectionTitle?: string;
  versions?: string[];
  collapsable?: boolean;
  spoiler?: boolean;
};

export const SummarySection = (props: Props) => {
  const { sectionTitle, collapsable, ...nativeProps } = props;

  const wrapperRef = useRef<ComponentRef<"div">>(null);

  const { width: wrapperWidth, height: wrapperHeight } = useResizeObserver({
    ref: wrapperRef,
  });

  const [open, setOpen] = useState(true);
  const [spoiler, setSpoiler] = useState(props.spoiler ?? false);

  return (
    <section {...nativeProps} className={styles.section}>
      {sectionTitle && (
        <h1>
          {nativeProps.id && <a href={`#${nativeProps.id}`}>#</a>}

          <span>{sectionTitle}</span>

          {(props.versions || props.spoiler) && (
            <span className={styles.versions}>
              {props.versions?.map((version) => (
                <span key={version}>{version}</span>
              ))}
              {props.spoiler && <span className={styles.spoiler}>Spoiler</span>}
            </span>
          )}

          {props.spoiler && (
            <button
              className={clsx(styles.spoilerBtn, open && styles.open)}
              onClick={() => setSpoiler((v) => !v)}
            >
              <img height={14} src={spoiler ? eyeOpenSvg : eyeClosedSvg} />
            </button>
          )}

          {collapsable && (
            <button
              className={clsx(styles.collapseBtn, open && styles.open)}
              onClick={() => setOpen((v) => !v)}
            >
              <img height={10} src={chevronRightSvg} />
            </button>
          )}
        </h1>
      )}

      <div
        ref={wrapperRef}
        className={clsx(
          styles.wrapper,
          !open && styles.open,
          spoiler && styles.spoiler,
          props.className
        )}
      >
        {props.children}
      </div>

      {spoiler && (
        <div
          className={styles.spoilerOverlay}
          style={{
            ["--wrapperWidth" as string]: `${wrapperWidth}px`,
            ["--wrapperHeight" as string]: `${wrapperHeight}px`,
          }}
        >
          <h1>SPOILER ALERT!</h1>
          <button onClick={() => setSpoiler(false)}>
            <span>Show anyways</span>
          </button>
        </div>
      )}
    </section>
  );
};
