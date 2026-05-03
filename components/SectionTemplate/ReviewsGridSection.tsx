'use client';

import { type ReactNode, useMemo, useState } from 'react';
import Image from 'next/image';
import {
  SortAscendingIcon,
  CheckIcon,
  CaretDownIcon,
  StarIcon,
  InfoIcon,
} from '@phosphor-icons/react/ssr';
import { Button, Popover, Tooltip } from '@heroui/react';
import { StarRating } from '../StarRating/StarRating';
import { Display, Label } from '../Typography';
import { Section } from '../Section/Section';
import type { Review, ReviewSource } from '../../types/reviews';
import { twMerge } from 'tailwind-merge';

type SortBy = 'featured' | 'newest' | 'highest' | 'lowest';

const PAGE_SIZE = 20;
const STAR_FILLED = '#fbbc04';
const STAR_EMPTY = '#dadce0';
const FEATURED_PATTERN = [0, 1, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 2, 2, 2] as const;

const SORT_OPTIONS: Array<{ value: SortBy; label: string }> = [
  { value: 'featured', label: 'À la une' },
  { value: 'newest', label: 'Plus récents' },
  { value: 'highest', label: 'Note la plus haute' },
  { value: 'lowest', label: 'Note la plus basse' },
];

function getEffectiveRating(review: Review): number {
  return review.rating ?? 5;
}

function featuredSort(reviews: Array<Review>): Array<Review> {
  if (reviews.length === 0) return [];

  const byRatingDesc = (a: Review, b: Review) =>
    getEffectiveRating(b) - getEffectiveRating(a) ||
    b.date.getTime() - a.date.getTime();

  const maxLen = Math.max(...reviews.map(r => r.text.length));

  const g1: Array<Review> = [];
  const g2: Array<Review> = [];
  const g3: Array<Review> = [];
  const g4: Array<Review> = [];

  for (const r of reviews) {
    const pct = maxLen > 0 ? r.text.length / maxLen : 0;
    if (pct >= 0.6 && pct <= 0.9) g1.push(r);
    else if (pct >= 0.2 && pct <= 0.5) g2.push(r);
    else if (pct >= 0.1 && pct < 0.2) g3.push(r);
    else g4.push(r);
  }

  g1.sort(byRatingDesc);
  g2.sort(byRatingDesc);
  g3.sort(byRatingDesc);
  g4.sort(byRatingDesc);

  const groups = [g1, g2, g3] as const;
  const ptrs: [number, number, number] = [0, 0, 0];
  const result: Array<Review> = [];

  while (ptrs[0] < g1.length || ptrs[1] < g2.length || ptrs[2] < g3.length) {
    let added = false;
    for (const slot of FEATURED_PATTERN) {
      if (ptrs[slot] < groups[slot].length) {
        result.push(groups[slot][ptrs[slot]]);
        ptrs[slot]++;
        added = true;
      }
    }
    if (!added) break;
  }

  return [...result, ...g4];
}

const SourceLogo = ({ source }: { source: ReviewSource }) => {
  if (source === 'google') {
    return (
      <Image
        src="/images/logo-google-icon.svg"
        alt="Google"
        width={24}
        height={24}
        className="h-6 w-auto shrink-0"
      />
    );
  }
  return (
    <Image
      src="/images/logo-facebook.png"
      alt="Facebook"
      width={24}
      height={24}
      className="h-6 w-auto shrink-0"
    />
  );
};

const ReviewGridCard = ({ review }: { review: Review }) => (
  <div className="bg-accent-foreground gap-m flex flex-col rounded-lg p-6">
    <div className="gap-s flex flex-row items-center justify-between">
      <span className="text-base font-medium">{review.author.name}</span>
      <SourceLogo source={review.source} />
    </div>
    <span className="text-sm opacity-60">
      {review.date.toLocaleDateString('fr-FR', {
        month: 'long',
        year: 'numeric',
      })}
    </span>
    <div className="gap-xs flex flex-row items-center">
      <StarRating rating={getEffectiveRating(review)} />
      {review.source === 'facebook' && (
        <Tooltip delay={0}>
          <Button
            variant="ghost"
            isIconOnly
            size="sm"
            className="h-fit! w-fit! min-w-0! p-0! opacity-40 transition-opacity hover:opacity-80"
            aria-label="À propos des avis Facebook"
          >
            <InfoIcon size={14} />
          </Button>
          <Tooltip.Content
            placement="top"
            className="max-w-64 text-xs break-normal"
          >
            Facebook utilise un système de recommandation sans étoiles. Un avis
            « Je recommande » exprime une satisfaction maximale, soit
            l’équivalent de 5 étoiles sur 5.
          </Tooltip.Content>
        </Tooltip>
      )}
    </div>
    <p className="text-base">{review.text}</p>
  </div>
);

type ReviewsGridSectionProps = {
  reviews: Array<Review>;
  averageRating: number;
  totalReviewCount: number;
  title: string;
  subtitle?: string;
  disclaimer?: ReactNode;
};

export const ReviewsGridSection = ({
  reviews,
  averageRating,
  totalReviewCount,
  title,
  subtitle,
  disclaimer,
}: ReviewsGridSectionProps) => {
  const [sortBy, setSortBy] = useState<SortBy>('featured');
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [pages, setPages] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  const filtered = useMemo(
    () =>
      filterRating !== null
        ? reviews.filter(r => getEffectiveRating(r) === filterRating)
        : reviews,
    [reviews, filterRating],
  );

  const sorted = useMemo(() => {
    switch (sortBy) {
      case 'featured':
        return featuredSort(filtered);
      case 'newest':
        return [...filtered].sort(
          (a, b) => b.date.getTime() - a.date.getTime(),
        );
      case 'highest':
        return [...filtered].sort(
          (a, b) =>
            getEffectiveRating(b) - getEffectiveRating(a) ||
            b.date.getTime() - a.date.getTime(),
        );
      case 'lowest':
        return [...filtered].sort(
          (a, b) =>
            getEffectiveRating(a) - getEffectiveRating(b) ||
            b.date.getTime() - a.date.getTime(),
        );
    }
  }, [filtered, sortBy]);

  const ratingCounts = useMemo(() => {
    const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    for (const r of reviews) counts[getEffectiveRating(r)]++;
    return counts;
  }, [reviews]);

  const displayed = sorted.slice(0, pages * PAGE_SIZE);
  const hasMore = pages * PAGE_SIZE < sorted.length;

  const filterLabel =
    filterRating !== null
      ? `${filterRating} étoile${filterRating > 1 ? 's' : ''} (${filtered.length})`
      : `${totalReviewCount.toLocaleString('fr-FR')} avis`;

  return (
    <Section contentClassName="flex flex-col gap-xl">
      <div className="gap-xs flex flex-col items-center text-center">
        {subtitle && (
          <Label.Small as="p" className="uppercase">
            {subtitle}
          </Label.Small>
        )}
        <Display.Medium as="h2">{title}</Display.Medium>
      </div>

      {/* Filter & sort bar */}
      <div className="gap-s flex flex-row items-center">
        <div className="gap-s flex min-w-0 flex-1 flex-row items-center">
          <StarRating rating={averageRating} />

          {/* Filter popover */}
          <Popover isOpen={filterOpen} onOpenChange={setFilterOpen}>
            <Popover.Trigger
              className={twMerge(
                'gap-xs border-default px-s py-xs flex shrink-0 cursor-pointer flex-row items-center rounded-lg border text-sm',
                filterRating !== null &&
                  'bg-foreground text-background border-foreground',
              )}
            >
              {filterLabel}
              <CaretDownIcon size={14} />
            </Popover.Trigger>
            <Popover.Content placement="bottom start">
              <Popover.Dialog className="p-m gap-s flex min-w-64 flex-col">
                {/* Summary row */}
                <div className="gap-s pb-xs border-default flex flex-row items-center justify-center border-b">
                  <StarRating rating={averageRating} />
                  <span className="text-sm font-medium">
                    {averageRating.toLocaleString('fr-FR', {
                      minimumFractionDigits: 1,
                    })}
                  </span>
                </div>

                {/* Rating rows: 5 → 1 */}
                <div className="gap-y-s grid grid-cols-[max-content_1fr_max-content]">
                  {([5, 4, 3, 2, 1] as const).map(stars => {
                    const count = ratingCounts[stars] ?? 0;
                    const isDisabled = count === 0;
                    const barPct =
                      reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                    const isActive = filterRating === stars;
                    return (
                      <Button
                        key={stars}
                        variant="ghost"
                        isDisabled={isDisabled}
                        onPress={() => {
                          setFilterRating(isActive ? null : stars);
                          setFilterOpen(false);
                        }}
                        size="sm"
                        className={twMerge(
                          'gap-x-s col-span-3 grid! h-auto! grid-cols-subgrid items-center',
                          isActive && 'font-medium',
                        )}
                      >
                        <div className="gap-xs flex flex-row items-center">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <StarIcon
                              key={i}
                              size={13}
                              weight="fill"
                              color={i < stars ? STAR_FILLED : STAR_EMPTY}
                            />
                          ))}
                        </div>
                        <div className="bg-default h-1.5 overflow-hidden rounded-full">
                          <div
                            className="bg-foreground h-full rounded-full"
                            style={{ width: `${barPct}%` }}
                          />
                        </div>
                        <span className="text-right text-sm tabular-nums">
                          ({count})
                        </span>
                      </Button>
                    );
                  })}
                </div>
              </Popover.Dialog>
            </Popover.Content>
          </Popover>
        </div>

        {/* Sort popover */}
        <Popover isOpen={sortOpen} onOpenChange={setSortOpen}>
          <Button variant="ghost" isIconOnly>
            <SortAscendingIcon size={20} />
          </Button>
          <Popover.Content placement="bottom end">
            <Popover.Dialog className="p-s flex min-w-52 flex-col">
              <p className="px-m py-s text-sm font-medium opacity-60">
                Trier par
              </p>
              {SORT_OPTIONS.map(opt => (
                <Button
                  key={opt.value}
                  variant="ghost"
                  fullWidth
                  onPress={() => {
                    setSortBy(opt.value);
                    setSortOpen(false);
                  }}
                  className="gap-l justify-between!"
                  size="sm"
                >
                  <span>{opt.label}</span>
                  {sortBy === opt.value && (
                    <CheckIcon size={16} weight="bold" />
                  )}
                </Button>
              ))}
            </Popover.Dialog>
          </Popover.Content>
        </Popover>
      </div>

      {/* Reviews grid */}
      {displayed.length === 0 ? (
        <p className="py-xl text-center opacity-60">
          Aucun avis pour cette note.
        </p>
      ) : (
        <>
          <div className="gap-l desktop:flex hidden">
            {([0, 1, 2] as const).map(col => (
              <div key={col} className="gap-l flex flex-1 flex-col">
                {displayed
                  .filter((_, i) => i % 3 === col)
                  .map((review, i) => (
                    <ReviewGridCard key={i} review={review} />
                  ))}
              </div>
            ))}
          </div>
          <div className="gap-l desktop:hidden flex flex-col">
            {displayed.map((review, i) => (
              <ReviewGridCard key={i} review={review} />
            ))}
          </div>
        </>
      )}

      {/* Show more */}
      {hasMore && (
        <div className="flex justify-center">
          <Button variant="outline" onPress={() => setPages(p => p + 1)}>
            Voir plus d’avis
          </Button>
        </div>
      )}

      {disclaimer}
    </Section>
  );
};
