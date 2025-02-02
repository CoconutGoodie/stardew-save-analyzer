import { useEffect } from "react";
import { navigate } from "vike/client/router";
import { useGameSaveStore } from "~frontend/store/useGameSaveStore";

import { Section } from "~frontend/component/Section/Section";
import { TableOfContents } from "~frontend/component/TableOfContents/TableOfContents";
import { AdventurersGuildSection } from "~frontend/section/AdventurersGuildSection/AdventurersGuildSection";
import { CookingSection } from "~frontend/section/CookingSection/CookingSection";
import { CraftingSection } from "~frontend/section/CraftingSection/CraftingSection";
import { FarmBuildingsSection } from "~frontend/section/FarmBuildingsSection/FarmBuildingsSection";
import { FishingSection } from "~frontend/section/FishingSection/FishingSection";
import { GoldenWalnutsSection } from "~frontend/section/GoldenWalnutsSection/GoldenWalnutsSection";
import { GrandpasEvaluationsSection } from "~frontend/section/GrandpasSection/GrandpasSection";
import { HelpWantedSection } from "~frontend/section/HelpWantedSection/HelpWantedSection";
import { MasteriesSection } from "~frontend/section/MasteriesSection/MasteriesSection";
import { MoneySection } from "~frontend/section/MoneySection/MoneySection";
import { MuseumSection } from "~frontend/section/MuseumSection/MuseumSection";
import { OverviewSection } from "~frontend/section/OverviewSection/OverviewSection";
import { QiChallengesSection } from "~frontend/section/QiChallengesSection/QiChallengesSection";
import { RarecrowSection } from "~frontend/section/RarecrowsSection/RarecrowsSection";
import { RelationshipsSection } from "~frontend/section/RelationshipsSection/RelationshipsSection";
import { ShippingMonoSection } from "~frontend/section/ShippingMonoSection/ShippingMonoSection";
import { ShippingPolySection } from "~frontend/section/ShippingPolySection/ShippingPolySection";
import { ShippingSection } from "~frontend/section/ShippingSection/ShippingSection";
import { SkillsSection } from "~frontend/section/SkillsSection/SkillsSection";
import { SpecialOrdersSection } from "~frontend/section/SpecialOrdersSection/SpecialOrdersSection";
import { StardropsSection } from "~frontend/section/StardropsSection/StardropsSection";

export default function AnalyzePage() {
  const { gameSave } = useGameSaveStore();

  useEffect(() => {
    if (!gameSave) {
      navigate("/");
    }
  }, []);

  if (!gameSave) return <h1>Checking for Game Save...</h1>;

  return (
    <>
      <TableOfContents />

      <OverviewSection gameSave={gameSave} />

      <hr />

      <MoneySection gameSave={gameSave} />

      <hr />

      <FarmBuildingsSection gameSave={gameSave} />

      <hr />

      <SkillsSection gameSave={gameSave} />

      <hr />

      <MasteriesSection gameSave={gameSave} />

      <hr />

      <HelpWantedSection gameSave={gameSave} />

      <hr />

      <SpecialOrdersSection gameSave={gameSave} />

      <hr />

      <QiChallengesSection gameSave={gameSave} />

      <hr />

      <RarecrowSection gameSave={gameSave} />

      <hr />

      <Section sectionTitle="Special Items & Powers [WIP]" collapsable>
        [WIP] Special Items & Powers here
      </Section>

      <hr />

      <RelationshipsSection gameSave={gameSave} />

      <hr />

      <Section sectionTitle="House & Family [WIP]" collapsable>
        [WIP] House & Family here
      </Section>

      <hr />

      <FishingSection gameSave={gameSave} />

      <hr />

      <CraftingSection gameSave={gameSave} />

      <hr />

      <CookingSection gameSave={gameSave} />

      <hr />

      <AdventurersGuildSection gameSave={gameSave} />

      <hr />

      <ShippingSection gameSave={gameSave} />

      <hr />

      <ShippingPolySection gameSave={gameSave} />

      <hr />

      <ShippingMonoSection gameSave={gameSave} />

      <hr />

      <Section sectionTitle="Forest Neightbors [WIP]" collapsable>
        [WIP] Forest Neightbors & Pedro here
      </Section>

      <hr />

      <StardropsSection gameSave={gameSave} />

      <hr />

      <MuseumSection gameSave={gameSave} />

      <hr />

      <GrandpasEvaluationsSection gameSave={gameSave} />

      <hr />

      <Section
        sectionTitle="Community Center / Joja Membership [WIP]"
        collapsable
      >
        [WIP] Community Center / Joja Membership here
      </Section>

      <hr />

      <Section sectionTitle="Secret Notes [WIP]" collapsable>
        [WIP] Secret Notes here
      </Section>

      <hr />

      <GoldenWalnutsSection gameSave={gameSave} />

      <hr />

      <Section sectionTitle="Ginger Island Upgrades [WIP]" collapsable>
        [WIP] Ginger Island Upgrades here
      </Section>

      <hr />

      <Section sectionTitle="Perfection Tracker [WIP]" collapsable>
        [WIP] Perfection Tracker Analysis here
      </Section>

      <hr />

      <Section sectionTitle="Todo List">
        <ul>
          <li>Support "Separate Wallets"</li>
          <li>Fix main app layout</li>
          <li>Add Tooltips to all sections</li>
        </ul>
      </Section>
    </>
  );
}
