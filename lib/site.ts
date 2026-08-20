/** Адрес сайта — нужен, чтобы собирать ссылки для писем. */
export function siteOrigin() {
  return (process.env.SITE_ORIGIN || "http://localhost:3010").replace(/\/$/, "");
}

export function orderUrl(token: string) {
  return `${siteOrigin()}/order/${token}`;
}

export function signupUrl(token: string) {
  return `${siteOrigin()}/signup/${token}`;
}
