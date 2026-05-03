import { ComponentPropsWithRef, ElementType, ReactNode } from 'react';
import { tv } from 'tailwind-variants';

// ─── Variant map ─────────────────────────────────────────────────────────────

const typography = tv({
  variants: {
    variant: {
      'display-large': 'display-large',
      'display-medium': 'display-medium',
      'display-small': 'display-small',
      'display-xsmall': 'display-xsmall',

      'heading-xxlarge': 'heading-xxlarge',
      'heading-xlarge': 'heading-xlarge',
      'heading-large': 'heading-large',
      'heading-medium': 'heading-medium',
      'heading-small': 'heading-small',
      'heading-xsmall': 'heading-xsmall',

      'label-large': 'label-large',
      'label-medium': 'label-medium',
      'label-small': 'label-small',
      'label-xsmall': 'label-xsmall',

      'paragraph-large': 'paragraph-large',
      'paragraph-medium': 'paragraph-medium',
      'paragraph-small': 'paragraph-small',
      'paragraph-xsmall': 'paragraph-xsmall',
    },
  },
});

type TypographyVariant = NonNullable<
  Parameters<typeof typography>[0]
>['variant'];

// ─── Polymorphic component factory ───────────────────────────────────────────

type TypographyProps<T extends ElementType> = ComponentPropsWithRef<T> & {
  as?: T;
  children?: ReactNode;
  className?: string;
};

function makeTypographyComponent<DefaultTag extends ElementType>(
  variant: TypographyVariant,
  defaultTag: DefaultTag,
) {
  function TypographyComponent<T extends ElementType = DefaultTag>({
    as,
    className,
    children,
    ...props
  }: TypographyProps<T>) {
    const Tag = (as ?? defaultTag) as ElementType;
    return (
      <Tag className={typography({ variant, className })} {...props}>
        {children}
      </Tag>
    );
  }

  TypographyComponent.displayName = `Typography(${variant})`;
  return TypographyComponent;
}

// ─── Exported namespaces ─────────────────────────────────────────────────────

export const Display = {
  Large: makeTypographyComponent('display-large', 'p'),
  Medium: makeTypographyComponent('display-medium', 'p'),
  Small: makeTypographyComponent('display-small', 'p'),
  XSmall: makeTypographyComponent('display-xsmall', 'p'),
};

export const Heading = {
  XXLarge: makeTypographyComponent('heading-xxlarge', 'h2'),
  XLarge: makeTypographyComponent('heading-xlarge', 'h2'),
  Large: makeTypographyComponent('heading-large', 'h2'),
  Medium: makeTypographyComponent('heading-medium', 'h3'),
  Small: makeTypographyComponent('heading-small', 'h3'),
  XSmall: makeTypographyComponent('heading-xsmall', 'h4'),
};

export const Label = {
  Large: makeTypographyComponent('label-large', 'span'),
  Medium: makeTypographyComponent('label-medium', 'span'),
  Small: makeTypographyComponent('label-small', 'span'),
  XSmall: makeTypographyComponent('label-xsmall', 'span'),
};

export const Paragraph = {
  Large: makeTypographyComponent('paragraph-large', 'p'),
  Medium: makeTypographyComponent('paragraph-medium', 'p'),
  Small: makeTypographyComponent('paragraph-small', 'p'),
  XSmall: makeTypographyComponent('paragraph-xsmall', 'p'),
};
