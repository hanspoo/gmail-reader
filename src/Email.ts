import { MsgFull } from "./types/MsgFull";

export class Email {
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
