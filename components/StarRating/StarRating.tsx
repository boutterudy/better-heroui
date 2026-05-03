import { StarIcon } from '@phosphor-icons/react/ssr';
import { ReactNode } from 'react';

const STAR_COUNT = 5;
const STAR_FILLED_COLOR = '#fbbc04';
const STAR_EMPTY_COLOR = '#dadce0';

type StarRatingProps = {
  rating: number;
  text?: ReactNode;
};

export const StarRating = ({ rating, text }: StarRatingProps) => {
  const filledStars = Math.ceil(rating);

  return (
    <div className="gap-s flex flex-row items-center">
      <div className="flex flex-row items-center">
        {Array.from({ length: STAR_COUNT }).map((_, i) => (
          <StarIcon
            key={i}
            size={20}
            weight="fill"
            color={i < filledStars ? STAR_FILLED_COLOR : STAR_EMPTY_COLOR}
          />
        ))}
      </div>
      {text}
    </div>
  );
};
