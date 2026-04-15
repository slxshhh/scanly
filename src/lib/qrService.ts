import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  query, 
  orderBy, 
  serverTimestamp,
  Timestamp
} from "firebase/firestore";
import { db, auth } from "./firebase";
import { QRState } from "@/src/types/qr";

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export interface SavedQRCode {
  id: string;
  name: string;
  options: QRState;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export const qrService = {
  async saveQRCode(name: string, options: QRState) {
    if (!auth.currentUser) throw new Error("User must be authenticated to save QR codes");
    
    const path = `users/${auth.currentUser.uid}/qrcodes`;
    try {
      const docRef = await addDoc(collection(db, path), {
        name,
        options,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  },

  async updateQRCode(qrId: string, name: string, options: QRState) {
    if (!auth.currentUser) throw new Error("User must be authenticated to update QR codes");
    
    const path = `users/${auth.currentUser.uid}/qrcodes/${qrId}`;
    try {
      await updateDoc(doc(db, path), {
        name,
        options,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  },

  async deleteQRCode(qrId: string) {
    if (!auth.currentUser) throw new Error("User must be authenticated to delete QR codes");
    
    const path = `users/${auth.currentUser.uid}/qrcodes/${qrId}`;
    try {
      await deleteDoc(doc(db, path));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  },

  async getSavedQRCodes(): Promise<SavedQRCode[]> {
    if (!auth.currentUser) return [];
    
    const path = `users/${auth.currentUser.uid}/qrcodes`;
    try {
      const q = query(collection(db, path), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as SavedQRCode[];
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
      return [];
    }
  }
};
