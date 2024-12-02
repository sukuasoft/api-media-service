import path from 'path';

export const pathStorage = path.resolve(__dirname, '../../storage');
export const pathMediaStorage = path.join(pathStorage, 'media');

export function getExtensionFile(fileName: string): string {
  const splits = fileName.split(".");

  return splits[splits.length - 1];
}