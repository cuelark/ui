import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/registry/cuelark/ui/accordion";

export default function AccordionDemo() {
  return (
    <Accordion type="single" collapsible numbered defaultValue="install" className="max-w-lg">
      <AccordionItem value="install">
        <AccordionTrigger>How do I install a component?</AccordionTrigger>
        <AccordionContent>Run the shadcn CLI with the component URL. The source is copied into your project, so you can change anything.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="theme">
        <AccordionTrigger>Can I change the accent color?</AccordionTrigger>
        <AccordionContent>Yes. Every color, the radius and the density are CSS variables. Change them once in your stylesheet.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="a11y">
        <AccordionTrigger>Is it accessible?</AccordionTrigger>
        <AccordionContent>Interactive parts are built on Radix primitives, with full keyboard support and correct ARIA roles.</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
