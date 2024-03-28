/**
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/* eslint-disable camelcase */

import { MsgBasic } from "../types/MsgBasic";
import { MsgFull } from "../types/MsgFull";

// [START gmail_quickstart]

import { promises as fs } from "fs";
const path = require("path");

const { authenticate } = require("@google-cloud/local-auth");
const { google } = require("googleapis");

// If modifying these scopes, delete token.json.
const SCOPES = ["https://www.googleapis.com/auth/gmail.readonly"];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = path.join(process.cwd(), "token.json");
const CREDENTIALS_PATH = path.join(process.cwd(), "credentials.json");

// authorize().then(listEmails).catch(console.error);

// [END gmail_quickstart]

export class Mailer {
  folder: string;
  constructor(public userId: string) {
    this.folder = process.env.MSG_FOLDER || `${process.env.HOME}/messages`;
    this.userId = userId;
  }
  auth: any;
  /**
   * Reads previously authorized credentials from the save file.
   *
   * @return {Promise<OAuth2Client|null>}
   */
  async loadSavedCredentialsIfExist() {
    try {
      const content = await fs.readFile(TOKEN_PATH);
      const credentials = JSON.parse(content.toString());
      return google.auth.fromJSON(credentials);
    } catch (err) {
      return null;
    }
  }

  /**
   * Serializes credentials to a file compatible with GoogleAuth.fromJSON.
   *
   * @param {OAuth2Client} client
   * @return {Promise<void>}
   */
  async saveCredentials(client: any) {
    const content = await fs.readFile(CREDENTIALS_PATH);
    const keys = JSON.parse(content.toString());
    const key = keys.installed || keys.web;
    const payload = JSON.stringify({
      type: "authorized_user",
      client_id: key.client_id,
      client_secret: key.client_secret,
      refresh_token: client.credentials.refresh_token,
    });
    await fs.writeFile(TOKEN_PATH, payload);
  }

  /**
   * Load or request or authorization to call APIs.
   *
   */
  async authorize() {
    let client = await this.loadSavedCredentialsIfExist();
    if (client) {
      return client;
    }
    client = await authenticate({
      scopes: SCOPES,
      keyfilePath: CREDENTIALS_PATH,
    });
    if (client.credentials) {
      await this.saveCredentials(client);
    }
    return client;
  }

  msgPath() {
    return `${this.folder}/${this.userId}`;
  }
  async createFolders() {
    try {
      await fs.access(this.msgPath(), fs.constants.F_OK);
    } catch {
      await fs.mkdir(this.msgPath(), { recursive: true });
    }
  }

  async find(maxResults = 100): Promise<Array<MsgFull>> {
    await this.createFolders();
    if (!this.auth) {
      this.auth = await this.authorize();
    }
    const gmail = google.gmail({ version: "v1", auth: this.auth });
    const res = await gmail.users.messages.list({
      userId: this.userId,
      maxResults,
    });

    const messages = res.data.messages as Array<MsgBasic>;

    const list: Array<MsgFull> = [];

    MESSAGE: for (const m of messages) {
      const msg = await this.loadFromCache(m.id);
      if (msg) {
        list.push(msg);
        continue MESSAGE;
      }

      const gm: MsgFull = await gmail.users.messages.get({
        userId: this.userId,
        id: m.id,
      });

      if (gm) {
        list.push(gm);
        this.saveCache(m.id, gm);
      } else {
        console.log(`Error recovering google mail ${this.userId}, ${m.id}`);
      }
    }

    return list;
  }

  saveCache(msgId: string, payload: MsgFull): void {
    const file = `${this.msgPath()}/${msgId}.json`;
    console.log(`guardando mensaje ${file}`);
    fs.writeFile(file, JSON.stringify(payload));
  }

  async loadFromCache(msgId: string): Promise<MsgFull | undefined> {
    const file = `${this.msgPath()}/${msgId}.json`;
    try {
      await fs.access(file, fs.constants.F_OK);
      console.log(`cache hit ${file}`);
      const data = await fs.readFile(file);
      return JSON.parse(data.toString()) as unknown as MsgFull;
    } catch {
      return undefined;
    }
  }
}
