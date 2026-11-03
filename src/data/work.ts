export interface WorkItem {
  title: string;
  kicker: string;
  summary: string;
  highlights: string[];
  stack: string[];
}

export const work: WorkItem[] = [
  {
    title: 'Theater',
    kicker: 'Multimedia collaboration platform',
    summary:
      'An advanced collaboration platform for enterprise, smart cities and governance, running on large interactive touch surfaces. I led R&D and core development.',
    highlights: [
      'Custom Chromium-based browser with hardware acceleration',
      'C# and C++ plugins and Windows services that connect Unity to native OS features and databases',
      'Architecture designed to handle very demanding graphics workloads',
    ],
    stack: ['Unity', 'C#', 'C++', 'Chromium', 'WebRTC'],
  },
  {
    title: 'Trion',
    kicker: 'Industry 4.0 · Real-time localisation',
    summary:
      'Real-time 3D visualisation for indoor and outdoor localisation. Live position data from RTLS and Ultra-Wide Band sensors is shown as explorable 3D scenes in the browser.',
    highlights: [
      'Live 3D scenes driven by streaming RTLS / UWB position data',
      'React and Three.js front end built for a smooth experience',
      'Led the React team from architecture through delivery',
    ],
    stack: ['React', 'TypeScript', 'Three.js', 'RTLS', 'UWB'],
  },
];

export const skills = [
  {
    group: 'Languages & frameworks',
    items: ['C#', '.NET', 'C/C++', 'TypeScript', 'React', 'Three.js', 'Unity', 'Python', 'Java'],
  },
  {
    group: 'Core competencies',
    items: [
      'Software architecture',
      'Graphics programming',
      '3D mathematics',
      'Design patterns',
      'Algorithms',
      'Technical leadership',
    ],
  },
  {
    group: 'Spoken languages',
    items: ['Italian', 'English'],
  },
];

export const experience = [
  {
    period: '2016 — Today',
    title: 'Team Lead & Software Developer',
    org: 'CT Innovation S.r.l.',
    place: 'Verona, Italy',
    text: 'Leading the Unity and React teams on flagship products: Theater, Trion, custom rendering pipelines and native integrations.',
  },
  {
    period: '2016 — Today',
    title: 'Game Developer',
    org: 'Game jams',
    place: 'Online & worldwide',
    text: 'Gameplay programming, VR interactions on Oculus, and VFX in game jam teams, including seven entries across Global Game Jam, Nordic Game Jam and online jams.',
  },
  {
    period: 'In progress',
    title: 'B.S. Computer Science & Engineering',
    org: 'Università degli Studi di Verona',
    place: 'Part-time',
    text: 'Coursework in computer graphics, software engineering and programming challenges.',
  },
  {
    period: '2014',
    title: 'Programming Challenges: 1st place',
    org: 'M.S. course, Prof. Romeo Rizzi',
    place: 'Verona, Italy',
    text: 'Wrote a C++ AI for a variant of Triple Triad (Final Fantasy VIII) that ranked first in head-to-head matches against other students’ algorithms. Full marks.',
  },
];
