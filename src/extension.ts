
import * as vscode from 'vscode';
import createWatcher from './utils/createWatcher';
import downloadPackages from './utils/downloadPackages';
import installPackage from './utils/installPackage.ts';
// import { EXTENSION_ID } from './constant';



export function activate(context: vscode.ExtensionContext) {

  createWatcher(context);
  downloadPackages(context);
  installPackage(context);


}



export function deactivate() { }
