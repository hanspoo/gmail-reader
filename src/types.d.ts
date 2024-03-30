declare global {
  namespace NodeJS {
    interface ProcessEnv {
      GMAIL_ACCOUNT: string;
    }
  }
}

export {};
