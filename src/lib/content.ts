export type L = { en: string; hi: string };

export const DAYS: { name: L; date: L; time: L; mantra: string; about: L; rituals: L[] }[] = [
  {
    name: { en: "Dhanteras", hi: "धनतेरस" }, date: { en: "6 Nov 2026 · Kartik Krishna Trayodashi", hi: "6 नवंबर 2026 · कार्तिक कृष्ण त्रयोदशी" },
    time: { en: "Puja in Pradosh Kaal, after sunset", hi: "पूजा प्रदोष काल में, सूर्यास्त के बाद" },
    mantra: "ॐ धन्वंतरये नमः",
    about: { en: "Honours Lord Dhanvantari and Kubera — a day for health and prosperity.", hi: "भगवान धन्वंतरि और कुबेर की आराधना — स्वास्थ्य एवं समृद्धि का दिन।" },
    rituals: [{ en: "Buy new utensils or gold", hi: "नए बर्तन या सोना खरीदें" }, { en: "Light the Yama Deepam at the doorstep", hi: "द्वार पर यम दीपक जलाएँ" }, { en: "Worship Dhanvantari and Kubera", hi: "धन्वंतरि व कुबेर की पूजा करें" }],
  },
  {
    name: { en: "Choti Diwali", hi: "छोटी दिवाली" }, date: { en: "7 Nov 2026 · Narak Chaturdashi", hi: "7 नवंबर 2026 · नरक चतुर्दशी" },
    time: { en: "Abhyang Snan before sunrise", hi: "सूर्योदय से पहले अभ्यंग स्नान" },
    mantra: "ॐ नमो भगवते वासुदेवाय",
    about: { en: "Celebrates Krishna's victory over Narakasura — light over darkness.", hi: "नरकासुर पर श्रीकृष्ण की विजय — अंधकार पर प्रकाश।" },
    rituals: [{ en: "Oil bath at dawn", hi: "भोर में तेल स्नान" }, { en: "Light 14 diyas around the home", hi: "घर में 14 दीये जलाएँ" }, { en: "Draw rangoli at the entrance", hi: "द्वार पर रंगोली बनाएँ" }],
  },
  {
    name: { en: "Lakshmi Puja", hi: "लक्ष्मी पूजा" }, date: { en: "8 Nov 2026 · Kartik Amavasya", hi: "8 नवंबर 2026 · कार्तिक अमावस्या" },
    time: { en: "Puja in Pradosh Kaal / Sthir Lagna, evening", hi: "प्रदोष काल / स्थिर लग्न में संध्या पूजा" },
    mantra: "ॐ श्रीं महालक्ष्म्यै नमः",
    about: { en: "The main night — welcoming Goddess Lakshmi and Lord Ganesha into the home.", hi: "मुख्य रात्रि — माँ लक्ष्मी और श्री गणेश का घर में स्वागत।" },
    rituals: [{ en: "Clean and decorate the home", hi: "घर की सफ़ाई व सजावट" }, { en: "Perform Lakshmi–Ganesh puja", hi: "लक्ष्मी-गणेश पूजन करें" }, { en: "Light diyas in every corner", hi: "हर कोने में दीये जलाएँ" }],
  },
  {
    name: { en: "Govardhan Puja", hi: "गोवर्धन पूजा" }, date: { en: "9 Nov 2026 · Kartik Shukla Pratipada", hi: "9 नवंबर 2026 · कार्तिक शुक्ल प्रतिपदा" },
    time: { en: "Morning puja and Annakut offering", hi: "प्रातः पूजा एवं अन्नकूट भोग" },
    mantra: "ॐ गोवर्धनधराय नमः",
    about: { en: "Remembers Krishna lifting Govardhan hill to shelter the people of Vrindavan.", hi: "श्रीकृष्ण द्वारा गोवर्धन पर्वत उठाकर ब्रजवासियों की रक्षा का स्मरण।" },
    rituals: [{ en: "Make a Govardhan from cow dung or clay", hi: "गोबर/मिट्टी से गोवर्धन बनाएँ" }, { en: "Offer Annakut (56 bhog)", hi: "अन्नकूट (छप्पन भोग) अर्पित करें" }, { en: "Parikrama of Govardhan", hi: "गोवर्धन परिक्रमा" }],
  },
  {
    name: { en: "Bhai Dooj", hi: "भाई दूज" }, date: { en: "10 Nov 2026 · Kartik Shukla Dwitiya", hi: "10 नवंबर 2026 · कार्तिक शुक्ल द्वितीया" },
    time: { en: "Tilak in the afternoon (Aparahna)", hi: "अपराह्न में तिलक" },
    mantra: "ॐ यमाय नमः",
    about: { en: "Celebrates the bond of brothers and sisters, inspired by Yama and Yamuna.", hi: "यम और यमुना की कथा से प्रेरित भाई-बहन के प्रेम का पर्व।" },
    rituals: [{ en: "Sister applies tilak to brother", hi: "बहन भाई को तिलक लगाती है" }, { en: "Aarti and sweets", hi: "आरती व मिठाई" }, { en: "Exchange of gifts", hi: "उपहारों का आदान-प्रदान" }],
  },
];

export type Track = { title: L; root: number; scale: number[]; tempo: number; lyricsHi: string; lyricsEn: string };

export const TRACKS: Track[] = [
  { title: { en: "Om Jai Lakshmi Mata", hi: "ॐ जय लक्ष्मी माता" }, root: 261.63, scale: [0, 2, 4, 5, 7, 9, 11, 12], tempo: 0.6,
    lyricsHi: "ॐ जय लक्ष्मी माता, मैया जय लक्ष्मी माता।\nतुमको निशदिन सेवत, हरि विष्णु विधाता॥\nउमा रमा ब्रह्माणी, तुम ही जग-माता।\nसूर्य-चंद्रमा ध्यावत, नारद ऋषि गाता॥",
    lyricsEn: "Om Jai Lakshmi Mata, Maiya Jai Lakshmi Mata.\nTumko nishdin sevat, Hari Vishnu Vidhata.\nUma Rama Brahmani, tum hi jag-mata.\nSurya-Chandrama dhyavat, Narad rishi gata.\n\nGlory to Mother Lakshmi, served day and night by Vishnu and Brahma — mother of the world." },
  { title: { en: "Jai Ganesh Deva", hi: "जय गणेश देवा" }, root: 293.66, scale: [0, 2, 4, 7, 9, 12], tempo: 0.5,
    lyricsHi: "जय गणेश जय गणेश, जय गणेश देवा।\nमाता जाकी पार्वती, पिता महादेवा॥\nएक दंत दयावंत, चार भुजा धारी।\nमाथे सिंदूर सोहे, मूसे की सवारी॥",
    lyricsEn: "Jai Ganesh Jai Ganesh, Jai Ganesh Deva.\nMata jaki Parvati, pita Mahadeva.\nEk dant dayavant, char bhuja dhari.\nMathe sindoor sohe, moose ki savari.\n\nGlory to Lord Ganesha, son of Parvati and Shiva — the kind one-tusked, four-armed god who rides a mouse." },
  { title: { en: "Shri Ramchandra Kripalu", hi: "श्री रामचंद्र कृपालु" }, root: 220, scale: [0, 2, 3, 5, 7, 8, 10, 12], tempo: 0.8,
    lyricsHi: "श्री रामचन्द्र कृपालु भजु मन हरण भवभय दारुणम्।\nनवकंज लोचन कंज मुख कर कंज पद कंजारुणम्॥",
    lyricsEn: "Shri Ramchandra kripalu bhaju man harana bhava bhaya darunam.\nNava kanja lochana kanja mukha kara kanja pada kanjarunam.\n\nO mind, worship the merciful Shri Rama, who removes the fear of worldly existence — lotus-eyed, lotus-faced. (Goswami Tulsidas)" },
  { title: { en: "Saraswati Vandana", hi: "सरस्वती वंदना" }, root: 329.63, scale: [0, 2, 4, 6, 7, 9, 11, 12], tempo: 0.7,
    lyricsHi: "या कुन्देन्दुतुषारहारधवला या शुभ्रवस्त्रावृता।\nया वीणावरदण्डमण्डितकरा या श्वेतपद्मासना॥",
    lyricsEn: "Ya kundendu tushara hara dhavala, ya shubhra vastravrita.\nYa veena varadanda mandita kara, ya shveta padmasana.\n\nShe who is white as jasmine, the moon and snow, clad in white, holding the veena, seated on a white lotus." },
  { title: { en: "Govardhan Bhajan", hi: "गोवर्धन भजन" }, root: 246.94, scale: [0, 2, 4, 5, 7, 9, 10, 12], tempo: 0.45,
    lyricsHi: "श्री गोवर्धन महाराज, ओ महाराज,\nतेरे माथे मुकुट विराज रहेओ॥\nतोपे पान चढ़े तोपे फूल चढ़े,\nतोपे चढ़े दूध की धार॥",
    lyricsEn: "Shri Govardhan Maharaj, O Maharaj,\nTere mathe mukut viraj raheo.\nTope paan chadhe, tope phool chadhe,\nTope chadhe doodh ki dhaar.\n\nO great Govardhan, a crown shines on your brow; we offer you betel, flowers and streams of milk." },
  { title: { en: "Temple Ambience", hi: "मंदिर वातावरण" }, root: 130.81, scale: [0, 2, 4, 7, 9, 12], tempo: 2.4,
    lyricsHi: "ॐ — शांति, शांति, शांति।\n(मंद तानपुरा और मंदिर की घंटियाँ)",
    lyricsEn: "Om — Shanti, Shanti, Shanti.\n(A gentle tanpura drone with temple bells)" },
];
