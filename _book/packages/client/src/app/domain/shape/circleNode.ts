import G6 from '@antv/g6';
G6.registerNode('circleNode', {
    drawShape: function drawShape(cfg, group) {
        const keyShape = group.addShape('circle', {
            attrs: {
                x: 0,
                y: 0,
                r: 30,
                fill: '#87e8de'
            }
        });
        return keyShape;
    }
}, 'circle');
