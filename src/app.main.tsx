import { GameSave } from "./gamesave/GameSave";
import { MoneySection } from "./section/MoneySection";
import { OverviewSection } from "./section/OverviewSection";
import { SkillsSection } from "./section/SkillsSection";
import { SpecialOrdersSection } from "./section/SpecialOrdersSection";
import { StardropsSection } from "./section/StardropsSection";

import logoPng from "./assets/logo.png";

// import saveXml from "./assets/Save_1.6.xml";

import { useEffect, useState } from "react";
import { SummarySection } from "./component/SummarySection";
import { LoadSaveSection } from "./section/LoadSaveSection";

import "./style/style.scss";
import { FishingSection } from "./section/FishingSection";

function App() {
  const [gameSave, setGameSave] = useState<GameSave>();

  return (
    <main>
      <header>
        <img
          width={350}
          src={logoPng}
          // For debug purposes
          // onClick={() => console.log(saveXml.SaveGame)}
        />
        <span>last updated for v1.6.4</span>
      </header>

      {gameSave == null ? (
        <>
          <LoadSaveSection onSelected={setGameSave} />
        </>
      ) : (
        <>
          <OverviewSection gameSave={gameSave} />

          <div style={{ display: "flex", gap: 50 }}>
            <MoneySection gameSave={gameSave} />

            <SummarySection>
              <h1>Animals & Pets [WIP]</h1>

              <p>...</p>
              <p>...</p>
              <p>...</p>
            </SummarySection>
          </div>

          <SkillsSection gameSave={gameSave} />

          <StardropsSection gameSave={gameSave} />

          <FishingSection gameSave={gameSave} />

          <SpecialOrdersSection gameSave={gameSave} />

          <SummarySection>
            <h1>Craftables [WIP]</h1>
          </SummarySection>

          <SummarySection>
            <h1>Socials [WIP]</h1>
          </SummarySection>

          <SummarySection>
            <h1>Community Center [WIP]</h1>
          </SummarySection>

          <SummarySection>
            <h1>Many More... [WIP]</h1>
          </SummarySection>

          <SummarySection>
            <h1>Todo List</h1>

            <ul>
              <li>"Quests" Section</li>
              <li>"Craftables" Section</li>
              <li>"Cooking" Section</li>
              <li>"Forest Neightbors" Section</li>
              <li>"Ginger Island" Section</li>
              <li>"Secret Notes" Section</li>
              <li>"Grandpa's Evaluation" Section</li>
              <li>"Socials" Section</li>
              <li>"Community Center" Section</li>
              <li>"Perfection" Section</li>
              <li>Tooltips Component</li>
              <li>Better Advancement Structure</li>
            </ul>
          </SummarySection>
        </>
      )}

      <footer style={{ height: 200 }}></footer>
    </main>
  );
}

export default App;
