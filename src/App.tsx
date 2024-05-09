import { open } from "@tauri-apps/api/dialog";
import "./App.css";

import { useState } from "react";
import { useTranslator } from "./hooks/translator";

function App() {
  const [filePath, setFilePath] = useState<string | null>(null);
  const { exporter, importer } = useTranslator();

  const handleExport = () => {
    exporter("translated.csv");
  };

  const handleImport = () => {
    !!filePath && importer(filePath);
  };

  const handleChooseFile = () => {
    open({
      directory: false,
      multiple: false,
      filters: [
        { name: "CSV", extensions: ["csv"] },
        {
          name: "Xlsx",
          extensions: ["xlsx"],
        },
      ],
    }).then((result) => {
      setFilePath(result as string);
    });
  };

  return (
    <div className="container">
      <h2>Choose a file to translate</h2>

      <button onClick={handleChooseFile}>Choose file</button>
      <br />

      <div>{filePath}</div>
      <br />

      <div>
        <button onClick={handleImport}>Import</button>{" "}
        <button onClick={handleExport}>Export</button>
      </div>
    </div>
  );
}

export default App;
