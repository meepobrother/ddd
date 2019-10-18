import G6 from '@antv/g6';
G6.registerEdge('line-arrow', {
    getPath: (points) => {
        const startPoint = points[0];
        const endPoint = points[1];
        return [
            ['M', startPoint.x, startPoint.y],
            ['L', endPoint.x / 3 + 2 / 3 * startPoint.x, startPoint.y],
            ['L', endPoint.x / 3 + 2 / 3 * startPoint.x, endPoint.y],
            ['L', endPoint.x, endPoint.y]
        ];
    },
    getShapeStyle: (cfg) => {
        const startPoint = cfg.startPoint;
        const endPoint = cfg.endPoint;
        const controlPoints = this.getControlPoints(cfg);
        let points = [startPoint]; // 添加起始点
        // 添加控制点
        if (controlPoints) {
            points = points.concat(controlPoints);
        }
        // 添加结束点
        points.push(endPoint);
        const path = this.getPath(points);
        const style = G6.Util.mix({}, G6.Global.defaultEdge.style, {
            stroke: '#BBB',
            lineWidth: 1,
            path,
            startArrow: {
                path: 'M 6,0 L -6,-6 L -3,0 L -6,6 Z',
                d: 6
            },
            endArrow: {
                path: 'M 6,0 L -6,-6 L -3,0 L -6,6 Z',
                d: 6
            }
        }, cfg.style);
        return style;
    }
}, 'line');
