'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as net from 'net';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "sourcetrail" is now active!');

    let sourcetrail = new Sourcetrail();

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let start = vscode.commands.registerCommand('extension.startServer', () => {
        sourcetrail.restartServer();
    });
    let stop = vscode.commands.registerCommand('extension.stopServer', () => {
        sourcetrail.stopServer();
    });

    let sendLoc = vscode.commands.registerCommand('extension.sendLocation', () => {
        sourcetrail.sendLocation();
    });
    let sendP = vscode.commands.registerCommand('extension.sendPing', () => {
        sourcetrail.sendPing();
    });

    context.subscriptions.push(start);
    context.subscriptions.push(stop);
    context.subscriptions.push(sendLoc);
    context.subscriptions.push(sendP);
    context.subscriptions.push(sourcetrail);
}

class Sourcetrail {
    private _server: net.Server;
    private _statusBarItem: vscode.StatusBarItem;

    constructor() {
        this._statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right);
        if (vscode.workspace.getConfiguration("sourcetrail").get("startServerAtStartup")) {
            this.restartServer();
        }
    }

    disconnectedStatus() {
        this._statusBarItem.text = "$(circle-slash) Sourcetrail";
        this._statusBarItem.show();
    }

    connectedStatus() {
        this._statusBarItem.text = "$(check) Sourcetrail";
        this._statusBarItem.show();
    }

    public restartServer() {
        let me = this;
        // Create StatusBarItem if needed
        if (!this._statusBarItem) {
            this.disconnectedStatus();
        }

        if (this._server) {
            this.stopServer();
            this._statusBarItem.hide();
        }

        this._server = net.createServer(function (socket) {
            // Handle incoming messages from clients.
            socket.on('data', function (data) {
                me.processMessage(data.toString());
            });
            socket.on('error', function (data) {
                vscode.window.showErrorMessage('Sourcetrail - Error recieving data');
                me.disconnectedStatus();
                console.log('server recieve data error');
            });

        });
        const ip: string = vscode.workspace.getConfiguration("sourcetrail").get<string>("ip");
        const port: number = vscode.workspace.getConfiguration("sourcetrail").get<number>("pluginPort");
        this._server.listen(port, ip);
        this.sendPing();
    }

    public stopServer() {
        this._server.close();
        this._server = null;
    }

    sendPing() {
        this.sendMessage("ping>>VS Code<EOM>");
    }

    sendLocation() {
        const editor = vscode.window.activeTextEditor;

        if (editor) {
            var message = "setActiveToken>>"
                + editor.document.uri.fsPath
                + ">>" + (editor.selection.active.line + 1).toString()
                + ">>" + (editor.selection.active.character + 1).toString()
                + "<EOM>";
            console.log(message);
            this.sendMessage(message);
        }
        else {
            console.log("No editor");
            vscode.window.showWarningMessage('Sourcetrail - No editor window with cursor open');
        }
    }

    sendMessage(message: string) {
        let me = this;
        const ip: string = vscode.workspace.getConfiguration("sourcetrail").get<string>("ip");
        const port: number = vscode.workspace.getConfiguration("sourcetrail").get<number>("sourcetrailPort");
        var connection = net.createConnection(port, ip);

        connection.on('error', function (connect) {
            console.log('send-error');
            vscode.window.showErrorMessage('Sourcetrail - Cant send message: is Sourcetrail running?');
            me.disconnectedStatus();
        })

        connection.on('connect', function (connect) {
            console.log('send-connect');
            console.log(message);
            connection.write(message);
            connection.end();
        })

    }

    processMessage(message: String) {
        console.log("process message: " + message);
        var m = message.split(">>");
        if (m[0] == "ping") {
            this.connectedStatus();
            this.sendPing();
        }
        else if (m[0] == "moveCursor") {
            this.connectedStatus();
            var file = vscode.Uri.file(m[1]);
            vscode.commands.executeCommand('vscode.open', file)
                .then(function () {
                    const editor = vscode.window.activeTextEditor;
                    if (editor) {
                        const pos = editor.selection.active;
                        var newPos = pos.with(parseInt(m[2]) - 1, parseInt(m[3]) - 1);
                        editor.selections = [new vscode.Selection(newPos, newPos)];
                        vscode.commands.executeCommand('revealLine', { 'lineNumber': parseInt(m[2]) - 1, 'at': 'center' });
                    }
                })

        }
    }

    dispose() {
        this.stopServer();
        this._statusBarItem.dispose();
    }
}

// this method is called when your extension is deactivated
export function deactivate() {
}