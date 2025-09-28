// Cloudinary configuration
export const CLOUDINARY_CONFIG = {
  cloudName: 'dsrsozscg', // Înlocuiește cu cloud name-ul tău
  apiKey: '942191844276884',       // Înlocuiește cu API key-ul tău
  apiSecret: 'kxFe5bJ1rH1nAQ-hj0ZZYYPfcVU'  // Înlocuiește cu API secret-ul tău
};

// URL template pentru imagini optimizate
export const CLOUDINARY_URL_TEMPLATE = 'https://res.cloudinary.com/{cloudName}/image/upload/w_{width},h_{height},f_auto,q_auto/{imagePath}';

// Funcție pentru generarea URL-urilor Cloudinary
export function getCloudinaryImageUrl(imagePath: string, width: number = 400, height: number = 300): string {
  // Elimină extensia din imagePath
  const publicId = imagePath.replace(/\.(jpg|jpeg|png|gif)$/i, '');
  return `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloudName}/image/upload/w_${width},h_${height},f_auto,q_auto/${publicId}`;
}

// Funcție pentru upload imagini (pentru viitor)
export function uploadToCloudinary(file: File): Promise<string> {
  // Implementare pentru upload - va fi adăugată mai târziu
  return Promise.resolve('');
}
