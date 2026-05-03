import { Accordion } from '@heroui/react';
import { Section, SectionCommonProps } from '../Section/Section';
import { SectionTextBlock } from './SectionTextBlock';
import {
  PriceServiceCard,
  PriceServiceItem,
  priceCardBaseClass,
} from './PriceServiceCard';
import { Heading } from '../Typography';

// ── Types ─────────────────────────────────────────────────────────────────────

export type { PriceServiceItem };

export type PriceCategory = {
  title: string;
  items: Array<PriceServiceItem>;
};

type PriceTableSectionProps = SectionCommonProps & {
  subtitle?: string;
  title?: string;
  details?: string;
  categories: Array<PriceCategory>;
  className?: string;
};

// ── Component ─────────────────────────────────────────────────────────────────

export const PriceTableSection = ({
  as,
  subtitle,
  title,
  details,
  categories,
  className,
}: PriceTableSectionProps) => {
  return (
    <Section
      as={as}
      className={className}
      contentClassName="flex flex-col gap-xl"
    >
      {(subtitle || title || details) && (
        <SectionTextBlock
          subtitle={subtitle}
          title={title ?? ''}
          details={details}
        />
      )}

      <Accordion.Root allowsMultipleExpanded className="gap-m flex flex-col">
        {categories.map((category, index) => (
          <Accordion.Item
            key={index}
            defaultExpanded={index === 0}
            data-hide-separator={true}
          >
            <Accordion.Heading level={3}>
              <Accordion.Trigger className={priceCardBaseClass}>
                <Heading.XSmall>{category.title}</Heading.XSmall>
                <Accordion.Indicator />
              </Accordion.Trigger>
            </Accordion.Heading>
            <Accordion.Panel>
              <Accordion.Body className="pt-m px-0">
                <div className="gap-m flex flex-col">
                  {category.items.map((item, itemIndex) => (
                    <PriceServiceCard key={itemIndex} {...item} />
                  ))}
                </div>
              </Accordion.Body>
            </Accordion.Panel>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </Section>
  );
};
