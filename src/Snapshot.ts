export interface Snapshot {
  /**
   * A list of commands that have been executed by the user.
   *
   * By default this will list the previous 20 commands, but this can be configured in the constructor options for SnapshotAddon.
   *
   * By default, the first two characters of commands will be trimmed. This is designed to remove the prompt from the command. If you wish to change this, you can configure the SnapshotAddon with commandTrim.
   */
  commands: string[];

  /**
   * The text currently displayed in the user's viewport. This is useful for identifying context around the user's current temrinal session.
   *
   * This will display the viewport as a single string with padding and newline characters.
   *
   * This is only available if the SnapshotAddon was configured with includeViewport: true.
   */
  viewport?: string;

  /**
   * The command that the user is currently typing but has not yet executed.
   *
   * By default, the first two characters of commands will be trimmed. This is designed to remove the prompt from the command. If you wish to change this, you can configure the SnapshotAddon with commandTrim.
   */
  entry: string;

  /**
   * Returns true if the terminal user is appending to the end of the last line in the active buffer.
   *
   * Ideally, if you are using Snashot to generate autocompletions, you should check this (with snapshotAddon.isAppending) before calling getSnapshot() to avoid unnecessary processing.
   */
  isAppending: boolean;
}

export interface SnapshotOptions {
  /**
   * The number of commands to save. Default is 20.
   */
  commandsToSave: number;
  /**
   * The number of characters to trim from the start of each command. This is designed to remove the prompt from the command. Defaults to 2.
   */
  commandTrim: number;

  /**
   * Whether to include the viewport in the snapshot. Defaults to true.
   * If you do not need the viewport, you can set this to false to improve performance.
   */
  includeViewport: boolean;
}
