// Educational JWT simulation only. This is not production security.
// A real JWT implementation requires a trusted backend/server to sign and verify tokens.

const JWT_HEADER = {
  alg: 'HS256',
  typ: 'JWT',
};

function base64UrlEncode(value) {
  return btoa(
    typeof value === 'string' ? value : JSON.stringify(value)
  )
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
}

function base64UrlDecode(value) {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4);
  return atob(padded);
}

export function generateToken(user) {
  const payload = {
    userId: user.userId ?? user.id ?? null,
    name: user.name ?? '',
    email: user.email ?? '',
    role: user.role ?? 'user',
    exp: Math.floor(Date.now() / 1000) + 60 * 60,
  };

  const headerSegment = base64UrlEncode(JWT_HEADER);
  const payloadSegment = base64UrlEncode(payload);
  const signature = 'simulated-signature';

  return `${headerSegment}.${payloadSegment}.${signature}`;
}

export function decodeToken(token) {
  if (!token || typeof token !== 'string') {
    return null;
  }

  const parts = token.split('.');
  if (parts.length !== 3) {
    return null;
  }

  try {
    const payload = JSON.parse(base64UrlDecode(parts[1]));
    return payload;
  } catch (error) {
    return null;
  }
}

export function isTokenValid(token) {
  const decoded = decodeToken(token);

  if (!decoded) {
    return false;
  }

  if (!decoded.exp) {
    return false;
  }

  const now = Math.floor(Date.now() / 1000);
  return decoded.exp > now;
}
