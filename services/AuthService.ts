import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  User,
  signOut,
  updatePassword,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { db } from '../firebase'; // Adjust this import as per your Firebase configuration
import { collection, deleteDoc, doc, getDoc, getDocs, setDoc, updateDoc } from 'firebase/firestore';
import { Role } from '../contexts/AuthContext';

type AuthStateChangedCallback = (user: User | null) => void;

class AuthService {
  private static instance: AuthService;
  private auth = getAuth();
  private user: User | null = null;
  private authStateChangedListener: AuthStateChangedCallback | null = null; // Added listener variable

  private constructor() {
    // Initialize listener for auth state changes
    onAuthStateChanged(this.auth, (user) => {
      this.user = user;
      // Notify the listener if it's active
      if (this.authStateChangedListener) {
        this.authStateChangedListener(this.user);
      }
    });
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  public getUser(): User | null {
    return this.user;
  }

  public getEmail(): string | null {
    return this.user?.email || null;
  }

  public resetPassword(): Promise<void> {
    return sendPasswordResetEmail(this.auth, this.user?.email || '');
  }

  public async getUserName(): Promise<string | null> {
    //get the name from the user document
    try {
      if (this.user) {
        const userDoc = await getDoc(doc(db, 'users', this.user.uid));
        if (userDoc.exists()) {
          return userDoc.data().name;
        }
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  public async getUserRole(): Promise<string | null> {
    //get the role from the user document
    try {
      if (this.user) {
        const userDoc = await getDoc(doc(db, 'users', this.user.uid));
        if (userDoc.exists()) {
          return userDoc.data().insightsRole;
        }
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  // Define the method to subscribe to auth state changes
  public listenToAuthStateChanges(callback: AuthStateChangedCallback): () => void {
    this.authStateChangedListener = callback;
    return () => {
      this.authStateChangedListener = null;
    };
  }
  

  // Check if a user is logged in
  public isLoggedIn(): boolean {
    return this.user !== null;
  }

  // Modified login method to include auth state listener
  async login(email: string, password: string): Promise<{ success: boolean; message?: string }> {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      this.user = userCredential.user;

      const userDoc = await getDoc(doc(db, 'users', this.user.uid));
      if (userDoc.exists() && userDoc.data().insightsRole !== 'UNVALIDATED') {
        return { success: true };
      } else {
        // If the hasInsights field is false, then the user is not allowed to login
        await signOut(this.auth);
        this.user = null;
        return { success: false, message: 'You are not allowed to login.' };
      }
    } catch (error) {
      return { success: false, message: error instanceof Error ? error.message : 'An error occurred' };
    }
  }

  async deleteUser(email: string, password: string): Promise<{ success: boolean; message?: string }> {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      this.user = userCredential.user;
      await deleteDoc(doc(db, 'users', this.user.uid));
      await this.user.delete();
      this.user = null;
      return { success: true, message: 'Account deleted successfully'};
    } catch (error) {
      return { success: false, message: error instanceof Error ? error.message : 'An error occurred' };
    }
  }

  async forgotPassword(email: string): Promise<{ success: boolean; message?: string }> {
    try {
      await sendPasswordResetEmail(this.auth, email);
      return { success: true, message: 'Password reset email sent successfully'};
    } catch (error) {
      return { success: false, message: error instanceof Error ? error.message : 'An error occurred' };
    }
  }

  async deleteLoggedInUser(): Promise<{ success: boolean; message?: string }> {
    try {
      if (this.user) {
        await deleteDoc(doc(db, 'users', this.user.uid));
        await this.user.delete();
        this.user = null;
        return { success: true };
      }
      return { success: false, message: 'User not found' };
    } catch (error) {
      return { success: false, message: error instanceof Error ? error.message : 'An error occurred' };
    }
  }

  // New method to register with email, password, and name
async register(email: string, password: string, name: string): Promise<{ success: boolean; message?: string }> {
  try {
    const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
    this.user = userCredential.user;

    await setDoc(doc(db, 'users', this.user.uid), {
      email,
      name,
      insightsRole: 'VIEW', // Set the role to DEFAULT upon registration
      hasInsights: false, // Set hasInsights to false upon registration
      partsRole: 'VIEW', // Set the role to DEFAULT upon registration
      hasParts: false, // Set hasParts to false upon registration
    });

    // Sign out the user right after registration
    await signOut(this.auth);
    this.user = null;

    return { success: true };
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : 'An error occurred' };
  }
}


  // New method to logout
  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
      this.user = null;
    } catch (error) {
      // Handle logout error if needed
    }
  }

  // Fetch all users from the database
  async fetchAllUsers() {
    try {
      const querySnapshot = await getDocs(collection(db, 'users'));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error("Error fetching users:", error);
      return [];
    }
  }
  
  // Method to grant access to a user
  async changeRole(userId: string, role: Role): Promise<{ success: boolean; message: string }> {
    console.log(userId);
    try {
      if (!userId) {
        return { success: false, message: 'Invalid user ID' };
      }
  
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, { insightsRole: role.toString()});
  
      return { success: true, message: 'Access granted successfully' };
    } catch (error) {
      console.error('Error granting access:', error);
      return { success: false, message: error instanceof Error ? error.message : 'Failed to grant access' };
    }
  } 

  // Method to delete a user
  public async sendResetEmail(email: string): Promise<{ success: boolean; message: string }> {
    try {
      await sendPasswordResetEmail(this.auth, email);
      return { success: true, message: "Password reset email sent successfully." };
    } catch (error) {
      console.error("Error sending password reset email:", error);
      return { success: false, message: (error as Error).message || "Failed to send password reset email." };
    }
  }

}

export default AuthService;