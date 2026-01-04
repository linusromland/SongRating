import type { ThemeConfig } from '../index';

const eurovision2025Songs = [
    {
        "id": "al",
        "header": "Albania",
        "icon": "🇦🇱",
        "artist": "Shkodra Elektronike",
        "song": "Zjerm",
        "youtubeUrl": "https://youtu.be/Sfvb761EEcM?si=XiisSSNHCQzQ8lsa"
    },
    {
        "id": "fr",
        "header": "France",
        "icon": "🇫🇷",
        "artist": "Louane",
        "song": "maman",
        "youtubeUrl": "https://youtu.be/ZFWzMZh47d0?si=NFmwVQE3rLKgmzy5"
    },
    {
        "id": "it",
        "header": "Italy",
        "icon": "🇮🇹",
        "artist": "Lucio Corsi",
        "song": "Volevo Essere Un Duro",
        "youtubeUrl": "https://youtu.be/-Alz9MnqyZI?si=VnZxRp-YWTj16wPQ"
    },
    {
        "id": "gb",
        "header": "United Kingdom",
        "icon": "🇬🇧",
        "artist": "Remember Monday",
        "song": "What The Hell Just Happened?",
        "youtubeUrl": "https://youtu.be/-hu6R3ZnOdY?si=tnm51kKSjdRG_WZ7"
    },
    {
        "id": "at",
        "header": "Austria",
        "icon": "🇦🇹",
        "artist": "JJ",
        "song": "Wasted Love",
        "youtubeUrl": "https://youtu.be/-ieSTNpxvio?si=kYoVVr0IgkcAmEhS"
    },
    {
        "id": "pt",
        "header": "Portugal",
        "icon": "🇵🇹",
        "artist": "NAPA",
        "song": "Deslocado",
        "youtubeUrl": "https://youtu.be/-s1Cc2uEj3U?si=4nVsQy2fv7_HOQSy"
    },
    {
        "id": "ee",
        "header": "Estonia",
        "icon": "🇪🇪",
        "artist": "Tommy Cash",
        "song": "Espresso Macchiato",
        "youtubeUrl": "https://youtu.be/5MS_Fczs_98?si=v-4Qmhs429tepopI"
    },
    {
        "id": "es",
        "header": "Spain",
        "icon": "🇪🇸",
        "artist": "Melody",
        "song": "ESA DIVA",
        "youtubeUrl": "https://youtu.be/BvVxhbCW9rw?si=63_W3GpSd0oVMbek"
    },
    {
        "id": "cz",
        "header": "Czechia",
        "icon": "🇨🇿",
        "artist": "ADONXS",
        "song": "Kiss Kiss Goodbye",
        "youtubeUrl": "https://youtu.be/Hm8CIICKAJU?si=F0GnI8jEEfKFlyVD"
    },
    {
        "id": "fi",
        "header": "Finland",
        "icon": "🇫🇮",
        "artist": "Erika Vikman",
        "song": "ICH KOMME",
        "youtubeUrl": "https://youtu.be/Kg3QoTpnqyw?si=YxjF8UYF6JvyPqIi"
    },
    {
        "id": "lu",
        "header": "Luxembourg",
        "icon": "🇱🇺",
        "artist": "Laura Thorn",
        "song": "La Poupée Monte Le Son",
        "youtubeUrl": "https://youtu.be/LVHu_KwHiKY?si=o7OGXmI8D9PXk8a2"
    },
    {
        "id": "sm",
        "header": "San Marino",
        "icon": "🇸🇲",
        "artist": "Gabry Ponte",
        "song": "Tutta L'Italia",
        "youtubeUrl": "https://youtu.be/Le3WpaLYRvE?si=DZcQF_2oyF2MlqRm"
    },
    {
        "id": "ua",
        "header": "Ukraine",
        "icon": "🇺🇦",
        "artist": "Ziferblat",
        "song": "Bird of Pray",
        "youtubeUrl": "https://youtu.be/OJ1x2aiL7ks?si=AqkICwnnRJUQ40Yk"
    },
    {
        "id": "il",
        "header": "Israel",
        "icon": "🇮🇱",
        "artist": "Yuval Raphael",
        "song": "New Day Will Rise",
        "youtubeUrl": "https://youtu.be/Q3BELu4z6-U?si=XYwFogJof3hMEAer"
    },
    {
        "id": "lt",
        "header": "Lithuania",
        "icon": "🇱🇹",
        "artist": "Katarsis",
        "song": "Tavo Akys",
        "youtubeUrl": "https://youtu.be/R2f2aZ6Fy58?si=z27-nrmSOY-R1fK6"
    },
    {
        "id": "lv",
        "header": "Latvia",
        "icon": "🇱🇻",
        "artist": "Tautumeitas",
        "song": "Bur Man Laimi",
        "youtubeUrl": "https://youtu.be/RKw0OCgPV3s?si=lz1k4M38s-AbYoeo"
    },
    {
        "id": "am",
        "header": "Armenia",
        "icon": "🇦🇲",
        "artist": "PARG",
        "song": "SURVIVOR",
        "youtubeUrl": "https://youtu.be/RfH5o3XtI2c?si=OYnEVu98niFEaKDu"
    },
    {
        "id": "be",
        "header": "Belgium",
        "icon": "🇧🇪",
        "artist": "Red Sebastian",
        "song": "Strobe Lights",
        "youtubeUrl": "https://youtu.be/ScupiVTosHU?si=A3jOQ2XXVENXfjHt"
    },
    {
        "id": "se",
        "header": "Sweden",
        "icon": "🇸🇪",
        "artist": "KAJ",
        "song": "Bara Bada Bastu",
        "youtubeUrl": "https://youtu.be/WK3HOMhAeQY?si=IGlRscboWTsJJHvE"
    },
    {
        "id": "pl",
        "header": "Poland",
        "icon": "🇵🇱",
        "artist": "Justyna Steczkowska",
        "song": "GAJA",
        "youtubeUrl": "https://youtu.be/YXHHDjiclxA?si=Q4_CQ_cVWN3zmb1N"
    },
    {
        "id": "au",
        "header": "Australia",
        "icon": "🇦🇺",
        "artist": "Go-Jo",
        "song": "Milkshake Man",
        "youtubeUrl": "https://youtu.be/_08I6mjHSLA?si=N8SwubJMuotWaJGE"
    },
    {
        "id": "gr",
        "header": "Greece",
        "icon": "🇬🇷",
        "artist": "Klavdia",
        "song": "Asteromáta",
        "youtubeUrl": "https://youtu.be/aDiq8J9h6vQ?si=hAtKRXw51tX3KP3_"
    },
    {
        "id": "ge",
        "header": "Georgia",
        "icon": "🇬🇪",
        "artist": "Mariam Shengelia",
        "song": "Freedom",
        "youtubeUrl": "https://youtu.be/c3wu0dUNd4c?si=jODpY_VF8TdIBqco"
    },
    {
        "id": "ie",
        "header": "Ireland",
        "icon": "🇮🇪",
        "artist": "EMMY",
        "song": "Laika Party",
        "youtubeUrl": "https://youtu.be/cZnusVb7yjs?si=Poqrwq9gK7UQsg-r"
    },
    {
        "id": "ch",
        "header": "Switzerland",
        "icon": "🇨🇭",
        "artist": "Zoë Më",
        "song": "Voyage",
        "youtubeUrl": "https://youtu.be/dGX54zRExR8?si=yezRRd0QGGun7N3A"
    },
    {
        "id": "dk",
        "header": "Denmark",
        "icon": "🇩🇰",
        "artist": "Sissal",
        "song": "Hallucination",
        "youtubeUrl": "https://youtu.be/gdCAgiSIOUc?si=20-di5RIdzV6TQBp"
    },
    {
        "id": "nl",
        "header": "Netherlands",
        "icon": "🇳🇱",
        "artist": "Claude",
        "song": "C'est La Vie",
        "youtubeUrl": "https://youtu.be/hEHwr5k9pd0?si=WX-N80gOpqx3rpqZ"
    },
    {
        "id": "hr",
        "header": "Croatia",
        "icon": "🇭🇷",
        "artist": "Marko Bošnjak",
        "song": "Poison Cake",
        "youtubeUrl": "https://youtu.be/ie_v6qGCc5w?si=g03yY8CTWP_SDMB4"
    },
    {
        "id": "no",
        "header": "Norway",
        "icon": "🇳🇴",
        "artist": "Kyle Alessandro",
        "song": "Lighter",
        "youtubeUrl": "https://youtu.be/pUjWzQ671MQ?si=uVaaM-EAZEqWyrTm"
    },
    {
        "id": "cy",
        "header": "Cyprus",
        "icon": "🇨🇾",
        "artist": "Theo Evan",
        "song": "Shh",
        "youtubeUrl": "https://youtu.be/rbfQqWyqgJw?si=CrfFaWsCqQYV1vad"
    },
    {
        "id": "is",
        "header": "Iceland",
        "icon": "🇮🇸",
        "artist": "VÆB",
        "song": "RÓA",
        "youtubeUrl": "https://youtu.be/s9P83Nl6D1M?si=r0hdLoAIFK3yJY_-"
    },
    {
        "id": "mt",
        "header": "Malta",
        "icon": "🇲🇹",
        "artist": "Miriana Conte",
        "song": "SERVING",
        "youtubeUrl": "https://youtu.be/sLVSwfRRvMA?si=Bgd1OFhGDe7eRmJx"
    },
    {
        "id": "az",
        "header": "Azerbaijan",
        "icon": "🇦🇿",
        "artist": "Mamagama",
        "song": "Run With U",
        "youtubeUrl": "https://youtu.be/upbiPJ9uA70?si=hwIMfIxd1BS7Nuii"
    },
    {
        "id": "me",
        "header": "Montenegro",
        "icon": "🇲🇪",
        "artist": "Nina Žižić",
        "song": "Dobrodošli",
        "youtubeUrl": "https://youtu.be/ydMkpaB0CWk?si=iVlMt8KPo24PNm0f"
    },
    {
        "id": "de",
        "header": "Germany",
        "icon": "🇩🇪",
        "artist": "Abor & Tynna",
        "song": "Baller",
        "youtubeUrl": "https://youtu.be/zJplC4-9Scs?si=mvjJqymWer5SYp23"
    },
    {
        "id": "rs",
        "header": "Serbia",
        "icon": "🇷🇸",
        "artist": "Princ",
        "song": "Mila",
        "youtubeUrl": "https://youtu.be/18BCbtvDcag?si=JVHIpbe1r7v9L8YS"
    },
    {
        "id": "sl",
        "header": "Slovenia",
        "icon": "🇸🇮",
        "artist": "Klemen",
        "song": "How Much Time Do We Have Left",
        "youtubeUrl": "https://youtu.be/GT1YhfRpq3Q?si=GwCSzDZjAzSdfCK6"
    }
];

export const eurovision2025Config: ThemeConfig = {
    id: 'eurovision2025',
    name: 'Eurovision Song Contest 2025',
    title: 'Eurovision 2025 Song Rating',
    description: 'Who will win your heart? Compare the songs from Eurovision Song Contest 2025 and build your ranking!',
    year: '2025',
    scoreboardTitle: 'Eurovision 2025 Personal Scoreboard',
    loadingMessage: 'Initializing Eurovision Scoreboard...',
    shareDialogPlaceholder: 'E.g., My Eurovision Top 10',
    localStorageKey: 'eurovisionEloRatings',
    style: {
        primaryBg: '#1a1a2e',
        secondaryBg: '#16213e', 
        cardBg: '#2c3e50',
        textColor: '#e0e0e0',
        headerTextColor: '#ffffff',
        accentColor1: '#e94560',
        accentColor2: '#00f5d4',
        goldAccent: '#f9d71c'
    },
    songs: eurovision2025Songs
};