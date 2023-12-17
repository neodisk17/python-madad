import * as vscode from 'vscode';
import checkForPython from './checkForPython';
import { EXTENSION_ID } from '../constant';

const downloadPackages = (context: vscode.ExtensionContext) => {
  const downloadCommand = vscode.commands.registerCommand(`${EXTENSION_ID}.downloadFile`, () => {
    const activeEditor = vscode.window.activeTextEditor;

    if (activeEditor) {
      const fileName = activeEditor.document.fileName;
      checkForPython(fileName);
    }
  });

  context.subscriptions.push(downloadCommand);
};

export default downloadPackages;