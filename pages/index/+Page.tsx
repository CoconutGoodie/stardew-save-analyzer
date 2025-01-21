import { navigate } from "vike/client/router";
import { LoadSaveSection } from "~frontend/section/LoadSaveSection/LoadSaveSection";
import { useGameSaveStore } from "~frontend/store/useGameSaveStore";

export default function IndexPage() {
  const store = useGameSaveStore();

  return (
    <>
      <LoadSaveSection
        onSelected={(gameSave) => {
          store.load(gameSave);
          navigate("/analyze");
        }}
      />
    </>
  );
}
