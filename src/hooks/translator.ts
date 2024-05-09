import { invoke } from "@tauri-apps/api";

export function useTranslator() {
  const exporter = (outputFile: string) => {
    invoke("exporter", { outputFile }).then((response) => {
      console.log("Exported data", response);
    });
  };

  const importer = (inputFile: string) => {
    invoke("importer", { inputFile }).then((response) => {
      console.log("Imported data", response);
    });
  };

  return { exporter, importer };
}
