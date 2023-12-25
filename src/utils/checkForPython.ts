import { extensions, window } from 'vscode';
import { PYTHON_EXTENSION_ID } from '../constant';
import checkForPythonError from '../error-message/checkForPythonError';

const checkForPython = async (fileName: string) => {
  const pythonExtension = extensions.getExtension(PYTHON_EXTENSION_ID);

  if (!pythonExtension) {
    window.showWarningMessage(checkForPythonError.pythonNotInstalled);
    return;
  }

  if (!pythonExtension.activate) {
    await pythonExtension.activate();
  }

  const pythonApi = pythonExtension?.exports;
  const pythonPath = pythonApi.settings.getExecutionDetails().execCommand;

  // This scenario will never occures, even the virtual environment is not available
  // It will take the path of usr/bin/python

  if (!pythonPath) {
    window.showWarningMessage(checkForPythonError.noInterpreterSelected);
    return;
  }

  const terminal = window.activeTerminal || window.createTerminal();

  const pythonCommand = `${pythonPath} -m pip install -r ${fileName};`;
  terminal.sendText(pythonCommand, true);
  terminal.show();
};


export default checkForPython;