import {NodeAbstract} from './abstract';
import {GraphVisConfig} from '../../config';
import {DataAbstract} from "../../data/abstract";
import {Data} from "@angular/router";
import {GraphScene} from "../../scene";
import {Plane} from "../../../plane/plane";

/**
 * A simple node, derived from @see{NodeAbstract}
 * @author Peter Hasitschka
 */
export class NodeSimple extends NodeAbstract {

    constructor(x:number, y:number, protected dataEntity:DataAbstract, plane:Plane) {
        super(x, y, plane);
    }
}