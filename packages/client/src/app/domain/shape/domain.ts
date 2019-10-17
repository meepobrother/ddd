import { Shape } from '@antv/g6';
/**
 * 域
 */
Shape.registerNode('domain', {
    draw: (cfg, group) => {
        const shape = group.addShape('circle', {
            attrs: {
                x: 0,
                y: 0,
                r: 300,
                lineWidth: 2,
                stroke: '#b5b5b5',
                fill: '#87e8de'
            }
        });
        return shape;
    }
}, 'circle');
