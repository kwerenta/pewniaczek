import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

export function CouponSidebar() {
  return (
    <aside className="sticky top-[4.5rem] h-[calc(100vh-12rem)] w-96">
      <Card className="flex h-full flex-col">
        <CardHeader>
          <CardTitle>Twój kupon</CardTitle>
          <CardDescription>
            Lista wydarzeń, które chcesz obstawić
          </CardDescription>
        </CardHeader>
        <CardContent className="mb-4 overflow-y-auto">
          <span className="text-muted-foreground">
            Aktualnie twój kupon jest pusty :(
          </span>
        </CardContent>
        <CardFooter className="mt-auto">
          <Button>Obstaw</Button>
        </CardFooter>
      </Card>
    </aside>
  );
}
