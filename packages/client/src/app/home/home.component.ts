import { Component, OnInit, Inject } from '@angular/core';
import G6 from '@antv/g6';
import Grid from '@antv/g6/build/Grid';
import { DOCUMENT } from '@angular/common';
import * as g6 from '@antv/g6';
import Minimap from '@antv/g6/build/minimap';
import { types, Button } from '../domain/data/types';
import '../domain/shape/domain';
const minimap = new Minimap({
    size: [window.innerHeight / 4, window.innerHeight / 4]
});
console.log({
    g6
});
@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    graph: any;
    data: any = {
        nodes: [],
        groups: [],
        edges: []
    };
    btns: Button[] = types;
    inited: boolean = false;
    constructor(@Inject(DOCUMENT) public doc: Document) { }
    private initSocket() {
        this.socket = new WebSocket('ws://192.168.1.4:3000');
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
        const graph = new G6.Graph({
            container: 'mountNode',
            width: 3000,
            height: 3000,
            defaultNode: {
                shape: 'domain'
            },
            defaultEdge: {
                color: '#000'
            },
            modes: {
                default: [
                    'drag-canvas',
                    // 'zoom-canvas',
                    'drag-node',
                    'drag-group',
                    'drag-node-with-group',
                    'collapse-expand-group'
                ]
            },
            plugins: [
                new Grid(),
                minimap
            ]
        });
        this.graph = graph;
        this.graph.data(this.data);
        this.graph.render();
        this.graph.on('node:dragend', (evt: MouseEvent) => {
            this._save();
        });
        this.graph.on(`node:contextmenu`, (evt: MouseEvent) => {
            console.log({
                x: evt.x,
                y: evt.y
            });
        });
        this.graph.on(`node:mouseleave`, (evt: MouseEvent) => {
            console.log(`mouse leave`);
        });
    }
    socket: WebSocket;
    ngOnInit() { }

    send(event: string, data: any) {
        this.socket.send(
            JSON.stringify({
                event,
                data,
            })
        );
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
            style: {
                fill: it.color
            },
            labelCfg: {
                style: {
                    fill: '#fff'
                }
            },
            shape: it.shape
        };
        this.data.nodes.push(node);
        this.graph.changeData(this.data);
        this._save();
    }

    private _save() {
        const data = this.graph.save();
        this.send(`app.save`, data);
    }
}
