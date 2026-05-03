import { BannerSection } from './BannerSection';
import Image, { ImageProps } from 'next/image';
import { tv } from 'tailwind-variants';
import { ReactNode } from 'react';
import { Display, Label, Paragraph } from '../Typography';

// ── Styles ────────────────────────────────────────────────────────────────────

const ctaBannerSection = tv({
  slots: {
    content: 'flex flex-col gap-l px-4xl py-3xl desktop:items-center',
  },
  variants: {
    variant: {
      'image-left': {
        content: 'desktop:flex-row',
      },
      'image-right': {
        content: 'desktop:flex-row-reverse',
      },
    },
  },
  defaultVariants: {
    variant: 'image-left',
  },
});

// ── Component ─────────────────────────────────────────────────────────────────

type CtaBannerSectionProps = {
  subtitle?: string;
  title: string;
  details?: string;
  primaryCta?: ReactNode;
  secondaryCta?: ReactNode;
  image: ImageProps;
  variant?: 'image-left' | 'image-right';
};

export const CtaBannerSection = ({
  subtitle,
  title,
  details,
  primaryCta,
  secondaryCta,
  image,
  variant = 'image-left',
}: CtaBannerSectionProps) => {
  const { className: imageClassName, ...imageProps } = image;
  const { content } = ctaBannerSection({ variant });

  return (
    <BannerSection contentClassName={content()}>
      <div className="shrink-0">
        <Image
          className={`rounded-[36px] object-cover${imageClassName ? ` ${imageClassName}` : ''}`}
          {...(imageProps as ImageProps)}
        />
      </div>
      <div className="flex flex-col">
        {subtitle && (
          <Label.Small as="p" className="uppercase">
            {subtitle}
          </Label.Small>
        )}
        <Display.XSmall as="h2" className={subtitle ? 'mt-xs' : undefined}>
          {title}
        </Display.XSmall>
        {details && (
          <Paragraph.Medium className="mt-m">{details}</Paragraph.Medium>
        )}
        {(primaryCta || secondaryCta) && (
          <div className="mt-l gap-s flex flex-row">
            {primaryCta}
            {secondaryCta}
          </div>
        )}
      </div>
    </BannerSection>
  );
};
