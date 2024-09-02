const bodyParser = require('body-parser');
const jwt = require("jsonwebtoken")


const AUTH_HEADER_NAME = "authorization";


/***
 * Express middleware function that intercepts a request and verifies a JWT
 * @param req {Request} the incoming request
 * @param res{Response} the response to generate (here OR in a subsequent step of the request processing)
 * @param next allows the processing of the request to continue
 * @returns {*}
 */
function verifyTokenMiddleware(req, res, next) {


    //Check token is present in request
    if (!AUTH_HEADER_NAME in req.headers) {
        console.log("verifyTokenMiddleware --> Error No auth header provided".red())
        return res.status(400).json({msg: "No authorization header provided"})
    }

    let token = undefined;

    //Parse Token
    try {
        console.log(req.headers)
        const authorizationHeader = req.headers[AUTH_HEADER_NAME]
        console.log(" AuthorizationHeader: " + authorizationHeader)
        token = parseBearer(authorizationHeader);
    } catch (e) {
        console.log("VerifyToken: Error Parsing auth token".red())
        return res.status(403).json({
            msg: "Error parsing authorization token. Forbidden access"
        });
    }


    //Verify token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        req.user = decoded;
    } catch (err) {
        return res.status(401).json({
            msg: "Invalid Token"
        });
    }
    next();
};


/*
* Given a request object, checks wether the request contains a valid JWT token
* and if so, returns the decoded token
 */
function verifyJWT(req) {


    //Check wether token is present in request
    if (!AUTH_HEADER_NAME in req.headers) {
        console.log("NO AUTH HEADER PROVIDED");
        throw new Error("No authorization header provided");
    }

    let token = undefined;

    //Parse Token
    try {
        const authorizationHeader = req.headers[AUTH_HEADER_NAME]
        console.log(" AuthorizationHeader: " + authorizationHeader)
        token = parseBearer(authorizationHeader);

    } catch (e) {
        console.log("VerifyToken: Error Parsing auth token".red())
        throw new Error("Error parsing authorization token. Forbidden access");
    }

    //Verify token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = decoded;
    } catch (err) {
        console.log("Invalid JWT token".red())
        throw new Error("Invalid Token");
    }

    return req.user;


}


/***
 * Takes an Authorization header value as "Bearer <actualToken>" and extracts the token itself from it
 * @param bearer the whole
 * @returns {string}
 */
function parseBearer(bearer) {
    console.log("Trying to parse jwt: " + bearer)
    const [_, token] = bearer.trim().split(" ");
    return token;
};


module.exports = {verifyTokenMiddleware, verifyJWT};