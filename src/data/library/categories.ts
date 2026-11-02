import type { UiLang } from '../../types';

/** Topic categories of the built-in word library. Ids are also used as card tags. */
export interface CategoryMeta {
  id: string;
  icon: string;
  name: Record<UiLang, string>;
}

export const CATEGORIES: CategoryMeta[] = [
  { id: 'basics', icon: 'MessageCircle', name: { ru: 'Общение: фразы', en: 'Everyday phrases', de: 'Alltagsphrasen' } },
  { id: 'words', icon: 'Puzzle', name: { ru: 'Местоимения и связки', en: 'Pronouns & connectors', de: 'Pronomen & Bindewörter' } },
  { id: 'people', icon: 'Users', name: { ru: 'Люди и семья', en: 'People & family', de: 'Menschen & Familie' } },
  { id: 'body', icon: 'HeartPulse', name: { ru: 'Тело и здоровье', en: 'Body & health', de: 'Körper & Gesundheit' } },
  { id: 'food', icon: 'Apple', name: { ru: 'Еда', en: 'Food', de: 'Essen' } },
  { id: 'drinks', icon: 'Coffee', name: { ru: 'Напитки и ресторан', en: 'Drinks & eating out', de: 'Getränke & Restaurant' } },
  { id: 'home', icon: 'House', name: { ru: 'Дом и быт', en: 'Home', de: 'Wohnen' } },
  { id: 'clothes', icon: 'Shirt', name: { ru: 'Одежда', en: 'Clothes', de: 'Kleidung' } },
  { id: 'city', icon: 'Building2', name: { ru: 'Город и транспорт', en: 'City & transport', de: 'Stadt & Verkehr' } },
  { id: 'travel', icon: 'Plane', name: { ru: 'Путешествия', en: 'Travel', de: 'Reisen' } },
  { id: 'nature', icon: 'Trees', name: { ru: 'Природа и погода', en: 'Nature & weather', de: 'Natur & Wetter' } },
  { id: 'animals', icon: 'PawPrint', name: { ru: 'Животные', en: 'Animals', de: 'Tiere' } },
  { id: 'time', icon: 'Clock', name: { ru: 'Время и календарь', en: 'Time & calendar', de: 'Zeit & Kalender' } },
  { id: 'numbers', icon: 'Hash', name: { ru: 'Числа', en: 'Numbers', de: 'Zahlen' } },
  { id: 'colors', icon: 'Palette', name: { ru: 'Цвета и формы', en: 'Colours & shapes', de: 'Farben & Formen' } },
  { id: 'work', icon: 'Briefcase', name: { ru: 'Работа и профессии', en: 'Work & jobs', de: 'Arbeit & Berufe' } },
  { id: 'school', icon: 'GraduationCap', name: { ru: 'Учёба', en: 'Studying', de: 'Lernen & Schule' } },
  { id: 'shopping', icon: 'ShoppingCart', name: { ru: 'Покупки и деньги', en: 'Shopping & money', de: 'Einkaufen & Geld' } },
  { id: 'emotions', icon: 'Smile', name: { ru: 'Чувства и характер', en: 'Feelings & character', de: 'Gefühle & Charakter' } },
  { id: 'hobbies', icon: 'Gamepad2', name: { ru: 'Хобби и досуг', en: 'Hobbies & free time', de: 'Hobbys & Freizeit' } },
  { id: 'tech', icon: 'Laptop', name: { ru: 'Техника и связь', en: 'Technology', de: 'Technik & Kommunikation' } },
  { id: 'verbs', icon: 'Zap', name: { ru: 'Главные глаголы', en: 'Key verbs', de: 'Wichtige Verben' } },
  { id: 'adjectives', icon: 'Sparkles', name: { ru: 'Главные прилагательные', en: 'Key adjectives', de: 'Wichtige Adjektive' } },
  { id: 'society', icon: 'Landmark', name: { ru: 'Общество и абстрактное (B1–B2)', en: 'Society & abstract (B1–B2)', de: 'Gesellschaft & Abstraktes (B1–B2)' } },
];

export const CATEGORY_BY_ID = new Map(CATEGORIES.map((c) => [c.id, c]));

export const LEVELS = ['A1', 'A2', 'B1', 'B2'] as const;
export type Level = (typeof LEVELS)[number];
