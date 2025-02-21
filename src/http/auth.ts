import Cookies from "js-cookie";

export function getToken(): string | null {
  return Cookies.get("token") || null;
}
