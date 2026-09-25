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

/** Run a promise with a timeout; rejects with a human-readable message on expiry. */
function withTimeout<T>(promise: Promise<T>, ms = 3000): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error('Firestore request timed out, using local storage fallback.'));
    }, ms);

    promise
      .then((res) => { clearTimeout(timer); resolve(res); })
      .catch((err) => { clearTimeout(timer); reject(err); });
  });
}

export function useFirestore() {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  /** Create a new canvas document in Firestore and return its ID. Falls back to localStorage. */
  const createCanvas = useCallback(
    async (canvasName = 'Untitled - Paint'): Promise<string> => {
      setError(null);
      const localId = `canvas_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      const initialData = { version: '6.0.0', objects: [] };

      const localDoc: CanvasDocument = {
        id: localId,
        name: canvasName,
        title: canvasName,
        data: initialData,
        canvasJSON: JSON.stringify(initialData),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Persist locally first so user data is never lost on a network failure
      try {
        localStorage.setItem(LOCAL_STORAGE_PREFIX + localId, JSON.stringify(localDoc));
      } catch (e) {
        console.warn('LocalStorage save error:', e);
      }

      try {
        const docRef = await withTimeout(
          addDoc(collection(db, COLLECTION_NAME), {
            name: canvasName,
            data: initialData,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          }),
          3000
        );

        // Cache under the Firestore ID for future loads
        localStorage.setItem(
          LOCAL_STORAGE_PREFIX + docRef.id,
          JSON.stringify({ ...localDoc, id: docRef.id })
        );
        return docRef.id;
      } catch (err) {
        console.warn('Firestore create failed — falling back to local ID:', err);
        return localId;
      }
    },
    []
  );

  /** Save (update) an existing canvas document. Syncs Firestore with a localStorage backup. */
  const saveCanvas = useCallback(
    async (canvasId: string, payload: { name: string; data: any }): Promise<void> => {
      try {
        setIsSaving(true);
        setError(null);

        const dataObject =
          typeof payload.data === 'string' ? JSON.parse(payload.data) : payload.data;
        const jsonString =
          typeof payload.data === 'string' ? payload.data : JSON.stringify(payload.data);

        // Update localStorage backup first
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

        // Sync to Firestore (best-effort)
        try {
          await withTimeout(
            setDoc(
              doc(db, COLLECTION_NAME, canvasId),
              { name: payload.name, data: dataObject, updatedAt: serverTimestamp() },
              { merge: true }
            ),
            3500
          );
        } catch (firestoreErr) {
          console.warn('Firestore sync failed — canvas is safe in localStorage:', firestoreErr);
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

  /** Load a canvas document by ID. Tries Firestore first, falls back to localStorage. */
  const loadCanvas = useCallback(
    async (canvasId: string): Promise<CanvasDocument | null> => {
      try {
        setError(null);

        // Attempt Firestore load with timeout
        try {
          const docSnap = await withTimeout(getDoc(doc(db, COLLECTION_NAME, canvasId)), 3000);

          if (docSnap.exists()) {
            const raw = docSnap.data();
            const canvasData =
              raw.data ||
              (raw.canvasJSON ? JSON.parse(raw.canvasJSON) : { version: '6.0.0', objects: [] });

            const loadedDoc: CanvasDocument = {
              id: docSnap.id,
              name: raw.name || raw.title || 'Untitled - Paint',
              title: raw.name || raw.title || 'Untitled - Paint',
              data: canvasData,
              canvasJSON:
                typeof canvasData === 'string' ? canvasData : JSON.stringify(canvasData),
              createdAt: raw.createdAt?.toDate?.() || new Date(),
              updatedAt: raw.updatedAt?.toDate?.() || new Date(),
            };

            // Update localStorage cache with fresh Firestore data
            localStorage.setItem(LOCAL_STORAGE_PREFIX + canvasId, JSON.stringify(loadedDoc));
            return loadedDoc;
          }
        } catch (firestoreErr) {
          console.warn('Firestore load failed — trying localStorage:', firestoreErr);
        }

        // Fallback: read from localStorage
        const localData = localStorage.getItem(LOCAL_STORAGE_PREFIX + canvasId);
        if (localData) {
          const parsed = JSON.parse(localData);
          const canvasData =
            parsed.data ||
            (parsed.canvasJSON
              ? JSON.parse(parsed.canvasJSON)
              : { version: '6.0.0', objects: [] });

          return {
            id: canvasId,
            name: parsed.name || parsed.title || 'Untitled - Paint',
            title: parsed.name || parsed.title || 'Untitled - Paint',
            data: canvasData,
            canvasJSON:
              typeof canvasData === 'string' ? canvasData : JSON.stringify(canvasData),
            createdAt: parsed.createdAt ? new Date(parsed.createdAt) : new Date(),
            updatedAt: parsed.updatedAt ? new Date(parsed.updatedAt) : new Date(),
          };
        }

        return null; // Not found anywhere
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load canvas';
        setError(message);
        return null;
      }
    },
    []
  );

  return {
    createCanvas,
    saveCanvas,
    loadCanvas,
    isSaving,
    lastSaved,
    error,
  };
}
