import { ITerminalAddon, Terminal } from 'xterm';
import { BufferText } from './BufferText';
import { DebounceCallback } from './types';

export class SnapshotAddon implements ITerminalAddon {
  private terminal: Terminal;
  private bufferText: BufferText;
  private debounceTimeout: NodeJS.Timeout;

  public activate(terminal: Terminal): void {
    this.terminal = terminal;
    this.bufferText = new BufferText(terminal);
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

  /**
   * Provides a utility for executing SnapshotAddon methods with a debounce.
   * This is useful when the user is executing commands in the terminal that result in multiple events in rapid succession.
   * @param callback A callback that will be invoked after a specified idle period with this SnapshotAddon instance as the argument.
   * @param timeout The amount of time to wait before invoking the callback. Defaults to 500ms.
   */
  public withDebounce(callback: DebounceCallback, timeout: number = 500) {
    if (this.debounceTimeout) {
      clearTimeout(this.debounceTimeout);
    }
    this.debounceTimeout = setTimeout(() => {
      callback(this);
    }, timeout);
  }

  /**
   * Provides utilities for extracting text from the terminal buffer.
   */
  public get text(): BufferText {
    return this.bufferText;
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
