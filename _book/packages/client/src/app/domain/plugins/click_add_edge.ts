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
        this.edges = this.edges || [];
        if (this.edges.length === 0) {
            this.edges.push(model);
        } else {
            this.edges.push(model);
            const edges = this.edges;
            this.edges = [];
            node.addEdge({
                source: edges[0].id,
                target: edges[1].id
            });
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
