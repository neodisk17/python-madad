import { window } from 'vscode';
import checkForPython from './checkForPython';
import downloadPackagesError from '../error-message/downloadPackagesError';

const downloadPackages = () => {
  const activeEditor = window.activeTextEditor;

  if (activeEditor) {
    const fileName = activeEditor.document.fileName;
    checkForPython(fileName);
  }else{
    window.showWarningMessage(downloadPackagesError.noActiveEditor);
  }
};

export default downloadPackages;