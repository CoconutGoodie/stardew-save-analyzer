import { XMLNode } from "@src/util/XMLNode";
import clsx from "clsx";
import { useEffect, useState } from "react";

import crossPng from "@src/assets/icon/cross.png";
import xPng from "@src/assets/icon/barbed_hook.png";

import styles from "./TableOfContents.module.scss";

interface Props {}

export const TableOfContents = (props: Props) => {
  const [sections, setSections] = useState<XMLNode[]>([]);

  const [drew, setDrew] = useState(false);

  useEffect(() => {
    const mainElement = document.querySelector("main");
    const sections = mainElement?.querySelectorAll("section");
    setSections(
      Array.from(sections ?? [], (element) => new XMLNode(element)).filter(
        (section) => !!section.query(":scope > h1").element
      )
    );
  }, []);

  return (
    <div className={styles.root}>
      {drew && (
        <div className={styles.overlay} onClick={() => setDrew(false)} />
      )}

      <div className={clsx(styles.drawer, drew && styles.drew)}>
        <button className={styles.tag} onClick={() => setDrew(!drew)}>
          <img height={30} src={xPng} />
        </button>

        <button className={styles.close} onClick={() => setDrew(false)}>
          <img width={20} src={crossPng} />
        </button>

        <h1>Table of Contents</h1>
        <ul>
          {sections.map((section, i) => (
            <li key={i} data-wip={!!section.element?.id}>
              <a
                href={"#" + section.element?.id}
                onClick={() => setDrew(false)}
              >
                <img
                  width={20}
                  height={20}
                  src={(section.element as HTMLElement).dataset.icon}
                />
                <span>{section.query(":scope > h1 > span").text()}</span>
                <span style={{ opacity: 0.25 }}> - #{section.element?.id}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
