import { useState } from "react";
import { FileUploader as _FileUploader } from "react-drag-drop-files";
import { Section } from "~frontend/component/Section/Section";
import { DEMO_SAVES } from "~frontend/const/Assets";
import { GameSave } from "~frontend/gamesave/GameSave";
import { XMLNode } from "~frontend/util/XMLNode";

import clockPng from "~frontend/assets/icon/clock.png";

import styles from "./LoadSaveSection.module.scss";

// XXX Workaround: react-drag-drop-files exports malformed types
import type FileUploaderSrc from "react-drag-drop-files/dist/src/FileUploader";
const FileUploader: typeof FileUploaderSrc = _FileUploader;

interface Props {
  onSelected: (gameSave: GameSave) => void;
}

export const LoadSaveSection = (props: Props) => {
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadDemo = async (version: string) => {
    setLoading(true);
    const raw = await DEMO_SAVES.resolve(version)();
    const saveXml = XMLNode.fromText(raw ?? "");
    props.onSelected(new GameSave(saveXml));
    setLoading(false);
  };

  const uploadFile = async (file: File | File[]) => {
    if (Array.isArray(file)) return;

    setLoading(true);
    const saveXml = await XMLNode.fromFile(file);
    props.onSelected(new GameSave(saveXml));
    setLoading(false);
  };

  return (
    <>
      <Section>
        {/* TODO: This library warns with the following. Prolly need to rewrite at some point */}
        {/* Warning: React does not recognize the `overRide` prop on a DOM element. */}
        <FileUploader
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
        </FileUploader>

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
      </Section>

      <hr />

      <Section sectionTitle="Instructions" collapsable>
        <ol className={styles.instructions}>
          <li>Foo bar baz</li>
          <li>Foo bar baz</li>
          <li>Foo bar baz</li>
          <li>Foo bar baz</li>
        </ol>

        <div>
          Default save file locations are:
          <ul>
            <li>
              Windows: <code>%AppData%\StardewValley\Saves\</code>
            </li>
            <li>
              Mac OSX & Linux: <code>~/.config/StardewValley/Saves/</code>
            </li>
            <li>
              Proton Steam (Ubuntu):{" "}
              <code>
                ~/.steam/debian-installation/steamapps/compatdata/413150/pfx/drive_c/users/steamuser/AppData/Roaming/StardewValley/Saves/
              </code>
            </li>
          </ul>
        </div>
      </Section>
    </>
  );
};
