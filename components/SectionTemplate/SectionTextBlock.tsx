import { ElementType, ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';
import { Display, Label, Paragraph } from '../Typography';

export type SectionTextBlockProps = {
  subtitle?: string;
  title: string;
  titleAs?: ElementType;
  details?: string | ReactNode;
  primaryCta?: ReactNode;
  secondaryCta?: ReactNode;
  className?: string;
};

export const SectionTextBlock = ({
  subtitle,
  title,
  titleAs,
  details,
  primaryCta,
  secondaryCta,
  className,
}: SectionTextBlockProps) => {
  return (
    <div className={twMerge('flex flex-col', className)}>
      {subtitle && (
        <Label.Small as="p" className="uppercase">
          {subtitle}
        </Label.Small>
      )}
      <Display.Medium
        as={titleAs ?? 'h2'}
        className={twMerge(subtitle && 'mt-xs')}
      >
        {title}
      </Display.Medium>
      {details && typeof details === 'string' ? (
        <Paragraph.Medium className="mt-m">{details}</Paragraph.Medium>
      ) : (
        details
      )}
      {(primaryCta || secondaryCta) && (
        <div className="mt-l gap-s flex flex-row">
          {primaryCta}
          {secondaryCta}
        </div>
      )}
    </div>
  );
};
