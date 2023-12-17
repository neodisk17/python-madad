
import * as vscode from 'vscode';
import watchRequirementsTxtFile from './utils/watchRequirementsTxtFile';
import downloadPackages from './utils/downloadPackages';

export function activate(context: vscode.ExtensionContext) {
  watchRequirementsTxtFile(context);
  downloadPackages(context);
}

export function deactivate() { }
