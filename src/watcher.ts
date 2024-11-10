import { Watcher } from "./services";

const filePath = process.argv[2];

if (!filePath) {
  console.error("File path not provided.");
  process.exit(1);
}

console.log(
  `Processo ${process.pid} iniciado para arquivo ${process.argv[2]}.`
);

const watcher = new Watcher(filePath);
watcher.watchFile();
