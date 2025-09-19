export class JsonRpcProvider {
  private requestId: number = 0;

  constructor(private readonly url: string) {}

  async callMethod<T>(
    method: string,
    parameters?: Array<Record<string, any>> | Record<string, any>,
    fetchOptions?: RequestInit,
  ): Promise<T> {
    const body = {
      jsonrpc: '2.0',
      id: this.requestId++,
      method,
      params: parameters,
    };
    const resp = await fetch(this.url, {
      ...fetchOptions,
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        ...fetchOptions?.headers,
      },
    });
    const jsonResp = await resp.json();
    if (jsonResp.error) throw new Error(jsonResp.error.message);
    return jsonResp.result;
  }
}
