export interface AuthUser {
  name: string;
  email: string;
}

const SESSION_KEY = 'vello_demo_session';

const wait = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));

export function getSession(): AuthUser | null {
  try {
    const value = localStorage.getItem(SESSION_KEY);
    return value ? JSON.parse(value) as AuthUser : null;
  } catch {
    return null;
  }
}

export async function login(email: string, _password: string): Promise<AuthUser> {
  await wait();
  const user = { name: email.split('@')[0] || 'Corretor', email };
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  return user;
}

export async function register(name: string, email: string, _password: string): Promise<AuthUser> {
  await wait(700);
  const user = { name, email };
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  return user;
}

export async function continueWithGoogle(): Promise<AuthUser> {
  await wait(700);
  const user = { name: 'Corretor Vello', email: 'corretor@vello.app' };
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  return user;
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
}
