import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator, SelectTrigger, SelectValue } from "@/registry/cuelark/ui/select";

export default function SelectDemo() {
  return (
    <Select defaultValue="utc">
      <SelectTrigger className="w-60" aria-label="Timezone">
        <SelectValue placeholder="Select a timezone" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Americas</SelectLabel>
          <SelectItem value="pst">Pacific (UTC−8)</SelectItem>
          <SelectItem value="est">Eastern (UTC−5)</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>Europe & Asia</SelectLabel>
          <SelectItem value="utc">Coordinated Universal (UTC)</SelectItem>
          <SelectItem value="cet">Central European (UTC+1)</SelectItem>
          <SelectItem value="ist">India Standard (UTC+5:30)</SelectItem>
          <SelectItem value="jst">Japan Standard (UTC+9)</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
