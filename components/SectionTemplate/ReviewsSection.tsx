'use client';

import {
  type ReactNode,
  type Ref,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { Section } from '../Section/Section';
import { StarRating } from '../StarRating/StarRating';
import { Display, Label } from '../Typography';
import { Avatar, Card, Modal, useOverlayState } from '@heroui/react';
import Image from 'next/image';
import { ArrowLeftIcon, ArrowRightIcon } from '@phosphor-icons/react/ssr';
import { twMerge } from 'tailwind-merge';
import type { Review, ReviewSource } from '../../types/reviews';

const GAP = 24; // gap-l
const DOTS_MAX = 10;

type ReviewsSectionProps = {
  subtitle?: string;
  title: string;
  reviews: Array<Review>;
  className?: string;
};

const SourceLogo = ({ source }: { source: ReviewSource }) => {
  if (source === 'google') {
    return (
      <Image
        src="/images/logo-google-icon.svg"
        alt="Google"
        width={24}
        height={24}
        className="h-6 w-auto"
      />
    );
  }
  return (
    <Image
      src="/images/logo-facebook.png"
      alt="Facebook"
      width={24}
      height={24}
      className="h-6 w-auto"
    />
  );
};

type ReviewCardContentProps = {
  review: Review;
  textRef?: Ref<HTMLParagraphElement>;
  textClassName?: string;
  action?: ReactNode;
};

const ReviewCardContent = ({
  review,
  textRef,
  textClassName,
  action,
}: ReviewCardContentProps) => {
  const { source, rating, title, text, author, date } = review;
  return (
    <>
      <div className="gap-s flex flex-row items-center justify-between">
        <div>
          {rating !== undefined ? (
            <StarRating rating={rating} />
          ) : (
            title && <Label.Medium>{title}</Label.Medium>
          )}
        </div>
        <SourceLogo source={source} />
      </div>
      <div className="gap-m flex flex-col">
        <p
          ref={textRef}
          className={twMerge('text-base text-black', textClassName)}
        >
          {text}
        </p>
        {action}
      </div>
      <div className="gap-m mt-auto flex flex-row items-center">
        <Avatar>
          {author.photo && (
            <Avatar.Image src={author.photo} alt={author.name} />
          )}
          <Avatar.Fallback>{author.initials}</Avatar.Fallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="text-base font-medium text-black">
            {author.name}
          </span>
          <span className="text-default-400 text-sm text-gray-500">
            {date.toLocaleDateString('fr-FR', {
              month: 'long',
              year: 'numeric',
            })}
          </span>
        </div>
      </div>
    </>
  );
};

const ReviewCard = ({ review }: { review: Review }) => {
  const textRef = useRef<HTMLParagraphElement>(null);
  const [isTruncated, setIsTruncated] = useState(false);
  const modalState = useOverlayState();

  useEffect(() => {
    const el = textRef.current;
    if (!el) return;
    const check = () => setIsTruncated(el.scrollHeight > el.clientHeight);
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <>
      <Card className="flex h-full flex-col p-6" variant="default">
        <Card.Content className="gap-l flex flex-1 flex-col">
          <ReviewCardContent
            review={review}
            textRef={textRef}
            textClassName="line-clamp-7"
            action={
              isTruncated && (
                <button
                  onClick={modalState.open}
                  className="cursor-pointer self-start text-sm font-medium underline"
                >
                  Voir plus
                </button>
              )
            }
          />
        </Card.Content>
      </Card>
      <Modal state={modalState}>
        <Modal.Backdrop isDismissable>
          <Modal.Container size="lg">
            <Modal.Dialog>
              <Modal.Body className="gap-l flex flex-col p-6">
                <ReviewCardContent review={review} />
              </Modal.Body>
              <Modal.CloseTrigger />
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </>
  );
};

export const ReviewsSection = ({
  subtitle,
  title,
  reviews,
  className,
}: ReviewsSectionProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardWidth, setCardWidth] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const measure = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.offsetWidth;
      const count = w >= 900 ? 3 : w >= 600 ? 2 : 1;
      setVisibleCount(count);
      setCardWidth((w - (count - 1) * GAP) / count);
    };

    measure();
    const ro = new ResizeObserver(measure);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  const sortedReviews = [...reviews].sort(
    (a, b) => b.date.getTime() - a.date.getTime(),
  );

  const maxIndex = Math.max(0, sortedReviews.length - visibleCount);

  const handlePrev = () => setCurrentIndex(i => Math.max(0, i - 1));
  const handleNext = () => setCurrentIndex(i => Math.min(maxIndex, i + 1));

  const offset = cardWidth > 0 ? currentIndex * (cardWidth + GAP) : 0;

  return (
    <Section contentClassName={twMerge('flex flex-col gap-xl', className)}>
      <div className="flex flex-col items-center text-center">
        {subtitle && (
          <Label.Small as="p" className="uppercase">
            {subtitle}
          </Label.Small>
        )}
        <Display.Medium as="h2" className={twMerge(subtitle && 'mt-xs')}>
          {title}
        </Display.Medium>
      </div>

      <div className="gap-l flex flex-row items-center">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="shrink-0 cursor-pointer transition-opacity disabled:cursor-default disabled:opacity-30"
          aria-label="Avis précédent"
        >
          <ArrowLeftIcon size={24} />
        </button>

        <div ref={containerRef} className="min-w-0 flex-1 overflow-hidden">
          <div
            className="flex items-stretch"
            style={{
              gap: GAP,
              transform: `translateX(-${offset}px)`,
              transition: 'transform 300ms ease',
            }}
          >
            {sortedReviews.map((review, i) => (
              <div
                key={i}
                className={twMerge(
                  'shrink-0 p-0.5',
                  cardWidth === 0 && 'flex-1',
                )}
                style={cardWidth > 0 ? { width: cardWidth } : undefined}
              >
                <ReviewCard review={review} />
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={handleNext}
          disabled={currentIndex >= maxIndex}
          className="shrink-0 cursor-pointer transition-opacity disabled:cursor-default disabled:opacity-30"
          aria-label="Avis suivant"
        >
          <ArrowRightIcon size={24} />
        </button>
      </div>

      <div className="gap-s flex flex-col items-center">
        <div className="flex flex-row items-center gap-1">
          {(() => {
            const total = maxIndex + 1;
            const visibleIndices =
              total <= DOTS_MAX
                ? Array.from({ length: total }, (_, i) => i)
                : Array.from(
                    { length: DOTS_MAX },
                    (_, j) =>
                      Math.max(
                        0,
                        Math.min(currentIndex - 4, total - DOTS_MAX),
                      ) + j,
                  );
            return visibleIndices.map(i => {
              const isActive = i === currentIndex;
              const isEdge =
                total > DOTS_MAX &&
                ((i === visibleIndices[0] && i > 0) ||
                  (i === visibleIndices[visibleIndices.length - 1] &&
                    i < maxIndex));
              return (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  aria-label={`Aller à l'avis ${i + 1}`}
                  className={twMerge(
                    'bg-foreground cursor-pointer rounded-full transition-all',
                    isActive
                      ? 'h-2 w-4'
                      : isEdge
                        ? 'h-1.5 w-1.5 opacity-30'
                        : 'h-2 w-2 opacity-30',
                  )}
                />
              );
            });
          })()}
        </div>
      </div>
    </Section>
  );
};
