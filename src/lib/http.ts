import type { HTTPErrorResponse } from "./types";

export class ApiError extends Error {
  status: number;
  payload?: unknown;

  constructor(message: string, status: number, payload?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }
}

type Envelope<T> = { status: number; body: T };

function isEnvelope(x: unknown): x is Envelope<unknown> {
  if (!x || typeof x !== "object") return false;
  const o = x as Record<string, unknown>;
  return typeof o.status === "number" && "body" in o;
}

function humanizeStatus(status: number): string {
  switch (status) {
    case 0:
      return "Не удалось подключиться к серверу. Проверьте, что бэкенд запущен и доступен.";
    case 400:
      return "Некорректный запрос. Проверьте введённые данные.";
    case 401:
      return "Вы не авторизованы или введены неверные данные для входа.";
    case 403:
      return "Доступ запрещён.";
    case 404:
      return "Ничего не найдено.";
    case 409:
      return "Такой пользователь уже существует.";
    case 422:
      return "Данные не прошли проверку. Проверьте поля и попробуйте ещё раз.";
    case 429:
      return "Слишком много запросов. Попробуйте чуть позже.";
    case 500:
      return "Ошибка сервера. Попробуйте ещё раз или зайдите позже.";
    case 502:
    case 503:
      return "Сервис временно недоступен. Попробуйте позже.";
    case 504:
      return "Сервер слишком долго отвечает. Попробуйте позже.";
    default:
      return "Произошла ошибка. Попробуйте ещё раз.";
  }
}

function sanitizeBackendMessage(msg: string, status: number): string {
  const m = msg.trim();
  if (!m) return humanizeStatus(status);

  // не показываем пользователю внутренние grpc/технические сообщения
  if (/rpc error|code =|desc =|grpc/i.test(m)) {
    return humanizeStatus(status);
  }

  // если бэк вернул просто "HTTP 500" — превращаем в человеческий текст
  if (/^HTTP\s+\d{3}$/i.test(m)) {
    return humanizeStatus(status);
  }

  return m;
}

function extractErrorMessage(payload: unknown): string | null {
  if (!payload || typeof payload !== "object") return null;

  // { error_message: "..." }
  const o = payload as Partial<HTTPErrorResponse> & { message?: string };
  if (typeof o.error_message === "string") return o.error_message;
  if (typeof o.message === "string") return o.message;

  return null;
}

/**
 * Важно: credentials: "include" — чтобы cookie-сессия ездила туда/сюда.
 *
 * baseUrl:
 * - по умолчанию пусто => запросы идут относительным путём (/api/...)
 * - можно задать VITE_API_BASE_URL если вы НЕ используете прокси
 */
const baseUrl = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? "";

export async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;

  try {
    res = await fetch(`${baseUrl}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers || {}),
      },
      credentials: "include",
    });
  } catch (e) {
    // сетевые ошибки/не запущен бэк/проблемы с прокси
    const msg = e instanceof Error ? e.message : "";
    const base = humanizeStatus(0);
    throw new ApiError(msg ? `${base} (${msg})` : base, 0);
  }

  // 204 No Content
  if (res.status === 204) return undefined as T;

  let data: unknown = undefined;
  const text = await res.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  // Бэкенд иногда оборачивает ответы в { status, body }.
  // Для фронта удобнее всегда работать с самим body.
  const envelope = isEnvelope(data) ? data : null;
  const payload = envelope ? envelope.body : data;

  // ВАЖНО: если бэк использует "envelope status" как настоящий код (даже при HTTP 200),
  // мы должны ориентироваться на него.
  const effectiveStatus = envelope ? envelope.status : res.status;
  const effectiveOk = (effectiveStatus >= 200 && effectiveStatus < 300) && res.ok;

  if (!effectiveOk) {
    const backendMsg = extractErrorMessage(payload);
    const message = backendMsg
      ? sanitizeBackendMessage(backendMsg, effectiveStatus)
      : humanizeStatus(effectiveStatus);

    // Если это неизвестный код — аккуратно добавим код в конце (для дебага),
    // но так, чтобы пользователю было понятно.
    const finalMessage =
      backendMsg ? message : `${message} (код ${effectiveStatus})`;

    throw new ApiError(finalMessage, effectiveStatus, data);
  }

  return payload as T;
}
