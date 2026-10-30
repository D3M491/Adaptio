import { createContext, createElement, useContext, useMemo } from "react";
import { getLocales } from "expo-localization";
import { useProfile } from "../data/ProfileContext";
import it from "./it";
import en from "./en";

//The languages of the app: Italian, and English for everything else
const dictionaries = { it, en };

//The language of the phone, "it" only if it is Italian
export function deviceLanguage() {
  const code = getLocales()[0]?.languageCode;
  return code === "it" ? "it" : "en";
}

//The tag used to format numbers and dates
function localeOf(language) {
  return language === "it" ? "it-IT" : "en-US";
}

function lookup(dictionary, key) {
  return key.split(".").reduce((node, part) => node?.[part], dictionary);
}

//Returns the text of a key in a language. A missing text falls back to English, then to the key.
//An entry can be { one, other } for plurals: the one is used when params.count is 1.
//{name} in a text is replaced by params.name.
export function translate(language, key, params = {}) {
  let text = lookup(dictionaries[language], key) ?? lookup(en, key) ?? key;

  if (text !== null && typeof text === "object") {
    text = params.count === 1 ? text.one : text.other;
  }

  return String(text).replace(/\{(\w+)\}/g, (match, name) =>
    params[name] === undefined ? match : String(params[name]),
  );
}

//The name of a max or of a measurement in the current language, the saved name if it has no translation
export function entryName(t, name) {
  const label = t(`entries.${name}`);
  return label.startsWith("entries.") ? name : label;
}

//Shows a number the way the language does, e.g. 92.5 -> "92,5" in Italian, "92.5" in English
export function formatNumber(value, language) {
  return value.toLocaleString(localeOf(language));
}

//The text to put in an input for a number: the decimal separator of the language
export function numberToText(value, language) {
  return value === null || value === undefined
    ? ""
    : String(value).replace(".", language === "it" ? "," : ".");
}

//Reads a number typed with a comma or a point, NaN if it isn't a number
export function parseNumber(text) {
  return Number(String(text).trim().replace(",", "."));
}

const LanguageContext = createContext({
  language: deviceLanguage(),
  locale: localeOf(deviceLanguage()),
  t: (key, params) => translate(deviceLanguage(), key, params),
});

//Gives the texts in the language chosen in the settings: "auto" (the phone's), "it" or "en".
//Needs to be inside ProfileProvider.
export function LanguageProvider({ children }) {
  const { profile } = useProfile();
  const choice = profile.settings.language ?? "auto";
  const language = choice === "auto" ? deviceLanguage() : choice;

  const value = useMemo(
    () => ({
      language,
      locale: localeOf(language),
      t: (key, params) => translate(language, key, params),
    }),
    [language],
  );

  return createElement(LanguageContext.Provider, { value }, children);
}

//The function that gives a text from its key: const t = useT(); t("settings.title")
export function useT() {
  return useContext(LanguageContext).t;
}

//The language in use ("it" or "en") and its locale tag ("it-IT" or "en-US")
export function useLanguage() {
  const { language, locale } = useContext(LanguageContext);
  return { language, locale };
}
