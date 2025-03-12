'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { UserCircle, LogOut } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from 'next/link';
import { useToast } from "@/hooks/use-toast";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(false);
  const [userType, setUserType] = React.useState<'student' | 'admin'>('student');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      await login(email, password, userType);
      router.push(userType === 'admin' ? '/admin' : '/dashboard');
      toast({
        title: "Success",
        description: `Welcome back, ${userType === 'admin' ? 'Admin' : 'Student'}!`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Invalid email or password",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-primary rounded-full w-8 h-8 flex items-center justify-center">
              <UserCircle className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-xl">My Domain Student Living</span>
          </div>
          <Link href="/">
            <Button variant="ghost">
              <LogOut className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Welcome to My Domain</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Button 
                  onClick={() => setUserType('student')} 
                  variant={userType === 'student' ? 'default' : 'outline'}
                  className="flex-1"
                >
                  Student Login
                </Button>
                <Button 
                  onClick={() => setUserType('admin')} 
                  variant={userType === 'admin' ? 'default' : 'outline'}
                  className="flex-1"
                >
                  Admin Login
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder={userType === 'admin' ? "admin@mydomain.com" : "student@example.com"}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                      Logging in...
                    </div>
                  ) : (
                    `Login as ${userType === 'admin' ? 'Admin' : 'Student'}`
                  )}
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </main>

      <footer className="border-t py-6 bg-secondary text-white">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-center text-sm leading-loose md:text-left">
            © 2025 My Domain Student Living. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="#" className="text-sm hover:underline">
              Terms
            </Link>
            <Link href="#" className="text-sm hover:underline">
              Privacy
            </Link>
            <Link href="#" className="text-sm hover:underline">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
} 