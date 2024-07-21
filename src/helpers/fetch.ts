import { TDataOrError } from './types';

export const ABORTED_STATUS_CODE = -100;

export const fetch2 = async <T>(url: string): Promise<TDataOrError<T>> => {
  try {
    const res = await fetch(url);

    if (res.ok) {
      const data = (await res.json()) as T;
      return { ok: true, statusCode: res.status, data };
    }

    return { ok: false, statusCode: res.status, error: await res.text() };
  } catch (e) {
    if (e instanceof DOMException && e.name === 'AbortError') {
      return { ok: false, statusCode: ABORTED_STATUS_CODE, error: 'Request aborted' };
    }

    return { ok: false, statusCode: -1, error: e instanceof Error ? e.message : 'Unknown error' };
  }
};
