import * as vscode from 'vscode';
import * as sinon from 'sinon';
import * as assert from 'assert';
import installPackage from '../../utils/installPackage';
import EventEmitter from 'events';

suite('installPackage Test Suite', () => {
  let createQuickPickStub: sinon.SinonStub;
  let mockQuickPick: any;
  let onDidChangeValueEmitter: EventEmitter;

  setup(() => {
    onDidChangeValueEmitter = new EventEmitter();

    mockQuickPick = {
      show: sinon.spy(),
      hide: sinon.spy(),
      onDidChangeValue: (listener: any) => onDidChangeValueEmitter.on('change', listener),
      onDidAccept: sinon.spy(),
    };
    createQuickPickStub = sinon.stub(vscode.window, 'createQuickPick').returns(mockQuickPick);

  });

  teardown(() => {
    createQuickPickStub.restore();
    sinon.restore();
  });

  test('Test input box creation and display', () => {
    installPackage();
    assert.ok(createQuickPickStub.calledOnce);
    assert.ok(mockQuickPick.show.calledOnce);
  });

  test('Test package selection and appendPackageInRequirementFile call', () => {
    installPackage();
    const inputBox = createQuickPickStub.returnValues[0];
    let capturedInput = '';
    inputBox.onDidChangeValue((input: any) => { capturedInput = input; });

    onDidChangeValueEmitter.emit('change', 'test-package');
    assert.strictEqual(capturedInput, 'test-package');
  });

});