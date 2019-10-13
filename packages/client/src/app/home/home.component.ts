import { Component, OnInit, Inject, Input } from '@angular/core';
import G6 from '@antv/g6';
import Grid from '@antv/g6/build/Grid';
import { DOCUMENT } from '@angular/common';

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
        groups: []
    };
    btns: any[] = [{
        title: '贴事件',
        color: '#fa8b44',
        shape: 'rect'
    }, {
        title: '警告信息',
        color: 'rgb(255, 0, 122)',
        shape: 'circle'
    }, {
        title: '小报事贴',
        color: '#eed33c',
        shape: 'rect'
    }, {
        title: '核心业务',
        color: '#9ed5ea',
        shape: 'rect'
    }, {
        title: '贴热点',
        color: '#e8539a',
        shape: 'rect'
    }, {
        title: '外部系统',
        color: '#eea4c2',
        shape: 'rect'
    }, {
        title: '商业机会',
        color: '#60a89e',
        shape: 'rect'
    }];
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
            modes: {
                default: ['drag-canvas', 'drag-node', 'click-select', 'tooltip', 'edge-tooltip', 'activate-relations']
            },
            plugins: [
                new Grid()
            ]
        });
        graph.data(this.data);  // 读取 Step 2 中的数据源到图上
        graph.render();    // 渲染图
        this.graph = graph;
        this.graph.on('node:dragend', () => {
            this._save();
        });
    }

    ngOnInit() { }

    addNode(it: any) {
        this.data.nodes.push({
            id: new Date().getTime(),
            x: 100,
            y: 60,
            label: it.title,
            style: {
                fill: it.color
            },
            shape: it.shape
        });
        this._save();
        this.graph.changeData(this.data);
        this.graph.render();
    }

    private _save() {
        localStorage.setItem(`graph`, JSON.stringify(this.data));
    }
}
