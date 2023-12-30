
import { window, workspace } from 'vscode';
import { parse } from 'node-html-parser';
import { appendFileSync, existsSync, readFileSync } from 'fs';

import('node-fetch');

type packageDetails = {
  packageName: string;
  version: string;
  created: string;
  description?: string;
};

const installPackage = () => {
  const inputBox = window.createQuickPick();
  inputBox.placeholder = 'Type here to searach for your package';
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

      appendPackageInRequirementFile(selectedSuggestion);

      inputBox.hide();
    }
  });

  inputBox.show();
};

function appendPackageInRequirementFile(packageName: string) {
  const rootPath = workspace.workspaceFolders
    ? workspace.workspaceFolders[0].uri.fsPath
    : null;

  if (rootPath) {
    const requirementsPath = `${rootPath}/requirements.txt`;
    const constraintsPath = `${rootPath}/constraints.txt`;

    const requirementsExists = existsSync(requirementsPath);

    const constraintsExists = existsSync(constraintsPath);

    if (!requirementsExists && !constraintsExists) {
      appendIfNotExists(requirementsPath, 'requirements.txt', packageName);
    }

    if (requirementsExists) {
      appendIfNotExists(requirementsPath, 'requirements.txt', packageName);
    }

    if (constraintsExists) {
      appendIfNotExists(constraintsPath, 'constraints.txt', packageName);

    }

  } else {
    window.showErrorMessage('No workspace open.');
  }
}

const appendIfNotExists = (filePath: string, fileName: string, packageName: string) => {
  if (existsSync(filePath)) {
    const fileContent = readFileSync(filePath, 'utf-8');
    if (!fileContent.includes(packageName)) {
      appendFileSync(filePath, `\n${packageName}`);
      window.showInformationMessage(`Added ${packageName} package`);
    } else {
      window.showInformationMessage(`${packageName} already exist`);
    }
  } else {
    window.showInformationMessage(`${fileName} does not exist.`);
  }
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
      const element:any = item.childNodes[1].childNodes[1];
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
  } catch (error: unknown) {
    console.error('Error fetching suggestions from API:', error);
    console.error(error);
    return [];
  }
}

export default installPackage;