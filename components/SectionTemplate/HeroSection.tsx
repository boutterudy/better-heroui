import { ReactNode } from 'react';
import Image, { ImageProps } from 'next/image';
import { tv } from 'tailwind-variants';
import { Section, SectionCommonProps } from '../Section/Section';
import { SectionTextBlock } from './SectionTextBlock';

// ── Styles ────────────────────────────────────────────────────────────────────

const heroSection = tv({
  slots: {
    base: '',
    content: 'flex flex-col gap-m desktop:flex-row desktop:items-center',
    imageWrapper: 'flex items-center justify-center',
    image: '',
    textBlock: 'desktop:flex-1',
  },
  variants: {
    variant: {
      default: {
        imageWrapper: 'flex-1 self-stretch',
        image:
          'desktop:h-auto desktop:max-h-full desktop:max-w-full desktop:w-auto image-mobile-max-h mt-auto mb-0',
      },
      compact: {
        base: 'min-h-100 bg-accent-foreground',
        content: 'desktop:justify-center',
        imageWrapper: 'desktop:flex-1',
        image:
          'rounded-section-image image-mobile-max-h desktop:max-h-120 desktop:w-auto object-contain',
        textBlock:
          'mt-[calc(var(--spacing-l)+var(--navbar-logo-height)-var(--navbar-height)-var(--spacing-xxl))] mb-l',
      },
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

// ── Component ─────────────────────────────────────────────────────────────────

type HeroSectionProps = SectionCommonProps & {
  title: string;
  subtitle?: string;
  details?: string;
  primaryCta?: ReactNode;
  secondaryCta?: ReactNode;
  image?: ImageProps;
  className?: string;
  variant?: 'default' | 'compact';
};

export const HeroSection = ({
  as,
  title,
  subtitle,
  details,
  primaryCta,
  secondaryCta,
  image,
  className,
  variant = 'default',
}: HeroSectionProps) => {
  const { className: imageClassName, ...imageProps } = image ?? {};
  const {
    base,
    content,
    imageWrapper,
    image: imageSlot,
    textBlock,
  } = heroSection({ variant });

  return (
    <Section
      as={as}
      className={base({ className })}
      contentClassName={content()}
    >
      <SectionTextBlock
        className={textBlock()}
        subtitle={subtitle}
        title={title}
        details={details}
        primaryCta={primaryCta}
        secondaryCta={secondaryCta}
      />
      {image && (
        <div className={imageWrapper()}>
          <Image
            className={imageSlot({ className: imageClassName })}
            {...(imageProps as ImageProps)}
          />
        </div>
      )}
    </Section>
  );
};
