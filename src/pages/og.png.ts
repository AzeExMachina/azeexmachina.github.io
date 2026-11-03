// Social preview card (Open Graph / Twitter), rendered to /og.png at build time.
// Satori lays out the HTML-like tree with real fonts into SVG; Resvg rasterises it to PNG.
import type { APIRoute } from 'astro';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { site } from '../data/site';

export const WIDTH = 1200;
export const HEIGHT = 630;

const font = (pkg: string, file: string) =>
  readFile(join(process.cwd(), 'node_modules/@fontsource', pkg, 'files', file));

type Node = { type: string; props: Record<string, unknown> };
const h = (type: string, style: Record<string, unknown>, ...children: (Node | string)[]): Node => ({
  type,
  props: { style, children: children.length === 1 ? children[0] : children },
});

export const GET: APIRoute = async () => {
  const [display500, display600, body400] = await Promise.all([
    font('space-grotesk', 'space-grotesk-latin-500-normal.woff'),
    font('space-grotesk', 'space-grotesk-latin-600-normal.woff'),
    font('inter', 'inter-latin-400-normal.woff'),
  ]);

  const domain = new URL(import.meta.env.SITE).host;

  const card = h(
    'div',
    {
      width: '100%',
      height: '100%',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '56px 72px 64px',
      fontFamily: 'Inter',
      color: '#eef0f5',
      backgroundImage:
        'linear-gradient(180deg, #541a2e 0%, #b51a2b 22%, #e46a5f 31%, #ffa586 35%, #8e7477 41%, #384358 49%, #242f49 64%, #161e2f 100%)',
    },
    h(
      'div',
      { display: 'flex', alignItems: 'center', gap: '18px' },
      h(
        'div',
        {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '64px',
          height: '64px',
          borderRadius: '18px',
          backgroundImage: 'linear-gradient(135deg, #b51a2b, #541a2e)',
          border: '2px solid rgba(255,165,134,0.35)',
          color: '#ffa586',
          fontFamily: 'Space Grotesk',
          fontWeight: 600,
          fontSize: '26px',
        },
        'DA',
      ),
      h('div', { fontFamily: 'Space Grotesk', fontWeight: 500, fontSize: '26px', color: '#ffe3d8' }, domain),
    ),
    h(
      'div',
      { display: 'flex', flexDirection: 'column' },
      h(
        'div',
        {
          fontFamily: 'Space Grotesk',
          fontWeight: 500,
          fontSize: '24px',
          letterSpacing: '4px',
          textTransform: 'uppercase',
          color: '#ffa586',
        },
        site.role,
      ),
      h(
        'div',
        {
          marginTop: '14px',
          fontFamily: 'Space Grotesk',
          fontWeight: 600,
          fontSize: '92px',
          lineHeight: '96px',
          letterSpacing: '-2px',
        },
        site.name,
      ),
      h(
        'div',
        { marginTop: '22px', fontSize: '28px', lineHeight: '40px', color: '#c3c9d6' },
        site.tagline,
      ),
    ),
  );

  const svg = await satori(card as never, {
    width: WIDTH,
    height: HEIGHT,
    fonts: [
      { name: 'Space Grotesk', data: display500, weight: 500, style: 'normal' },
      { name: 'Space Grotesk', data: display600, weight: 600, style: 'normal' },
      { name: 'Inter', data: body400, weight: 400, style: 'normal' },
    ],
  });

  const png = new Resvg(svg, { fitTo: { mode: 'width', value: WIDTH } }).render().asPng();

  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
