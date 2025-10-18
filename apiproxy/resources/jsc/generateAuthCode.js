// Generate secure authorization code (Rhino-compatible)
var secureRandom = new Packages.java.security.SecureRandom();
var JSONObject = Packages.org.json.JSONObject;

function generateRandomString(length) {
    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
    var buffer = new java.lang.StringBuilder(length);
    for (var i = 0; i < length; i++) {
        var index = secureRandom.nextInt(chars.length);
        buffer.append(chars.charAt(index));
    }
    return buffer.toString();
}

var authCode = generateRandomString(32);
var timestamp = new Date().getTime();
var expiresAt = timestamp + (600 * 1000);

var codeData = new JSONObject();
codeData.put("client_id", context.getVariable("client_id"));
codeData.put("redirect_uri", context.getVariable("redirect_uri"));
codeData.put("code_challenge", context.getVariable("code_challenge"));
codeData.put("code_challenge_method", context.getVariable("code_challenge_method"));
codeData.put("scope", context.getVariable("scope") || "default");
codeData.put("created_at", timestamp);
codeData.put("expires_at", expiresAt);

context.setVariable("authorization_code", authCode);
context.setVariable("auth_code_data", codeData.toString());
