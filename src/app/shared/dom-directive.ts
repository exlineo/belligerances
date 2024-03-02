import { Directive, ElementRef, OnInit } from '@angular/core';
// Directive pour observer les modifications du DOM lors du Drag and Drop
@Directive({
    selector: '[watchDomTree]',
    standalone:true
})
export class DomChangedDirective implements OnInit {
    constructor(private elRef: ElementRef) { }
    ngOnInit() {
        this.registerDomChangedEvent(this.elRef.nativeElement);
    }

    registerDomChangedEvent(el: HTMLElement) {
        const observer = new MutationObserver(list => {
            const evt =
                new CustomEvent('dom-changed',
                    { detail: list, bubbles: true });
            el.dispatchEvent(evt);
        });
        const attributes = false;
        const childList = true;
        const subtree = true;
        observer.observe(el, { attributes, childList, subtree });
    }
}