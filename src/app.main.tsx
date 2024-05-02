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

import questPng from "@src/assets/icon/exclamation.png";
import { MasteriesSection } from "@src/section/MasteriesSection";

function App() {
  const [gameSave, setGameSave] = useState<GameSave>();

  return (
    <main>
      <header>
        <img width={350} src={logoPng} />
        <span>last updated for v1.6.4</span>
      </header>

      <div id="content">
        <div className="disclaimers">
          <div className="disclaimer">
            <img height={30} src={questPng} />
            <p>
              <em>Disclaimer!</em> This website is not affiliated with,
              endorsed, sponsored, or specifically approved by{" "}
              <a target="_blank" href="https://twitter.com/ConcernedApe">
                ConcernedApe
              </a>{" "}
              or{" "}
              <a target="_blank" href="https://www.stardewvalley.net/">
                Stardew Valley
              </a>
              .{"\n"}It is an independent, open-source, fan-made tool crafted by{" "}
              <a target="_blank" href="https://github.com/iGoodie">
                iGoodie
              </a>
              . Its aim is to provide players with helpful resources and
              utilities, purely out of my passion for the game.
            </p>
          </div>
          <div className="disclaimer">
            <img height={30} src={questPng} />
            <p>
              This website has no commercial concerns whatsoever. It DOES NOT
              seek to profit from the use of Stardew Valley's intellectual
              property. Instead, its goal is to contribute positively to the
              community and enhance the gaming experience for fellow players.
            </p>
          </div>
          <div className="disclaimer">
            <img height={30} src={questPng} />
            <p>
              For any inquiries or concerns regarding this website, please feel
              free to contact me on{" "}
              <a
                target="_blank"
                href="https://discordapp.com/users/117741752437309449"
              >
                Discord
              </a>
              , or leave a{" "}
              <a
                target="_blank"
                href="https://github.com/iGoodie/stardew-save-analyzer/issues?q=is%3Aissue+is%3Aopen+sort%3Aupdated-desc"
              >
                Github Issue
              </a>
              .{"\n"}I appreciate your support and understanding.{" "}
              <span className="heart">♥</span>
            </p>
          </div>
        </div>

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

            <MasteriesSection gameSave={gameSave} />

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
