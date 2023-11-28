import { Terminal } from 'xterm';

export class BufferText {
  private terminal: Terminal;

  constructor(terminal: Terminal) {
    this.terminal = terminal;
  }

  /**
   * Returns a string containing all the text currently present in the viewport. This is the text that is currently visible to the user.
   * @param {boolean} trim Whether to trim the result. Defaults to true.
   * @returns {string} The text in the viewport.
   */
  public viewport(trim: boolean = true): string {
    const lines = this.getLinesInRange(
      this.activeBuffer.viewportY,
      this.terminal.rows
    );
    if (trim) {
      return lines
        .map((line) => line?.translateToString().trimEnd() ?? '')
        .join('\n')
        .trimEnd();
    }
    return lines.map((line) => line?.translateToString() ?? '').join('\n');
  }

  /**
   * This method returns a string containing a specified number of rows leading up to the user's cursor. The default is 0, which returns only the line the cursor is on.
   * @param rowsBefore The number of rows to return before the cursor. Defaults to 0.
   * @param trim Whether to trim the whitespace from the resulting lines. Defaults to true.
   * @returns A
   */
  public cursor(rowsBefore: number = 0, trim: boolean = true): string {
    if (trim) {
      const lines = this.getLinesInRange(
        Math.max(this.cursorY - rowsBefore, 0),
        this.cursorY
      ).map((line) => line?.translateToString().trimEnd() ?? '');

      lines.push(
        this.activeBuffer
          .getLine(this.cursorY)
          ?.translateToString()
          .slice(0, this.activeBuffer.cursorX) ?? ''
      );

      return lines.join('\n');
    }

    return this.getLinesInRange(
      Math.max(this.cursorY - rowsBefore, 0),
      this.cursorY + 1
    )
      .map((line) => line?.translateToString() ?? ''.repeat(this.terminal.cols))
      .join('\n');
  }

  private get activeBuffer() {
    return this.terminal.buffer.active;
  }

  private get cursorY() {
    return this.activeBuffer.cursorY + this.activeBuffer.baseY;
  }

  private getLinesInRange(from: number, to: number) {
    return new Array(to - from)
      .fill(undefined)
      .map((_, i) => this.activeBuffer.getLine(i + from));
  }
}
