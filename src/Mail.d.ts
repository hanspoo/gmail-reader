export type Mail = {
  config: {
    url: string;
    method: string;
    userAgentDirectives: Array<{
      product: string;
      version: string;
      comment: string;
    }>;
    headers: {
      "x-goog-api-client": string;
      "Accept-Encoding": string;
      "User-Agent": string;
      Authorization: string;
      Accept: string;
    };
    params: {};
    retry: boolean;
    responseType: string;
  };
  data: {
    id: string;
    threadId: string;
    labelIds: Array<string>;
    snippet: string;
    payload: {
      partId: string;
      mimeType: string;
      filename: string;
      headers: Array<{
        name: string;
        value: string;
      }>;
      body: {
        size: number;
      };
      parts: Array<{
        partId: string;
        mimeType: string;
        filename: string;
        headers: Array<{
          name: string;
          value: string;
        }>;
        body: {
          size: number;
          data: string;
        };
      }>;
    };
    sizeEstimate: number;
    historyId: string;
    internalDate: string;
  };
  headers: {
    "alt-svc": string;
    "cache-control": string;
    "content-encoding": string;
    "content-type": string;
    date: string;
    server: string;
    "transfer-encoding": string;
    vary: string;
    "x-content-type-options": string;
    "x-frame-options": string;
    "x-xss-protection": string;
  };
  status: number;
  statusText: string;
  request: {
    responseURL: string;
  };
};
