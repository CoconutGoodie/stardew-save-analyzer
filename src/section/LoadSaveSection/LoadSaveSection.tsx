import clockPng from "@src/assets/icon/clock.png";
import { SummarySection } from "@src/component/SummarySection";
import { DEMO_SAVES } from "@src/const/Assets";
import { GameSave } from "@src/gamesave/GameSave";
import { XMLNode } from "@src/util/XMLNode";
import { useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import type FileUploaderSrc from "react-drag-drop-files/dist/src/FileUploader";

import styles from "./LoadSaveSection.module.scss";

const FileUploaderTyped: typeof FileUploaderSrc = FileUploader;

interface Props {
  onSelected: (gameSave: GameSave) => void;
}

function parseXML(raw: string): XMLDocument {
  return new DOMParser().parseFromString(raw, "text/xml");
}

async function parseXMLFromFile(file: File) {
  return new Promise<XMLDocument>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      try {
        resolve(parseXML(reader.result as string));
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => {
      reject(new Error("Error occurred while reading the file."));
    };

    reader.readAsText(file);
  });
}

export const LoadSaveSection = (props: Props) => {
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadDemo = async (version: string) => {
    setLoading(true);
    const raw = await DEMO_SAVES.resolve(version)();
    const xml = parseXML(raw ?? "");
    const saveXml = new XMLNode(xml.documentElement);
    props.onSelected(new GameSave(saveXml));
    setLoading(false);
  };

  const uploadFile = async (file: File | File[]) => {
    if (Array.isArray(file)) return;

    setLoading(true);
    const xml = await parseXMLFromFile(file);
    const saveXml = new XMLNode(xml.documentElement);
    props.onSelected(new GameSave(saveXml));
    setLoading(false);
  };

  return (
    <>
      <SummarySection>
        <FileUploaderTyped
          classes={styles.fileUpload}
          multiple={false}
          handleChange={uploadFile}
          onDraggingStateChange={setDragging}
          dropMessageStyle={{ display: "none" }}
        >
          {dragging ? (
            <div>Drop here</div>
          ) : (
            <div>Upload your own save file</div>
          )}
        </FileUploaderTyped>

        <span className={styles.or}>OR</span>

        <span className={styles.info}>
          Select a demo save (for proof of concept)
        </span>

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

      <hr />

      <SummarySection sectionTitle="Instructions" collapsable>
        [WIP] Instructions and FAQ here
      </SummarySection>
    </>
  );
};
