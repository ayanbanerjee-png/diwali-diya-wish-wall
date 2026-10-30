import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "en" | "hi";
type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (k: keyof typeof dict.en) => string };

export const dict = {
  en: {
    night: "Lakshmi Puja (Night)", evening: "Choti Diwali (Evening)", tagline: "A Virtual Place of Light",
    online: "devotees lighting diyas online", Days: "Days", Hours: "Hours", Minutes: "Minutes", Seconds: "Seconds",
    until: "until Diwali · 8 November 2026", lightTitle: "Light a Diya", worldwide: "diyas lit worldwide", byYou: "by you",
    lightBtn: "Light a Diya", glowHere: "Your diyas will glow here.", wall: "Wish & Blessing Wall",
    yourName: "Your Name", writeWish: "Write a Wish/Greeting", share: "Share Blessing", sharing: "Sharing…",
    journey: "The Five Days of Deepavali", day: "Day", rituals: "Rituals", significance: "Significance",
    lyrics: "Lyrics", playlist: "Aarti Playlist", echo: "Temple Echo", reverb: "Reverb/Delay",
    errDiya: "Couldn't light your diya, please try again.", errWish: "Couldn't post your wish, please try again.",
  },
  hi: {
    night: "लक्ष्मी पूजा (रात्रि)", evening: "छोटी दिवाली (संध्या)", tagline: "प्रकाश का एक आभासी स्थान",
    online: "भक्त ऑनलाइन दीये जला रहे हैं", Days: "दिन", Hours: "घंटे", Minutes: "मिनट", Seconds: "सेकंड",
    until: "दिवाली तक · 8 नवंबर 2026", lightTitle: "दीया जलाएँ", worldwide: "दीये विश्वभर में जले", byYou: "आपके द्वारा",
    lightBtn: "दीया जलाएँ", glowHere: "आपके दीये यहाँ जगमगाएँगे।", wall: "शुभकामना एवं आशीर्वाद दीवार",
    yourName: "आपका नाम", writeWish: "अपनी शुभकामना लिखें", share: "आशीर्वाद भेजें", sharing: "भेजा जा रहा है…",
    journey: "दीपावली के पाँच दिन", day: "दिन", rituals: "विधि", significance: "महत्व",
    lyrics: "बोल", playlist: "आरती सूची", echo: "मंदिर गूँज", reverb: "रिवर्ब/डिले",
    errDiya: "दीया नहीं जल सका, फिर से प्रयास करें।", errWish: "शुभकामना नहीं भेजी जा सकी, फिर से प्रयास करें।",
  },
};

const LangCtx = createContext<Ctx | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");
  useEffect(() => { if (localStorage.getItem("dd-lang") === "hi") setLangState("hi"); }, []);
  useEffect(() => { document.documentElement.lang = lang; }, [lang]);
  const setLang = (l: Lang) => { setLangState(l); localStorage.setItem("dd-lang", l); };
  return <LangCtx.Provider value={{ lang, setLang, t: (k) => dict[lang][k] }}>{children}</LangCtx.Provider>;
}

export function useLang() {
  const c = useContext(LangCtx);
  if (!c) throw new Error("useLang outside LangProvider");
  return c;
}
