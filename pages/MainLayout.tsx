import { PropsWithChildren } from "react";

// import styles from "./LandingLayout.module.scss";

// import "@frontend/styles/style.scss";

interface Props extends PropsWithChildren {}

export function MainLayout(props: Props) {
  return (
    <main id="foo">
      <div>{props.children}</div>
    </main>
  );
}
