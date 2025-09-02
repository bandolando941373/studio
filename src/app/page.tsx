import { RockIdentifier } from '@/components/rock-identifier';
import { Logo } from '@/components/logo';

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="py-6 px-4 md:px-8">
        <Logo />
      </header>
      <main className="flex-grow flex items-start justify-center p-4 md:p-8">
        <RockIdentifier />
      </main>
      <footer className="text-center p-4 text-muted-foreground text-sm">
        <p>
          Powered by GenAI. Identification accuracy may vary.
        </p>
      </footer>
    </div>
  );
}
