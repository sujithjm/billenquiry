// Rhino-compatible PKCE validation utilities
function raiseInvalidRequest(message) {
    context.setVariable("pkce.error.type", "InvalidRequest");
    context.setVariable("error_description", message);
    throw new Error("InvalidRequest");
}

if (context.removeVariable) {
    context.removeVariable("pkce.error.type");
}

var clientId = context.getVariable("client_id");
var redirectUri = context.getVariable("redirect_uri");
var responseType = context.getVariable("response_type");
var codeChallenge = context.getVariable("code_challenge");
var codeChallengeMethod = context.getVariable("code_challenge_method");

if (!clientId || !redirectUri || !responseType) {
    raiseInvalidRequest("Missing required parameters: client_id, redirect_uri, or response_type");
}

if (responseType !== "code") {
    raiseInvalidRequest("Unsupported response_type. Must be 'code'");
}

if (!codeChallenge) {
    raiseInvalidRequest("Missing code_challenge parameter (PKCE required)");
}

if (!codeChallengeMethod) {
    codeChallengeMethod = "plain";
    context.setVariable("code_challenge_method", codeChallengeMethod);
}

if (codeChallengeMethod !== "S256" && codeChallengeMethod !== "plain") {
    raiseInvalidRequest("Invalid code_challenge_method. Must be 'S256' or 'plain'");
}

var base64UrlPattern = /^[A-Za-z0-9\-\._~]+$/;
if (!base64UrlPattern.test(codeChallenge)) {
    raiseInvalidRequest("Invalid code_challenge format");
}

if (codeChallenge.length < 43 || codeChallenge.length > 128) {
    raiseInvalidRequest("code_challenge must be between 43 and 128 characters");
}
