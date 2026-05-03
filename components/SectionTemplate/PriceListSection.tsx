import { ArrowRightIcon, CheckCircleIcon } from '@phosphor-icons/react/ssr';
import NextLink from 'next/link';
import { Section, SectionCommonProps } from '../Section/Section';
import { SectionTextBlock } from './SectionTextBlock';
import { Display, Label, Paragraph } from '../Typography';
import { priceCardBaseClass } from './PriceServiceCard';

// ── Types ─────────────────────────────────────────────────────────────────────

export type PriceItem = {
  title: string;
  details?: string;
  price: string;
  href?: string;
};

type PriceListSectionProps = SectionCommonProps & {
  subtitle?: string;
  title: string;
  details?: string;
  promises: Array<string>;
  items: Array<PriceItem>;
  className?: string;
};

// ── Component ─────────────────────────────────────────────────────────────────

export const PriceListSection = ({
  as,
  subtitle,
  title,
  details,
  promises,
  items,
  className,
}: PriceListSectionProps) => {
  return (
    <Section
      as={as}
      className={className}
      contentClassName="flex flex-col gap-xl desktop:flex-row desktop:items-start"
    >
      {/* Left panel — sticky on desktop */}
      <div className="desktop:flex-1 desktop:max-w-1/3 desktop:sticky desktop:self-start desktop:top-[calc(var(--navbar-logo-height)+var(--spacing-xl))] flex flex-col">
        <SectionTextBlock subtitle={subtitle} title={title} details={details} />

        <div className="my-l bg-foreground/20 h-px w-full" />

        <ul className="gap-s flex flex-col">
          {promises.map((promise, index) => (
            <li key={index} className="gap-s flex flex-row items-start">
              <CheckCircleIcon
                size={20}
                className="mt-0.5 shrink-0"
                weight="bold"
              />
              <Paragraph.Medium>{promise}</Paragraph.Medium>
            </li>
          ))}
        </ul>
      </div>

      {/* Right panel — price cards */}
      <div className="gap-m flex flex-1 flex-col">
        {items.map((item, index) => {
          const cardClass = `${priceCardBaseClass} gap-xl flex flex-row items-center`;
          const inner = (
            <>
              <div className="gap-xs flex flex-1 flex-col">
                <Label.Medium as="h3">{item.title}</Label.Medium>
                {item.details && (
                  <Paragraph.Small className="opacity-70">
                    {item.details}
                  </Paragraph.Small>
                )}
                <Display.XSmall className="mt-s">{item.price}</Display.XSmall>
              </div>
              {item.href && <ArrowRightIcon size={20} className="shrink-0" />}
            </>
          );

          return item.href ? (
            <NextLink key={index} href={item.href} className={cardClass}>
              {inner}
            </NextLink>
          ) : (
            <div key={index} className={cardClass}>
              {inner}
            </div>
          );
        })}
      </div>
    </Section>
  );
};
