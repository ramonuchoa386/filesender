import path from "path";
import dotenv from "dotenv";
import { fork } from "child_process";

dotenv.config();

const sources = `${process.env.STREAM_SOURCES}`;

((files: string[]) => {
  if (process.env.SNAPSHOT_FOLDER === undefined) {
    console.error('Variável "SNAPSHOT_FOLDER" não configurada.');
    process.exitCode = 1;
    process.exit();
  }

  files.forEach((file) => {
    const filePath = path.join(`${process.env.SNAPSHOT_FOLDER}`, file);

    const child = fork(path.resolve(__dirname, "watcher.js"), [filePath]);

    child.on("error", (err) => {
      console.error(`Erro no processo filho para o arquivo ${file}:`, err);
    });

    child.on("exit", (code) => {
      console.log(
        `Processo filho para o arquivo ${file} terminou com o código ${code}`
      );
    });
  });
})(sources.split(","));
