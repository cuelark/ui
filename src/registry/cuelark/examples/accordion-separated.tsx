import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/registry/cuelark/ui/accordion";

export default function AccordionSeparated() {
  return (
    <div className="grid w-full max-w-lg gap-8">
      <Accordion type="multiple" variant="separated" defaultValue={["shipping"]}>
        <AccordionItem value="shipping">
          <AccordionTrigger>Shipping</AccordionTrigger>
          <AccordionContent>Orders leave our warehouse within two business days.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="returns">
          <AccordionTrigger>Returns</AccordionTrigger>
          <AccordionContent>Return anything within 30 days for a full refund.</AccordionContent>
        </AccordionItem>
      </Accordion>
      <Accordion type="single" collapsible variant="dashed">
        <AccordionItem value="billing">
          <AccordionTrigger>Billing</AccordionTrigger>
          <AccordionContent>Invoices are issued on the first of every month.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="seats">
          <AccordionTrigger>Seats</AccordionTrigger>
          <AccordionContent>Add or remove seats at any time; changes are prorated.</AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
