import G6 from '@antv/g6';
G6.registerBehavior('click-add-edge', {
    getEvents() {
        return {
            'node:click': 'onClick',
            mousemove: 'onMousemove'
        };
    },
    onClick(ev) {
        const node = ev.item;
        const graph = this.graph;
        const point = { x: ev.x, y: ev.y };
        const model = node.getModel();
        // 如果在添加边的过程中，再次点击另一个节点，结束边的添加
        if (this.addingEdge && this.edge) {
            graph.updateItem(this.edge, {
                target: model.id
            });
            this.edge = null;
            this.addingEdge = false;
        } else {
            // 点击节点，触发增加边
            this.edge = graph.addItem('edge', {
                source: model.id,
                target: point
            });
            this.addingEdge = true;
        }
    },
    onMousemove(ev) {
        const point = { x: ev.x, y: ev.y };
        if (this.addingEdge && this.edge) {
            // 增加边的过程中，移动时边跟着移动
            this.graph.updateItem(this.edge, {
                target: point
            });
        }
    }
});
