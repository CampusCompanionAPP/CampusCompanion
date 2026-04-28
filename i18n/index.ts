import { getLocales } from "expo-localization";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import { locales } from "@/src/constants/language";
import { fetchUserData } from "@/src/services/userService";
import en from "../locales/en.json";
import es from "../locales/es.json";
import fr from "../locales/fr.json";
import it from "../locales/it.json";
import ko from "../locales/ko.json";

const resources = {
  en: { translation: en },
  es: { translation: es },
  fr: { translation: fr },
  it: { translation: it },
  ko: { translation: ko },
};

const deviceLanguage = getLocales()[0]?.languageCode?.split("-")[0] ?? "en";

i18n.use(initReactI18next).init({
  debug: true,
  resources,
  lng: deviceLanguage,
  fallbackLng: "en",
  supportedLngs: ["en", "es", "fr", "it", "ko"],
  load: "languageOnly",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;

export const syncUserLanguage = async () => {
  try {
    const data = await fetchUserData();

    if (data?.language) i18n.changeLanguage(locales[data.language]);
    else throw new Error();
  } catch (err: any) {
    console.error(err.message);
  }
};

export const setDefaultLanugage = () => {
  i18n.changeLanguage(deviceLanguage);
};
