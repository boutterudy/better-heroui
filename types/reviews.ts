export type ReviewSource = 'google' | 'facebook';

export type ReviewAuthor = {
  name: string;
  photo?: string;
  initials: string;
};

export type Review = {
  id?: string;
  source: ReviewSource;
  text: string;
  author: ReviewAuthor;
  date: Date;
  url?: string;
} & (
  | { rating: number; title?: undefined }
  | { rating?: undefined; title?: string }
);
