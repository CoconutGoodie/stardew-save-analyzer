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
import checkmarkPng from "@src/assets/icon/checkmark.png";
import { useResizeObserver } from "usehooks-ts";
import { useSpoilersStore } from "@src/store/useSpoilersStore";

type Props = ComponentProps<"section"> & {
  sectionTitle?: string;
  sectionIcon?: string;
  versions?: string[];
  stripes?: boolean;
  collapsable?: boolean;
  spoiler?: boolean;
  allDone?: boolean;
};

export const SummarySection = (props: Props) => {
  const {
    sectionTitle,
    stripes,
    collapsable,
    spoiler,
    allDone,
    sectionIcon,
    ...nativeProps
  } = props;

  const wrapperRef = useRef<ComponentRef<"div">>(null);
  const { width: wrapperWidth, height: wrapperHeight } = useResizeObserver({
    ref: wrapperRef,
  });

  const spoilerStore = useSpoilersStore();

  const markedAsSpoiler =
    props.id != null && props.spoiler
      ? !spoilerStore.revealed.includes(props.id)
      : false;

  const [expanded, setExpanded] = useState(true);

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
    <section
      {...nativeProps}
      className={clsx(styles.section, props.stripes && styles.stripes)}
      data-done={props.allDone}
      data-icon={props.sectionIcon}
    >
      {sectionTitle && (
        <h1 className={clsx(props.allDone && styles.allDone)}>
          {nativeProps.id && <a href={`#${nativeProps.id}`}>#</a>}

          <span>{sectionTitle}</span>

          {props.allDone && <img height={14} src={checkmarkPng} />}

          {(props.versions || props.spoiler) && (
            <span className={styles.versions}>
              {props.versions?.map((version) => (
                <span key={version}>{version}</span>
              ))}
              {/* {props.spoiler && <span className={styles.spoiler}>Spoiler</span>} */}
            </span>
          )}

          {props.spoiler && (
            <button
              className={clsx(styles.spoilerBtn, expanded && styles.expanded)}
              onClick={onSpoilerButtonClick}
            >
              <img
                height={14}
                src={markedAsSpoiler ? eyeClosedSvg : eyeOpenSvg}
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

      {props.spoiler && (
        <div
          className={clsx(
            styles.spoilerOverlay,
            markedAsSpoiler && styles.shown,
            expanded && styles.expanded
          )}
          style={{
            ["--wrapperWidth" as string]: `${wrapperWidth}px`,
            ["--wrapperHeight" as string]: `${wrapperHeight}px`,
          }}
        >
          <h1>SPOILER ALERT!</h1>
          {expanded && (
            <p>
              This section possibly contains spoilers about the latest update
            </p>
          )}
          <button onClick={onSpoilerButtonClick}>
            <span>Click to reveal</span>
          </button>
        </div>
      )}
    </section>
  );
};
