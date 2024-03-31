import dotenv from "dotenv";

import { Command } from "commander";
import { BuscarMails } from "./BuscarMails";

dotenv.config();

function main() {
  const program = new Command();

  program
    .name("search-gmail")
    .description("CLI to explore gmail inbox")
    .version("0.1.0");

  program
    .command("search")
    .description("search in mails matching")
    .option("--debug")
    .option("-a, --account <char>", "email account to login")
    .option("-f, --from <char>", "match email")
    .option("-s, --subject <char>", "match subject")
    .option("-n, --emails <numbers>", "número de emails a recuperar")
    .action((options) => {
      const { emails, debug, account, from, subject } = options;

      const maxResults = emails ? parseInt(emails) : 100;

      new BuscarMails(maxResults, debug, account, from, subject).execute();
    });

  program.parse();
}

main();
