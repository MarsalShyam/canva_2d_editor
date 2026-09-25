import { useState, useCallback } from 'react';
import {
  doc,
  getDoc,
  setDoc,
  addDoc,
  collection,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../services/firebase';
import type { CanvasDocument } from '../types/canvas';

const COLLECTION_NAME = 'canvases';
const LOCAL_STORAGE_PREFIX = 'canvaflow_doc_';

// Helper to run promises with a timeout
function withTimeout<T>(promise: Promise<T>, ms = 3000): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error('Firestore request timed out, using local storage fallback.'));
    }, ms);

    promise
      .then((res) => {
        clearTimeout(timer);
        resolve(res);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
}

export function useFirestore() {
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  /* Create a new canvas document in Firestore and return its ID.*/
  const createCanvas = useCallback(
    async (canvasName = 'Untitled - Paint'): Promise<string> => {
      setError(null);
      const localId = `canvas_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      const initialData = { version: '6.0.0', objects: [] };

      // Save locally first so user data is never lost
      const localDoc: CanvasDocument = {
        id: localId,
        name: canvasName,
        title: canvasName,
        data: initialData,
        canvasJSON: JSON.stringify(initialData),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      try {
        localStorage.setItem(LOCAL_STORAGE_PREFIX + localId, JSON.stringify(localDoc));
      } catch (e) {
        console.warn('LocalStorage save error:', e);
      }

      // Try saving to Firestore with timeout
      try {
        const firestorePromise = addDoc(collection(db, COLLECTION_NAME), {
          name: canvasName,
          data: initialData,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        const docRef = await withTimeout(firestorePromise, 3000);

        // Also cache under the Firestore ID locally
        localStorage.setItem(
          LOCAL_STORAGE_PREFIX + docRef.id,
          JSON.stringify({ ...localDoc, id: docRef.id })
        );
        return docRef.id;
      } catch (err) {
        console.warn('Firestore create fallback to local:', err);
        return localId;
      }
    },
    []
  );

  /* Saving | updating an existing canvas document by ID.*/
  const saveCanvas = useCallback(
    async (canvasId: string, payload: { name: string; data: any }): Promise<void> => {
      try {
        setIsSaving(true);
        setError(null);

        const dataObject = typeof payload.data === 'string' ? JSON.parse(payload.data) : payload.data;
        const jsonString = typeof payload.data === 'string' ? payload.data : JSON.stringify(payload.data);

        // Update local storage backup
        try {
          const cached = localStorage.getItem(LOCAL_STORAGE_PREFIX + canvasId);
          const parsed = cached ? JSON.parse(cached) : {};
          const updated: CanvasDocument = {
            ...parsed,
            id: canvasId,
            name: payload.name,
            title: payload.name,
            data: dataObject,
            canvasJSON: jsonString,
            updatedAt: new Date().toISOString(),
          };
          localStorage.setItem(LOCAL_STORAGE_PREFIX + canvasId, JSON.stringify(updated));
        } catch (e) {
          console.warn('LocalStorage update warning:', e);
        }

        // Sync to Firestore
        try {
          const docRef = doc(db, COLLECTION_NAME, canvasId);
          const firestorePromise = setDoc(
            docRef,
            {
              name: payload.name,
              data: dataObject,
              updatedAt: serverTimestamp(),
            },
            { merge: true }
          );
          await withTimeout(firestorePromise, 3500);
        } catch (firestoreErr) {
          console.warn('Firestore sync failed, saved to localStorage:', firestoreErr);
        }

        setLastSaved(new Date());
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to save canvas';
        setError(message);
        throw new Error(message);
      } finally {
        setIsSaving(false);
      }
    },
    []
  );

  /* Loading a canvas document by ID. Returns null if document does not exist.*/
  const loadCanvas = useCallback(
    async (canvasId: string): Promise<CanvasDocument | null> => {
      try {
        setIsLoading(true);
        setError(null);

        // Try Firestore first with a 3-second timeout
        try {
          const docRef = doc(db, COLLECTION_NAME, canvasId);
          const docSnap = await withTimeout(getDoc(docRef), 3000);

          if (docSnap.exists()) {
            const raw = docSnap.data();
            const canvasData = raw.data || (raw.canvasJSON ? JSON.parse(raw.canvasJSON) : { version: '6.0.0', objects: [] });
            const loadedDoc: CanvasDocument = {
              id: docSnap.id,
              name: raw.name || raw.title || 'Untitled - Paint',
              title: raw.name || raw.title || 'Untitled - Paint',
              data: canvasData,
              canvasJSON: typeof canvasData === 'string' ? canvasData : JSON.stringify(canvasData),
              createdAt: raw.createdAt?.toDate?.() || new Date(),
              updatedAt: raw.updatedAt?.toDate?.() || new Date(),
            };
            localStorage.setItem(LOCAL_STORAGE_PREFIX + canvasId, JSON.stringify(loadedDoc));
            return loadedDoc;
          }
        } catch (firestoreErr) {
          console.warn('Firestore load error/timeout, trying localStorage:', firestoreErr);
        }

        // Fallback to local storage
        const localData = localStorage.getItem(LOCAL_STORAGE_PREFIX + canvasId);
        if (localData) {
          const parsed = JSON.parse(localData);
          const canvasData = parsed.data || (parsed.canvasJSON ? JSON.parse(parsed.canvasJSON) : { version: '6.0.0', objects: [] });
          return {
            id: canvasId,
            name: parsed.name || parsed.title || 'Untitled - Paint',
            title: parsed.name || parsed.title || 'Untitled - Paint',
            data: canvasData,
            canvasJSON: typeof canvasData === 'string' ? canvasData : JSON.stringify(canvasData),
            createdAt: parsed.createdAt ? new Date(parsed.createdAt) : new Date(),
            updatedAt: parsed.updatedAt ? new Date(parsed.updatedAt) : new Date(),
          };
        }

        // If not found in either Firestore or LocalStorage
        return null;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load canvas';
        setError(message);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return {
    createCanvas,
    saveCanvas,
    loadCanvas,
    isSaving,
    isLoading,
    lastSaved,
    error,
  };
}
