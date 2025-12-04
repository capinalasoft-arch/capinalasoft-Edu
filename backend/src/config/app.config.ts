import { readFileSync } from 'node:fs';
import { join } from 'node:path';

interface PackageJson {
  name?: string;
  version?: string;
}

const pkg = JSON.parse(
  readFileSync(join(__dirname, '..', '..', 'package.json'), 'utf-8'),
) as PackageJson;

export const appConfig = () => ({
  app: {
    name: pkg.name ?? 'capinalasoft-edu-api',
    version: pkg.version ?? '0.0.1',
  },
});

export type AppConfig = ReturnType<typeof appConfig>;
