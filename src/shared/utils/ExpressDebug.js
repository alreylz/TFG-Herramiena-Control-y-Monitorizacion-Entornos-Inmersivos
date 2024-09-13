require('../LogColouring');


function print(path, layer) {
    if (layer.route) {
        layer.route.stack.forEach(print.bind(null, path.concat(split(layer.route.path))))
    } else if (layer.name === 'router' && layer.handle.stack) {
        layer.handle.stack.forEach(print.bind(null, path.concat(split(layer.regexp))))
    } else if (layer.method) {
        console.log('%s /%s',
            `${layer.method.toUpperCase()}`.red(),
            `${path.concat(split(layer.regexp)).filter(Boolean).join('/')}`.magenta())
    }
}

function split(thing) {
    if (typeof thing === 'string') {
        return thing.split('/')
    } else if (thing.fast_slash) {
        return ''
    } else {
        var match = thing.toString()
            .replace('\\/?', '')
            .replace('(?=\\/|$)', '$')
            .match(/^\/\^((?:\\[.*+?^${}()|[\]\\\/]|[^.*+?^${}()|[\]\\\/])*)\$\//)
        return match
            ? match[1].replace(/\\(.)/g, '$1').split('/')
            : '<complex:' + thing.toString() + '>'
    }
}


class ExpressDebug {
    static showAllExpressEndpoints(app) {
        app._router.stack.forEach(print.bind(null, []));
    }


    //Get info about a route in object-like format
    static test(router) {
        
        console.log(router.stack.filter((layer) => {

                if (layer.route.path)
                    console.log(layer.route.path)
                if (layer.route.methods)
                    console.log(layer.route.methods)

                return layer.route !== "undefined"
            }
        ))


    }


    static showRouterEndpoints(router) {
        router.stack.forEach(print.bind(null, []));
    }


}


module.exports = ExpressDebug;