import { ArrowRightIcon } from '@phosphor-icons/react/ssr';
import NextLink from 'next/link';
import { Label, Paragraph } from '../Typography';

// ── Types ─────────────────────────────────────────────────────────────────────

export type PriceServiceItem = {
  title: string;
  details?: string;
  price: string;
  href?: string;
};

// ── Shared shell style ────────────────────────────────────────────────────────

export const priceCardBaseClass = 'bg-accent-foreground py-l px-xl rounded-xl';

// ── Component ─────────────────────────────────────────────────────────────────

export const PriceServiceCard = ({
  title,
  details,
  price,
  href,
}: PriceServiceItem) => {
  const cardClass =
    'bg-accent-foreground/50 py-l px-xl rounded-xl flex flex-row items-center gap-m';

  const inner = (
    <>
      <div className="gap-xs flex flex-1 flex-col">
        <Label.Medium as="span" className="text-foreground font-semibold">
          {title}
        </Label.Medium>
        {details && (
          <Paragraph.Small className="text-foreground opacity-70">
            {details}
          </Paragraph.Small>
        )}
      </div>
      <div className="gap-l flex shrink-0 items-center">
        <Label.Medium as="span" className="text-foreground font-semibold">
          {price}
        </Label.Medium>
        {href && <ArrowRightIcon size={20} />}
      </div>
    </>
  );

  return href ? (
    <NextLink href={href} className={cardClass}>
      {inner}
    </NextLink>
  ) : (
    <div className={cardClass}>{inner}</div>
  );
};
