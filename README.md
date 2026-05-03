# better-heroui

Pre-built, styled website section components for Next.js sites, built on top of
[HeroUI](https://heroui.com) and Tailwind CSS.

## Prerequisites

| Dependency   | Version |
| ------------ | ------- |
| Next.js      | >= 16   |
| React        | >= 19   |
| Tailwind CSS | >= 4    |
| pnpm         | >= 10   |

> This package enforces pnpm as the package manager.

## Installation

```bash
pnpm add better-heroui
```

Import the stylesheet once in your app (e.g. `app/layout.tsx` or your global CSS
entry):

```css
@import 'tailwindcss';
@import '@heroui/styles';
@import 'better-heroui/styles';
```

## Components

### Base Components

| Export                       | Description                                                                     |
| ---------------------------- | ------------------------------------------------------------------------------- |
| `Navigation`                 | Responsive header with logo, nav links, optional CTA, and mobile hamburger menu |
| `Footer` / `Footer.LinkList` | Column-based footer with social links and copyright text                        |
| `Section`                    | Polymorphic container wrapper with built-in responsive padding                  |

### Typography

All typography components are polymorphic (accept an `as` prop) and support
multiple size variants.

| Export      | Variants                             |
| ----------- | ------------------------------------ |
| `Display`   | `Large`, `Medium`, `Small`, `XSmall` |
| `Heading`   | `XXLarge` → `XSmall`                 |
| `Label`     | `Large` → `XSmall`                   |
| `Paragraph` | `Large` → `XSmall`                   |

### UI Components

| Export              | Description                                                  |
| ------------------- | ------------------------------------------------------------ |
| `StarRating`        | 5-star rating display with customizable label                |
| `ServiceCard`       | Product/service card with image, title, description, and CTA |
| `BusinessHoursItem` | Single business hours row (day + hours)                      |

### Section Templates

Drop-in, fully styled landing page sections. Each section is a named export.

| Export                    | Description                                                                               |
| ------------------------- | ----------------------------------------------------------------------------------------- |
| `SectionTextBlock`        | Title, subtitle, body text, and CTAs                                                      |
| `HeroSection`             | Hero with image and CTAs (supports `default` and `compact` variants)                      |
| `BannerSection`           | Generic banner wrapper                                                                    |
| `CtaSection`              | Call-to-action section                                                                    |
| `CtaBannerSection`        | Banner-style CTA                                                                          |
| `PartnersSection`         | Partner/client logo carousel                                                              |
| `ServicesSection`         | Service cards grid with alternating wide/narrow layout                                    |
| `ValuePropositionSection` | Value proposition cards                                                                   |
| `AverageReviewsSection`   | Average rating and review count display                                                   |
| `ReviewsSection`          | Review carousel with modal expansion for long reviews                                     |
| `ReviewsGridSection`      | Grid layout of review cards                                                               |
| `FaqSection`              | FAQ accordion with sticky left panel and Schema.org structured data                       |
| `FaqCategoriesMenu`       | Category-based FAQ navigation menu                                                        |
| `QuestionsSection`        | General questions section                                                                 |
| `ContactSection`          | Full contact form (Zod validation, phone number input, business hours, address, hCaptcha) |
| `TeamSection`             | Team member showcase with photos and links                                                |
| `ProductsOverviewSection` | Product/item cards                                                                        |
| `PriceListSection`        | Simple price list                                                                         |
| `PriceTableSection`       | Accordion-based price comparison table                                                    |
| `PriceServiceCard`        | Individual price service card                                                             |

The `SectionTemplate` namespace export groups all section template components.

### Utilities

| Export           | Description                                    |
| ---------------- | ---------------------------------------------- |
| `getRatingLabel` | Returns a text label for a numeric star rating |

## Usage

```tsx
import {
  Navigation,
  SectionTemplate,
  Footer,
} from 'better-heroui';

export default function Page() {
  return (
    <>
      <Navigation
        logo={<img src="/logo.svg" alt="Logo" />}
        links={[
          { label: 'Services', href: '#services' },
          { label: 'Contact', href: '#contact' },
        ]}
      />

      <SectionTemplate.Hero
        title="Your tagline here"
        subtitle="Supporting description"
        image={{ src: '/hero.jpg', alt: 'Hero image' }}
        cta={{ label: 'Get started', href: '#contact' }}
      />

      <SectionTemplate.Services id="services" items={[...]} />

      <SectionTemplate.Contact
        id="contact"
        hcaptchaSiteKey={process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY!}
      />

      <Footer
        copyright="© 2025 Your Company"
        links={[...]}
      />
    </>
  );
}
```

## Notes

- **Language**: Contact form labels, validation messages, and date formatting
  are currently hardcoded in French (`fr-FR`).
- **Breakpoints**: Desktop/mobile split is at approximately 900px using Tailwind
  responsive utilities.
- **Contact form**: Submits to `/api/contact` via POST. You must implement this
  API route in your Next.js app.
- **hCaptcha**: `ContactSection` requires a valid hCaptcha site key passed as a
  prop.
