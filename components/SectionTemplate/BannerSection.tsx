import { PropsWithChildren } from 'react';
import { Section, SectionCommonProps } from '../Section/Section';
import { twMerge } from 'tailwind-merge';

type BannerSectionProps = PropsWithChildren<
  SectionCommonProps & {
    className?: string;
    contentClassName?: string;
  }
>;

export const BannerSection = ({
  as,
  className,
  contentClassName,
  children,
}: BannerSectionProps) => {
  return (
    <Section
      as={as}
      className={className}
      contentClassName={twMerge(
        'bg-accent-foreground rounded-section-image',
        contentClassName,
      )}
    >
      {children}
    </Section>
  );
};
