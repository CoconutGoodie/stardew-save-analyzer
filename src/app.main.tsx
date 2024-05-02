import { GameSave } from "./gamesave/GameSave";
import { MoneySection } from "./section/MoneySection";
import { OverviewSection } from "./section/OverviewSection";
import { SkillsSection } from "./section/SkillsSection";
import { SpecialOrdersSection } from "./section/SpecialOrdersSection";
import { StardropsSection } from "./section/StardropsSection";

import logoPng from "./assets/logo.png";

// import saveXml from "./assets/Save_1.6.xml";

import { useState } from "react";
import { SummarySection } from "./component/SummarySection";
import { LoadSaveSection } from "./section/LoadSaveSection";

import { FishingSection } from "./section/FishingSection";
import "./style/style.scss";
import { GrandpasEvaluationsSection } from "./section/GrandpasSection";
import { MuseumSection } from "@src/section/MuseumSection";

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

      <div id="content">
        {gameSave == null ? (
          <>
            <LoadSaveSection onSelected={setGameSave} />
          </>
        ) : (
          <>
            <OverviewSection gameSave={gameSave} />

            <div style={{ display: "flex", gap: 50 }}>
              <MoneySection gameSave={gameSave} />

              <SummarySection sectionTitle="Animals & Pets [WIP]" collapsable>
                <p>...</p>
                <p>...</p>
                <p>...</p>
              </SummarySection>
            </div>

            <SkillsSection gameSave={gameSave} />

            <SummarySection sectionTitle="Masteries [WIP]" collapsable>
              [WIP] Skill Masteries & Unlocked Perks here
            </SummarySection>

            <SummarySection sectionTitle="Quests [WIP]" collapsable>
              [WIP] "Help Wanted" Quests & Story Quests here
            </SummarySection>

            <SpecialOrdersSection gameSave={gameSave} />

            <StardropsSection gameSave={gameSave} />

            <FishingSection gameSave={gameSave} />

            <SummarySection sectionTitle="Crafting [WIP]" collapsable>
              [WIP] Craftables here
            </SummarySection>

            <SummarySection sectionTitle="Cooking [WIP]" collapsable>
              [WIP] Cooking Recipes here
            </SummarySection>

            <SummarySection sectionTitle="Shipping [WIP]" collapsable>
              [WIP] Shipping Bin Achievements here
            </SummarySection>

            <MuseumSection gameSave={gameSave} />

            <GrandpasEvaluationsSection gameSave={gameSave} />

            <SummarySection sectionTitle="Perfection Tracker [WIP]" collapsable>
              [WIP] Perfection Tracker Analysis here
            </SummarySection>

            <hr />

            <SummarySection sectionTitle="Todo List">
              <ul>
                <li>"Quests" Section</li>
                <li>"Craftables" Section</li>
                <li>"Cooking" Section</li>
                <li>"Forest Neightbors" Section</li>
                <li>"Ginger Island" Section</li>
                <li>"Secret Notes" Section</li>
                <li>"Grandpa's Evaluation" Section</li>
                <li>"Monster Hunting" Section</li>
                <li>"Socials" Section</li>
                <li>"Community Center" Section</li>
                <li>"Perfection" Section</li>
                <li>Tooltips Component</li>
                <li>Better Advancement Structure</li>
              </ul>
            </SummarySection>
          </>
        )}
      </div>

      <footer style={{ height: 200 }}></footer>
    </main>
  );
}

export default App;
