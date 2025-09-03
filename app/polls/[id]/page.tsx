'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

// Mock data for a single poll
const mockPoll = {
  id: '1',
  title: 'Favorite Programming Language',
  description: 'What is your favorite programming language?',
  options: ['JavaScript', 'Python', 'Java', 'C#', 'Go'],
  votes: [120, 80, 60, 40, 30],
  createdBy: 'John Doe',
  createdAt: '2023-09-01',
};

export default function PollDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasVoted, setHasVoted] = useState(false);

  // Calculate total votes
  const totalVotes = mockPoll.votes.reduce((sum, votes) => sum + votes, 0);

  // Handle vote submission
  const handleVote = () => {
    if (selectedOption !== null) {
      // In a real app, you would send the vote to the server
      console.log(`Voted for option: ${mockPoll.options[selectedOption]}`);
      setHasVoted(true);
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

      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">{mockPoll.title}</CardTitle>
          <CardDescription>{mockPoll.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            {mockPoll.options.map((option, index) => {
              const voteCount = mockPoll.votes[index];
              const percentage = totalVotes > 0 ? Math.round((voteCount / totalVotes) * 100) : 0;
              
              return (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {!hasVoted ? (
                        <input
                          type="radio"
                          id={`option-${index}`}
                          name="poll-option"
                          checked={selectedOption === index}
                          onChange={() => setSelectedOption(index)}
                          className="h-4 w-4"
                        />
                      ) : null}
                      <label 
                        htmlFor={`option-${index}`}
                        className={`${hasVoted && selectedOption === index ? 'font-bold' : ''}`}
                      >
                        {option}
                      </label>
                    </div>
                    {hasVoted && (
                      <span className="text-sm">
                        {voteCount} votes ({percentage}%)
                      </span>
                    )}
                  </div>
                  
                  {hasVoted && (
                    <div className="w-full bg-muted rounded-full h-2.5">
                      <div 
                        className="bg-primary h-2.5 rounded-full" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {!hasVoted && (
            <Button 
              onClick={handleVote} 
              disabled={selectedOption === null}
              className="w-full"
            >
              Submit Vote
            </Button>
          )}

          {hasVoted && (
            <p className="text-center text-muted-foreground">
              Thank you for voting! Total votes: {totalVotes}
            </p>
          )}
        </CardContent>
        <CardFooter className="text-sm text-muted-foreground">
          Created by {mockPoll.createdBy} on {mockPoll.createdAt}
        </CardFooter>
      </Card>
    </div>
  );
}