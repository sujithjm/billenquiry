// Generate access and refresh tokens (Rhino-compatible)
var secureRandom = new Packages.java.security.SecureRandom();
var JSONObject = Packages.org.json.JSONObject;

function generateToken(length) {
    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
    var buffer = new java.lang.StringBuilder(length);
    for (var i = 0; i < length; i++) {
        var index = secureRandom.nextInt(chars.length);
        buffer.append(chars.charAt(index));
    }
    return buffer.toString();
}

var accessToken = generateToken(64);
var refreshToken = generateToken(64);
var timestamp = new Date().getTime();
var expiresAt = timestamp + (3600 * 1000);

var tokenData = new JSONObject();
tokenData.put("client_id", context.getVariable("client_id"));
tokenData.put("scope", context.getVariable("scope"));
tokenData.put("created_at", timestamp);
tokenData.put("expires_at", expiresAt);
tokenData.put("refresh_token", refreshToken);

tokenData.put("access_token", accessToken);

context.setVariable("access_token", accessToken);
context.setVariable("refresh_token", refreshToken);
context.setVariable("token_lookup_key", "Bearer " + accessToken);
context.setVariable("token_data", tokenData.toString());
