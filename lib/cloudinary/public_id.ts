export function extractPublicIdFromUrl(url: string): string | null {
  try {
    const afterUpload = url.split('/upload/')[1];
    if (!afterUpload) return null;
    const noVersion = afterUpload.replace(/^v\d+\//, '');
    const withoutExt = noVersion.replace(/\.[^/.]+$/, '');
    return withoutExt;
  } catch {
    return null;
  }
}
