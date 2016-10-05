import {ResourceGraph} from './graphs/resourcegraph';
import {LearnerGraph} from './graphs/learnergraph';

/**
 * Configurations related to the Graph Visualization
 * @author Peter Hasitschka
 */
export class GraphVisConfig {

    /**
     * Scene related configuration
     */
    public static scene = {
        near: 0.1,
        far: 10000,

        camera: {
            z: 330
        },

        backplane: {
            color: 0xEEEEFF,
            padding: 0,
            z: -1
        }
    };

    public static nodes = {
        segments: 32,
        abstractnode: {
            size: 3,
            color: 0xff33ff,
            highlight_color: 0xff3333,
            z_pos: 0.0,
        },

        resourcenode: {
            color: 0x5555bb
        },
        learnernode: {
            color: 0x00aa00
        }
    };

    public static edges = {
        abstractedge: {
            color: 0xaaaaff,
            z_pos: -1.0,
            thickness: 0.7
        }
    };

    /**
     * Defines the numbers of planes in a row
     * depending on the bootstrap class
     */
    public static plane_grid = {
        xs: 1,
        sm: 1,
        md: 2,
        lg: 2
    };

    public static intergraph_connections = {
        width : 0.1,
        color : "grey"
    }


    public static active_graphs = {
        'resource': ResourceGraph,
        'learner': LearnerGraph
    };


}