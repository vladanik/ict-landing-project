const ADMIN_SESSION_KEY = 'ictAdminPanelSession';
const LEGACY_ACCESS_KEY = 'ictAdminPanelAccessGranted';
const ADMIN_SESSION_DURATION_MS = 2 * 60 * 60 * 1000;

const getConfiguredPasswordHash = () =>
  (process.env.REACT_APP_ADMIN_PANEL_PASSWORD_HASH || '').trim().toLowerCase();

const bytesToHex = (bytes) =>
  Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');

// This is only a lightweight frontend gate. It does not provide real production security.
// Backend authentication and authorization are required to protect admin APIs properly.
export const hashString = async (value) => {
  const encodedValue = new TextEncoder().encode(value);
  const digest = await window.crypto.subtle.digest('SHA-256', encodedValue);
  return bytesToHex(new Uint8Array(digest));
};

export const isAdminPasswordConfigured = () => Boolean(getConfiguredPasswordHash());

export const validateAdminPassword = async (password) => {
  const configuredHash = getConfiguredPasswordHash();

  if (!configuredHash) {
    return false;
  }

  const submittedHash = await hashString(password);
  return submittedHash === configuredHash;
};

const createSessionId = () => {
  const sessionBytes = new Uint8Array(16);
  window.crypto.getRandomValues(sessionBytes);
  return bytesToHex(sessionBytes);
};

export const createAdminSession = () => {
  const session = {
    authenticated: true,
    expiresAt: Date.now() + ADMIN_SESSION_DURATION_MS,
    sessionId: createSessionId(),
  };

  sessionStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
  sessionStorage.removeItem(LEGACY_ACCESS_KEY);
  return session;
};

export const getAdminSession = () => {
  const storedSession = sessionStorage.getItem(ADMIN_SESSION_KEY);

  if (!storedSession) {
    return null;
  }

  try {
    return JSON.parse(storedSession);
  } catch (error) {
    console.error('Unable to parse admin session:', error);
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    return null;
  }
};

export const clearAdminSession = () => {
  sessionStorage.removeItem(ADMIN_SESSION_KEY);
  sessionStorage.removeItem(LEGACY_ACCESS_KEY);
};

export const isAdminSessionValid = () => {
  sessionStorage.removeItem(LEGACY_ACCESS_KEY);

  const session = getAdminSession();

  if (
    session?.authenticated !== true ||
    typeof session?.expiresAt !== 'number' ||
    session?.expiresAt <= Date.now() ||
    typeof session?.sessionId !== 'string'
  ) {
    clearAdminSession();
    return false;
  }

  return true;
};
