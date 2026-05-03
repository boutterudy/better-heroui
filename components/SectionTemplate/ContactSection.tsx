'use client';

import { ReactNode, useRef, useState } from 'react';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import {
  Button,
  FieldError,
  Form,
  TextField,
  Label,
  Input,
  TextArea,
  Link,
} from '@heroui/react';
import { Display } from '../Typography';
import { z } from 'zod';
import { isValidPhoneNumber } from 'libphonenumber-js';
import { twMerge } from 'tailwind-merge';
import { tv } from 'tailwind-variants';
import { PhoneIcon } from '@phosphor-icons/react/dist/ssr/Phone';
import { MapPinIcon } from '@phosphor-icons/react/dist/ssr/MapPin';
import { ArrowRightIcon } from '@phosphor-icons/react/dist/ssr/ArrowRight';
import { BannerSection } from './BannerSection';
import { SectionCommonProps } from '../Section/Section';
import { BusinessHoursItem, type BusinessHours } from './BusinessHoursItem';

export type { BusinessHours };

// ── Variants ──────────────────────────────────────────────────────────────────

const contactSection = tv({
  slots: {
    section: '',
    content: 'px-12 py-8 desktop:px-24 desktop:py-16',
  },
  variants: {
    variant: {
      default: {},
      hero: {
        section: 'bg-accent-foreground min-h-150',
        content: 'bg-transparent rounded-none',
      },
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

// ── Contact form schema ───────────────────────────────────────────────────────

const contactSchema = z.object({
  name: z.string().min(1, 'Veuillez entrer votre nom'),
  email: z
    .string()
    .min(1, 'Veuillez entrer votre adresse e-mail')
    .email('Adresse e-mail invalide'),
  phone: z
    .string()
    .optional()
    .refine(
      val => !val || isValidPhoneNumber(val, 'FR'),
      'Numéro de téléphone invalide',
    ),
  message: z
    .string()
    .min(10, 'Le message doit contenir au moins 10 caractères'),
});

type ContactFormErrors = Partial<
  Record<keyof z.infer<typeof contactSchema> | 'captcha' | 'submit', string>
>;

// ── InfoItem ──────────────────────────────────────────────────────────────────

type InfoItemProps = {
  icon: ReactNode;
  value: string;
  ctaLabel: string;
  ctaHref: string;
  ctaTarget?: '_blank' | '_self';
};

const InfoItem = ({
  icon,
  value,
  ctaLabel,
  ctaHref,
  ctaTarget,
}: InfoItemProps) => (
  <div className="gap-m flex flex-row items-start">
    <div className="flex size-8 shrink-0 items-center justify-center">
      {icon}
    </div>
    <div className="gap-xs flex flex-col">
      <p className="text-base">{value}</p>
      <Link
        href={ctaHref}
        target={ctaTarget}
        rel={ctaTarget === '_blank' ? 'noopener noreferrer' : undefined}
        className="gap-xs flex items-center"
      >
        {ctaLabel}
        <ArrowRightIcon size={16} />
      </Link>
    </div>
  </div>
);

// ── ContactSection ────────────────────────────────────────────────────────────

type ContactSectionProps = SectionCommonProps & {
  title: string;
  phoneNumber: string;
  phoneHref: string;
  address: string;
  addressUrl: string;
  businessHours: BusinessHours;
  bookSlotHref: string;
  hCaptchaSiteKey: string;
  /** URL of the contact API endpoint. Defaults to "/api/contact". */
  contactApiUrl?: string;
  variant?: 'default' | 'hero';
  className?: string;
};

export const ContactSection = ({
  as,
  title,
  phoneNumber,
  phoneHref,
  address,
  addressUrl,
  businessHours,
  bookSlotHref,
  hCaptchaSiteKey,
  contactApiUrl = '/api/contact',
  variant = 'default',
  className,
}: ContactSectionProps) => {
  const { section, content } = contactSection({ variant });
  const captchaRef = useRef<HCaptcha>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [fieldErrors, setFieldErrors] = useState<ContactFormErrors>({});
  const isLoading = status === 'loading';

  const validateField = (
    field: keyof z.infer<typeof contactSchema>,
    value: string,
  ) => {
    const raw = field === 'phone' ? value || undefined : value;
    const result = contactSchema.shape[field].safeParse(raw);
    setFieldErrors(prev => ({
      ...prev,
      [field]: result.success ? undefined : result.error.issues[0]?.message,
    }));
  };

  return (
    <BannerSection
      as={as}
      className={twMerge(section(), className)}
      contentClassName={content()}
    >
      <div className="gap-xl flex flex-col">
        {/* Title */}
        <Display.Medium as="h2">{title}</Display.Medium>

        {/* Two-column layout */}
        <div className="gap-xl desktop:flex-row flex flex-col">
          {/* Form */}
          {status === 'success' ? (
            <div className="gap-m flex flex-1 flex-col">
              <Display.XSmall as="p">Message envoyé !</Display.XSmall>
              <p className="text-base">
                Merci pour votre message. Nous vous répondrons dans les plus
                brefs délais.
              </p>
            </div>
          ) : (
            <Form
              className="gap-l flex flex-1 flex-col"
              onSubmit={async e => {
                e.preventDefault();
                if (isLoading) return;

                const formData = new FormData(
                  e.currentTarget as HTMLFormElement,
                );
                const raw = {
                  name: String(formData.get('name') ?? ''),
                  email: String(formData.get('email') ?? ''),
                  phone: String(formData.get('phone') ?? '') || undefined,
                  message: String(formData.get('message') ?? ''),
                };

                const result = contactSchema.safeParse(raw);
                const errors: ContactFormErrors = {};

                if (!result.success) {
                  for (const issue of result.error.issues) {
                    const field = issue.path[0] as keyof ContactFormErrors;
                    if (!errors[field]) errors[field] = issue.message;
                  }
                }

                if (!captchaToken) {
                  errors.captcha = 'Veuillez compléter le captcha';
                }

                if (Object.keys(errors).length > 0) {
                  setFieldErrors(errors);
                  return;
                }

                setFieldErrors({});
                setStatus('loading');
                try {
                  const res = await fetch(contactApiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...raw, captchaToken }),
                  });
                  if (!res.ok) throw new Error('Failed to send');
                  setStatus('success');
                } catch {
                  setFieldErrors({
                    submit: 'Une erreur est survenue. Veuillez réessayer.',
                  });
                  setStatus('idle');
                } finally {
                  captchaRef.current?.resetCaptcha();
                  setCaptchaToken(null);
                }
              }}
            >
              <TextField fullWidth isInvalid={!!fieldErrors.name}>
                <Label>Nom</Label>
                <Input
                  name="name"
                  autoComplete="name"
                  placeholder="Marie Dupont"
                  onChange={e => validateField('name', e.target.value)}
                />
                <FieldError>{fieldErrors.name}</FieldError>
              </TextField>

              <TextField fullWidth isInvalid={!!fieldErrors.email}>
                <Label>E-mail</Label>
                <Input
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="marie.dupont@exemple.fr"
                  onChange={e => validateField('email', e.target.value)}
                />
                <FieldError>{fieldErrors.email}</FieldError>
              </TextField>

              <TextField fullWidth isInvalid={!!fieldErrors.phone}>
                <Label>Téléphone</Label>
                <Input
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="06 12 34 56 78"
                  onChange={e => validateField('phone', e.target.value)}
                />
                <FieldError>{fieldErrors.phone}</FieldError>
              </TextField>

              <TextField fullWidth isInvalid={!!fieldErrors.message}>
                <Label>Message</Label>
                <TextArea
                  name="message"
                  rows={5}
                  placeholder="Bonjour, je me permets de vous contacter à propos de…"
                  onChange={e => validateField('message', e.target.value)}
                />
                <FieldError>{fieldErrors.message}</FieldError>
              </TextField>

              <HCaptcha
                ref={captchaRef}
                sitekey={hCaptchaSiteKey}
                onVerify={token => {
                  setCaptchaToken(token);
                  setFieldErrors(prev => ({ ...prev, captcha: undefined }));
                }}
                onExpire={() => setCaptchaToken(null)}
              />

              {fieldErrors.captcha && (
                <p className="text-sm text-red-600">{fieldErrors.captcha}</p>
              )}

              {fieldErrors.submit && (
                <p className="text-sm text-red-600">{fieldErrors.submit}</p>
              )}

              <Button
                type="submit"
                variant="primary"
                className="self-start"
                isDisabled={isLoading}
                isPending={isLoading}
              >
                {isLoading ? 'Envoi en cours…' : 'Envoyer le message'}
              </Button>
            </Form>
          )}

          {/* Information */}
          <aside className="gap-l desktop:flex-1 flex flex-col">
            <InfoItem
              icon={<PhoneIcon size={32} />}
              value={phoneNumber}
              ctaLabel="Appeler"
              ctaHref={phoneHref}
            />

            <InfoItem
              icon={<MapPinIcon size={32} />}
              value={address}
              ctaLabel="Voir sur la carte"
              ctaHref={addressUrl}
              ctaTarget="_blank"
            />

            <BusinessHoursItem
              businessHours={businessHours}
              bookSlotHref={bookSlotHref}
            />
          </aside>
        </div>
      </div>
    </BannerSection>
  );
};
