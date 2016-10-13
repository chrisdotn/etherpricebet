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
            host: "localhost",
            port: 8548
        },
        "morden": {
            network_id: 2, // Official Ethereum test network
            host: "localhost",
            port: 8547
        },
        "staging": {
            network_id: 42, // custom private network
            host: "localhost",
            port: 8546
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
