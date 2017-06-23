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

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('extension.sayHello', () => {
        // The code you place here will be executed every time your command is executed

        // Display a message box to the user
        vscode.window.showInformationMessage('Hello World!');
        var editor = vscode.window.activeTextEditor;
    });

    vscode.commands.registerCommand('sendTestmessage', sendMessage);

    context.subscriptions.push(disposable);
}

function startTCPServer(addr: number)
{
    var server = net.createServer(function (socket) {
        // Handle incoming messages from clients.
        socket.on('data', function (data) {
            vscode.window.showInformationMessage(data.toString());
        });

    });

    server.listen(6666, 'localhost');

}

function sendMessage(message: string)
{
    var connection = net.createConnection(6666, 'localhost');

    connection.on('error', function(connect) {
        vscode.window.showErrorMessage('cant send message');
    })

    connection.on('connect', function(connect) {
        connection.write("test");
    })
    
}

// this method is called when your extension is deactivated
export function deactivate() {
}