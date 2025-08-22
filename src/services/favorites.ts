import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  arrayUnion, 
  arrayRemove 
} from 'firebase/firestore';
import { db } from '../config/firebase';
import type { User } from 'firebase/auth';

export interface UserFavorites {
  userId: string;
  favorites: string[];
  updatedAt: Date;
}

export const getUserFavorites = async (user: User): Promise<string[]> => {
  try {
    const userDoc = await getDoc(doc(db, 'userFavorites', user.uid));
    if (userDoc.exists()) {
      const data = userDoc.data() as UserFavorites;
      return data.favorites || [];
    }
    return [];
  } catch (error) {
    console.error('Error getting user favorites:', error);
    return [];
  }
};

export const addFavorite = async (user: User, locationId: string): Promise<boolean> => {
  try {
    const userDocRef = doc(db, 'userFavorites', user.uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      // Update existing document
      await updateDoc(userDocRef, {
        favorites: arrayUnion(locationId),
        updatedAt: new Date()
      });
    } else {
      // Create new document
      await setDoc(userDocRef, {
        userId: user.uid,
        favorites: [locationId],
        updatedAt: new Date()
      });
    }
    return true;
  } catch (error) {
    console.error('Error adding favorite:', error);
    return false;
  }
};

export const removeFavorite = async (user: User, locationId: string): Promise<boolean> => {
  try {
    const userDocRef = doc(db, 'userFavorites', user.uid);
    await updateDoc(userDocRef, {
      favorites: arrayRemove(locationId),
      updatedAt: new Date()
    });
    return true;
  } catch (error) {
    console.error('Error removing favorite:', error);
    return false;
  }
};

export const syncFavorites = async (user: User, localFavorites: string[]): Promise<string[]> => {
  try {
    // Get cloud favorites
    const cloudFavorites = await getUserFavorites(user);
    
    // Merge local and cloud favorites
    const mergedFavorites = [...new Set([...localFavorites, ...cloudFavorites])];
    
    // Update cloud with merged favorites
    const userDocRef = doc(db, 'userFavorites', user.uid);
    await setDoc(userDocRef, {
      userId: user.uid,
      favorites: mergedFavorites,
      updatedAt: new Date()
    });
    
    return mergedFavorites;
  } catch (error) {
    console.error('Error syncing favorites:', error);
    return localFavorites;
  }
};