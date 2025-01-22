import clsx from "clsx";
import { ComponentProps, forwardRef } from "react";

import checkmarkPng from "~frontend/assets/icon/checkmark-outlined.png";

import styles from "./ImageObjective.module.scss";

interface Props extends ComponentProps<"img"> {
  done: boolean;
  checkmarkInvisible?: boolean;
}

export const ImageObjective = forwardRef<HTMLDivElement, Props>(
  (props, ref) => {
    const { done, checkmarkInvisible, ...otherProps } = props;

    return (
      <div ref={ref} className={styles.wrapper}>
        <img
          {...otherProps}
          className={clsx(
            props.className,
            styles.objective,
            done && styles.done
          )}
        />
        {done && !checkmarkInvisible && (
          <img className={styles.checkmark} src={checkmarkPng} />
        )}
      </div>
    );
  }
);
