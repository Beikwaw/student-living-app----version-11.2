import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, deleteUser } from 'firebase/auth';
import { getFirestore, doc, deleteDoc } from 'firebase/firestore';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: resolve(__dirname, '../.env.local') });

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const usersToDelete = [
  { email: 'student1@example.com', password: 'password123' },
  { email: 'student2@example.com', password: 'password123' },
  { email: 'admin@example.com', password: 'admin123' }
];

async function deleteUserByCredentials(email: string, password: string) {
  try {
    console.log(`Attempting to delete user: ${email}`);
    
    // Sign in as the user
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Delete from Firestore
    await deleteDoc(doc(db, 'users', user.uid));
    console.log(`Deleted Firestore document for user: ${email}`);

    // Delete from Auth
    await deleteUser(user);
    console.log(`Deleted auth user: ${email}`);
  } catch (error: any) {
    if (error.code === 'auth/user-not-found') {
      console.log(`No user found with email: ${email}`);
    } else {
      console.error(`Error deleting user ${email}:`, error);
    }
  }
}

async function deleteAllUsers() {
  try {
    console.log('Starting user deletion process...');
    
    // Delete users sequentially
    for (const user of usersToDelete) {
      await deleteUserByCredentials(user.email, user.password);
    }

    console.log('All users deleted successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error in deleteAllUsers:', error);
    process.exit(1);
  }
}

// Run the script
deleteAllUsers().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
}); 