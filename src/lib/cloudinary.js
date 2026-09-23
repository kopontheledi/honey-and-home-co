export async function uploadImages(files) {
  const cloud = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const preset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  if (!cloud || !preset) {
    throw new Error('Cloudinary env values are missing.');
  }

  return Promise.all(
    [...files].map(async (file) => {
      const body = new FormData();

      body.append('file', file);
      body.append('upload_preset', preset);
      body.append('folder', 'honey-home-products');

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloud}/image/upload`,
        {
          method: 'POST',
          body,
        }
      );

      if (!response.ok) {
        throw new Error('Image upload failed');
      }

      const data = await response.json();

      return data.secure_url;
    })
  );
}