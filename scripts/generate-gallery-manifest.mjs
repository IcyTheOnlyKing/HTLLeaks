import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const galleryDirectory = path.join(rootDir, 'assets', 'gallery');
const manifestPath = path.join(galleryDirectory, 'gallery-manifest.json');

const extensionTypeMap = new Map([
  ['.jpg', 'image'],
  ['.jpeg', 'image'],
  ['.png', 'image'],
  ['.gif', 'image'],
  ['.webp', 'image'],
  ['.svg', 'image'],
  ['.bmp', 'image'],
  ['.tiff', 'image'],
  ['.mp4', 'video'],
  ['.mov', 'video'],
  ['.webm', 'video'],
  ['.m4v', 'video'],
  ['.avi', 'video'],
  ['.mp3', 'audio'],
  ['.wav', 'audio'],
  ['.ogg', 'audio'],
  ['.flac', 'audio'],
  ['.aac', 'audio']
]);

const titleCase = (value) =>
  value
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ');

const createTags = (type, relativePath) => {
  const tags = new Set();
  tags.add(type.charAt(0).toUpperCase() + type.slice(1));

  const directoryName = path.dirname(relativePath);
  const segments = directoryName === '.' ? [] : directoryName
    .split(path.sep)
    .filter(Boolean)
    .map(titleCase);

  segments.forEach((segment) => tags.add(segment));

  return Array.from(tags);
};

const discoverFiles = async (directory, relativePrefix = '') => {
  let entries = [];
  const dirents = await fs.readdir(directory, { withFileTypes: true });

  for (const dirent of dirents) {
    if (dirent.name.startsWith('.')) continue;
    const absolutePath = path.join(directory, dirent.name);
    const relativePath = path.join(relativePrefix, dirent.name);

    if (dirent.isDirectory()) {
      const nested = await discoverFiles(absolutePath, relativePath);
      entries = entries.concat(nested);
    } else {
      entries.push(relativePath);
    }
  }

  return entries;
};

const buildManifest = async () => {
  try {
    await fs.access(galleryDirectory);
  } catch (error) {
    throw new Error('Der Ordner "assets/gallery" wurde nicht gefunden.');
  }

  const files = await discoverFiles(galleryDirectory);

  const items = files
    .map((relativePath) => {
      const extension = path.extname(relativePath).toLowerCase();
      const type = extensionTypeMap.get(extension);
      if (!type) return null;

      const title = titleCase(path.basename(relativePath, extension));
      const src = path.posix.join('assets/gallery', relativePath.split(path.sep).join('/'));

      return {
        type,
        title: title || 'Unbenanntes Medium',
        description: '',
        src,
        tags: createTags(type, relativePath)
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.title.localeCompare(b.title, 'de'));

  const manifest = {
    generatedAt: new Date().toISOString(),
    items
  };

  await fs.writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');

  console.log(`Manifest mit ${items.length} Einträgen erstellt: ${path.relative(rootDir, manifestPath)}`);
};

buildManifest().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
