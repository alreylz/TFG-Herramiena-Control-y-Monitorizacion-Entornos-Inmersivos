const express = require("express");
const path = require("path");
const Services_REST_API = require("./Grpc/rest/ServiceRouter");
const RPC_REST_API = require("./Grpc/rest/RPCs");
const ExpressDebug = require("./shared/utils/ExpressDebug");


/***
 * @fileOverview Contains the express server configuration
 *  - Where to find views, static folders, CORS
 *  - Connects all routes to be deployed and accessible in the application
 * @param options
 * @returns {*|Express}
 */
module.exports = function (options) {

    /* Third party imports */
    const express = require('express');
    const path = require("path");
    const app = express();

    /* My imports */
    const {getApplicationRoot, getIPAddress} = require("./shared/Basics.js");

    // Configuraciones y variables globales
    app.set("applicationRoot", getApplicationRoot());
    app.applicationRoot = getApplicationRoot();
    // Configuración EJS
    app.set("view engine", "ejs")
    app.set('views', path.join(app.applicationRoot, "client", "views"));

    // Aliases para acceso a archivos estáticos
    app.use(express.static(path.join(app.applicationRoot, "client", "static")));
    app.use('/cli-js/', express.static(path.join(app.applicationRoot, "client", "js")));
    app.use("/style/", express.static(path.join(app.applicationRoot, "client", "style", "css")));
    app.use('/images/', express.static(path.join(app.applicationRoot, "client", "static", "images")));
    app.use('/fonts/', express.static(path.join(app.applicationRoot, "client", "static", "fonts")));
    app.use('/docs/', express.static(path.join(app.applicationRoot, "client", "static", "docs")));
    app.use('/icons/', express.static(path.join(app.applicationRoot, "client", "static", "icons")));
    app.use('/favicon.ico', express.static(path.join(app.applicationRoot, "client", "static", "images", "favicon.svg")));

    /* Middlewares globales */
    app.use(express.urlencoded({extended: true}));
    app.use(express.json());
    const cors = require('cors');
    // Configuración CORS middleware
    const corsOptions = {
        origin: '*', // Change this to specify specific origins in production
        methods: ['OPTIONS', 'GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    };
    app.use(cors(corsOptions));


    // Sesiones
    /**
     * 'express-session' provides an abstraction to achieve stateful HTTP through cookies that travel along with each request.
     *  A given cookie contains an id that can have a set of data associated to it in the server
     */
        // Creates a property in the request
    const session = require('express-session');

    // Allows to store the session data in a MongoDB database
    const MongoStore = require('connect-mongo');

    app.use(session({
        //TODO: make the name of the cookie configurable
        name: "ixci",
        secret: "@changeme" /* used to sign cookies (in order to detect tampering) */,
        resave: true,
        saveUninitialized: false,
        cookie: {maxAge: 30 /*min*/ * 60 * 1000}
        ,
        store: MongoStore.create(
            {
                mongoUrl: `mongodb://${options.MONGO_HOST}:${options.MONGO_PORT}/${options.MONGO_DB_NAME}`,
                transformId: (id) => {
                    return id;
                }
            }
        )
    }))
    //-------------------------------------
    //----------FRONT ENDPOINTS------------
    //-------------------------------------
    /* Endpoints related to sign in and sign up in the application */
    const SessionAuth = require("./Main/routes/SessionAuth")(options);
    app.use("/", SessionAuth);

    console.log(getIPAddress())

    let JSHelpers = require("./shared/JSHelpers.js");
    console.log(options)


    //--------------------------
    //----------JWT------------
    //--------------------------
    const JWT = require("./Main/routes/JWTAuth");
    app.use("/api/v1", JWT);

    //--------------------------
    //----------APIS------------
    //--------------------------
    const Users_REST_API = require("./Main/rest/Users");
    app.use("/api/v1", Users_REST_API);
    const Packages_REST_API = require("./Grpc/rest/Packages")
    app.use("/api/v1", Packages_REST_API);
    const Services_REST_API = require("./Grpc/rest/ServiceRouter")
    app.use("/api/v1", Services_REST_API);
    const RPC_REST_API = require("./Grpc/rest/RPCs")
    app.use("/api/v1", RPC_REST_API);
    const MessageRouter = require("./Grpc/rest/Messages")
    app.use("/api/v1", MessageRouter);

    const ProtosRESTAPI = require("./Grpc/rest/ProtosRouter");
    app.use("/", ProtosRESTAPI);


    /* Endpoints related to showing views to the user */
    const ClientRouter = require("./Main/routes/ClientRouter")
    app.use("/", ClientRouter);
    /* Endpoints related to taking user input and executing operations (e.g., creating rpcs, messages, etc.) */
    const OpsRouter = require("./Main/routes/OpsRouter")
    app.use("/", OpsRouter);

    const PubSubAPI = require("./Main/rest/PubSub");
    app.use("/", PubSubAPI);
    const ExpressDebug = require('./shared/utils/ExpressDebug');
    console.log("AAAAAAAAAAAAAAAAAAAAAA")
    //console.log(ExpressDebug.showRouterEndpoints(Users_REST_API))

    ExpressDebug.test(Users_REST_API)
    // Server info endpoint (used from the client javascript to check configuration parameters of the server)
    const ServerInfo = require("./Main/routes/ServerInfo")(options);

    app.use("/info", ServerInfo);


    console.group("AVAILABLE ENDPOINTS:")
    ExpressDebug.showAllExpressEndpoints(app);
    console.groupEnd()


    return app;
}