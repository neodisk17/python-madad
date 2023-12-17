import * as vscode from 'vscode';
import { PYTHON_EXTENSION_ID } from '../constant';
import checkForPythonError from '../error-message/checkForPythonError';

const checkForPython = async (fileName: string) => {
  const pythonExtension = vscode.extensions.getExtension(PYTHON_EXTENSION_ID);

  if (!pythonExtension) {
    vscode.window.showWarningMessage(checkForPythonError.pythonNotInstalled);
    return;
  }

  if (!pythonExtension.activate) {
    await pythonExtension.activate();
  }

  const pythonApi = pythonExtension?.exports;
  const pythonPath = pythonApi.settings.getExecutionDetails().execCommand;

  if (!pythonPath) {
    vscode.window.showWarningMessage(checkForPythonError.noInterpreterSelected);
    return;
  }

  const terminal = vscode.window.activeTerminal || vscode.window.createTerminal();

  const pythonCommand = `${pythonPath} -m pip install -r ${fileName};`;

  terminal.sendText(pythonCommand, true);

  terminal.show();
};


export default checkForPython;