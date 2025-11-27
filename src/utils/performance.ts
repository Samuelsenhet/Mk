// Performance optimization utilities för TIDE
import { useState, useEffect, useCallback } from 'react';

// Image lazy loading hook
export function useImageLazyLoading() {
  const [imageCache, setImageCache] = useState<Map<string, string>>(new Map());
  
  const preloadImage = useCallback((url: string) => {
    if (imageCache.has(url)) return imageCache.get(url);
    
    const img = new Image();
    img.src = url;
    img.onload = () => {
      setImageCache(prev => new Map(prev).set(url, url));
    };
    
    return url;
  }, [imageCache]);
  
  return preloadImage;
}

// Profile data caching
export class ProfileCache {
  private cache = new Map<string, any>();
  private expiry = new Map<string, number>();
  private TTL = 5 * 60 * 1000; // 5 minutes
  
  set(key: string, data: any) {
    this.cache.set(key, data);
    this.expiry.set(key, Date.now() + this.TTL);
  }
  
  get(key: string) {
    const expiry = this.expiry.get(key);
    if (!expiry || Date.now() > expiry) {
      this.cache.delete(key);
      this.expiry.delete(key);
      return null;
    }
    return this.cache.get(key);
  }
  
  clear() {
    this.cache.clear();
    this.expiry.clear();
  }
}

export const profileCache = new ProfileCache();

// Debounced search for matches
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Offline state management
export function useOfflineStatus() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOffline;
}