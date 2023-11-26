import { ITerminalAddon, Terminal } from 'xterm';

export class SnapshotAddon implements ITerminalAddon {
  private terminal: Terminal;

  public activate(terminal: Terminal): void {
    this.terminal = terminal;
  }

  public dispose(): void {}
}
