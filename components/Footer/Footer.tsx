import { ReactNode } from 'react';
import NextLink from 'next/link';
import { twMerge } from 'tailwind-merge';
import { Label, Paragraph } from '../Typography';

// ── Types ─────────────────────────────────────────────────────────────────────

export type FooterLink = {
  label: string;
  href: string;
  target?: '_blank' | '_self';
  rel?: string;
};

type FooterColumn = {
  title: string;
  content: ReactNode;
};

type FooterSocialLink = {
  icon: ReactNode;
  href: string;
  label: string;
};

type FooterProps = {
  columns: Array<FooterColumn>;
  copyrightText: ReactNode;
  socialLinks?: Array<FooterSocialLink>;
  className?: string;
};

// ── Footer.LinkList ───────────────────────────────────────────────────────────

type FooterLinkListProps = {
  links: Array<FooterLink>;
};

const FooterLinkList = ({ links }: FooterLinkListProps) => (
  <div className="gap-l flex flex-col">
    {links.map(link => (
      <NextLink
        key={link.href}
        href={link.href}
        target={link.target}
        rel={
          link.rel ??
          (link.target === '_blank' ? 'noopener noreferrer' : undefined)
        }
        className="paragraph-small hover:underline"
      >
        {link.label}
      </NextLink>
    ))}
  </div>
);

// ── Footer ────────────────────────────────────────────────────────────────────

const FooterRoot = ({
  columns,
  copyrightText,
  socialLinks,
  className,
}: FooterProps) => (
  <footer className={twMerge('p-xxl flex justify-center', className)}>
    <div className="gap-xl container flex flex-col">
      <hr className="border-foreground/10" />

      {/* Link columns */}
      <div className="gap-xl desktop:justify-between flex flex-row flex-wrap">
        {columns.map(col => (
          <div key={col.title} className="gap-m flex flex-col">
            <Label.Small as="h3" className="uppercase">
              {col.title}
            </Label.Small>
            {col.content}
          </div>
        ))}
      </div>

      <hr className="border-foreground/10" />

      {/* Bottom bar — mobile: social then copyright; desktop: copyright | social */}
      <div className="gap-m desktop:flex-row desktop:items-center desktop:justify-between flex flex-col-reverse">
        <Paragraph.XSmall>{copyrightText}</Paragraph.XSmall>
        {socialLinks && socialLinks.length > 0 && (
          <div className="gap-m flex flex-row">
            {socialLinks.map(social => (
              <NextLink
                key={social.href}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
              >
                {social.icon}
              </NextLink>
            ))}
          </div>
        )}
      </div>
    </div>
  </footer>
);

export const Footer = Object.assign(FooterRoot, {
  LinkList: FooterLinkList,
});
