import type { ImageMetadata } from 'astro';
import retrobardShot from '../assets/projects/retrobard.png';

export interface ProjectLink {
  label: string;
  href: string;
  primary?: boolean;
}

export interface Project {
  title: string;
  kicker: string;
  /** Small pill next to the kicker, e.g. "Beta". */
  status?: string;
  summary: string;
  highlights: string[];
  stack: string[];
  links: ProjectLink[];
  image?: { src: ImageMetadata; alt: string };
}

export const projects: Project[] = [
  {
    title: 'RetroBard',
    kicker: 'Personal project · Windows desktop app',
    status: 'Beta',
    summary:
      'Gives retro RPGs a voice. RetroBard reads the dialogue box of the emulator window as you play and speaks each line in a voice chosen for that character, using ElevenLabs or a voice server of your choice.',
    highlights: [
      'Captures only the linked game window with Windows Graphics Capture, never the rest of the screen',
      'Reads the game’s own pixel font by matching letter shapes taught once: exact text in milliseconds, no OCR model',
      'Speaks through ElevenLabs or any OpenAI-compatible voice server, including free ones running on your own PC',
      'Streams speech as raw PCM, so each line starts playing while it is still arriving',
      'Private by design: no accounts, no telemetry and no global keyboard hook',
    ],
    stack: ['Python', 'PySide6', 'OpenCV', 'Win32', 'ElevenLabs', 'OpenAI speech API'],
    links: [
      { label: 'Get it on itch.io', href: 'https://aze-ex-machina.itch.io/retrobard', primary: true },
      { label: 'Source on GitHub', href: 'https://github.com/AzeExMachina/RetroBard' },
    ],
    image: {
      src: retrobardShot,
      alt: 'RetroBard’s pixel-art logo above a retro dialogue box that reads “BARD: Every line of dialogue, read aloud in AI voices.”',
    },
  },
];
