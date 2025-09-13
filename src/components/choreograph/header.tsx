export function Header() {
  return (
    <header className="flex items-center justify-between p-4 border-b">
      <h1 className="text-2xl font-bold font-headline text-primary">
        ChoreoGraph
      </h1>
      <p className="text-sm text-muted-foreground hidden sm:block">Interactive Fractal Generator</p>
    </header>
  );
}
