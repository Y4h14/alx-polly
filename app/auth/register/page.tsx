'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

export default function RegisterPage() {
  const router = useRouter();
  
  // This is a placeholder for the actual registration functionality
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would handle registration here
    console.log('Registration attempted');
    // Redirect to login page after registration
    router.push('/auth/login');
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Create an Account</CardTitle>
          <CardDescription>
            Fill in your details to create a new account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <FormLabel htmlFor="name">Full Name</FormLabel>
              <Input id="name" type="text" placeholder="John Doe" required />
            </div>
            <div className="space-y-2">
              <FormLabel htmlFor="email">Email</FormLabel>
              <Input id="email" type="email" placeholder="your@email.com" required />
            </div>
            <div className="space-y-2">
              <FormLabel htmlFor="password">Password</FormLabel>
              <Input id="password" type="password" required />
            </div>
            <div className="space-y-2">
              <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
              <Input id="confirmPassword" type="password" required />
            </div>
            <Button type="submit" className="w-full">Register</Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-center">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-primary hover:underline">
              Login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}