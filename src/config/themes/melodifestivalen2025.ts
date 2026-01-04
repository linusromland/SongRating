import type { ThemeConfig } from '../index';

const melodifestivalen2025Songs = [
  // Heat 1
  {
    id: 'albinJohnsen',
    artist: 'Albin Johnsén feat. Pa',
    song: 'Upp i luften',
    youtubeUrl: 'https://youtu.be/IP87K0AIYGg',
  },
  {
    id: 'majaIvarsson',
    artist: 'Maja Ivarsson',
    song: 'Kamikaze Life',
    youtubeUrl: 'https://youtu.be/2PzB8r9DE1Y',
  },
  {
    id: 'johnLundvik',
    artist: 'John Lundvik',
    song: 'Voice of the Silent',
    youtubeUrl: 'https://youtu.be/1n0h_RfxMVo',
  },
  {
    id: 'meiraOmar',
    artist: 'Meira Omar',
    song: 'Hush Hush',
    youtubeUrl: 'https://youtu.be/YmBpmrAFwhY',
  },
  {
    id: 'adrianMaceus',
    artist: 'Adrian Macéus',
    song: 'Vår första gång',
    youtubeUrl: 'https://youtu.be/5QZgSkxwRVI',
  },
  {
    id: 'linneaHenriksson',
    artist: 'Linnea Henriksson',
    song: 'Den känslan',
    youtubeUrl: 'https://youtu.be/Ea2N0FTW4oE',
  },
  // Heat 2
  {
    id: 'nomiTales',
    artist: 'Nomi Tales',
    song: 'Funniest Thing',
    youtubeUrl: 'https://youtu.be/LqbefjnJwrI',
  },
  {
    id: 'schlagerz',
    artist: 'Schlagerz',
    song: 'Don Juan',
    youtubeUrl: 'https://youtu.be/5IoHf6Hmb2M',
  },
  {
    id: 'erikSegerstedt',
    artist: 'Erik Segerstedt',
    song: 'Show Me What Love Is',
    youtubeUrl: 'https://youtu.be/Y8HE5dad7G0',
  },
  {
    id: 'klaraHammarstrom',
    artist: 'Klara Hammarström',
    song: 'On and On and On',
    youtubeUrl: 'https://youtu.be/XGCQeSZU91Q',
  },
  {
    id: 'fredrikLundman',
    artist: 'Fredrik Lundman',
    song: 'The Heart of a Swedish Cowboy',
    youtubeUrl: 'https://youtu.be/_GUKoDtMvfM',
  },
  {
    id: 'kaliffa',
    artist: 'Kaliffa',
    song: 'Salute',
    youtubeUrl: 'https://youtu.be/vPp9B_En0oY',
  },
  // Heat 3
  {
    id: 'greczula',
    artist: 'Greczula',
    song: 'Believe Me',
    youtubeUrl: 'https://youtu.be/hZ6TvE5K5OI',
  },
  {
    id: 'malouPrytz',
    artist: 'Malou Prytz',
    song: '24K Gold',
    youtubeUrl: 'https://youtu.be/A3aey8Fq2kk',
  },
  {
    id: 'bjornHolmgren',
    artist: 'Björn Holmgren',
    song: 'Rädda mig',
    youtubeUrl: 'https://youtu.be/z6AlgMvoRCw',
  },
  {
    id: 'dollyStyle',
    artist: 'Dolly Style',
    song: 'Yihaa',
    youtubeUrl: 'https://youtu.be/MQAo-zrTolM',
  },
  {
    id: 'angelino',
    artist: 'Angelino',
    song: 'Teardrops',
    youtubeUrl: 'https://youtu.be/uoJNOmcH11w',
  },
  {
    id: 'annikaWickihalder',
    artist: 'Annika Wickihalder',
    song: 'Life Again',
    youtubeUrl: 'https://youtu.be/yj3vsbNwtis',
  },
  // Heat 4
  {
    id: 'andreasLundstedt',
    artist: 'Andreas Lundstedt',
    song: 'Vicious',
    youtubeUrl: 'https://youtu.be/h4-2ZG1nmh0',
  },
  {
    id: 'ellaTiritiello',
    artist: 'Ella Tiritiello',
    song: 'Bara du är där',
    youtubeUrl: 'https://youtu.be/C-bp6REIkEw',
  },
  {
    id: 'tennesseeTears',
    artist: 'Tennessee Tears',
    song: 'Yours',
    youtubeUrl: 'https://youtu.be/GCSZ6k8Eud4',
  },
  {
    id: 'kaj',
    artist: 'KAJ',
    song: 'Bara bada bastu',
    youtubeUrl: 'https://youtu.be/28__O2Ngc74',
  },
  {
    id: 'amena',
    artist: 'AmenA',
    song: 'Do Good Be Better',
    youtubeUrl: 'https://youtu.be/QYWp3RO8eWA',
  },
  {
    id: 'mansZelmerlow',
    artist: 'Måns Zelmerlöw',
    song: 'Revolution',
    youtubeUrl: 'https://youtu.be/IhPRo-zLuKY',
  },
  // Heat 5
  {
    id: 'arvingarna',
    artist: 'Arvingarna',
    song: 'Ring Baby Ring',
    youtubeUrl: 'https://youtu.be/OGNXvXse83M',
  },
  {
    id: 'arwin',
    artist: 'Arwin',
    song: 'This Dream of Mine',
    youtubeUrl: 'https://youtu.be/_00GjF6xBX4',
  },
  {
    id: 'sagaLudvigsson',
    artist: 'Saga Ludvigsson',
    song: 'Hate You So Much',
    youtubeUrl: 'https://youtu.be/RrJQztdljQM',
  },
  {
    id: 'victoriaSilvstedt',
    artist: 'Victoria Silvstedt',
    song: 'Love It!',
    youtubeUrl: 'https://youtu.be/Q_b1t8YweZI',
  },
  {
    id: 'vilhelmBuchaus',
    artist: 'Vilhelm Buchaus',
    song: 'I\'m Yours',
    youtubeUrl: 'https://youtu.be/OAhZrpDhliM',
  },
  {
    id: 'scarlet',
    artist: 'SCARLET',
    song: "Sweet n' Psycho",
    youtubeUrl: 'https://youtu.be/5dGLh8CCRtE',
  },
];

export const melodifestivalen2025Config: ThemeConfig = {
  id: 'melodifestivalen2025',
  name: 'Melodifestivalen',
  description:
    'Which song will win your heart? Compare songs from Melodifestivalen 2025 and build your ranking!',
  year: '2025',
  style: {
    primaryBg: '#0f1419',
    secondaryBg: '#1a2332',
    cardBg: '#2d3748',
    textColor: '#e2e8f0',
    headerTextColor: '#ffffff',
    accentColor1: '#3182ce',
    accentColor2: '#63b3ed',
    goldAccent: '#ecc94b',
  },
  songs: melodifestivalen2025Songs,
};
