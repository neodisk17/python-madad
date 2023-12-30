import * as vscode from 'vscode';
import * as assert from 'assert';
import * as sinon from 'sinon';
import downloadPackages from '../../utils/downloadPackages';
import downloadPackagesError from '../../error-message/downloadPackagesError';
import { PYTHON_EXTENSION_ID } from '../../constant';

suite('downloadPackages Test Suite', () => {
  let showWarningMessageStub: sinon.SinonStub,
    activeTextEditorStub: sinon.SinonStub;

  setup(() => {
    showWarningMessageStub = sinon.stub(vscode.window, 'showWarningMessage');
    activeTextEditorStub = sinon.stub(vscode.window, 'activeTextEditor');
  });

  teardown(() => {
    showWarningMessageStub.restore();
    activeTextEditorStub.restore();
    sinon.restore();
  });

  test('If an active editor is not available', async () => {
    activeTextEditorStub.get(() => false);

    await downloadPackages();

    assert.ok(
      showWarningMessageStub.calledOnceWith(
        downloadPackagesError.noActiveEditor,
      ),
    );

    activeTextEditorStub.restore();
  });

  test('If an active editor is available', async () => {
    activeTextEditorStub.get(() => ({ document: { fileName: 'requirement' } }));

    await downloadPackages();

    assert.ok(
      !showWarningMessageStub.calledOnceWith(
        downloadPackagesError.noActiveEditor,
      ),
    );

    activeTextEditorStub.restore();
  });

  test('Check if the command was run on the terminal', async () => {
    const pythonExtension = vscode.extensions.getExtension(PYTHON_EXTENSION_ID);

    activeTextEditorStub.get(() => ({
      document: { fileName: 'requirement.txt' },
    }));

    if (pythonExtension) {
      await pythonExtension.activate();
      const pythonApi = pythonExtension?.exports;
      const pythonPath = pythonApi.settings.getExecutionDetails().execCommand;
      if (pythonPath) {
        let mockTerminal: any = { sendText: sinon.spy(), show: sinon.spy() };
        let createTerminalStub = sinon
          .stub(vscode.window, 'createTerminal')
          .returns(mockTerminal);

        await downloadPackages();
        assert.ok(createTerminalStub.called);
        assert.ok(
          mockTerminal.sendText.calledOnceWithExactly(
            sinon.match('python -m pip install -r requirement.txt'),
            sinon.match(1),
          ),
        );
        assert.ok(
          !mockTerminal.sendText.calledOnceWithExactly(
            sinon.match('python -m pip install -r requirement.txt'),
            sinon.match(0),
          ),
        );
        assert.ok(mockTerminal.show.called);

        createTerminalStub.restore();
        activeTextEditorStub.restore();
      } else {
        assert.fail('Python Path is not found');
      }
    } else {
      assert.fail('Python Extension is not found');
    }
  });
});
