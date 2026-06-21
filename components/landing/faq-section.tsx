import { FacebookCTA } from "@/components/landing/facebook-cta"
import { Reveal } from "@/components/landing/reveal"
import { Section, SectionHeader } from "@/components/landing/section"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { faqs } from "@/lib/faq-data"

export function FaqSection() {
  return (
    <Section id="faq">
      <SectionHeader
        eyebrow="FAQ"
        title="Questions, sagot agad."
        description="If your question isn't here, just message us. We reply on Facebook."
      />

      <div className="mx-auto grid max-w-4xl grid-cols-1 gap-10 md:grid-cols-[1fr_280px]">
        <Reveal>
          <Accordion
            multiple={false}
            defaultValue={[0]}
            className="rounded-md border border-border/70 bg-card/40 px-6"
          >
            {faqs.map((faq, idx) => (
              <AccordionItem key={faq.q} value={idx}>
                <AccordionTrigger>{faq.q}</AccordionTrigger>
                <AccordionContent>{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>

        <Reveal delay={0.1}>
          <aside className="sticky top-24 flex flex-col gap-4 rounded-md border border-border/70 bg-card/60 p-6">
            <h3 className="text-base font-semibold leading-snug">
              Still have a question?
            </h3>
            <p className="text-sm text-muted-foreground">
              The fastest way to get an answer is to send us a quick message on
              Facebook.
            </p>
            <FacebookCTA size="default" className="w-full" />
          </aside>
        </Reveal>
      </div>
    </Section>
  )
}
