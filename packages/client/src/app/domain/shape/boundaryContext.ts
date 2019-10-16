import { Shape } from '@antv/g6';
/**
 * 核心子域
 */
Shape.registerNode('boundaryContext', {
    draw: (cfg, group) => {
        const keyShape = group.addShape('circle', {
            attrs: {
                x: 0,
                y: 0,
                r: 30,
                fill: '#000'
            }
        });
        group.addShape('text', {
            attrs: {
                x: 0,
                y: 0,
                textAlign: 'center',
                textBaseline: 'middle',
                text: cfg.label,
                fill: '#666'
            }
        });
        return keyShape;
    }
}, 'circle');
