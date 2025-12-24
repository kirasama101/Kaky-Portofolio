// Image upload helper functions
// Ready to be replaced with Supabase Storage

export interface UploadedImage {
  file: File;
  preview: string;
  name: string;
}

export const createImagePreview = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const processImageFiles = async (files: FileList): Promise<UploadedImage[]> => {
  const images: UploadedImage[] = [];
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (file.type.startsWith("image/")) {
      const preview = await createImagePreview(file);
      images.push({
        file,
        preview,
        name: file.name,
      });
    }
  }
  
  return images;
};

// Placeholder for Supabase Storage integration
export const uploadToSupabase = async (file: File, bucket: string, path: string): Promise<string> => {
  // Replace with actual Supabase upload logic:
  // import { supabase } from './supabaseClient';
  // const { data, error } = await supabase.storage.from(bucket).upload(path, file);
  // if (error) throw error;
  // return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
  
  console.log(`Would upload ${file.name} to ${bucket}/${path}`);
  return URL.createObjectURL(file);
};

export const deleteFromSupabase = async (bucket: string, path: string): Promise<void> => {
  // Replace with actual Supabase delete logic:
  // import { supabase } from './supabaseClient';
  // await supabase.storage.from(bucket).remove([path]);
  
  console.log(`Would delete ${bucket}/${path}`);
};
