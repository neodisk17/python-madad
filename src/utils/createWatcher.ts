import * as vscode from 'vscode';
import checkForPython from './checkForPython';

const createWatcher = (context: vscode.ExtensionContext) => {

  const filePatternsToWatch = [
    "**/*requirements*.{txt, in}",
    "**/*constraints*.txt",
    "**/requirements/*.{txt,in}",
    "**/constraints/*.txt"
  ];

  const fileWatchers = filePatternsToWatch.map((pattern) => vscode.workspace.createFileSystemWatcher(`**/${pattern}`));

  fileWatchers.forEach((fileWatcher) => {
    fileWatcher.onDidChange((uri) => {
      const filename = uri.fsPath; // Get the filename
      checkForPython(filename);
    });
    context.subscriptions.push(fileWatcher);
  });

};

export default createWatcher;