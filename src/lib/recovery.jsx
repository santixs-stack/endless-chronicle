// ═══════════════════════════════════════════
//  OFFLINE & API FAILURE RECOVERY
//  Handles:
//  - Network connectivity loss
//  - API key errors
//  - Rate limiting
//  - Server errors
//  - Mid-game disconnects
//  - Auto-retry with backoff
// ═══════════════════════════════════════════

import { useState, useEffect, useCallback, useRef } from 'react';

// ── Error classifier ────────────────────────
export function classifyError(error) {
  const msg = (error?.message || String(error)).toLowerCase();

  if (!navigator.onLine) return {
    type: 'offline',
    title: 'No Internet Connection',
    message: 'Your device is offline. Reconnect and try again.',
    retryable: true,
    delay: 3000,
  };

  if (msg.includes('401') || msg.includes('403') || msg.includes('api key') || msg.includes('authentication')) return {
    type: 'auth',
    title: 'API Key Error',
    message: 'Could not authenticate with the AI. Check your API key in settings.',
    retryable: false,
  };

  if (msg.includes('429') || msg.includes('rate limit') || msg.includes('too many')) return {
    type: 'ratelimit',
    title: 'Too Many Requests',
    message: 'The AI is busy. Waiting a moment then retrying automatically…',
    retryable: true,
    delay: 8000,
  };

  if (msg.includes('529') || msg.includes('overload') || msg.includes('overloaded')) return {
    type: 'overload',
    title: 'AI is Very Busy',
    message: 'The AI is handling too many stories right now. Retrying automatically in a few seconds…',
    retryable: true,
    delay: 6000,
  };

  if (msg.includes('500') || msg.includes('502') || msg.includes('503') || msg.includes('server')) return {
    type: 'server',
    title: 'Server Error',
    message: 'The AI service is having trouble. Retrying in a moment…',
    retryable: true,
    delay: 5000,
  };

  if (msg.includes('timeout') || msg.includes('network') || msg.includes('fetch')) return {
    type: 'network',
    title: 'Connection Problem',
    message: 'Lost connection to the AI. Retrying…',
    retryable: true,
    delay: 3000,
  };

  if (msg.includes('context') || msg.includes('token') || msg.includes('length')) return {
    type: 'context',
    title: 'Story Too Long',
    message: 'This adventure has grown very long. Starting a fresh chapter will help.',
    retryable: false,
  };

  return {
    type: 'unknown',
    title: 'Something Went Wrong',
    message: 'An unexpected error occurred. Try again.',
    retryable: true,
    delay: 2000,
  };
}

// ── Retry with exponential backoff ──────────
export async function withRetry(fn, maxAttempts = 4, baseDelay = 1500) {
  let lastError;
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      const classified = classifyError(err);

      // Don't retry auth errors
      if (!classified.retryable) throw err;

      // Don't retry on last attempt
      if (attempt === maxAttempts - 1) throw err;

      // Exponential backoff with jitter — avoids hammering the API in sync
      const base = classified.delay || baseDelay * Math.pow(2, attempt);
      const jitter = Math.random() * 1000;
      const delay = base + jitter;
      await new Promise(r => setTimeout(r, delay));
    }
  }
  throw lastError;
}

// ── Online/offline detection hook ───────────
export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const goOnline  = () => { setIsOnline(true);   };
    const goOffline = () => { setIsOnline(false);  };

    window.addEventListener('online',  goOnline);
    window.addEventListener('offline', goOffline);
    return () => {
      window.removeEventListener('online',  goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  return isOnline;
}

// ── API call with full recovery ─────────────
// Drop-in wrapper around callAPI that handles
// all failure modes gracefully.
export function useApiWithRecovery() {
  const [failureState, setFailureState] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const abortRef = useRef(null);

  const call = useCallback(async (apiFn, { onSuccess, onError, maxRetries = 2 } = {}) => {
    setFailureState(null);

    // Cancel any in-flight request
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();

    try {
      const result = await withRetry(apiFn, maxRetries + 1);
      setRetryCount(0);
      if (onSuccess) onSuccess(result);
      return result;
    } catch (err) {
      const classified = classifyError(err);
      setFailureState(classified);
      setRetryCount(c => c + 1);
      if (onError) onError(classified, err);
      throw err;
    }
  }, []);

  const retry = useCallback((apiFn, opts) => {
    return call(apiFn, opts);
  }, [call]);

  const dismiss = useCallback(() => setFailureState(null), []);

  return { call, retry, dismiss, failureState, retryCount };
}
