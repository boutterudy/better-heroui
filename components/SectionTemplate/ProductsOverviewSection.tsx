import Image, { ImageProps } from 'next/image';
import { tv } from 'tailwind-variants';
import { Section, SectionCommonProps } from '../Section/Section';
import { SectionTextBlock } from './SectionTextBlock';
import { Display, Paragraph } from '../Typography';

// ── Types ─────────────────────────────────────────────────────────────────────

export type ProductItem = {
  image: ImageProps;
  title: string;
  details: string;
};

type ProductsOverviewSectionProps = SectionCommonProps & {
  subtitle?: string;
  title?: string;
  products: Array<ProductItem>;
  className?: string;
};

// ── Styles ────────────────────────────────────────────────────────────────────

const productsOverview = tv({
  slots: {
    grid: 'grid grid-cols-1 gap-xl desktop:grid-cols-2',
    item: 'flex flex-col gap-l desktop:flex-row desktop:items-stretch',
    imageWrapper:
      'shrink-0 overflow-hidden rounded-xl desktop:w-48 desktop:self-stretch',
    image: 'h-60 w-full object-cover desktop:h-full desktop:w-48',
    textBlock: 'flex flex-col gap-s justify-center',
  },
});

// ── Component ─────────────────────────────────────────────────────────────────

export const ProductsOverviewSection = ({
  as,
  subtitle,
  title,
  products,
  className,
}: ProductsOverviewSectionProps) => {
  const {
    grid,
    item,
    imageWrapper,
    image: imageSlot,
    textBlock,
  } = productsOverview();

  return (
    <Section
      as={as}
      className={className}
      contentClassName="flex flex-col gap-xl"
    >
      {title && <SectionTextBlock subtitle={subtitle} title={title} />}
      <div className={grid()}>
        {products.map((product, index) => {
          const { className: imageClassName, ...imageProps } = product.image;

          return (
            <div key={index} className={item()}>
              <div className={imageWrapper()}>
                <Image
                  className={imageSlot({ className: imageClassName })}
                  {...(imageProps as ImageProps)}
                />
              </div>
              <div className={textBlock()}>
                <Display.XSmall as="h3">{product.title}</Display.XSmall>
                <Paragraph.Medium>{product.details}</Paragraph.Medium>
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
};
