import { window } from 'vscode';
import { getPythonPath } from './getPythonPath';

export const checkForPython = async (fileName: string) => {
  const pythonPath = await getPythonPath();
  if (!pythonPath) {
    return;
  }
  const terminal = window.activeTerminal || window.createTerminal();
  const pythonCommand = `${pythonPath} -m pip install -r ${fileName};`;
  terminal.sendText(pythonCommand, true);
  terminal.show();
};

export default checkForPython;
