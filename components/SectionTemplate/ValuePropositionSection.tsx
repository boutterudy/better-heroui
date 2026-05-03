import { ReactNode } from 'react';
import { Section } from '../Section/Section';
import { twMerge } from 'tailwind-merge';
import { Display, Label, Paragraph } from '../Typography';

type ValuePropositionCard = {
  icon: ReactNode;
  title: string;
  details?: string;
};

type ValuePropositionSectionProps = {
  title: string;
  cards: Array<ValuePropositionCard>;
  className?: string;
};

export const ValuePropositionSection = ({
  title,
  cards,
  className,
}: ValuePropositionSectionProps) => {
  return (
    <Section contentClassName={twMerge('flex flex-col gap-xl', className)}>
      <Display.Medium as="h2">{title}</Display.Medium>
      <div className="gap-x-l gap-y-xl desktop:grid-cols-2 grid grid-cols-1">
        {cards.map((card, index) => (
          <div key={index} className="gap-s flex flex-col">
            <div className="h-8 w-8 shrink-0">{card.icon}</div>
            <Label.Medium as="h3">{card.title}</Label.Medium>
            {card.details && (
              <Paragraph.Medium>{card.details}</Paragraph.Medium>
            )}
          </div>
        ))}
      </div>
    </Section>
  );
};
