import {AfelApi} from "../afel/afelapi";



export class GvfPlugins {

    /**
     * Add your plugin classes here!
     */
    static plugins = {
        onInit : [
            AfelApi
        ]
    }
}