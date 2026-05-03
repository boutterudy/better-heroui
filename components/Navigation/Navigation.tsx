'use client';

import { ReactNode, useEffect, useState } from 'react';
import NextLink from 'next/link';
import { Button, Header, Link } from '@heroui/react';

type NavLink = {
  label: string;
  href: string;
};

type NavigationProps = {
  logo: ReactNode;
  links: Array<NavLink>;
  cta?: ReactNode;
  menuIcon: ReactNode;
  closeIcon: ReactNode;
};

export const Navigation = ({
  logo,
  links,
  cta,
  menuIcon,
  closeIcon,
}: NavigationProps) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 900px)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (e.matches) setIsOpen(false);
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    <>
      <Header className="bg-background sticky top-0 z-50 flex h-(--navbar-height) justify-center overflow-visible p-0 shadow-xl">
        <div className="container flex h-full items-center justify-between">
          <NextLink href="/" className="relative z-50 self-start">
            {logo}
          </NextLink>

          {/* Desktop nav */}
          <nav className="gap-l px-s desktop:flex hidden items-center">
            {links.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm no-underline hover:underline"
              >
                {link.label}
              </Link>
            ))}
            {cta}
          </nav>

          {/* Mobile toggle */}
          <Button
            className="desktop:hidden"
            isIconOnly
            variant="ghost"
            onPress={() => setIsOpen(prev => !prev)}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
          >
            {isOpen ? closeIcon : menuIcon}
          </Button>
        </div>
      </Header>

      {/* Mobile overlay */}
      {isOpen && (
        <div className="bg-background fixed inset-x-0 top-0 bottom-0 z-40">
          <nav className="gap-m flex h-full flex-col items-center justify-center">
            {links.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="text-base no-underline hover:underline"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  );
};
