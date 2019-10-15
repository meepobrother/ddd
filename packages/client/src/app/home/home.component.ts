import { Component, OnInit, Inject } from '@angular/core';
import G6 from '@antv/g6';
import Grid from '@antv/g6/build/Grid';
import { DOCUMENT } from '@angular/common';
export type Shapes = 'diamond' | 'circle' | 'ellipse' | 'image' | 'modelRect' | 'star' | 'triangle' | 'rect';
export interface Button {
    title: string;
    color: string;
    shape: Shapes;
}
@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    graph: any;

    types: any[] = [{
        title: '领域',
        children: [{
            title: '核心领域'
        }, {
            title: '子领域'
        }]
    }, {
        title: '界限上下文',
        desc: `首先要将大系统划分层多个界限上下文，比如大健康行业直销系统可以划分为产品、经销商、订单等几个界限上下文，每个界限上下文有自己的领域逻辑、数据持久化、用例、接口等。每个界限上下文根据特点，具体实现方式又不同，比如有些界限上下文基本没有业务逻辑，就是增删改查，则可以使用CRUD最简单的模式；有些界限上线文有一定的业务逻辑，但对高并发、高性能没要求，则可以使用经典DDD模式；有些界限上下文有一定的业务逻辑，而且有高性能要求，则可以使CQRS模式。`,
        children: []
    }, {
        title: '聚合',
        desc: `通常将多个实体和值对象组合到一个聚合中来表达一个完整的概念，比如订单实体、订单明细实体、订单金额值对象就代表一个完整的订单概念，而且生命周期是相同的，并且需要统一持久化到数据库中`,
        children: [
            {
                title: '聚合根',
                desc: `将聚合中表达总概念的实体做成聚合根，比如订单实体就是聚合根，对聚合中所有实体的状态变更必须经过聚合根，因为聚合根协调了整个聚合的逻辑，保证一致性。当然其他实体可以被外部直接临时查询调用`
            },
            {
                title: '实体',
                desc: `有业务生命周期，采用业务标识符进行跟踪。比如一个订单就是实体，订单有生命周期的，而且有一个订单号唯一的标识它自己，如果两个订单所有属性值全部相同，但订单号不同，也是不同的实体`,
                children: [{
                    title: '值对象',
                    desc: `无业务生命周期，无业务标识符，通常用于模式实体。比如订单的收货地址、订单支付的金额等就是值对象`
                }, {
                    title: '服务',
                    desc: `无状态，有行为，通常就是一个用例来协调多个领域逻辑完成功能`
                }]
            }
        ]
    }, {
        title: '服务',
        desc: `协调聚合之间的业务逻辑，并且完成用例。`
    }, {
        title: '仓储',
        desc: `用于对聚合进行持久化，通常为每个聚合根配备一个仓储即可。仓储能够很好的解耦领域逻辑与数据库。`
    }, {
        title: '工厂',
        desc: `用于创建复杂的领域对象，能够将领域对象复杂的创建过程保护起来。`
    }];

    data: any = {
        edges: [],
        nodes: [],
        groups: []
    };
    btns: Button[] = [{
        title: '贴事件',
        color: '#fa8b44',
        shape: 'diamond'
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
        shape: 'modelRect'
    }, {
        title: '贴热点',
        color: '#e8539a',
        shape: 'rect'
    }, {
        title: '外部系统',
        color: '#eea4c2',
        shape: 'triangle'
    }, {
        title: '商业机会',
        color: '#60a89e',
        shape: 'star'
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
