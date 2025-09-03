import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  return (
    <div className="container mx-auto py-12">
      {/* Hero Section */}
      <section className="py-12 md:py-24 lg:py-32 flex flex-col items-center text-center space-y-4">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter">
          Create and Share Polls <br className="hidden sm:inline" />
          with Anyone, Anywhere
        </h1>
        <p className="text-muted-foreground text-lg max-w-[700px] mx-auto">
          Alx-Polly makes it easy to create polls, gather opinions, and visualize results in real-time.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <Link href="/polls">
            <Button size="lg">
              Browse Polls
            </Button>
          </Link>
          <Link href="/polls/create">
            <Button variant="outline" size="lg">
              Create a Poll
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter mb-4">Key Features</h2>
          <p className="text-muted-foreground max-w-[700px] mx-auto">
            Everything you need to create and manage polls effectively.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Easy Creation</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Create polls in seconds with our intuitive interface. Add multiple options and customize your poll settings.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Real-time Results</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Watch results update in real-time as votes come in. Visualize data with beautiful charts and graphs.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Secure Voting</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Prevent duplicate votes and ensure the integrity of your polls with our secure voting system.</p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
