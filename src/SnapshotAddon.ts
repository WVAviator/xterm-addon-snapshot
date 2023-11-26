import { ITerminalAddon, Terminal } from 'xterm';

export class SnapshotAddon implements ITerminalAddon {
  private terminal: Terminal;

  public activate(terminal: Terminal): void {
    this.terminal = terminal;
    console.log('SnapshotAddon activated');
  }

  /**
   * Returns true if the terminal user is appending to the end of the last line in the active buffer.
   * Returns false if the user has moved the cursor elsewhere.
   * Use this to determine whether to show a suggested autocompletion. Suggested use would be in a callback to onWriteParsed.
   * @returns {boolean}
   */
  public get isAppending(): boolean {
    const lastLineIndex = this.lastLineIndex;
    const cursorOnLastLine =
      this.activeBuffer.cursorY === lastLineIndex - this.activeBuffer.baseY;
    if (!cursorOnLastLine) return false;

    // This code gets the text after the cursor on the last line.
    // If there isn't any text, the cursor must be at the end of the line.
    const currentLine = this.activeBuffer.getLine(lastLineIndex);
    const currentLineText = currentLine?.translateToString();
    const textAfterCursor =
      currentLineText?.slice(this.activeBuffer.cursorX) || '';

    return !textAfterCursor.trim();
  }

  public dispose(): void {}

  private get activeBuffer() {
    return this.terminal.buffer.active;
  }

  private get lines() {
    return new Array(this.activeBuffer.length)
      .fill(undefined)
      .map((_, i) => this.activeBuffer.getLine(i));
  }

  private get lastLineIndex() {
    return this.lines.reduce(
      (acc, cur, i) => (cur?.translateToString().trimEnd() ? i : acc),
      0
    );
  }
}
