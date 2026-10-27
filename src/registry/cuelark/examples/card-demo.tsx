import { Badge } from "@/registry/cuelark/ui/badge";
import { Button } from "@/registry/cuelark/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardLabel, CardTitle } from "@/registry/cuelark/ui/card";

export default function CardDemo() {
  return (
    <Card variant="raised" marks className="w-full max-w-sm">
      <CardHeader>
        <CardLabel>Plan · 02</CardLabel>
        <CardTitle asChild>
          <h3>Studio</h3>
        </CardTitle>
        <CardDescription>For small teams shipping every week.</CardDescription>
        <CardAction>
          <Badge variant="primary" size="sm" mono>
            Popular
          </Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-semibold tracking-tight">
          $24<span className="text-sm font-normal text-muted-foreground"> / seat / month</span>
        </p>
        <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
          <li>Unlimited projects</li>
          <li>Shared component library</li>
          <li>Priority support</li>
        </ul>
      </CardContent>
      <CardFooter divided>
        <Button className="w-full">Start free trial</Button>
      </CardFooter>
    </Card>
  );
}
