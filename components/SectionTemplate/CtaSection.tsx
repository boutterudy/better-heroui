import { ReactNode } from 'react';
import Image, { ImageProps } from 'next/image';
import { tv } from 'tailwind-variants';
import { Section, SectionCommonProps } from '../Section/Section';
import { SectionTextBlock } from './SectionTextBlock';

// ── Styles ────────────────────────────────────────────────────────────────────

const ctaSection = tv({
  slots: {
    content:
      'flex flex-col-reverse gap-xl desktop:items-center desktop:justify-center',
    imageWrapper: 'flex items-center justify-center',
    image:
      'desktop:h-auto desktop:max-h-full desktop:max-w-full desktop:w-auto rounded-section-image image-mobile-max-h mt-auto mb-0',
    textBlock: 'desktop:flex-1 desktop:max-w-1/2',
  },
  variants: {
    variant: {
      'text-on-right': {
        content: 'desktop:flex-row',
      },
      'text-on-left': {
        content: 'desktop:flex-row-reverse',
      },
    },
  },
  defaultVariants: {
    variant: 'text-on-right',
  },
});

// ── Component ─────────────────────────────────────────────────────────────────

type CtaSectionProps = SectionCommonProps & {
  title: string;
  subtitle?: string;
  details?: string | ReactNode;
  primaryCta?: ReactNode;
  secondaryCta?: ReactNode;
  image?: ImageProps;
  className?: string;
  variant?: 'text-on-left' | 'text-on-right';
};

export const CtaSection = ({
  as,
  title,
  subtitle,
  details,
  primaryCta,
  secondaryCta,
  image,
  className,
  variant = 'text-on-right',
}: CtaSectionProps) => {
  const { className: imageClassName, ...imageProps } = image ?? {};
  const {
    content,
    imageWrapper,
    image: imageSlot,
    textBlock,
  } = ctaSection({
    variant,
  });

  return (
    <Section as={as} className={className} contentClassName={content()}>
      {image && (
        <div className={imageWrapper()}>
          <Image
            className={imageSlot({ className: imageClassName })}
            {...(imageProps as ImageProps)}
          />
        </div>
      )}
      <SectionTextBlock
        className={textBlock()}
        subtitle={subtitle}
        title={title}
        details={details}
        primaryCta={primaryCta}
        secondaryCta={secondaryCta}
      />
    </Section>
  );
};
