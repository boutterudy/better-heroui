import { Accordion } from '@heroui/react';
import { Section } from '../Section/Section';
import { Display } from '../Typography';
import type { FaqItem } from './FaqSection';

// ── Types ─────────────────────────────────────────────────────────────────────

type QuestionsSectionProps = {
  id: string;
  title: string;
  items: Array<FaqItem>;
};

// ── QuestionsSection ──────────────────────────────────────────────────────────

export const QuestionsSection = ({
  id,
  title,
  items,
}: QuestionsSectionProps) => {
  return (
    <Section id={id}>
      <Display.Medium as="h2">{title}</Display.Medium>
      <div className="mt-l">
        <Accordion.Root allowsMultipleExpanded>
          {items.map((item, index) => (
            <Accordion.Item key={index} defaultExpanded={index === 0}>
              <Accordion.Heading level={3}>
                <Accordion.Trigger>
                  {item.question}
                  <Accordion.Indicator />
                </Accordion.Trigger>
              </Accordion.Heading>
              <Accordion.Panel>
                <Accordion.Body>
                  <div className="gap-s flex flex-col">
                    {item.answer.map((paragraph, pIndex) => (
                      <p key={pIndex}>{paragraph}</p>
                    ))}
                    {item.ctas && item.ctas.length > 0 && (
                      <div className="gap-xs mt-xs flex flex-col">
                        {item.ctas.map((cta, ctaIndex) => (
                          <div key={ctaIndex}>{cta}</div>
                        ))}
                      </div>
                    )}
                  </div>
                </Accordion.Body>
              </Accordion.Panel>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      </div>
    </Section>
  );
};
