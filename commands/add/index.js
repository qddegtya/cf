const BC = require("../../lib/BaseCommand").default;
const fs = require("fs");
const path = require("path");
const inquirer = require("inquirer");
const AJS = require("xajs");
const vfs = require("vinyl-fs");
const map = require("map-stream");

const tpl = AJS.future.tpl;
const MagicString = AJS.lang.MagicString;

const IF_IS_INNER_PKG =
  JSON.parse(
    fs.readFileSync(path.join(process.cwd(), "package.json")).toString()
  ).name === "@atools/cf";

class Add extends BC {
  constructor(config) {
    super(config);

    this.tplRoot = path.join(__dirname, "../../_template/cmd.tpl");
  }

  init(commander) {}

  async do() {
    await inquirer
      .prompt([
        {
          type: "input",
          name: "name",
          message: "[CF] -> command name: ",
        },
        {
          type: "input",
          name: "alias",
          message: "[CF] -> command alias: ",
        },
        {
          type: "input",
          name: "description",
          message: "[CF] -> command description: ",
        },
      ])
      .then(async ({ name, alias, description }) => {
        if (this.conflict(name)) {
          throw new Error(`Command [ ${name} ] exists.`);
        }

        if (name === alias)
          throw new Error(`Command alias can't be the same as its name`);

        vfs
          .src("_template/cmd.tpl")
          .pipe(
            map((file, cb) => {
              file.basename = "index.js";
              file.contents = Buffer.from(
                tpl.exec(file.contents.toString(), {
                  pkg: IF_IS_INNER_PKG
                    ? 'require("../../lib/BaseCommand").default'
                    : 'require("@atools/cf").BC',
                  name: MagicString(name).capitalize(),
                  command: name,
                  alias,
                  description,
                }),
                "utf8"
              );

              cb(null, file);
            })
          )
          .pipe(vfs.dest(`${this.config.root}/${name}`));
      });
  }
}

Add.command = "add";
Add.alias = "a";
Add.description = "add one command";

module.exports = Add;
