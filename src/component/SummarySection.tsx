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
import { useSpoilersStore } from "@src/store/useSpoilersStore";

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

  const [expanded, setExpanded] = useState(props.spoiler ? false : true);

  const spoilerStore = useSpoilersStore();

  const markedAsSpoiler =
    props.id != null && props.spoiler
      ? !spoilerStore.revealed.includes(props.id)
      : false;

  const onSpoilerButtonClick = () => {
    if (!props.id) return;

    if (markedAsSpoiler) {
      spoilerStore.reveal(props.id);
      setExpanded(true);
    } else {
      spoilerStore.hide(props.id);
    }
  };

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
              className={clsx(styles.spoilerBtn, expanded && styles.expanded)}
              onClick={onSpoilerButtonClick}
            >
              <img
                height={14}
                src={markedAsSpoiler ? eyeOpenSvg : eyeClosedSvg}
              />
            </button>
          )}

          {collapsable && (
            <button
              className={clsx(styles.collapseBtn, expanded && styles.expanded)}
              onClick={() => setExpanded((v) => !v)}
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
          !expanded && styles.expanded,
          markedAsSpoiler && styles.spoiler,
          props.className
        )}
      >
        {props.children}
      </div>

      {markedAsSpoiler && (
        <div
          className={clsx(styles.spoilerOverlay, expanded && styles.expanded)}
          style={{
            ["--wrapperWidth" as string]: `${wrapperWidth}px`,
            ["--wrapperHeight" as string]: `${wrapperHeight}px`,
          }}
        >
          <h1>SPOILER ALERT!</h1>
          <button onClick={onSpoilerButtonClick}>
            <span>Click to reveal</span>
          </button>
        </div>
      )}
    </section>
  );
};
