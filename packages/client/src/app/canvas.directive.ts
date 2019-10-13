import { Directive, ElementRef, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Directive({
    selector: '[appCanvas]'
})
export class CanvasDirective implements OnInit {
    @Output()
    emitInit: EventEmitter<any> = new EventEmitter();
    constructor(
        public element: ElementRef<HTMLCanvasElement>,
        @Inject(DOCUMENT) public doc: Document
    ) { }

    ngOnInit() {
        const client = this.element.nativeElement.getBoundingClientRect();
        this.emitInit.emit(client);
    }

}
