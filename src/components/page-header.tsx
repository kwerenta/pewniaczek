import { Separator } from "./ui/separator";

type PageHeaderProps = {
  children?: React.ReactNode;
  title: string;
  description: string;
  capitalizeDescription?: boolean;
};

export function PageHeader({ children, title, description }: PageHeaderProps) {
  return (
    <>
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
          <p className="text-muted-foreground">{description}</p>
        </div>
        {children}
      </div>
      <Separator className="my-6" />
    </>
  );
}
