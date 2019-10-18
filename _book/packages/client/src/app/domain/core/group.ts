import { Group } from '@antv/g6';
export class CoreGroup {
    group: any;
    constructor(cfgs: any) {
        this.group = new Group(cfgs);
    }
    addGroup() { }
    addShape() { }
}
