import { BannerSection } from './BannerSection';
import Image, { ImageProps } from 'next/image';
import { twMerge } from 'tailwind-merge';
import { Heading } from '../Typography';

type PartnersSectionProps = {
  title: string;
  images: Array<ImageProps>;
};

export const PartnersSection = ({ title, images }: PartnersSectionProps) => {
  return (
    <BannerSection contentClassName="flex flex-col justify-center align-middle px-3xl py-xxl gap-xl">
      <Heading.Small as="h2" className="text-center">
        {title}
      </Heading.Small>
      <div className="gap-y-xl flex flex-1 flex-row flex-wrap items-center justify-center gap-x-20">
        {images.map(({ className: imageClassName, ...imageProps }) => (
          <Image
            key={imageProps.src.toString()}
            className={twMerge('max-h-10', imageClassName)}
            {...(imageProps as ImageProps)}
          />
        ))}
      </div>
    </BannerSection>
  );
};
