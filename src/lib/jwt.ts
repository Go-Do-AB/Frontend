type JwtPayload = Record<string, unknown>;

export function parseJwtPayload(token: string): JwtPayload | null {
  try {
    return JSON.parse(atob(token.split(".")[1])) as JwtPayload;
  } catch {
    return null;
  }
}

export function getStoredJwtPayload(): JwtPayload | null {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem("accessToken");
  if (!token) return null;
  return parseJwtPayload(token);
}

export function getRolesFromPayload(payload: JwtPayload): string[] {
  const roles =
    (payload.role as string | string[] | undefined) ||
    (payload[
      "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
    ] as string | string[] | undefined) ||
    [];
  return Array.isArray(roles) ? roles : [roles];
}

export function getUserIdFromPayload(payload: JwtPayload): string | null {
  return (
    (payload.sub as string | undefined) ||
    (payload[
      "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
    ] as string | undefined) ||
    (payload.nameid as string | undefined) ||
    null
  );
}

export function getEmailFromPayload(payload: JwtPayload): string | null {
  return (
    (payload.email as string | undefined) ||
    (payload[
      "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
    ] as string | undefined) ||
    null
  );
}
