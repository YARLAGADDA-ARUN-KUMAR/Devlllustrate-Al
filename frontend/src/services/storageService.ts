import type { IllustrationCreation } from '../types';

const DB_NAME = 'devillustrate_db';
const DB_VERSION = 1;
const STORE_NAME = 'creations';
const LEGACY_LOCALSTORAGE_KEY = 'devillustrate_creations_v1';

/**
 * Open or initialize IndexedDB for robust large image persistence.
 */
function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB is not supported in this browser environment.'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export const StorageService = {
  /**
   * Retrieve all saved creations from IndexedDB, migrating any legacy localStorage data.
   */
  async getAllCreations(fallbackCreations: IllustrationCreation[] = []): Promise<IllustrationCreation[]> {
    try {
      const db = await openDatabase();
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.getAll();

      const items: IllustrationCreation[] = await new Promise((resolve, reject) => {
        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => reject(request.error);
      });

      // If IndexedDB has records, return sorted newest first
      if (items.length > 0) {
        return items.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      }

      // Check legacy localStorage for existing creations to migrate
      let legacyItems: IllustrationCreation[] = [];
      try {
        const raw = localStorage.getItem(LEGACY_LOCALSTORAGE_KEY);
        if (raw) {
          legacyItems = JSON.parse(raw);
        }
      } catch (e) {
        console.warn('Could not read legacy localStorage data', e);
      }

      const initialToSeed = legacyItems.length > 0 ? legacyItems : fallbackCreations;

      // Migrate to IndexedDB
      if (initialToSeed.length > 0) {
        const writeTx = db.transaction(STORE_NAME, 'readwrite');
        const writeStore = writeTx.objectStore(STORE_NAME);
        for (const item of initialToSeed) {
          writeStore.put(item);
        }
        await new Promise((resolve) => {
          writeTx.oncomplete = resolve;
        });
      }

      return initialToSeed;
    } catch (err) {
      console.warn('IndexedDB unavailable, falling back to localStorage/initial data', err);
      try {
        const saved = localStorage.getItem(LEGACY_LOCALSTORAGE_KEY);
        if (saved) return JSON.parse(saved);
      } catch {
        // ignore
      }
      return fallbackCreations;
    }
  },

  /**
   * Save or update a creation in IndexedDB.
   */
  async saveCreation(creation: IllustrationCreation): Promise<void> {
    try {
      const db = await openDatabase();
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.put(creation);
      await new Promise((resolve, reject) => {
        tx.oncomplete = resolve;
        tx.onerror = () => reject(tx.error);
      });
    } catch (err) {
      console.error('Failed to save creation to IndexedDB', err);
      // Fallback: save metadata to localStorage if possible
      try {
        const existingRaw = localStorage.getItem(LEGACY_LOCALSTORAGE_KEY);
        const list: IllustrationCreation[] = existingRaw ? JSON.parse(existingRaw) : [];
        const filtered = list.filter((c) => c.id !== creation.id);
        // Avoid localStorage quota crash by truncating dataUrl if needed
        const safeItem = { ...creation };
        if (safeItem.imageDataUrl && safeItem.imageDataUrl.length > 500000) {
          safeItem.imageDataUrl = '';
        }
        localStorage.setItem(LEGACY_LOCALSTORAGE_KEY, JSON.stringify([safeItem, ...filtered]));
      } catch (e) {
        console.error('LocalStorage fallback also failed', e);
      }
    }
  },

  /**
   * Delete a creation by ID.
   */
  async deleteCreation(id: string): Promise<void> {
    try {
      const db = await openDatabase();
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.delete(id);
      await new Promise((resolve, reject) => {
        tx.oncomplete = resolve;
        tx.onerror = () => reject(tx.error);
      });
    } catch (err) {
      console.error('Failed to delete creation from IndexedDB', err);
    }
  },

  /**
   * Clear all stored creations.
   */
  async clearAllCreations(): Promise<void> {
    try {
      const db = await openDatabase();
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.clear();
      await new Promise((resolve, reject) => {
        tx.oncomplete = resolve;
        tx.onerror = () => reject(tx.error);
      });
      localStorage.removeItem(LEGACY_LOCALSTORAGE_KEY);
    } catch (err) {
      console.error('Failed to clear IndexedDB', err);
      localStorage.removeItem(LEGACY_LOCALSTORAGE_KEY);
    }
  },
};
