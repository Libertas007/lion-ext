/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

import * as path from "path";
import {
    workspace,
    ExtensionContext,
    DocumentSemanticTokensProvider,
    SemanticTokensLegend,
    ProviderResult,
    SemanticTokensBuilder,
    Position,
    Range,
    languages,
    TextDocument,
    SemanticTokens,
    window,
} from "vscode";

import {
    LanguageClient,
    LanguageClientOptions,
    MessageStrategy,
    RevealOutputChannelOn,
    ServerOptions,
    TransportKind,
} from "vscode-languageclient/node";

let client: LanguageClient;

/* const tokenTypes = ["class", "variable", "method", "library", "type"];
const tokenModifiers = [];
const legend = new SemanticTokensLegend(tokenTypes, tokenModifiers);

const provider: DocumentSemanticTokensProvider = {
    provideDocumentSemanticTokens(
        document: TextDocument
    ): ProviderResult<SemanticTokens> {
        // analyze the document and return semantic tokens

        const tokensBuilder = new SemanticTokensBuilder(legend);
        // on line 1, characters 1-5 are a class declaration
        tokensBuilder.push(
            new Range(new Position(1, 1), new Position(1, 5)),
            "class",
            []
        );
        return tokensBuilder.build();
    },
}; */

const selector = { language: "lion", scheme: "file" };

// languages.registerDocumentSemanticTokensProvider(selector, provider, legend);

export function activate(context: ExtensionContext) {
    // The server is implemented in node
    const serverModule = context.asAbsolutePath(
        path.join("server", "out", "server.js")
    );

    // If the extension is launched in debug mode then the debug server options are used
    // Otherwise the run options are used
    const serverOptions: ServerOptions = {
        run: { module: serverModule, transport: TransportKind.ipc },
        debug: {
            module: serverModule,
            transport: TransportKind.ipc,
        },
    };

    // Options to control the language client
    const clientOptions: LanguageClientOptions = {
        // Register the server for plain text documents
        documentSelector: [
            { scheme: "file", language: "lion" },
            { scheme: "file", language: "lios" },
        ],
        revealOutputChannelOn: RevealOutputChannelOn.Error,
        initializationOptions: {
            analytics: true,
        },
        outputChannelName: "Lion Language Server",
        synchronize: {
            // Notify the server about file changes to '.clientrc files contained in the workspace
            fileEvents: workspace.createFileSystemWatcher("**/.clientrc"),
        },
    };

    // Create the language client and start the client.
    client = new LanguageClient(
        "lionServer",
        "Lion Language Server",
        serverOptions,
        clientOptions
    );

    /* client.onNotification("lion/lios", (message) => {
        window.showWarningMessage(message);
    }); */

    // Start the client. This will also launch the server
    client.start();
}

export function deactivate(): Thenable<void> | undefined {
    if (!client) {
        return undefined;
    }
    return client.stop();
}
