import { IBufferLine, IFunctionIdentifier, Terminal } from 'xterm';

interface CommandStoreSettings {
  /**
   * The number of commands to save. Default is 20.
   */
  commandsToSave: number;
  /**
   * The number of characters to trim from the start of each command. This is designed to remove the prompt from the command.
   * For example, it remove the '$ ' from '$ ls -la'. Defaults to 2.
   */
  trim: number;
}

export class CommandStore {
  private settings = {
    commandsToSave: 20,
    trim: 2,
  };
  private commands: string[] = [];
  constructor(
    private terminal: Terminal,
    settings: Partial<CommandStoreSettings> = {}
  ) {
    this.applySettings(settings);
    terminal.onKey(({ key }) => {
      if (key !== '\r') return;

      const command = this.current.slice(this.settings.trim);
      this.commands.push(command);

      if (this.commands.length > this.settings.commandsToSave) {
        this.commands.shift();
      }
    });
  }

  /**
   * Applies new settings to this command store.
   * @param settings The new settings to apply.
   */
  public applySettings(settings: Partial<CommandStoreSettings>) {
    Object.assign(this.settings, settings);
  }

  public getCommands(): string[] {
    return this.commands;
  }

  /**
   * Returns the command that the user is currently typing but has not yet executed.
   */
  public get current(): string {
    const lines: string[] = [];
    let line: IBufferLine | undefined;
    do {
      line = this.terminal.buffer.active.getLine(
        this.terminal.buffer.active.baseY +
          this.terminal.buffer.active.cursorY -
          lines.length
      );
      lines.push(line?.translateToString().trim() || '');
    } while (line?.isWrapped);

    return lines.reverse().join('');
  }
}
