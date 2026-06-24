export function decodeJwt(token) {
  try {
    const payload = token.split(".")[1];

    const decodedPayload = atob(
      payload.replace(/-/g, "+").replace(/_/g, "/")
    );

    return JSON.parse(decodedPayload);
  } catch {
    return null;
  }
}

export function getEmailFromToken(token) {
  const decoded = decodeJwt(token);

  return decoded?.sub || "";
}

export function isTokenExpired(token) {
  const decoded = decodeJwt(token);

  if (!decoded?.exp) return true;

  const expirationDate = decoded.exp * 1000;

  return Date.now() >= expirationDate;
}