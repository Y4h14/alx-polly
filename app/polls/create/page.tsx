'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

export default function CreatePollPage() {
  const router = useRouter();
  const [options, setOptions] = useState(['', '']);
  
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
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would send the poll data to the server
    const formData = new FormData(e.target as HTMLFormElement);
    const pollData = {
      title: formData.get('title'),
      description: formData.get('description'),
      options: options.filter(option => option.trim() !== ''),
    };
    
    console.log('Poll created:', pollData);
    // Redirect to polls page after creation
    router.push('/polls');
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
            
            <Button type="submit" className="w-full">
              Create Poll
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}