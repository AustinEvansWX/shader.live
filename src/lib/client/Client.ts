type NewShaderListener = (shaderSource: string) => void;

export class Client {
  private ws: WebSocket;
  private listeners: NewShaderListener[];

  constructor() {
    this.ws = new WebSocket("ws://localhost:6969");
    this.ws.onmessage = (msg) => this.OnMessage(msg);
    this.listeners = [];
  }

  public OnNewShader(listener: NewShaderListener) {
    this.listeners.push(listener);
  }

  public RemoveAllListeners() {
    this.listeners = [];
  }

  public Disconnect() {
    this.ws.close();
  }

  private OnMessage(msg: MessageEvent<string>) {
    for (const listener of this.listeners) {
      listener(msg.data);
    }
  }
}
