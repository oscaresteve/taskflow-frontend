// Redimensiona y recomprime una imagen en el navegador antes de subirla (a WebP), para no mandar
// tal cual lo que sea que haya elegido el usuario. Si ya es pequeña, o algo falla, se devuelve el
// archivo original: esto es una optimización, no debe poder romper la subida.
export async function compressImage(
  file: File,
  { maxDimension = 512, quality = 0.8 }: { maxDimension?: number; quality?: number } = {},
): Promise<File> {
  try {
    const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });

    const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height));
    if (scale === 1) {
      return file; // ya es igual o más pequeña que el máximo, no hay nada que comprimir
    }

    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);

    const context = canvas.getContext("2d");
    if (!context) return file;

    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/webp", quality));
    if (!blob) return file;

    return new File([blob], file.name, { type: "image/webp" });
  } catch {
    return file;
  }
}
