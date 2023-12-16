
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

  watchRequirementsTxtFile(context);
  downloadPackages(context);

}

const checkForPython = async(fileName: string) => {
  if (vscode.extensions.getExtension('ms-python.python')) {
    const pythonExtension = vscode.extensions.getExtension('ms-python.python');
    const pythonApi = pythonExtension?.exports;

    const pythonPath = pythonApi.settings.getExecutionDetails().execCommand;

    // Check if the Python API is available
    if (pythonApi) {
      await pythonExtension.activate();
      if (pythonPath) {

        const activeInterpreter = pythonApi.settings.getExecutionDetails(vscode.Uri.file(''));
        console.log(" activeInterpreter.executable ", activeInterpreter.executable);
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

const watchRequirementsTxtFile = (context: vscode.ExtensionContext)=>{

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

const downloadPackages = (context: vscode.ExtensionContext)=>{
  const downloadCommand = vscode.commands.registerCommand('python-helper.downloadFile', () => {
    const activeEditor = vscode.window.activeTextEditor;

    if (activeEditor) {
      const fileName = activeEditor.document.fileName;
      checkForPython(fileName);
    }
  });

  context.subscriptions.push(downloadCommand);
};

export function deactivate() { }
