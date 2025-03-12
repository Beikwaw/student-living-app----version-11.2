import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
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

// Validate Firebase config
Object.entries(firebaseConfig).forEach(([key, value]) => {
  if (!value) {
    throw new Error(`Missing Firebase config value for ${key}`);
  }
});

console.log('Firebase Config:', {
  ...firebaseConfig,
  apiKey: '***' // Hide API key in logs
});

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

interface RequestDetails {
  accommodationType: string;
  location: string;
  dateSubmitted: Date;
}

interface UserData {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
  requestDetails?: RequestDetails;
}

const sampleUsers = [
  {
    email: 'student1@example.com',
    password: 'password123',
    name: 'John Doe',
    role: 'user',
    requestDetails: {
      accommodationType: 'Apartment',
      location: 'Downtown',
      dateSubmitted: new Date()
    }
  },
  {
    email: 'student2@example.com',
    password: 'password123',
    name: 'Jane Smith',
    role: 'user',
    requestDetails: {
      accommodationType: 'Dormitory',
      location: 'Campus',
      dateSubmitted: new Date()
    }
  },
  {
    email: 'admin@example.com',
    password: 'admin123',
    name: 'Admin User',
    role: 'admin',
    requestDetails: null
  }
];

async function createUser(user: typeof sampleUsers[0]) {
  try {
    console.log(`Attempting to create user: ${user.email}`);
    
    // Create authentication user
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      user.email,
      user.password
    );

    console.log(`Created auth user: ${user.email}`);

    // Create user document in Firestore
    const userData: UserData = {
      id: userCredential.user.uid,
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: new Date().toISOString()
    };

    // Only add requestDetails if it's not null
    if (user.requestDetails !== null) {
      userData.requestDetails = user.requestDetails;
    }

    await setDoc(doc(db, 'users', userCredential.user.uid), userData);

    console.log(`Created Firestore document for user: ${user.email}`);
    return true;
  } catch (error: any) {
    if (error.code === 'auth/email-already-in-use') {
      console.log(`User ${user.email} already exists, skipping...`);
      return true;
    }
    throw error;
  }
}

async function createSampleUsers() {
  try {
    console.log('Starting user creation process...');
    
    // Create users sequentially to avoid rate limiting
    for (const user of sampleUsers) {
      try {
        await createUser(user);
      } catch (error) {
        console.error(`Failed to create user ${user.email}:`, error);
        throw error;
      }
    }

    console.log('All sample users created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error in createSampleUsers:', error);
    process.exit(1);
  }
}

// Run the script
createSampleUsers().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
}); 