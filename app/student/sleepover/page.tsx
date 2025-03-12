'use client';

import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { createSleepoverRequest } from '../../../lib/firestore';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Calendar } from 'lucide-react';

export default function SleepoverRequestPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    guestName: '',
    guestEmail: '',
    startDate: '',
    endDate: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to submit a sleepover request",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      await createSleepoverRequest({
        userId: user.uid,
        guestName: formData.guestName,
        guestEmail: formData.guestEmail,
        startDate: new Date(formData.startDate),
        endDate: new Date(formData.endDate),
        status: 'pending'
      });

      toast({
        title: "Success",
        description: "Your sleepover request has been submitted successfully",
      });

      setFormData({
        guestName: '',
        guestEmail: '',
        startDate: '',
        endDate: ''
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit sleepover request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Submit Sleepover Request
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="guestName" className="text-sm font-medium">
                Guest Name
              </label>
              <Input
                id="guestName"
                placeholder="Enter guest's full name"
                value={formData.guestName}
                onChange={(e) => setFormData(prev => ({ ...prev, guestName: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="guestEmail" className="text-sm font-medium">
                Guest Email
              </label>
              <Input
                id="guestEmail"
                type="email"
                placeholder="Enter guest's email address"
                value={formData.guestEmail}
                onChange={(e) => setFormData(prev => ({ ...prev, guestEmail: e.target.value }))}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="startDate" className="text-sm font-medium">
                  Start Date
                </label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="endDate" className="text-sm font-medium">
                  End Date
                </label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                  required
                />
              </div>
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Request'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 