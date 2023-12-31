import { window, workspace } from 'vscode';
import { getPythonPath } from './getPythonPath';

const syncPackages = async () => {
  const defaultValue = 'requirements.txt';

  const userInput = await window.showInputBox({
    value: defaultValue,
    prompt: 'Enter the name of the file where you want to sync',
    placeHolder: '',
  });

  if (!userInput) {
    window.showErrorMessage('User cancelled the operation');
    return;
  }

  const rootPath = getWorkspaceRootPath();

  if (!rootPath) {
    window.showErrorMessage('No workspace is open');
    return;
  }

  const terminal = window.activeTerminal || window.createTerminal();

  const pythonPath = await getPythonPath();
  if (!pythonPath) {
    return;
  }

  const filePath = `${rootPath}/${userInput}`;
  const pythonCommand = `${pythonPath} -m pip freeze >> ${filePath};`;
  terminal.sendText(pythonCommand, true);
  terminal.show();
  window.showInformationMessage('Syncing the packages');
  console.log(`User entered: ${userInput}`);
};

const getWorkspaceRootPath = () => {
  if (workspace.workspaceFolders && workspace.workspaceFolders.length > 0) {
    return workspace.workspaceFolders[0].uri.fsPath;
  } else {
    return undefined; // No workspace is open
  }
};

export default syncPackages;
