/*
 * Avisos de novo agendamento no navegador. Funciona enquanto a Vello estiver
 * aberta em alguma aba; quando o aviso por e-mail existir, os dois se somam.
 */
const KEY = "vello-browser-notifications";

export function notificationsSupported() {
  return typeof window !== "undefined" && "Notification" in window;
}

export function notificationsEnabled() {
  if (!notificationsSupported() || Notification.permission !== "granted") return false;
  try {
    return localStorage.getItem(KEY) !== "off";
  } catch {
    return true;
  }
}

export function setNotificationsPreference(enabled: boolean) {
  try {
    localStorage.setItem(KEY, enabled ? "on" : "off");
  } catch {
    // Sem armazenamento: vale só para esta sessão.
  }
}

/** Pede permissão ao navegador; devolve true se ficou liberado. */
export async function askNotificationPermission() {
  if (!notificationsSupported()) return false;
  if (Notification.permission === "granted") {
    setNotificationsPreference(true);
    return true;
  }
  if (Notification.permission === "denied") return false;
  const result = await Notification.requestPermission();
  if (result === "granted") setNotificationsPreference(true);
  return result === "granted";
}

export function notifyNewAppointment({ title, body, url }: { title: string; body: string; url: string }) {
  if (!notificationsEnabled()) return;
  try {
    const notification = new Notification(title, { body, icon: "/icon-192.png", tag: "vello-agendamento" });
    notification.onclick = () => {
      window.focus();
      window.location.href = url;
    };
  } catch {
    // Alguns navegadores só permitem avisos via service worker; o aviso
    // dentro do painel continua funcionando.
  }
}
