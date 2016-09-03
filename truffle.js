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
  deploy: [
    "Mortal",
    "Bet"
  ],
  rpc: {
    host: "localhost",
    port: 8545
  }
};
