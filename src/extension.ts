import { workspace, ExtensionContext, commands } from 'vscode';
import { EXTENSION_ID } from './constant';
import downloadPackages from './utils/downloadPackages';
import checkForPython from './utils/checkForPython';
import installPackage from './utils/installPackage';
import syncPackages from './utils/syncPackages';

const filePatternsToWatch = [
  '**/*requirements*.{txt, in}',
  '**/*constraints*.txt',
  '**/requirements/*.{txt,in}',
  '**/constraints/*.txt',
];

export function activate(context: ExtensionContext) {
  const fileWatchers = filePatternsToWatch.map((pattern) =>
    workspace.createFileSystemWatcher(pattern),
  );

  fileWatchers.forEach((fileWatcher) => {
    fileWatcher.onDidChange((uri) => {
      const filename = uri.fsPath;
      checkForPython(filename);
    });
    context.subscriptions.push(fileWatcher);
  });

  const downloadCommand = commands.registerCommand(
    `${EXTENSION_ID}.installPackage`,
    downloadPackages,
  );

  const installPythonPackage = commands.registerCommand(
    `${EXTENSION_ID}.install-python-package`,
    installPackage,
  );
  const syncPythonPackage = commands.registerCommand(
    `${EXTENSION_ID}.sync-python-package`,
    syncPackages,
  );

  context.subscriptions.push(downloadCommand);
  context.subscriptions.push(installPythonPackage);
  context.subscriptions.push(syncPythonPackage);
}

export function deactivate() {}
