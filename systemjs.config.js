/**
 * System configuration for Angular 2 samples
 * Adjust as necessary for your application needs.
 */
(function (global) {
    // map tells the System loader where to look for things
    var map = {
        'gvfcore': 'build', // 'dist',
        '@angular': 'node_modules/@angular',
        'angular2-in-memory-web-api': 'node_modules/angular2-in-memory-web-api',
        'rxjs': 'node_modules/rxjs',
        'point-in-polygon': 'node_modules/point-in-polygon',
        'node-dijkstra': 'node_modules/node-dijkstra',
        'ngraph.events': 'node_modules/ngraph.events',
        'ngraph.expose': 'node_modules/ngraph.expose',
        'ngraph.forcelayout': 'node_modules/ngraph.forcelayout',
        'ngraph.graph': 'node_modules/ngraph.graph',
        'ngraph.merge': 'node_modules/ngraph.merge',
        'ngraph.physics.primitives': 'node_modules/ngraph.physics.primitives',
        'ngraph.physics.simulator': 'node_modules/ngraph.physics.simulator',
        'ngraph.quadtreebh': 'node_modules/ngraph.quadtreebh',
        'ngraph.random': 'node_modules/ngraph.random'
    };
    // packages tells the System loader how to load when no filename and/or no extension
    var packages = {
        'gvfcore': {main: 'main.js', defaultExtension: 'js'},
        'rxjs': {defaultExtension: 'js'},
        'angular2-in-memory-web-api': {main: 'index.js', defaultExtension: 'js'},
        'point-in-polygon': {
            main: 'index.js', defaultExtension: 'js'
        },
        'node-dijkstra': {
            main: 'libs/Graph.js', defaultExtension: 'js'
        },
        'ngraph.events': {
            main: 'index.js', defaultExtension: 'js'
        },
        'ngraph.expose': {
            main: 'index.js', defaultExtension: 'js'
        },
        'ngraph.forcelayout': {
            main: 'index.js', defaultExtension: 'js'
        },
        'ngraph.graph': {
            main: 'index.js', defaultExtension: 'js'
        },
        'ngraph.merge': {
            main: 'index.js', defaultExtension: 'js'
        },
        'ngraph.physics.primitives': {
            main: 'index.js', defaultExtension: 'js'
        },
        'ngraph.physics.simulator': {
            main: 'index.js', defaultExtension: 'js'
        },
        'ngraph.quadtreebh': {
            main: 'index.js', defaultExtension: 'js'
        },
        'ngraph.random': {
            main: 'index.js', defaultExtension: 'js'
        }
    };
    var ngPackageNames = [
        'common',
        'compiler',
        'core',
        'forms',
        'http',
        'platform-browser',
        'platform-browser-dynamic',
        'router',
        'router-deprecated',
        'upgrade'
    ];
    // Individual files (~300 requests):
    function packIndex(pkgName) {
        packages['@angular/' + pkgName] = {main: 'index.js', defaultExtension: 'js'};
    }

    // Bundled (~40 requests):
    function packUmd(pkgName) {
        packages['@angular/' + pkgName] = {main: 'bundles/' + pkgName + '.umd.js', defaultExtension: 'js'};
    }

    // Most environments should use UMD; some (Karma) need the individual index files
    var setPackageConfig = System.packageWithIndex ? packIndex : packUmd;
    // Add package entries for angular packages
    ngPackageNames.forEach(setPackageConfig);
    var config = {
        map: map,
        packages: packages
    };
    System.config(config);
})(this);