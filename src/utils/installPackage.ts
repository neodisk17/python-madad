
import * as vscode from 'vscode';
import { parse } from 'node-html-parser';
import 'node-fetch';

type packageDetails = {
  packageName: string;
  version: string;
  created: string;
  description?: string;
};

const installPackage = (context: vscode.ExtensionContext) => {
  const disposable = vscode.commands.registerCommand('python-helper.install-python-package', async () => {
    const inputBox = vscode.window.createQuickPick();
    inputBox.placeholder = 'Enter your query for API suggestions';
    inputBox.onDidChangeValue(async (query) => {
      inputBox.busy = true;
      const suggestions: packageDetails[] = await fetchSuggestionsFromAPI(query);
      inputBox.items = suggestions.map((suggestion: packageDetails) => ({
        label: suggestion.packageName,
        description: suggestion.description,
        detai: suggestion.version,

      }));
      inputBox.busy = false;
    });

    inputBox.onDidAccept(() => {
      const selectedSuggestion = inputBox.activeItems[0]?.label;
      if (selectedSuggestion) {
        vscode.window.showInformationMessage(`You selected: ${selectedSuggestion}`);
        inputBox.hide();
      }
    });

    inputBox.show();
  });

  context.subscriptions.push(disposable);
};

async function fetchSuggestionsFromAPI(query: string): Promise<packageDetails[]> {
  try {

    if (query.length < 1) {
      return [];
    }

    const url = `https://pypi.org/search/?q=${query}`;

    const response = await fetch(url);
    const data = await response.text();

    const root = parse(data);
    const ulElem = root.querySelectorAll('.unstyled li');

    const elementList: packageDetails[] = [];

    ulElem.forEach((item) => {
      const element = item.childNodes[1].childNodes[1];
      const packageName = element?.childNodes[1]?.childNodes[0]?.innerText;
      const version = element?.childNodes[3]?.childNodes[0]?.innerText;
      const created = element?.childNodes[5]?.childNodes[0]?.innerText;
      const description = element?.nextElementSibling?.childNodes[0]?.innerText ?? "";
      elementList.push({
        packageName,
        version,
        created,
        description
      });
    });

    return elementList;

  } catch (error) {
    console.error('Error fetching suggestions from API:', error.message);
    return [];
  }

}

export default installPackage;