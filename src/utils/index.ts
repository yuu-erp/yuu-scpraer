import * as path from 'path';

export const handlePath = (
  filePath: string,
  baseUrl: string = path.resolve(process.cwd(), './src/sources'),
) => path.join(baseUrl, filePath);
