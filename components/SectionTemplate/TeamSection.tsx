import Image, { ImageProps } from 'next/image';
import { Link } from '@heroui/react';
import { ArrowRightIcon } from '@phosphor-icons/react/ssr';
import { twMerge } from 'tailwind-merge';
import { Section, SectionCommonProps } from '../Section/Section';
import { Display, Label, Paragraph } from '../Typography';

export type TeamMember = {
  firstName: string;
  role: string;
  image: ImageProps;
  href: string;
};

type TeamSectionProps = SectionCommonProps & {
  title: string;
  subtitle?: string;
  members: Array<TeamMember>;
  className?: string;
};

export const TeamSection = ({
  as,
  title,
  subtitle,
  members,
  className,
}: TeamSectionProps) => {
  return (
    <Section
      as={as}
      className={className}
      contentClassName="flex flex-col gap-xl"
    >
      <div className="gap-xs flex flex-col">
        {subtitle && (
          <Label.Small as="p" className="text-center uppercase">
            {subtitle}
          </Label.Small>
        )}
        <Display.Medium as="h2" className="text-center">
          {title}
        </Display.Medium>
      </div>
      <div className="gap-xl desktop:flex-row desktop:flex-wrap desktop:justify-center flex flex-col">
        {members.map(member => {
          const { className: imageClassName, ...imageProps } = member.image;
          return (
            <div
              key={member.firstName}
              className="desktop:w-[calc((100%-5rem)/3)] desktop:flex-none flex flex-col items-center"
            >
              <Image
                className={twMerge(
                  'rounded-section-image aspect-[8/9] w-full object-cover',
                  imageClassName,
                )}
                {...(imageProps as ImageProps)}
              />
              <Label.Large as="p" className="mt-m text-center">
                {member.firstName}
              </Label.Large>
              <Paragraph.Medium className="mt-xs text-center">
                {member.role}
              </Paragraph.Medium>
              <Link
                href={member.href}
                className="mt-m gap-xs flex items-center"
              >
                En savoir plus sur {member.firstName}
                <ArrowRightIcon size={16} />
              </Link>
            </div>
          );
        })}
      </div>
    </Section>
  );
};
