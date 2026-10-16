const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');

const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'assets', 'images');

const palette = {
  night: '#10131D',
  line: '#394158',
  gold: '#E7B85C',
  goldBright: '#FFD77A',
  goldDark: '#8E622A',
  ruby: '#A94C49',
  rubyDark: '#6E3032',
  blue: '#668DB2',
  violet: '#8C79A8',
  parchment: '#F2E5C5',
  parchmentLight: '#FFF1C8',
  parchmentDark: '#D7C49D',
  white: '#FFFFFF',
};

function rgba(hex, alpha = 255) {
  const value = hex.replace('#', '');
  return [
    Number.parseInt(value.slice(0, 2), 16),
    Number.parseInt(value.slice(2, 4), 16),
    Number.parseInt(value.slice(4, 6), 16),
    alpha,
  ];
}

function createCanvas(size, background) {
  const png = new PNG({ width: size, height: size });
  if (background) fill(png, 0, 0, 1024, 1024, background);
  return png;
}

function fill(png, x, y, width, height, color) {
  const scale = png.width / 1024;
  const left = Math.round(x * scale);
  const top = Math.round(y * scale);
  const right = Math.round((x + width) * scale);
  const bottom = Math.round((y + height) * scale);
  const [red, green, blue, alpha] = rgba(color);

  for (let py = top; py < bottom; py += 1) {
    for (let px = left; px < right; px += 1) {
      if (px < 0 || py < 0 || px >= png.width || py >= png.height) continue;
      const index = (png.width * py + px) << 2;
      png.data[index] = red;
      png.data[index + 1] = green;
      png.data[index + 2] = blue;
      png.data[index + 3] = alpha;
    }
  }
}

function drawBackground(png) {
  fill(png, 0, 0, 1024, 1024, palette.night);
  fill(png, 64, 64, 896, 24, palette.line);
  fill(png, 64, 936, 896, 24, palette.line);
  fill(png, 64, 64, 24, 896, palette.line);
  fill(png, 936, 64, 24, 896, palette.line);
  fill(png, 128, 168, 32, 32, palette.gold);
  fill(png, 864, 152, 32, 32, palette.blue);
  fill(png, 848, 816, 40, 40, palette.ruby);
  fill(png, 104, 792, 24, 24, palette.violet);
}

function drawMark(png, monochrome = false) {
  const color = (value) => (monochrome ? palette.white : value);
  fill(png, 240, 344, 240, 352, color(palette.goldDark));
  fill(png, 544, 344, 240, 352, color(palette.goldDark));
  fill(png, 272, 304, 208, 352, color(palette.parchmentLight));
  fill(png, 544, 304, 208, 352, color(palette.parchmentLight));
  fill(png, 304, 336, 176, 272, color(palette.parchment));
  fill(png, 544, 336, 176, 272, color(palette.parchment));
  fill(png, 480, 304, 64, 400, color(palette.rubyDark));
  fill(png, 384, 384, 48, 160, color(palette.gold));
  fill(png, 592, 384, 48, 160, color(palette.gold));
  fill(png, 272, 656, 208, 48, color(palette.parchmentDark));
  fill(png, 544, 656, 208, 48, color(palette.parchmentDark));
  fill(png, 464, 216, 96, 40, color(palette.goldBright));
  fill(png, 488, 192, 48, 88, color(palette.goldBright));
}

function write(name, png) {
  fs.writeFileSync(path.join(OUT, name), PNG.sync.write(png));
}

fs.mkdirSync(OUT, { recursive: true });

const icon = createCanvas(1024);
drawBackground(icon);
drawMark(icon);
write('icon.png', icon);

const foreground = createCanvas(512);
drawMark(foreground);
write('android-icon-foreground.png', foreground);

const background = createCanvas(512);
drawBackground(background);
write('android-icon-background.png', background);

const monochrome = createCanvas(432);
drawMark(monochrome, true);
write('android-icon-monochrome.png', monochrome);

const splash = createCanvas(1024);
drawMark(splash);
write('splash-icon.png', splash);

const favicon = createCanvas(48);
drawBackground(favicon);
drawMark(favicon);
write('favicon.png', favicon);

console.log('SelahPixel brand assets generated in assets/images.');
