'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/components/ui/use-toast';
import { createPoll } from '@/lib/actions';

export default function CreatePollPage() {
  const router = useRouter();
  const [options, setOptions] = useState(['', '']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  
  // Add a new option field
  const addOption = () => {
    setOptions([...options, '']);
  };
  
  // Remove an option field
  const removeOption = (index: number) => {
    if (options.length <= 2) return; // Minimum 2 options required
    const newOptions = [...options];
    newOptions.splice(index, 1);
    setOptions(newOptions);
  };
  
  // Update option value
  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (!user) {
        toast({
          title: 'Authentication required',
          description: 'You must be logged in to create a poll',
          variant: 'destructive'
        });
        router.push('/auth/login');
        return;
      }
      
      const formData = new FormData(e.target as HTMLFormElement);
      const title = formData.get('title') as string;
      const description = formData.get('description') as string;
      const filteredOptions = options.filter(option => option.trim() !== '');
      
      if (filteredOptions.length < 2) {
        toast({
          title: 'Invalid options',
          description: 'You must provide at least 2 options',
          variant: 'destructive'
        });
        setIsSubmitting(false);
        return;
      }
      
      // Use the server action to create the poll
      const result = await createPoll({
        title,
        description,
        options: filteredOptions,
        userId: user.id
      });
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      toast({
        title: 'Poll created',
        description: 'Your poll has been created successfully'
      });
      
      // Redirect to polls page after creation
      router.push('/polls');
    } catch (error) {
      console.error('Error creating poll:', error);
      toast({
        title: 'Error',
        description: 'Failed to create poll. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <Link href="/polls">
          <Button variant="outline" size="sm">
            ← Back to Polls
          </Button>
        </Link>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Create a New Poll</CardTitle>
          <CardDescription>
            Fill in the details to create your poll
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <FormLabel htmlFor="title">Poll Title</FormLabel>
              <Input 
                id="title" 
                name="title" 
                placeholder="Enter a question for your poll" 
                required 
              />
            </div>
            
            <div className="space-y-2">
              <FormLabel htmlFor="description">Description (Optional)</FormLabel>
              <Input 
                id="description" 
                name="description" 
                placeholder="Add more context to your question" 
              />
            </div>
            
            <div className="space-y-3">
              <FormLabel>Poll Options</FormLabel>
              {options.map((option, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder={`Option ${index + 1}`}
                    value={option}
                    onChange={(e) => updateOption(index, e.target.value)}
                    required
                  />
                  {options.length > 2 && (
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="icon" 
                      onClick={() => removeOption(index)}
                    >
                      ×
                    </Button>
                  )}
                </div>
              ))}
              
              <Button 
                type="button" 
                variant="outline" 
                onClick={addOption}
                className="w-full mt-2"
              >
                + Add Option
              </Button>
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create Poll'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}