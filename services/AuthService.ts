import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  User,
  signOut,
  updatePassword,
} from 'firebase/auth';
import { db } from '../firebase'; // Adjust this import as per your Firebase configuration
import { doc, getDoc, setDoc } from 'firebase/firestore';

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
          return userDoc.data().role;
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
      if (userDoc.exists() && userDoc.data().hasAccess) {
        return { success: true };
      } else {
        // If the hasAccess field is false, then the user is not allowed to login
        await signOut(this.auth);
        this.user = null;
        return { success: false, message: 'You are not allowed to login.' };
      }
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
        role: 'DEFAULT', // Set the role to DEFAULT upon registration
        hasAccess: false, // Set hasAccess to false upon registration
      });

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

  // New method to change user profile
  async changeName(name: string): Promise<{ success: boolean; message?: string }> {
    try {
      if (this.user) {
        await updateProfile(this.user, { displayName: name });
        // Notify the listener if it's active
        if (this.authStateChangedListener) {
          this.authStateChangedListener(this.user);
        }

        return { success: true };
      } else {
        return { success: false, message: 'User not authenticated.' };
      }
    } catch (error) {
      return { success: false, message: error instanceof Error ? error.message : 'An error occurred' };
    }
  }

  async changePassword(newPassword: string): Promise<{ success: boolean; message?: string }> {
    try {
      if (this.user) {
        await updatePassword(this.user, newPassword);

        return { success: true };
      } else {
        return { success: false, message: 'User not authenticated.' };
      }
    } catch (error) {
      return { success: false, message: error instanceof Error ? error.message : 'An error occurred' };
    }
  }
}

export default AuthService.getInstance();
