import { Component, OnInit, Inject, ElementRef } from '@angular/core';
import { DOCUMENT } from '@angular/common';
declare const RESOURCE_BASE: any;
declare const mxResources: any;
declare const Graph: any;
declare const Editor: any;
declare const EditorUi: any;
declare const mxObjectCodec: any;
declare const mxUtils: any;
declare const STYLE_PATH: any;
declare const urlParams: any;
declare const mxLanguage: any;
declare const mxCodec: any;
declare const SERVER_IP: any;
export class CustomData {
    constructor(public value?: any) { }
}
declare const window: Window;
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    title = 'client';
    socket: WebSocket;
    graph: any;
    codec: any;
    editor: any;
    ui: any;
    constructor(@Inject(DOCUMENT) public doc: Document, public ele: ElementRef<HTMLDivElement>) { }
    private initSocket() {
        this.socket = new WebSocket(`ws://${SERVER_IP}`);
        this.socket.onopen = () => {
            this.send(`app.init`, {});
            (window as any).send = (event: string, data: any) => {
                this.send(event, data);
            };
            this.socket.onmessage = (event: MessageEvent) => {
                if (this.editor) {
                    const graph = this.editor.graph;
                    const res = JSON.parse(event.data);
                    const doc = mxUtils.parseXml(res.data);
                    if (doc.documentElement != null && doc.documentElement.nodeName === 'mxGraphModel') {
                        const decoder = new mxCodec(doc);
                        const node = doc.documentElement;
                        decoder.decode(node, graph.getModel());
                    }
                }
            };
        };
    }

    /**
     * node结束
     */
    send(event: string, data: any) {
        this.socket.send(
            JSON.stringify({
                event,
                data,
            })
        );
    }

    ngOnInit() {
        this.doc.addEventListener(`save`, (evt: any) => {
            this.send(`app.save`, evt.data);
        });
        const editorUiInit = EditorUi.prototype.init;
        EditorUi.prototype.init = function () {
            editorUiInit.apply(this, arguments);
            this.actions.get('export').setEnabled(false);
            // Updates action states which require a backend
            if (!Editor.useLocalStorage) {
                const enabled = true;
                this.actions.get('open').setEnabled(enabled || Graph.fileSupport);
                this.actions.get('import').setEnabled(enabled || Graph.fileSupport);
                this.actions.get('save').setEnabled(true);
                this.actions.get('saveAs').setEnabled(enabled);
                this.actions.get('export').setEnabled(enabled);
            }
        };
        mxResources.loadDefaultBundle = false;
        const bundle = mxResources.getDefaultBundle(RESOURCE_BASE, mxLanguage) ||
            mxResources.getSpecialBundle(RESOURCE_BASE, mxLanguage);
        const that = this;
        mxUtils.getAll([bundle, STYLE_PATH + '/default.xml'], (xhr) => {
            mxResources.parse(xhr[0].getText());
            const themes = new Object();
            themes[Graph.prototype.defaultThemeName] = xhr[1].getDocumentElement();
            const editor = new Editor(urlParams.chrome === '0', themes);
            that.ui = new EditorUi(editor);
            that.editor = editor;
            this.initSocket();
        });
        console.log(`ng on init`, bundle);
    }
}
