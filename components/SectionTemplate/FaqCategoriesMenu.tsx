import { ComponentType } from 'react';
import { ScrollShadow } from '@heroui/react';
import { Label } from '../Typography';

// ── Types ─────────────────────────────────────────────────────────────────────

type FaqCategoryMenuItem = {
  id: string;
  title: string;
  icon: ComponentType<{ className?: string }>;
};

type FaqCategoriesMenuProps = {
  categories: Array<FaqCategoryMenuItem>;
};

// ── FaqCategoriesMenu ─────────────────────────────────────────────────────────

export const FaqCategoriesMenu = ({ categories }: FaqCategoriesMenuProps) => {
  return (
    <nav className="pt-xxl px-xl overflow-hidden">
      <ScrollShadow orientation="horizontal" className="w-full">
        <ul className="gap-l mx-auto flex w-fit flex-row">
          {categories.map(category => (
            <li key={category.id} className="shrink-0">
              <a
                href={`#${category.id}`}
                className="button button--md button--ghost gap-s flex flex-col items-center text-center"
              >
                <category.icon className="desktop:size-10 size-8" />
                <Label.Medium as="span">{category.title}</Label.Medium>
              </a>
            </li>
          ))}
        </ul>
      </ScrollShadow>
    </nav>
  );
};
