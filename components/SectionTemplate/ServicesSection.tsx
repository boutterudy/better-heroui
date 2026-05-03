import { ReactNode } from 'react';
import { Section } from '../Section/Section';
import { twMerge } from 'tailwind-merge';
import { ServiceCard, ServiceCardProps } from '../ServiceCard/ServiceCard';
import { SectionTextBlock } from './SectionTextBlock';

type ServicesSectionProps = {
  header: {
    title: string;
    subtitle?: string;
    primaryCta?: ReactNode;
    className?: string;
  };
  services: Array<ServiceCardProps>;
  className?: string;
};

export const ServicesSection = ({
  header: { title, subtitle, primaryCta, className: headerClassName },
  services,
  className,
}: ServicesSectionProps) => {
  return (
    <Section
      contentClassName={twMerge('flex flex-1 flex-col gap-8', className)}
    >
      <SectionTextBlock
        title={title}
        subtitle={subtitle}
        primaryCta={primaryCta}
        className={headerClassName}
      />
      <div className="gap-l flex flex-col">
        {(() => {
          const rows: Array<Array<ServiceCardProps>> = [];
          for (let i = 0; i < services.length; i += 2) {
            rows.push(services.slice(i, i + 2));
          }

          return rows.map((row, rowIndex) => {
            // Alternating wide/narrow card layout: even rows → [wide][narrow], odd rows → [narrow][wide].
            // This creates a visual rhythm across the grid.
            // Intentional — reordering or adding services will shift the pattern.
            const isEvenRow = rowIndex % 2 === 0;

            if (row.length === 1) {
              const [card] = row;
              return (
                <ServiceCard
                  key={card.title}
                  {...card}
                  className={twMerge(card.className, 'w-full')}
                />
              );
            }

            const [first, second] = row;
            const firstClass = isEvenRow
              ? 'w-full desktop:flex-1'
              : 'w-full desktop:max-w-[448px]';
            const secondClass = isEvenRow
              ? 'w-full desktop:max-w-[448px]'
              : 'w-full desktop:flex-1';

            return (
              <div
                key={rowIndex}
                className="gap-l desktop:flex-row desktop:items-stretch flex flex-col"
              >
                <ServiceCard
                  {...first}
                  className={twMerge(first.className, firstClass)}
                />
                <ServiceCard
                  {...second}
                  className={twMerge(second.className, secondClass)}
                />
              </div>
            );
          });
        })()}
      </div>
    </Section>
  );
};
