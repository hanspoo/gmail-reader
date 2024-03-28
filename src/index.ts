import { MsgFull } from "../types/MsgFull";
import { Mailer } from "./Mailer";

async function main() {
  let from = "";
  if (process.argv[2] === "--from") from = process.argv[3];

  const mailer = new Mailer("hanscpoo@welinux.cl");
  const mensajes = await mailer.find(1000);
  mensajes.forEach((msg: MsgFull) => {
    const e = new Email(msg);
    if (from) {
      if (e.from && e.from.indexOf(from) !== -1) {
        console.log(e.subject, e.from);
      }
    } else {
      console.log(e.subject, e.from);
    }
  });
}

main();

class Email {
  subject?: string;
  from?: string;
  constructor(public msg: MsgFull) {
    this.subject = this.findHeader("Subject") || undefined;
    this.from = this.findHeader("From") || undefined;
  }
  findHeader(h: string): string | undefined {
    const header = this.msg.data.payload.headers.find((x) => x.name === h);
    return header?.value;
  }
}
