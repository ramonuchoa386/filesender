import fs from "fs";

class FileChecker {
  private directory: string;

  constructor(directory: string) {
    this.directory = directory;
  }

  public async checkFileLastModify(): Promise<number | null> {
    try {
      await fs.promises.access(this.directory, fs.constants.F_OK);
    } catch (err) {
      console.error("File not found in the directory.");
      return null;
    }

    try {
      const stats = await fs.promises.stat(this.directory);
      const currentModification = stats.mtimeMs;
      console.log("currentModification: ", currentModification);

      return currentModification;
    } catch (err) {
      console.error("Error getting file stats:", err);
      return null;
    }
  }
}

export default FileChecker;
