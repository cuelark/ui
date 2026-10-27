import { Rating } from "@/registry/cuelark/ui/rating";

export default function RatingDemo() {
  return (
    <div className="flex flex-col items-center gap-4">
      <Rating defaultValue={3} label="Rate this component" size="lg" />
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Rating value={4} readOnly size="sm" label="Average rating" />
        4.0 · 1,284 reviews
      </div>
    </div>
  );
}
