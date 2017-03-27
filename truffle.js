var DefaultBuilder = require("truffle-default-builder");

module.exports = {
    build: new DefaultBuilder({
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
    }),
    networks: {
        live: {
            host: "localhost",
            port: 8548,
            network_id: 1
        },
        ropsten: {
            host: "localhost",
            port: 8547,
            network_id: 3
        },
        staging: {
            host: "localhost",
            port: 8546,
            network_id: 42
        },
        development: {
            host: "localhost",
            port: 8545,
            network_id: "*"
        }
    }
};
