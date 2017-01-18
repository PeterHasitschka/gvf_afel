import {Input, Directive, Renderer, ElementRef, OnInit} from "@angular/core";
import {NodeAbstract} from "../../graphvis/graphs/nodes/abstract";
import {GraphVisConfig} from "../../graphvis/config";

@Directive({
    selector: '[intergraphconnection]',

})
/**
 * Directive holding a svg-line between two planes
 * Implemented not as a component but as a directive to allow using the LINE tag
 * @author Peter Hasitschka
 */
export class InterGraphConnectionDirective implements OnInit {

    @Input('nodePair') nodes;

    constructor(private el:ElementRef, private renderer:Renderer) {
        let config = GraphVisConfig.intergraph_connections;
        this.el.nativeElement.setAttribute("stroke", config.color);
        this.el.nativeElement.setAttribute("stroke-width", config.width);
    }

    ngOnInit() {
        let i = 1;
        this.nodes.forEach((node:NodeAbstract) => {
            let pos = node.getWorkspacePosition();
            this.el.nativeElement.setAttribute("x" + i, pos.x);
            this.el.nativeElement.setAttribute("y" + i, pos.y);
            i++;
        });
    }
}