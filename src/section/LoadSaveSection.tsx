import { useState } from "react";
import { SummarySection } from "../component/SummarySection";
import { GameSave } from "../gamesave/GameSave";
import { AssetRepository } from "../util/AssetRepository";

import clockPng from "../assets/icon/clock.png";

import styles from "./LoadSaveSection.module.scss";

const demoSaves = new AssetRepository(
  import.meta.glob<Promise<{ default: { SaveGame: GameSave.SaveXml } }>>(
    "../assets/Save_*.xml"
  ),
  "../assets/Save_",
  ".xml"
);

interface Props {
  onSelected: (gameSave: GameSave) => void;
}

export const LoadSaveSection = (props: Props) => {
  const [loading, setLoading] = useState(false);

  const loadDemo = async (version: string) => {
    setLoading(true);
    const module = await demoSaves.resolve(version)();
    props.onSelected(new GameSave(module.default.SaveGame));
    setLoading(false);
  };

  return (
    <SummarySection className={styles.section}>
      <div className={styles.fileUpload}>Upload your own save file [WIP]</div>

      <span className={styles.or}>OR</span>

      <span className={styles.info}>Select a demo save (for now)</span>

      <div className={styles.demoSaves}>
        <button onClick={() => loadDemo("1.2")}>v1.2</button>
        <button onClick={() => loadDemo("1.3")}>v1.3</button>
        <button onClick={() => loadDemo("1.5")}>v1.5</button>
        <button onClick={() => loadDemo("1.6")}>v1.6</button>
      </div>

      {loading && (
        <div className={styles.loader}>
          <img width={50} src={clockPng} />
          <span>Loading...</span>
        </div>
      )}
    </SummarySection>
  );
};
