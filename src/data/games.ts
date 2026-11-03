import type { ImageMetadata } from 'astro';
import broke from '../assets/games/broke-logo.jpg';
import undivided from '../assets/games/undivided.png';
import fishload from '../assets/games/fishload.png';
import onirica from '../assets/games/onirica.png';
import caffeinship from '../assets/games/caffeinship.png';
import loupe from '../assets/games/loupe.png';
import storyOfYourLife from '../assets/games/story-of-your-life.png';

export interface Game {
  title: string;
  jam: string;
  year: number;
  pitch: string;
  tags: string[];
  url: string;
  cover: ImageMetadata;
  video?: string;
  role?: string;
  award?: string;
}

export const games: Game[] = [
  {
    title: 'Brok-e',
    jam: 'Global Game Jam',
    year: 2020,
    pitch:
      'A fully immersive VR dream: find ways to restore lost feelings in a very personal virtual experience.',
    tags: ['VR', 'Oculus', 'Puzzle'],
    url: 'https://aze-ex-machina.itch.io/brok-e',
    cover: broke,
    role: 'Programmer'
  },
  {
    title: 'In the Loupe',
    jam: 'Nordic Game Jam Online',
    year: 2020,
    pitch:
      'A calm exploration game. Help the young witch Linette use her magic loupe to reveal the forest’s secrets.',
    tags: ['3D', 'Exploration'],
    url: 'https://k0cc4.itch.io/in-the-loupe',
    cover: loupe,
    role: 'Programmer'
  },
  {
    title: 'A Fishload of Space',
    jam: 'Quarantine Jam',
    year: 2020,
    pitch:
      'A 3D side-scrolling bullet hell. A fish astronaut fights Sharkbot, using former friends turned into laser guns.',
    tags: ['3D', 'Bullet hell', 'Unity'],
    url: 'https://lombricc.itch.io/a-fishload-of-space',
    cover: fishload,
    role: 'Programmer'
  },
  {
    title: 'Undivided',
    jam: 'StaySafeJam',
    year: 2020,
    pitch:
      'In a world swallowed by darkness, deliver supplies to people trapped at home without losing yourself to the dark.',
    tags: ['Survival', 'Atmospheric', 'Unity'],
    url: 'https://arvuti.itch.io/undivided',
    cover: undivided,
    video: '/media/undivided.mp4',
    role: 'Programmer',
    award: 'Best Mood Mojo'
  },
  {
    title: 'The Story of Your Life',
    jam: 'Nordic Game Jam',
    year: 2017,
    pitch:
      'A short, dark point-and-click text adventure for Windows and Android, made by a team of seven.',
    tags: ['Point & click', 'Text based', 'Dark'],
    url: 'https://kimsey0.itch.io/story-of-your-life',
    cover: storyOfYourLife,
    role: 'Programmer',
  },
  {
    title: 'Onirica',
    jam: 'Global Game Jam',
    year: 2017,
    pitch:
      'Calm down or get upset to change your brainwaves and reshape the dreamscape, from idyllic dream to nightmare.',
    tags: ['Puzzle', 'Unity'],
    url: 'https://aze-ex-machina.itch.io/onirica',
    cover: onirica,
    role: 'Programmer'
  },
  {
    title: 'The Caffeinship',
    jam: 'Global Game Jam · Milan',
    year: 2016,
    pitch:
      'A local multiplayer game about an intern trying to work out the exact coffee ritual their boss wants before getting fired.',
    tags: ['2D', 'Local multiplayer'],
    url: 'https://aze-ex-machina.itch.io/the-caffeinship',
    cover: caffeinship,
    role: 'Programmer',
    award: 'Best 2D Graphic'
  },
];
