import { window } from 'vscode';
import checkForPython from './checkForPython';

const downloadPackages = () => {
  const activeEditor = window.activeTextEditor;

  if (activeEditor) {
    const fileName = activeEditor.document.fileName;
    checkForPython(fileName);
  }
};

export default downloadPackages;