import * as childProcess from "child_process";
import * as fs from "fs";
import * as path from "path";
import * as mustache from "mustache";

export default class Application {
  private readonly cwd: string;
  private readonly libRoot: string = path.resolve(__dirname);
  private readonly templateDirectory: string;

  public constructor(cwd: string) {
    this.cwd = cwd;
    this.templateDirectory = path.resolve(this.libRoot, "../templates");
  }

  /**
   * make empty directory based on current working directory
   *
   * @param dirName
   * @return true if success
   */
  public mkdir(dirName: string): boolean {
    const pathAbsolute = path.resolve(this.cwd, dirName);

    if (fs.existsSync(pathAbsolute)) {
      return false;
    }
    fs.mkdirSync(pathAbsolute);

    return true;
  }

  /**
   * make empty file based on current working directory
   *
   * @param filePath
   * @return true if success
   */
  public touch(filePath: string): boolean {
    const pathAbsolute = path.resolve(this.cwd, filePath);

    if (fs.existsSync(pathAbsolute)) {
      return false;
    }
    fs.writeFileSync(pathAbsolute, "");

    return true;
  }

  /**
   * make file from template based on current working directory
   *
   * @param templatePath
   * @param variables
   * @return true if success
   */
  public template(templatePath: string, variables: unknown): boolean {
    const destPathAbsolute = path.resolve(this.cwd, templatePath);

    if (fs.existsSync(destPathAbsolute)) {
      return false;
    }
    //
    const templateFilePath = path.resolve(
      this.templateDirectory,
      templatePath
    );
    const output = mustache.render(
      fs.readFileSync(templateFilePath).toString(),
      variables
    );
    fs.writeFileSync(destPathAbsolute, output);

    return true;
  }
}

export function task(cwd: string) {
  const app = new Application(cwd);

  // create package.json
  app.template("package.json", { name: path.basename(cwd) });
  /// install dependencies
  /// nothing
  /// install devDependencies
  childProcess.execSync(
    "npm install -D " +
      [
        "@ndxbn/preset-typescript",
        "@ndxbn/preset-jest",
        "@types/jest",
        "@types/node",
        "jest",
        "ts-jest",
        "typescript",
      ].join(" ")
  );

  // install typescript
  // create tsconfig.json
  app.template("tsconfig.json", {});
  // create "src/" directory
  app.mkdir("src");
  // create "src/{index.ts, cli.ts}
  app.touch("src/index.ts");
  app.touch("src/cli.ts");
}
