import { supabase } from './supabase.js';

export async function apiRequest(path, options = {}, session = null) {
  const currentSession = session || (await supabase?.auth.getSession())?.data.session;
  const headers = new Headers(options.headers || {});

  if (currentSession?.access_token) {
    headers.set('Authorization', `Bearer ${currentSession.access_token}`);
  }
  if (options.body && !(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  return fetch(path, { ...options, headers });
}

export async function apiJson(path, options = {}, session = null) {
  const response = await apiRequest(path, options, session);
  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(result.error || 'The request could not be completed.');
  }
  return result;
}