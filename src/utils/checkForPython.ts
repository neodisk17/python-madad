import * as vscode from 'vscode';

const checkForPython = async (fileName: string) => {
  const pythonExtension = vscode.extensions.getExtension('ms-python.python');
  if (pythonExtension) {
    const pythonApi = pythonExtension?.exports;

    const pythonPath = pythonApi.settings.getExecutionDetails().execCommand;

    // Check if the Python API is available
    if (pythonApi) {
      if(!pythonExtension.isActive){
        await pythonExtension.activate();
      }

      if (pythonPath) {

        const terminal = vscode.window.activeTerminal || vscode.window.createTerminal('Python Terminal');
        const pythonCommand = `${pythonPath} -m pip install -r ${fileName};`;
        terminal.sendText(pythonCommand, true);
        terminal.show();

      } else {
        vscode.window.showWarningMessage('No Python interpreter selected. Please select a Python interpreter.');
      }
    }
  } else {
    vscode.window.showWarningMessage('Python extension is not installed. Please install the Python extension for VS Code.');
  }
};

export default checkForPython;