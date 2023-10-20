interface DocsContainerProps {
  title: string;
  children: React.ReactNode;
}

export function DocsContainer({ children, title }: DocsContainerProps) {
  return (
    <main className="container py-6 md:px-8">
      <h1 className="mb-3 text-4xl  font-semibold">{title}</h1>
      {children}
    </main>
  );
}
