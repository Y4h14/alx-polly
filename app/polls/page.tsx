'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

// Mock data for polls
const mockPolls = [
  {
    id: '1',
    title: 'Favorite Programming Language',
    description: 'What is your favorite programming language?',
    options: ['JavaScript', 'Python', 'Java', 'C#', 'Go'],
    votes: [120, 80, 60, 40, 30],
    createdBy: 'John Doe',
    createdAt: '2023-09-01',
  },
  {
    id: '2',
    title: 'Best Frontend Framework',
    description: 'Which frontend framework do you prefer?',
    options: ['React', 'Vue', 'Angular', 'Svelte'],
    votes: [150, 70, 50, 40],
    createdBy: 'Jane Smith',
    createdAt: '2023-09-02',
  },
  {
    id: '3',
    title: 'Preferred Database',
    description: 'What database do you use most often?',
    options: ['PostgreSQL', 'MySQL', 'MongoDB', 'SQLite', 'Redis'],
    votes: [90, 85, 70, 40, 30],
    createdBy: 'Alex Johnson',
    createdAt: '2023-09-03',
  },
];

export default function PollsPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">All Polls</h1>
        <Link href="/polls/create">
          <Button>Create New Poll</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockPolls.map((poll) => (
          <Link href={`/polls/${poll.id}`} key={poll.id}>
            <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle>{poll.title}</CardTitle>
                <CardDescription>{poll.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {poll.options.length} options • 
                  {poll.votes.reduce((a, b) => a + b, 0)} total votes
                </p>
              </CardContent>
              <CardFooter className="text-xs text-muted-foreground">
                Created by {poll.createdBy} on {poll.createdAt}
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}