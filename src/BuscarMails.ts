import { Mailer } from "./Mailer";
import { Email } from "./Email";

export class BuscarMails {
  constructor(
    public maxResults: number,
    public debug = false,
    public account: string,
    public from: string,
    public subject: string
  ) {
    if (from) this.from = this.from.toLowerCase();
    if (subject) this.subject = this.subject.toLowerCase();
    if (maxResults) this.maxResults = maxResults;
  }

  async execute(account?: string) {
    const acc = account || process.env.GMAIL_ACCOUNT;
    if (!acc) {
      console.log("Please define the email account to login in");
      return;
    }

    const mailer = new Mailer(acc, this.debug);
    const mensajes = await mailer.find(
      this.from,
      this.subject,
      this.maxResults
    );
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

    // if (process.env.DEBUG) console.log(`this.subject: **${this.subject}**`);
    if (usarFrom && !cumpleFrom) return false;
    if (usarSubject && !cumpleSubject) return false;

    return true;
  }
}
