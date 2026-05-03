import { ComponentPropsWithRef, ElementType } from 'react';
import { twMerge } from 'tailwind-merge';

export type SectionCommonProps = {
  as?: ElementType;
};

export type SectionProps<T extends ElementType = 'section'> =
  ComponentPropsWithRef<T> & {
    as?: T;
    contentClassName?: string;
  };

export const Section = <T extends ElementType = 'section'>({
  as,
  children,
  className,
  contentClassName,
  ...props
}: SectionProps<T>) => {
  const Tag = as ?? 'section';

  return (
    <Tag
      className={twMerge('p-xxl flex h-fit flex-1 justify-center', className)}
      {...props}
    >
      <div className={twMerge('container', contentClassName)}>{children}</div>
    </Tag>
  );
};
