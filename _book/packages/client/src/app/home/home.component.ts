import { Component, OnInit, Inject } from '@angular/core';
import G6 from '@antv/g6';
import { DOCUMENT } from '@angular/common';
import { types, Button } from '../domain/data/types';
import '../domain/shape/index';
import '../domain/plugins/index';
@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    graph: any;
    data = {
        nodes: [],
        groups: [],
        edges: []
    };
    btns: Button[] = types;
    inited: boolean = false;

    constructor(@Inject(DOCUMENT) public doc: Document) { }
    private initSocket() {
        this.socket = new WebSocket('ws://10.0.0.4:3000');
        this.socket.onopen = () => {
            this.send(`app.init`, {});
            this.socket.onmessage = (event: MessageEvent) => {
                if (this.graph) {
                    try {
                        let data = JSON.parse(event.data);
                        if (typeof data.event === 'string') {
                            data = data.data;
                        }
                        this.data = data;
                        this.inited = true;
                        this.graph.changeData(data);
                    } catch (e) {
                        console.log(e.message);
                    }
                }
            };
        };
    }
    onEmitInit(client: any) {
        this.initSocket();
        const rect = this.doc.body.getBoundingClientRect();
        const graph = new G6.Graph({
            container: 'mountNode',
            width: rect.width,
            height: rect.height,
            defaultNode: {
                shape: 'circleNode'
            },
            defaultEdge: {
                color: '#000'
            },
            modes: {
                default: [
                    'drag-canvas',
                    // 'zoom-canvas',
                    // 'drag-node',
                    'click-select',
                    ['drag-group', {
                        multiple: true,
                        keyCode: 17
                    }],
                    'drag-node-with-group',
                    'collapse-expand-group',
                    'activate-relations',
                    'click-add-edge'
                ]
            },
            plugins: []
        });
        this.graph = graph;
        this.graph.data(this.data);
        this.graph.render();
        this.graph.on('node:dragend', (evt: MouseEvent) => {
            this._save();
        });
        this.graph.on(`node:contextmenu`, (evt: MouseEvent) => {
            this._showContextMenu((evt as any).item, evt.x, evt.y);
        });
        this.graph.on(`node:dblclick`, (evt: MouseEvent) => {
            this._editNodeLabel((evt as any).item, evt.x, evt.y);
        });
        let edgeNodes = [];
        this.graph.on('node:click', (evt: MouseEvent) => {
            const node = (evt as any).item;
            const model = node.getModel();
            edgeNodes.push(model.id);
            if (edgeNodes.length === 2) {
                this._drawEdge(edgeNodes[0], edgeNodes[1]);
                edgeNodes = [];
            }
        });
        this.graph.on(`canvas:dragend`, (evt: MouseEvent) => {
            console.log({
                evt,
                graph: this.graph
            });
        });
        this.graph.on(`click`, (evt: MouseEvent) => {
            this.showContextMenu = false;
            this.showEditNode = false;
            this.currentEditNode = undefined;
        });
        this.graph.on(`contextmenu`, (evt: MouseEvent) => {
            console.log({
                evt
            });
        });
    }

    socket: WebSocket;
    ngOnInit() { }

    _drawEdge(start: string, end: string) {
        this.data.edges.push({
            source: start,
            target: end
        });
        console.log({
            data: this.data
        });
        this.graph.changeData(this.data);
        this._save();
    }
    /**
     * node
     */
    showEditNode: boolean = false;
    showEditNodeX: number;
    showEditNodeY: number;
    currentEditNode: any;
    currentEditConfig: any;
    _selectNode(node: any) {
        this.currentEditNode = node;
    }
    _editNodeLabel(item: any, x: number, y: number) {
        this.showEditNode = true;
        this.showContextMenu = false;
        this.showEditNodeX = x;
        this.showEditNodeY = y;
        this.currentEditNode = item;
        this.currentEditConfig = item.getModel();
    }
    _updateNodeLabel(cfg: any) {
        this.graph.updateItem(this.currentEditNode, cfg);
        this._save();
    }
    addNode(it: any) {
        if (!this.inited) {
            return;
        }
        const node: any = {
            id: new Date().getTime(),
            x: 150,
            y: 100,
            label: it.title,
            size: [100, 60],
            style: {
                fill: it.color,
                stroke: `none`
            },
            labelCfg: {
                style: {
                    fill: '#ffffff'
                }
            },
            shape: it.shape
        };
        this.data.nodes.push(node);
        this.graph.changeData(this.data);
        this._save();
    }
    deleteNode() {
        try {
            this.graph.removeItem(this.currentEditNode);
            this._hideContextMenu();
            this._save();
        } catch (e) {
            console.log({
                graph: this.graph
            });
        }
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

    private _save() {
        const data = this.graph.save();
        this.send(`app.save`, data);
    }
    /**
     * 右键菜单
     */
    showContextMenu: boolean = false;
    contextMenuX: number;
    contextMenuY: number;
    _showContextMenu(node: any, x: number, y: number) {
        this.currentEditNode = node;
        this.showContextMenu = true;
        this.contextMenuX = x;
        this.contextMenuY = y;
        this.showEditNode = false;
    }

    _hideContextMenu() {
        this.showContextMenu = false;
    }
}
