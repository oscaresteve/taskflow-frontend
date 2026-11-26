export function setCookie(name: string, value: string, days = 365) {
  document.cookie = `${name}=${value}; path=/; max-age=${days * 86400}; SameSite=Lax`;
}
