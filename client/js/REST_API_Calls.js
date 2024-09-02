/**
 * @fileOverview Code for helper functions that perform my own REST API calls
 */


import {GetRequestAsyncJWT, PostRequestAsyncJson, RequestAsync} from "./Shared/Web_Requests.js";


const REST_BASE_URI = "http://localhost:3000/api/v1/"


// export class REST_Call{
//
// }


export async function getAvailableMessages() {
    const allMessages = await GetRequestAsyncJWT("http://localhost:3000/api/v1/messages", localStorage.getItem("ixci-jwt"));
    console.log("MESSAGES", allMessages);
    return allMessages;
}

export async function getAvailableServices() {
    //Makes request to Services API to get available services
    const allServices = await GetRequestAsyncJWT("http://localhost:3000/api/v1/services", localStorage.getItem("ixci-jwt"));
    console.log("SERVICES", allServices);
    return allServices;
}

export async function getAvailablePackages() {
    const packages = await GetRequestAsyncJWT("http://localhost:3000/api/v1/services", localStorage.getItem("ixci-jwt"));
    console.log("SERVICES", packages);
    return packages;
}


export async function getAvailableRPCs() {
    const allRPCs = await GetRequestAsyncJWT("http://localhost:3000/api/v1/rpcs", localStorage.getItem("ixci-jwt"));
    console.log("RPCs", allRPCs);
    return allRPCs;
}


export async function removeRPC(rpcId) {
    await RequestAsync("http://localhost:3000/api/v1/rpcs/" + rpcId, "DELETE", {
        jwtToken: localStorage.getItem("ixci-jwt"),
        expect: "json"
    })
}

// POST

export async function addService(service) {
    //Makes request to Services API to get available services
    const response = await RequestAsync("http://localhost:3000/api/v1/services", "POST", {
        jwtToken: localStorage.getItem("ixci-jwt"),
        body: service
    });
    console.log("RESPONSE from POST to /services", response);
    return response;
}

export async function commitPackage(grpcPackage) {
    //Makes request to Services API to get available services
    const response = await RequestAsync("http://localhost:3000/api/v1/packages", "POST", {
        jwtToken: localStorage.getItem("ixci-jwt"),
        body: grpcPackage.serialize()
    });
    console.log("RESPONSE from POST to /pacakges", response);
    return response;
}






