export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type ShowPreview = {
  __typename?: 'ShowPreview';
  id: Scalars['ID'];
  name: Scalars['String'];
  genre: Scalars['String'];
  rating: Scalars['Float'];
  airdate?: Maybe<Scalars['String']>;
  airtime?: Maybe<Scalars['String']>;
  image?: Maybe<Image>;
};

export type Episode = {
  __typename?: 'Episode';
  name?: Maybe<Scalars['String']>;
  airdate?: Maybe<Scalars['String']>;
  airtime?: Maybe<Scalars['String']>;
  summary?: Maybe<Scalars['String']>;
};

export type Show = {
  __typename?: 'Show';
  name: Scalars['String'];
  episodes: Array<Maybe<Episode>>;
  summary?: Maybe<Scalars['String']>;
  image?: Maybe<Image>;
  network?: Maybe<Network>;
  cast?: Maybe<Array<Cast>>;
};


export type ShowEpisodesArgs = {
  id: Scalars['ID'];
};


export type ShowCastArgs = {
  id: Scalars['ID'];
};

export type Country = {
  __typename?: 'Country';
  name: Scalars['String'];
};

export type Network = {
  __typename?: 'Network';
  name?: Maybe<Scalars['String']>;
  country?: Maybe<Country>;
};

export type Image = {
  __typename?: 'Image';
  medium: Scalars['String'];
  original: Scalars['String'];
};

export type Cast = {
  __typename?: 'Cast';
  name: Scalars['String'];
};

export interface ShowQuery {
  show: Show;
}

export interface ScheduleQuery {
  schedule: ShowPreview[];
}

export interface SearchQuery {
  shows: ShowPreview[];
}

export interface GenreSchedule {
  genre: string;
  shows: ShowPreview[];
}

export interface Settings {
  isNextWeek: boolean;
  countryCode: 'US' | 'NL';
  rating: number;
}
