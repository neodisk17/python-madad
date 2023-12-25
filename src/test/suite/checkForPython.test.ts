import * as vscode from 'vscode';
import * as assert from 'assert';
import * as sinon from 'sinon';
import checkForPython from '../../utils/checkForPython';
import checkForPythonError from '../../error-message/checkForPythonError';
import { PYTHON_EXTENSION_ID } from '../../constant';

suite('checkForPython Test Suite', () => {
  let showWarningMessageStub: sinon.SinonStub;

  setup(() => {
    showWarningMessageStub = sinon.stub(vscode.window, 'showWarningMessage');
  });

  teardown(() => {
    showWarningMessageStub.restore();
  });

  test('Check if Python extension is available', async () => {
    const pythonExtension = vscode.extensions.getExtension(PYTHON_EXTENSION_ID);
    if (!pythonExtension) {
      await checkForPython('filename');
      assert.ok(showWarningMessageStub.calledOnceWith(checkForPythonError.pythonNotInstalled));
    }
  });

  test('Check if the command was run on the terminal', async () => {
    const pythonExtension = vscode.extensions.getExtension(PYTHON_EXTENSION_ID);

    if (pythonExtension) {
      await pythonExtension.activate();
      const pythonApi = pythonExtension?.exports;
      const pythonPath = pythonApi.settings.getExecutionDetails().execCommand;
      if (pythonPath) {

        let mockTerminal: any = { sendText: sinon.spy(), show: sinon.spy() };
        let createTerminalStub = sinon.stub(vscode.window, 'createTerminal').returns(mockTerminal);

        await checkForPython('filename');
        assert.ok(createTerminalStub.called);
        assert.ok(mockTerminal.sendText.calledOnceWithExactly(sinon.match('python -m pip install -r filename'), sinon.match(1)));
        assert.ok(!mockTerminal.sendText.calledOnceWithExactly(sinon.match('python -m pip install -r filename'), sinon.match(0)));
        assert.ok(mockTerminal.show.called);

        createTerminalStub.restore();
      } else {
        assert.fail("Python Path is not found");
      }
    } else {
      assert.fail("Python Extension is not found");
    }
  });
});