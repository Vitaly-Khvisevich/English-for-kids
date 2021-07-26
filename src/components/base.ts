export const ProgramSettings = {
  standardGame: true,
  currentPage: '#',
  isAddCategory: false,
  myRouts: [] as string[],
};

export const OBJECTS = {
  categories: [] as (string[] | { word: string; translation: string; image: string; audioSrc: string }[])[],
  categoryHistory: [] as {
    index: number;
    categoryName: string;
    countWords: number;
    hash: string;
    src: string;
  }[],
  cards: [] as Array<HTMLElement>,
  cardCategories: [] as Array<HTMLElement>,
  difArr: [] as Array<{
    word: string;
    translation: string;
    category: string;
    clicks: number;
    correct: number;
    wrong: number;
    perCent: number;
  }>,
  moreErrorElements: [] as Array<{
    word: string;
    translation: string;
    category: string;
    clicks: number;
    correct: number;
    wrong: number;
    perCent: number;
  }>,
};
export const gameElements = {
  selectGroupCards: [] as string[] | { word: string; translation: string; image: string; audioSrc: string }[],
  randomCard: {} as string | { word: string; translation: string; image: string; audioSrc: string },
  randomErrCard: {} as {
    word: string;
    translation: string;
    category: string;
    clicks: number;
    correct: number;
    wrong: number;
    perCent: number;
  },
  elementIndex: -1 as number,
  errors: 0 as number,
  selectCategory: '' as string | null | undefined,
};

export const shareElements: {
  checkbox: HTMLElement | null;
  popUpMenu: HTMLElement | null;
  footer: HTMLElement | null;
  menuSwitchInput: HTMLElement | null;
  button: HTMLElement | null;
  result: HTMLElement | null;
  table: HTMLElement | null;
  thTable: Array<HTMLElement>;
  tdTable: Array<HTMLElement>;
  staticButtonReset: HTMLElement | null;
  staticButtonRepeat: HTMLElement | null;
  errorCards: Array<HTMLElement>;
  cardsCategory: Array<HTMLElement>;
  adminWords: HTMLElement | null;
  adminCategories: HTMLElement | null;
} = {
  checkbox: null,
  popUpMenu: null,
  footer: null,
  menuSwitchInput: null,
  button: null,
  result: null,
  table: null,
  thTable: [],
  tdTable: [],
  staticButtonReset: null,
  staticButtonRepeat: null,
  errorCards: [],
  cardsCategory: [],
  adminWords: null,
  adminCategories: null,
};

export const authorization = {
  adminLogin: 'admin',
  adminPassword: 'admin',
};
