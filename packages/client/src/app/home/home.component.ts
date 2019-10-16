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
        edges: [],
        nodes: [],
        groups: [{
            id: 'nogroup',
            title: '未分组',
            parentId: 'main'
        }, {
            id: 'main',
            title: '主分组'
        }]
    };
    btns: Button[] = types;
    constructor(@Inject(DOCUMENT) public doc: Document) {
        const data = localStorage.getItem('graph');
        if (data) {
            this.data = JSON.parse(data);
        }
    }
    onEmitInit(client: any) {
        const graph = new G6.Graph({
            container: 'mountNode',
            width: client.width,
            height: client.height,
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
        graph.data(this.data);  // 读取 Step 2 中的数据源到图上
        graph.render();    // 渲染图
        this.graph = graph;
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

    ngOnInit() { }

    addNode(it: any) {
        const node: any = {
            id: new Date().getTime(),
            x: 100,
            y: 60,
            label: it.title,
            style: {
                fill: it.color
            },
            shape: it.shape,
            groupId: 'nogroup'
        };
        this.data.nodes.push(node);
        this.graph.changeData(this.data);
        this._save();
    }

    private _save() {
        const data = this.graph.save();
        localStorage.setItem(`graph`, JSON.stringify(data));
    }
}
