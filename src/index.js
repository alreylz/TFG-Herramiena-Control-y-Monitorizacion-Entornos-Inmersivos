/* Third-party Library Imports */
const {program} = require('commander'); // -> Library for parsing command line arguments
const https = require("https"); // -> Library for creating secure https servers
const fs = require("fs"); // -> Library for reading system access
const path = require("path"); // -> Library for handling file paths

/* Custom Library Imports */
const Basics = require("./shared/Basics.js");
const LogColouring = require("./shared/LogColouring.js");


/* Parse command line arguments (commander library) */
program.name("ixci-grpc")
    .description("The Immersive eXperimenter Control Interface: " +
        "a remote procedure call generation tool (based upon grpc) targeted at supporting the execution, control and monitoring of VR/AR/MR user studies.")
    .version("0.1");


program
    .requiredOption('-p, --port <port>',
        'Port to listen on ', process.env.PORT || 3000)
    .requiredOption('--secure', 'Use HTTPS (default: false)', false)
    .option('-k, --keyfile <path>', 'Https key file.',
        process.env.KEYFILE ? path.join(Basics.getApplicationRoot(), process.env.KEYFILE) : path.join(Basics.getApplicationRoot(), 'key.pem'))
    .option('-c, --certfile <path>', 'Https cert file.',
        process.env.CERTFILE ? path.join(Basics.getApplicationRoot(), process.env.CERTFILE) : path.join(Basics.getApplicationRoot(), 'cert.pem'))
    .option('-d, --debug', "Run in debug mode", process.env.ENVIRONMENT ? process.env.ENVIRONMENT === "dev" : false)
    .parse();


/* Read .env file */
const EnvParsed = require("dotenv").config({path: path.join(Basics.getApplicationRoot(), ".env")}).parsed; // -> Library for reading .env files

console.log(EnvParsed.ENVIRONMENT)
if (EnvParsed.ENVIRONMENT === 'dev') {
    program.allowUnknownOption();
}

const options = program.opts();

const PORT = process.env.PORT;
const HOST = process.env.SERVER_ADDRESS;


options.hostname = process.env.HOSTNAME;


// globalOptions = options;
global.globalOptions = {...options, ...EnvParsed};


if (options.debug) {
    // console.log(".env file: ", EnvParsed.parsed);
    // console.log("Options: ", program.opts());
}


console.log("GlobalOptions", global.globalOptions)


const ExpressApp = require("./express-app")(global.globalOptions)

const addresses = Basics.getIPAddress();

if (options.secure) {
    global.server = https.createServer({
        key: fs.readFileSync(options.keyfile),
        cert: fs.readFileSync(options.certfile)
    }, ExpressApp);

    global.server.listen(options.port, () => {
        console.log("Secure Web Server Started");
        for (const address of addresses)
            console.log(`\thttp(s)://${address}:${options.port}`);

    });
} else {
    console.log("Web Server Started");
    global.server = ExpressApp.listen(options.port, function () {
        for (const address of addresses)
            console.log(`\thttp://${address}:${options.port}`);
    });

}


// console.clear();
console.log("\n" +
    "-------------------------------\n" +
    "█ ▀▄▀ █▀▀ █ ▄▄ █▀▀ █▀█ █▀█ █▀▀\n".blue() +
    "█ █ █ █▄▄ █    █▄█ █▀▄ █▀▀ █▄▄\n".blue() +
    "-------------------------------\n" +
    `by @alreylz        version ${program.version()}\n`)


const dbConnection = require('./db')(EnvParsed.MONGO_HOST,
    EnvParsed.MONGO_PORT,
    EnvParsed.ENVIRONMENT !== "test" ? EnvParsed.MONGO_DB_NAME : EnvParsed.TEST_MONGO_DB_NAME);


global.useWebsockets = false

if (global.useWebsockets) {

// ¿ESTO PARA QUÉ ES?
// Import a websocket server
    const WS_SERVER_PORT = process.env.WEBSOCKET_SERVER_PORT;
// a) Websocket server to which game clients will connect to
    const wsServer = require("./websock-communication/WebsocketServer")(global.server, WS_SERVER_PORT, "/screenshare");
    global.game_clients = wsServer.game_clients;


// b) Websocket server to which browsers will connect to
    const wsServerBroadcast = require("./websock-communication/WebsocketServerBroadcast")(global.server, 3002, "/monitor/all");
    global.browser_sockets = wsServerBroadcast.browser_sockets;


    const authenticatedWSServer = require("./websock-communication/WebsocketServerAuthenticated")(global.server, 3003, "/wsSubscribe");


// Connect to the database and

//Elmina el archivo proto y lo vuelve a crear con la cabecera
    const PROTO_PATH = path.resolve(__dirname, 'proto', 'protofile.proto'); // -> Archivo de salida (proto)

    const PROTO_PACKAGE = process.env.DEFAULT_PROTO_PACKAGE; //"testRoomScene";


    const protosPath = path.resolve(__dirname, 'proto');

    ExpressApp.set("protosPath", protosPath);

    var grpcServices = new Map(); // Mapa de stubs para poder ejecutar los RPC. (e.g. grpcServices["service<NombreServicio>"]
}


// Terminate on Ctrl+C
process.on('SIGINT', () => {
    global.server.close()
});


module.exports.app = ExpressApp;
module.exports.server = global.server;