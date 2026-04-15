import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { storage, auth } from "./firebase";

export const storageService = {
  async uploadQRImage(file: File): Promise<string> {
    if (!auth.currentUser) throw new Error("User must be authenticated to upload images");
    
    // Create a unique filename
    const fileExtension = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExtension}`;
    const storageRef = ref(storage, `users/${auth.currentUser.uid}/qr-images/${fileName}`);
    
    try {
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  },

  async deleteQRImage(imageUrl: string): Promise<void> {
    if (!auth.currentUser) return;
    
    try {
      // Only delete if it's a firebase storage URL and belongs to the user
      if (imageUrl.includes('firebasestorage.googleapis.com') && imageUrl.includes(auth.currentUser.uid)) {
        const storageRef = ref(storage, imageUrl);
        await deleteObject(storageRef);
      }
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  }
};
