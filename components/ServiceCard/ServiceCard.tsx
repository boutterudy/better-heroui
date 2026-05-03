import { ReactNode } from 'react';
import Image, { ImageProps } from 'next/image';
import { Card } from '@heroui/react';
import { twMerge } from 'tailwind-merge';
import { Display, Paragraph } from '../Typography';

export type ServiceCardProps = {
  image: ImageProps;
  title: string;
  details?: string;
  cta?: ReactNode;
  className?: string;
};

export const ServiceCard = ({
  image,
  title,
  details,
  cta,
  className,
}: ServiceCardProps) => {
  const { className: imageClassName, ...imageProps } = image;

  return (
    <Card
      className={twMerge('flex flex-col overflow-hidden', className)}
      variant="transparent"
    >
      <div className="relative max-h-90 w-full overflow-hidden">
        <Image
          className={twMerge(
            'rounded-section-image h-90 max-h-90 w-full object-cover',
            imageClassName,
          )}
          {...(imageProps as ImageProps)}
        />
      </div>
      <Card.Content className="gap-m flex flex-col">
        <Display.XSmall as="h3">{title}</Display.XSmall>
        {details && <Paragraph.Medium>{details}</Paragraph.Medium>}
      </Card.Content>
      {cta && <Card.Footer>{cta}</Card.Footer>}
    </Card>
  );
};
