import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { createClient } from '@/lib/supabase';
import { formatDate } from '@/lib/utils';

async function getPolls() {
  const supabase = createClient();
  
  // Fetch polls
  const { data: polls, error } = await supabase
    .from('polls')
    .select(`
      *,
      profiles(full_name),
      poll_options(id, text)
    `)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching polls:', error);
    return [];
  }
  
  return polls;
}

export default async function PollsPage() {
  const polls = await getPolls();
  
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">All Polls</h1>
        <Link href="/polls/create">
          <Button>Create New Poll</Button>
        </Link>
      </div>

      {polls.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-muted-foreground">No polls found. Create your first poll!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {polls.map((poll) => (
            <Link href={`/polls/${poll.id}`} key={poll.id}>
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle>{poll.title}</CardTitle>
                  <CardDescription>{poll.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {poll.poll_options?.length || 0} options
                  </p>
                </CardContent>
                <CardFooter className="text-xs text-muted-foreground">
                  Created by {poll.profiles?.full_name || 'Anonymous'} on {formatDate(poll.created_at)}
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}