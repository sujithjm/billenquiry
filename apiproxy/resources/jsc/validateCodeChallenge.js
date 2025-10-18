// Validate PKCE code_verifier against code_challenge (Rhino-compatible)
function raiseInvalidRequest(message) {
    context.setVariable("pkce.error.type", "InvalidRequest");
    context.setVariable("error_description", message);
    throw new Error("InvalidRequest");
}

function raiseInvalidGrant(message) {
    context.setVariable("pkce.error.type", "InvalidGrant");
    context.setVariable("error_description", message);
    throw new Error("InvalidGrant");
}

if (context.removeVariable) {
    context.removeVariable("pkce.error.type");
}

var authCodeData = context.getVariable("auth_code_data");
var codeVerifier = context.getVariable("code_verifier");
var grantType = context.getVariable("grant_type");
var clientId = context.getVariable("client_id");
var redirectUri = context.getVariable("redirect_uri");

if (grantType !== "authorization_code") {
    raiseInvalidRequest("Unsupported grant_type");
}

if (!authCodeData) {
    raiseInvalidGrant("Invalid or expired authorization code");
}

var JSONObject = Packages.org.json.JSONObject;
var codeData = new JSONObject(authCodeData);

var now = new Date().getTime();
if (now > codeData.getLong("expires_at")) {
    raiseInvalidGrant("Authorization code has expired");
}

if (clientId !== codeData.getString("client_id")) {
    raiseInvalidGrant("Client ID mismatch");
}

if (redirectUri !== codeData.getString("redirect_uri")) {
    raiseInvalidGrant("Redirect URI mismatch");
}

if (!codeVerifier) {
    raiseInvalidRequest("Missing code_verifier");
}

var base64UrlPattern = /^[A-Za-z0-9\-\._~]+$/;
if (!base64UrlPattern.test(codeVerifier) || codeVerifier.length < 43 || codeVerifier.length > 128) {
    raiseInvalidRequest("Invalid code_verifier format or length");
}

var codeChallenge = codeData.getString("code_challenge");
var challengeMethod = codeData.getString("code_challenge_method");
var computedChallenge;

if (challengeMethod === "S256") {
    var MessageDigest = Packages.java.security.MessageDigest;
    var md = MessageDigest.getInstance("SHA-256");
    var verifierBytes = new java.lang.String(codeVerifier).getBytes("UTF-8");
    var hashBytes = md.digest(verifierBytes);
    var Base64 = Packages.org.apache.commons.codec.binary.Base64;
    computedChallenge = Base64.encodeBase64URLSafeString(hashBytes);
} else {
    computedChallenge = codeVerifier;
}

if (computedChallenge !== codeChallenge) {
    raiseInvalidGrant("Code verifier validation failed");
}

context.setVariable("scope", codeData.getString("scope"));
