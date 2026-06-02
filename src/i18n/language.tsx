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
  | "tabs.pet"
  | "tabs.profile"
  | "tabs.workbench"
  | "tool.badges.hot"
  | "tool.demo.subtitle"
  | "tool.demo.title"
  | "tool.items.conversion.description"
  | "tool.items.conversion.title"
  | "tool.items.kpi.description"
  | "tool.items.kpi.title"
  | "tool.items.material.description"
  | "tool.items.material.title"
  | "tool.items.monitor.description"
  | "tool.items.monitor.title"
  | "tool.items.parameter.description"
  | "tool.items.parameter.title"
  | "tool.items.quiz.description"
  | "tool.items.quiz.title"
  | "tool.items.simulation.description"
  | "tool.items.simulation.title"
  | "tool.items.startup.description"
  | "tool.items.startup.title"
  | "tool.search.placeholder"
  | "tool.sections.process.subtitle"
  | "tool.sections.process.title"
  | "tool.sections.training.subtitle"
  | "tool.sections.training.title"
  | "tool.stats.pending"
  | "tool.stats.todayQueries"
  | "tool.stats.trainingProgress"
  | "tool.summary.status"
  | "tool.summary.text"
  | "tool.summary.title"
  | "tool.title";

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
    "tabs.pet": "\u5ba0\u7269",
    "tabs.profile": "\u6211",
    "tabs.workbench": "\u5de5\u4f5c\u53f0",
    "tool.badges.hot": "\u70ed",
    "tool.demo.subtitle": "\u4fdd\u7559\u539f\u59cb\u4ea4\u4e92\u6309\u94ae",
    "tool.demo.title": "\u6f14\u793a\u529f\u80fd",
    "tool.items.conversion.description":
      "\u8f6c\u5316\u7387\u3001\u80fd\u8017\u4e0e\u635f\u5931\u5206\u6790",
    "tool.items.conversion.title": "\u8f6c\u5316\u5206\u6790",
    "tool.items.kpi.description": "\u5173\u952e\u6307\u6807\u8d8b\u52bf\u4e0e\u8fbe\u6210\u7387",
    "tool.items.kpi.title": "KPI \u6307\u6807",
    "tool.items.material.description":
      "\u539f\u6599\u914d\u6bd4\u4e0e\u5e93\u5b58\u504f\u5dee\u6821\u9a8c",
    "tool.items.material.title": "\u7269\u6599\u5e73\u8861",
    "tool.items.monitor.description":
      "\u8bbe\u5907\u72b6\u6001\u3001\u62a5\u8b66\u4e0e\u70b9\u68c0",
    "tool.items.monitor.title": "\u5b9e\u65f6\u76d1\u63a7",
    "tool.items.parameter.description":
      "\u914d\u65b9\u3001\u6e29\u5ea6\u3001\u538b\u529b\u53c2\u6570\u901f\u67e5",
    "tool.items.parameter.title": "\u53c2\u6570\u67e5\u8be2",
    "tool.items.quiz.description":
      "\u6bcf\u65e5 10 \u9898\uff0c\u5de9\u56fa\u57fa\u7840\u77e5\u8bc6",
    "tool.items.quiz.title": "\u5c0f\u793c\u5237\u9898",
    "tool.items.simulation.description":
      "\u4eff\u771f\u6f14\u7ec3\u4e0e\u5f02\u5e38\u5904\u7f6e",
    "tool.items.simulation.title": "\u4eff\u771f\u7cfb\u7edf",
    "tool.items.startup.description":
      "\u5f00\u505c\u8f66\u6b65\u9aa4\u3001\u98ce\u9669\u70b9\u63d0\u9192",
    "tool.items.startup.title": "\u5f00\u8f66\u5bfc\u822a",
    "tool.search.placeholder": "\u641c\u7d22\u53c2\u6570\u3001\u6307\u6807\u3001\u57f9\u8bad\u5185\u5bb9",
    "tool.sections.process.subtitle": "\u751f\u4ea7\u8fc7\u7a0b\u5e38\u7528\u5de5\u5177",
    "tool.sections.process.title": "\u5de5\u827a\u529f\u80fd",
    "tool.sections.training.subtitle": "\u65b0\u4eba\u7ec3\u4e60\u4e0e\u80fd\u529b\u63d0\u5347",
    "tool.sections.training.title": "\u5de5\u827a\u57f9\u8bad",
    "tool.stats.pending": "\u5f85\u5904\u7406",
    "tool.stats.todayQueries": "\u4eca\u65e5\u67e5\u8be2",
    "tool.stats.trainingProgress": "\u57f9\u8bad\u8fdb\u5ea6",
    "tool.summary.status": "\u8fd0\u884c\u4e2d",
    "tool.summary.text": "2 \u6761\u6307\u6807\u9884\u8b66\uff0c6 \u9879\u4efb\u52a1\u5f85\u786e\u8ba4",
    "tool.summary.title": "\u4eca\u65e5\u5de5\u827a\u6982\u89c8",
    "tool.title": "\u5de5\u827a\u5de5\u4f5c\u53f0"
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
    "tabs.pet": "Pet",
    "tabs.profile": "Me",
    "tabs.workbench": "Workbench",
    "tool.badges.hot": "Hot",
    "tool.demo.subtitle": "Original interaction buttons",
    "tool.demo.title": "Demo tools",
    "tool.items.conversion.description": "Conversion, energy use, and loss analysis",
    "tool.items.conversion.title": "Conversion",
    "tool.items.kpi.description": "Key trends and completion rate",
    "tool.items.kpi.title": "KPI",
    "tool.items.material.description": "Ratio checks and inventory variance",
    "tool.items.material.title": "Material balance",
    "tool.items.monitor.description": "Equipment state, alarms, and inspection",
    "tool.items.monitor.title": "Live monitor",
    "tool.items.parameter.description": "Recipe, temperature, and pressure lookup",
    "tool.items.parameter.title": "Parameters",
    "tool.items.quiz.description": "10 daily questions to build fundamentals",
    "tool.items.quiz.title": "Daily quiz",
    "tool.items.simulation.description": "Simulation drills and abnormal handling",
    "tool.items.simulation.title": "Simulator",
    "tool.items.startup.description": "Startup steps and risk reminders",
    "tool.items.startup.title": "Startup guide",
    "tool.search.placeholder": "Search parameters, metrics, training",
    "tool.sections.process.subtitle": "Common tools for production workflow",
    "tool.sections.process.title": "Process tools",
    "tool.sections.training.subtitle": "Practice and skill development",
    "tool.sections.training.title": "Training",
    "tool.stats.pending": "Pending",
    "tool.stats.todayQueries": "Queries today",
    "tool.stats.trainingProgress": "Training",
    "tool.summary.status": "Running",
    "tool.summary.text": "2 metric alerts, 6 tasks pending confirmation",
    "tool.summary.title": "Today's process overview",
    "tool.title": "Process workbench"
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
