import { ReactNode } from 'react';
import Image, { ImageProps } from 'next/image';
import { Accordion } from '@heroui/react';
import { Section, SectionCommonProps } from '../Section/Section';
import { SectionTextBlock } from './SectionTextBlock';
import { twMerge } from 'tailwind-merge';

// ── Types ─────────────────────────────────────────────────────────────────────

export type FaqItem = {
  question: string;
  answer: Array<string>;
  ctas?: Array<ReactNode>;
};

type FaqSectionProps = SectionCommonProps & {
  subtitle?: string;
  title: string;
  details?: string;
  cta?: ReactNode;
  image?: ImageProps;
  items: Array<FaqItem>;
  className?: string;
};

// ── FaqSection ────────────────────────────────────────────────────────────────

export const FaqSection = ({
  as,
  subtitle,
  title,
  details,
  cta,
  image,
  items,
  className,
}: FaqSectionProps) => {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer.join('\n\n'),
      },
    })),
  };

  const { className: imageClassName, ...imageProps } = image ?? {};

  return (
    <Section
      as={as}
      className={className}
      contentClassName="flex flex-col gap-xl desktop:flex-row desktop:items-start"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Left panel — sticky on desktop */}
      <div
        className={twMerge(
          'desktop:flex-1 desktop:max-w-1/3 desktop:sticky desktop:self-start desktop:top-[calc(var(--navbar-logo-height)+var(--spacing-xl))] flex flex-col',
        )}
      >
        <SectionTextBlock subtitle={subtitle} title={title} details={details} />

        {cta && <div className="mt-l">{cta}</div>}

        {image && (
          <div className="mt-l">
            <Image
              className={twMerge(
                'rounded-section-image w-full object-cover',
                imageClassName,
              )}
              {...(imageProps as ImageProps)}
            />
          </div>
        )}
      </div>

      {/* Right panel — accordion list */}
      <div className="flex flex-1 flex-col">
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
