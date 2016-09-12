module.exports = {
    build: {
        "index.html": "index.html",
        "app.js": [
            "javascripts/app.js"
        ],
        "app.css": [
            "stylesheets/app.css"
        ],
        "concise.min.css": "stylesheets/concise/concise.min.css",
        "masthead.css": "stylesheets/masthead.css",
        "dev.css": "stylesheets/dev.css",
        "images/": "images/"
    },
    networks: {
        "live": {
            network_id: 1, // Ethereum public network
        },
        "morden": {
            network_id: 2, // Official Ethereum test network
            host: "127.0.0.1", // FIXME: fill a valid morden IP
            port: 80
        },
        "staging": {
            network_id: 1337 // custom private network
        },
        "development": {
            network_id: "default"
        }
    },
    rpc: {
        host: "localhost",
        port: 8545
    }
};
