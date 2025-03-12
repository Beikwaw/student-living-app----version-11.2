# MDO - Student Living App

A Next.js application for managing student accommodation and services, built with Firebase Authentication and Firestore.

## Features

- User authentication (students and administrators)
- Student application submission and tracking
- Real-time communication between students and administrators
- Admin dashboard for managing applications
- Secure data access with Firestore security rules

## Tech Stack

- Next.js 13+ (App Router)
- TypeScript
- Firebase Authentication
- Cloud Firestore
- Tailwind CSS

## Prerequisites

- Node.js 16.8 or later
- Firebase project with Authentication and Firestore enabled
- npm or yarn package manager

## Setup

1. Clone the repository:
```bash
git clone https://github.com/your-username/mdo-student-living.git
cd mdo-student-living
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a Firebase project:
   - Go to the [Firebase Console](https://console.firebase.google.com)
   - Create a new project
   - Enable Authentication with Email/Password
   - Enable Cloud Firestore
   - Get your Firebase configuration

4. Set up environment variables:
```bash
cp .env.example .env.local
```
Edit `.env.local` and add your Firebase configuration values.

5. Deploy Firestore security rules:
```bash
firebase deploy --only firestore:rules
```

6. Run the development server:
```bash
npm run dev
# or
yarn dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── admin/             # Admin dashboard
│   ├── student/           # Student dashboard
│   └── layout.tsx         # Root layout
├── context/               # React context providers
├── lib/                   # Shared utilities
│   ├── firebase.ts        # Firebase initialization
│   └── firestore.ts       # Firestore operations
├── public/                # Static files
└── middleware.ts          # Route protection middleware
```

## Authentication

The application uses Firebase Authentication for user management. Two types of users are supported:
- Students (role: 'user')
- Administrators (role: 'admin')

## Database Structure

Firestore collections:
- `users`: User profiles and application data
  - `id`: User ID (matches Firebase Auth UID)
  - `email`: User's email
  - `name`: User's name
  - `role`: User role ('user' or 'admin')
  - `applicationStatus`: Application status ('pending', 'accepted', or 'denied')
  - `requestDetails`: Accommodation request information
  - `communicationLog`: Messages between user and admin

## Security

- Firebase Authentication for user management
- Firestore security rules for data protection
- Route protection with Next.js middleware
- Environment variables for sensitive configuration

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 