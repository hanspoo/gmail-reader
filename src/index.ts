import dotenv from "dotenv";

import { MsgFull } from "./types/MsgFull";

import { Mailer } from "./Mailer";
import { Command } from "commander";

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
    .option("-s, --subject <char>", "match subject", ",")
    .option("-n, --emails <numbers>", "número de emails a recuperar", ",")
    .action((options) => {
      const { emails, debug, account, from, subject } = options;
      new BuscarMails(emails, debug, account, from, subject).process();
    });

  program.parse();
}

class BuscarMails {
  constructor(
    public emails: number,
    public debug = false,
    public account: string,
    public from: string,
    public subject: string
  ) {
    if (this.from) this.from = this.from.toLowerCase();
    if (this.subject) this.subject = this.subject.toLowerCase();
    if (this.emails) this.emails = 100;
  }

  async process(account?: string) {
    const acc = account || process.env.GMAIL_ACCOUNT;
    if (!acc) {
      console.log("Please define the email account to login in");
      return;
    }

    const mailer = new Mailer(acc, this.debug);
    const mensajes = await mailer.find(this.emails);
    mensajes
      .map((m) => new Email(m))
      .filter((m) => this.seDebeMostrar(m))
      .forEach((e: Email) => {
        console.log(e.date, e.subject, e.from);
      });
  }
  seDebeMostrar(e: Email) {
    const usarFrom = !!this.from;
    const cumpleFrom =
      this.from && e.from && e.from.toLowerCase().indexOf(this.from) !== -1;

    const usarSubject = !!this.subject;
    const cumpleSubject =
      this.subject &&
      e.subject &&
      e.subject.toLowerCase().indexOf(this.subject) !== -1;

    if (usarFrom && !cumpleFrom) return false;
    if (usarSubject && !cumpleSubject) return false;

    return true;
  }
}

class Email {
  subject?: string;
  from?: string;
  date?: string;
  constructor(public msg: MsgFull) {
    this.subject = this.findHeader("Subject") || undefined;
    this.from = this.findHeader("From") || undefined;
    this.date = this.findHeader("Date") || undefined;
  }
  findHeader(h: string): string | undefined {
    const header = this.msg.data.payload.headers.find((x) => x.name === h);
    return header?.value;
  }
}

main();
