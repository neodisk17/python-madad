
import { workspace, ExtensionContext, commands } from 'vscode';
import { EXTENSION_ID } from './constant';
import downloadPackages from './utils/downloadPackages';
import checkForPython from './utils/checkForPython';

const filePatternsToWatch = [
  "**/*requirements*.{txt, in}",
  "**/*constraints*.txt",
  "**/requirements/*.{txt,in}",
  "**/constraints/*.txt"
];

export function activate(context: ExtensionContext) {

  const fileWatchers = filePatternsToWatch.map((pattern) => workspace.createFileSystemWatcher(pattern));

  fileWatchers.forEach((fileWatcher) => {
    fileWatcher.onDidChange((uri) => {
      const filename = uri.fsPath;
      checkForPython(filename);
    });
    context.subscriptions.push(fileWatcher);
  });

  const downloadCommand = commands.registerCommand(`${EXTENSION_ID}.installPackage`, downloadPackages);

  context.subscriptions.push(downloadCommand);

}

export function deactivate() { }
