import React, {
  createContext,
  ReactNode,
  useContext,
  useMemo,
  useState
} from "react";

export type Language = "zh" | "en";

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
  t: (key: TranslationKey) => string;
};

export type TranslationKey =
  | "ai.audio"
  | "ai.language.current"
  | "ai.language.switchTo"
  | "ai.vibrate"
  | "home.accessibility.menu"
  | "home.accessibility.search"
  | "home.channels.food"
  | "home.channels.live"
  | "home.channels.outfit"
  | "home.channels.recommend"
  | "home.channels.red"
  | "home.channels.shortDrama"
  | "home.channels.travel"
  | "home.tabs.city"
  | "home.tabs.discover"
  | "home.tabs.following"
  | "language.en"
  | "language.zh"
  | "pet.actions.feed"
  | "pet.actions.play"
  | "pet.actions.rest"
  | "pet.messages.drag"
  | "pet.messages.feed"
  | "pet.messages.idle"
  | "pet.messages.play"
  | "pet.messages.rest"
  | "pet.messages.touch"
  | "pet.moods.fed"
  | "pet.moods.happy"
  | "pet.moods.idle"
  | "pet.moods.playful"
  | "pet.moods.sleepy"
  | "pet.name"
  | "pet.stats.bond"
  | "pet.stats.energy"
  | "pet.stats.hunger"
  | "tabs.home"
  | "tabs.profile";

const TRANSLATIONS: Record<Language, Record<TranslationKey, string>> = {
  zh: {
    "ai.audio": "\u97f3\u9891",
    "ai.language.current": "\u5f53\u524d\u8bed\u8a00",
    "ai.language.switchTo": "\u5207\u6362\u4e3a",
    "ai.vibrate": "\u6296\u52a8",
    "home.accessibility.menu": "\u6253\u5f00\u83dc\u5355",
    "home.accessibility.search": "\u641c\u7d22",
    "home.channels.food": "\u7f8e\u98df",
    "home.channels.live": "\u76f4\u64ad",
    "home.channels.outfit": "\u7a7f\u642d",
    "home.channels.recommend": "\u63a8\u8350",
    "home.channels.red": "RED",
    "home.channels.shortDrama": "\u77ed\u5267",
    "home.channels.travel": "\u65c5\u884c",
    "home.tabs.city": "\u91cd\u5e86",
    "home.tabs.discover": "\u53d1\u73b0",
    "home.tabs.following": "\u5173\u6ce8",
    "language.en": "\u82f1\u6587",
    "language.zh": "\u4e2d\u6587",
    "pet.actions.feed": "\u5582\u98df",
    "pet.actions.play": "\u9017\u73a9",
    "pet.actions.rest": "\u4f11\u606f",
    "pet.messages.drag":
      "\u5c0f\u706b\u7075\u628a\u4f60\u7684\u624b\u5f53\u6210\u4e86\u8bad\u7ec3\u76ee\u6807",
    "pet.messages.feed":
      "\u5c0f\u706b\u7075\u5403\u5230\u4e86\u6696\u70d8\u70d8\u7684\u706b\u82b1\u679c",
    "pet.messages.idle":
      "\u5c0f\u706b\u7075\u6b63\u5728\u7b49\u4f60\u6478\u6478\u5b83",
    "pet.messages.play":
      "\u5b83\u6446\u51fa\u6218\u6597\u59ff\u52bf\uff0c\u60f3\u518d\u6765\u4e00\u8f6e",
    "pet.messages.rest":
      "\u5c0f\u706b\u7075\u8db4\u4e0b\u6765\u6253\u4e86\u4e00\u4e2a\u6696\u6696\u7684\u54c8\u6b20",
    "pet.messages.touch":
      "\u5b83\u8e6d\u8fc7\u6765\u4e86\uff0c\u5c3e\u5df4\u7684\u706b\u82d7\u4eae\u4e86\u4e00\u4e0b",
    "pet.moods.fed": "\u6ee1\u8db3",
    "pet.moods.happy": "\u88ab\u6478\u6478",
    "pet.moods.idle": "\u5f85\u673a",
    "pet.moods.playful": "\u5174\u594b",
    "pet.moods.sleepy": "\u4f11\u606f\u4e2d",
    "pet.name": "\u5c0f\u706b\u7075",
    "pet.stats.bond": "\u4eb2\u5bc6",
    "pet.stats.energy": "\u7cbe\u529b",
    "pet.stats.hunger": "\u9971\u8179",
    "tabs.home": "\u9996\u9875",
    "tabs.profile": "\u6211"
  },
  en: {
    "ai.audio": "Audio",
    "ai.language.current": "Current language",
    "ai.language.switchTo": "Switch to",
    "ai.vibrate": "Vibrate",
    "home.accessibility.menu": "Open menu",
    "home.accessibility.search": "Search",
    "home.channels.food": "Food",
    "home.channels.live": "Live",
    "home.channels.outfit": "Outfits",
    "home.channels.recommend": "For You",
    "home.channels.red": "RED",
    "home.channels.shortDrama": "Drama",
    "home.channels.travel": "Travel",
    "home.tabs.city": "Chongqing",
    "home.tabs.discover": "Discover",
    "home.tabs.following": "Following",
    "language.en": "English",
    "language.zh": "Chinese",
    "pet.actions.feed": "Feed",
    "pet.actions.play": "Play",
    "pet.actions.rest": "Rest",
    "pet.messages.drag": "Flarelet turns your hand into a training target.",
    "pet.messages.feed": "Flarelet ate a warm spark fruit.",
    "pet.messages.idle": "Flarelet is waiting for a gentle pat.",
    "pet.messages.play": "It takes a battle stance and wants another round.",
    "pet.messages.rest": "Flarelet curls up with a cozy yawn.",
    "pet.messages.touch": "It nudges closer, and its tail flame flickers.",
    "pet.moods.fed": "Satisfied",
    "pet.moods.happy": "Petted",
    "pet.moods.idle": "Idle",
    "pet.moods.playful": "Excited",
    "pet.moods.sleepy": "Resting",
    "pet.name": "Flarelet",
    "pet.stats.bond": "Bond",
    "pet.stats.energy": "Energy",
    "pet.stats.hunger": "Full",
    "tabs.home": "Home",
    "tabs.profile": "Me"
  }
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

type LanguageProviderProps = {
  children: ReactNode;
};

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguage] = useState<Language>("zh");

  const value = useMemo<LanguageContextValue>(() => {
    const t = (key: TranslationKey) => TRANSLATIONS[language][key];
    const toggleLanguage = () => {
      setLanguage((current) => (current === "zh" ? "en" : "zh"));
    };

    return {
      language,
      setLanguage,
      toggleLanguage,
      t
    };
  }, [language]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider.");
  }

  return context;
}
