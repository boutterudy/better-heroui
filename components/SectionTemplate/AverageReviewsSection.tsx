import { StarRating } from '../StarRating/StarRating';
import Image from 'next/image';
import { Section } from '../Section/Section';

type AverageReviewsSectionProps = {
  google: {
    rating: number;
    url: string;
  };
  facebook: {
    recommendationPercent: number;
    url: string;
  };
};

export const AverageReviewsSection = ({
  google,
  facebook,
}: AverageReviewsSectionProps) => {
  return (
    <Section
      className="py-0"
      contentClassName="flex flex-col items-center gap-xl px-4xl py-8 desktop:flex-row desktop:gap-xxl desktop:justify-center"
    >
      <a
        href={google.url}
        target="_blank"
        rel="noopener noreferrer"
        className="gap-s flex flex-row items-center"
      >
        <span className="text-base leading-6 font-bold">
          {google.rating.toFixed(1)}
        </span>
        <StarRating rating={google.rating} />
        <Image
          src="/images/logo-google.svg"
          alt="Google"
          width={73}
          height={24}
          className="h-6 w-auto"
        />
      </a>
      <a
        href={facebook.url}
        target="_blank"
        rel="noopener noreferrer"
        className="gap-s flex flex-row items-center"
      >
        <span className="text-base leading-6 font-bold">
          Recommandé par {facebook.recommendationPercent}&nbsp;%
        </span>
        <Image
          src="/images/logo-facebook.png"
          alt="Facebook"
          width={24}
          height={24}
          className="h-6 w-auto"
        />
      </a>
    </Section>
  );
};
