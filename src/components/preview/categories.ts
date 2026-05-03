/**
 * Preview categories — mirrors MobileApp/constants/categories.ts but with
 * inline Swedish labels (the preview is Swedish-first, no i18n runtime).
 *
 * Display order matches the mobile app: family-friendly first, then broad → niche.
 */

export interface SubcategoryDef {
  code: number;
  label: string;
}

export interface CategoryDef {
  code: number;
  label: string;
  subcategories: SubcategoryDef[];
}

export const CATEGORIES: CategoryDef[] = [
  {
    code: 8,
    label: "Kul för barn",
    subcategories: [
      { code: 801, label: "0–4 år" },
      { code: 802, label: "5–10 år" },
      { code: 803, label: "11–15 år" },
    ],
  },
  {
    code: 1,
    label: "Evenemang",
    subcategories: [
      { code: 101, label: "Festivaler & skoj" },
      { code: 102, label: "Fritid & livsstil" },
      { code: 103, label: "Mässor & marknader" },
    ],
  },
  {
    code: 3,
    label: "Underhållning",
    subcategories: [
      { code: 301, label: "Bio & film" },
      { code: 302, label: "Musik & konserter" },
      { code: 303, label: "Teater & shower" },
    ],
  },
  {
    code: 2,
    label: "Idrott & sport",
    subcategories: [
      { code: 201, label: "Sport att utöva" },
      { code: 202, label: "Sport att se på" },
      { code: 203, label: "Sport att prova" },
    ],
  },
  {
    code: 5,
    label: "Upplevelser & äventyr",
    subcategories: [
      { code: 501, label: "Parker & stigar" },
      { code: 502, label: "Mat & dryck" },
      { code: 503, label: "Utflykter & äventyr" },
    ],
  },
  {
    code: 4,
    label: "Kultur & sevärdheter",
    subcategories: [
      { code: 401, label: "Guidade turer" },
      { code: 402, label: "Konst & gallerier" },
      { code: 403, label: "Museer & sevärdheter" },
    ],
  },
  {
    code: 6,
    label: "Lära & utforska",
    subcategories: [
      { code: 601, label: "Föreläsningar" },
      { code: 602, label: "Lär dig..." },
      { code: 603, label: "Träffar & möten" },
    ],
  },
  {
    code: 7,
    label: "Hälsa & välmående",
    subcategories: [
      { code: 701, label: "Spa & bad" },
      { code: 702, label: "Stöd & samverkan" },
      { code: 703, label: "Trosaktiviteter" },
    ],
  },
];

export const SHOW_ALL_CODE = 0;

export const getCategory = (code: number): CategoryDef | undefined =>
  CATEGORIES.find((c) => c.code === code);
