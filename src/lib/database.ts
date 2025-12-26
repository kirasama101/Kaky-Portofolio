import { supabase } from './supabaseClient';
import type { Project, HeroContent, FooterContent } from './mockData';

// Re-export types for convenience
export type { Project, HeroContent, FooterContent };

// Convert database row to Project interface
const dbRowToProject = (row: any, images: string[], videos: string[] = []): Project => ({
  id: row.id,
  title: row.title,
  titleEn: row.title_en,
  tag: row.tag,
  tagEn: row.tag_en,
  description: row.description || undefined,
  descriptionEn: row.description_en || undefined,
  coverImage: row.cover_image || '',
  images: images,
  videos: videos.length > 0 ? videos : undefined,
  spanCols: row.span_cols || 1,
  spanRows: row.span_rows || 1,
  icon: row.icon || undefined,
});

// Convert Project to database row format
const projectToDbRow = (project: Omit<Project, 'id'> | Partial<Project>) => ({
  title: project.title,
  title_en: project.titleEn,
  tag: project.tag,
  tag_en: project.tagEn,
  description: project.description || null,
  description_en: project.descriptionEn || null,
  cover_image: project.coverImage || null,
  icon: project.icon || null,
  span_cols: project.spanCols || 1,
  span_rows: project.spanRows || 1,
});

// Projects
export const getProjects = async (): Promise<Project[]> => {
  try {
    // Fetch all projects
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (projectsError) throw projectsError;
    if (!projects) return [];

    // Fetch all project images
    const { data: images, error: imagesError } = await supabase
      .from('project_images')
      .select('*')
      .order('display_order', { ascending: true });

    if (imagesError) throw imagesError;

    // Fetch all project videos
    const { data: videos, error: videosError } = await supabase
      .from('project_videos')
      .select('*')
      .order('display_order', { ascending: true });

    if (videosError) throw videosError;

    // Group images by project_id
    const imagesByProject: Record<string, string[]> = {};
    images?.forEach((img) => {
      if (!imagesByProject[img.project_id]) {
        imagesByProject[img.project_id] = [];
      }
      imagesByProject[img.project_id].push(img.image_url);
    });

    // Group videos by project_id
    const videosByProject: Record<string, string[]> = {};
    videos?.forEach((vid) => {
      if (!videosByProject[vid.project_id]) {
        videosByProject[vid.project_id] = [];
      }
      videosByProject[vid.project_id].push(vid.video_url);
    });

    // Map projects with their images and videos
    return projects.map((project) =>
      dbRowToProject(project, imagesByProject[project.id] || [], videosByProject[project.id] || [])
    );
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
};

export const getProject = async (id: string): Promise<Project | undefined> => {
  try {
    // Fetch project
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();

    if (projectError) throw projectError;
    if (!project) return undefined;

    // Fetch project images
    const { data: images, error: imagesError } = await supabase
      .from('project_images')
      .select('image_url')
      .eq('project_id', id)
      .order('display_order', { ascending: true });

    if (imagesError) throw imagesError;

    // Fetch project videos
    const { data: videos, error: videosError } = await supabase
      .from('project_videos')
      .select('video_url')
      .eq('project_id', id)
      .order('display_order', { ascending: true });

    if (videosError) throw videosError;

    const imageUrls = images?.map((img) => img.image_url) || [];
    const videoUrls = videos?.map((vid) => vid.video_url) || [];

    return dbRowToProject(project, imageUrls, videoUrls);
  } catch (error) {
    console.error('Error fetching project:', error);
    throw error;
  }
};

export const createProject = async (
  project: Omit<Project, 'id'>
): Promise<Project> => {
  try {
    const projectData = projectToDbRow(project);

    // Insert project
    const { data: newProject, error: projectError } = await supabase
      .from('projects')
      .insert(projectData)
      .select()
      .single();

    if (projectError) throw projectError;
    if (!newProject) throw new Error('Failed to create project');

    // Insert project images
    if (project.images && project.images.length > 0) {
      const imageInserts = project.images.map((imageUrl, index) => ({
        project_id: newProject.id,
        image_url: imageUrl,
        display_order: index,
      }));

      const { error: imagesError } = await supabase
        .from('project_images')
        .insert(imageInserts);

      if (imagesError) throw imagesError;
    }

    // Insert project videos
    if (project.videos && project.videos.length > 0) {
      const videoInserts = project.videos.map((videoUrl, index) => ({
        project_id: newProject.id,
        video_url: videoUrl,
        display_order: index,
      }));

      const { error: videosError } = await supabase
        .from('project_videos')
        .insert(videoInserts);

      if (videosError) throw videosError;
    }

    return dbRowToProject(newProject, project.images || [], project.videos || []);
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
};

export const updateProject = async (
  id: string,
  updates: Partial<Project>
): Promise<Project | null> => {
  try {
    const projectData = projectToDbRow(updates);

    // Update project
    const { data: updatedProject, error: projectError } = await supabase
      .from('projects')
      .update(projectData)
      .eq('id', id)
      .select()
      .single();

    if (projectError) throw projectError;
    if (!updatedProject) return null;

    // Update images if provided
    if (updates.images !== undefined) {
      // Delete existing images
      const { error: deleteError } = await supabase
        .from('project_images')
        .delete()
        .eq('project_id', id);

      if (deleteError) throw deleteError;

      // Insert new images
      if (updates.images.length > 0) {
        const imageInserts = updates.images.map((imageUrl, index) => ({
          project_id: id,
          image_url: imageUrl,
          display_order: index,
        }));

        const { error: imagesError } = await supabase
          .from('project_images')
          .insert(imageInserts);

        if (imagesError) throw imagesError;
      }
    }

    // Update videos if provided
    if (updates.videos !== undefined) {
      // Delete existing videos
      const { error: deleteVideoError } = await supabase
        .from('project_videos')
        .delete()
        .eq('project_id', id);

      if (deleteVideoError) throw deleteVideoError;

      // Insert new videos
      if (updates.videos.length > 0) {
        const videoInserts = updates.videos.map((videoUrl, index) => ({
          project_id: id,
          video_url: videoUrl,
          display_order: index,
        }));

        const { error: videosError } = await supabase
          .from('project_videos')
          .insert(videoInserts);

        if (videosError) throw videosError;
      }
    }

    // Fetch updated project with images and videos
    return await getProject(id);
  } catch (error) {
    console.error('Error updating project:', error);
    throw error;
  }
};

export const deleteProject = async (id: string): Promise<boolean> => {
  try {
    // Delete project (images will be deleted automatically due to CASCADE)
    const { error } = await supabase.from('projects').delete().eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
};

// Hero content
export const getHeroContent = async (): Promise<HeroContent> => {
  try {
    const { data, error } = await supabase
      .from('hero_content')
      .select('*')
      .single();

    if (error) throw error;
    if (!data) throw new Error('Hero content not found');

    return {
      badge: data.badge,
      badgeEn: data.badge_en,
      title: data.title,
      titleEn: data.title_en,
      titleBreak: data.title_break,
      titleBreakEn: data.title_break_en,
      description: data.description,
      descriptionEn: data.description_en,
      ctaPrimary: data.cta_primary,
      ctaPrimaryEn: data.cta_primary_en,
      ctaSecondary: data.cta_secondary,
      ctaSecondaryEn: data.cta_secondary_en,
    };
  } catch (error) {
    console.error('Error fetching hero content:', error);
    throw error;
  }
};

export const updateHeroContent = async (
  updates: Partial<HeroContent>
): Promise<HeroContent> => {
  try {
    const updateData: any = {};
    if (updates.badge !== undefined) updateData.badge = updates.badge;
    if (updates.badgeEn !== undefined) updateData.badge_en = updates.badgeEn;
    if (updates.title !== undefined) updateData.title = updates.title;
    if (updates.titleEn !== undefined) updateData.title_en = updates.titleEn;
    if (updates.titleBreak !== undefined)
      updateData.title_break = updates.titleBreak;
    if (updates.titleBreakEn !== undefined)
      updateData.title_break_en = updates.titleBreakEn;
    if (updates.description !== undefined)
      updateData.description = updates.description;
    if (updates.descriptionEn !== undefined)
      updateData.description_en = updates.descriptionEn;
    if (updates.ctaPrimary !== undefined)
      updateData.cta_primary = updates.ctaPrimary;
    if (updates.ctaPrimaryEn !== undefined)
      updateData.cta_primary_en = updates.ctaPrimaryEn;
    if (updates.ctaSecondary !== undefined)
      updateData.cta_secondary = updates.ctaSecondary;
    if (updates.ctaSecondaryEn !== undefined)
      updateData.cta_secondary_en = updates.ctaSecondaryEn;

    // Get the first (and should be only) row and update it
    const { data: existing } = await supabase
      .from('hero_content')
      .select('id')
      .limit(1)
      .single();

    if (existing) {
      const { error } = await supabase
        .from('hero_content')
        .update(updateData)
        .eq('id', existing.id);
      if (error) throw error;
    } else {
      // If no row exists, insert a new one
      const { error } = await supabase.from('hero_content').insert(updateData);
      if (error) throw error;
    }

    return await getHeroContent();
  } catch (error) {
    console.error('Error updating hero content:', error);
    throw error;
  }
};

// Footer content
export const getFooterContent = async (): Promise<FooterContent> => {
  try {
    const { data, error } = await supabase
      .from('footer_content')
      .select('*')
      .single();

    if (error) throw error;
    if (!data) throw new Error('Footer content not found');

    return {
      title: data.title,
      titleEn: data.title_en,
      description: data.description,
      descriptionEn: data.description_en,
      cta: data.cta,
      ctaEn: data.cta_en,
    };
  } catch (error) {
    console.error('Error fetching footer content:', error);
    throw error;
  }
};

export const updateFooterContent = async (
  updates: Partial<FooterContent>
): Promise<FooterContent> => {
  try {
    const updateData: any = {};
    if (updates.title !== undefined) updateData.title = updates.title;
    if (updates.titleEn !== undefined) updateData.title_en = updates.titleEn;
    if (updates.description !== undefined)
      updateData.description = updates.description;
    if (updates.descriptionEn !== undefined)
      updateData.description_en = updates.descriptionEn;
    if (updates.cta !== undefined) updateData.cta = updates.cta;
    if (updates.ctaEn !== undefined) updateData.cta_en = updates.ctaEn;

    // Get the first (and should be only) row and update it
    const { data: existing } = await supabase
      .from('footer_content')
      .select('id')
      .limit(1)
      .single();

    if (existing) {
      const { error } = await supabase
        .from('footer_content')
        .update(updateData)
        .eq('id', existing.id);
      if (error) throw error;
    } else {
      // If no row exists, insert a new one
      const { error } = await supabase.from('footer_content').insert(updateData);
      if (error) throw error;
    }

    return await getFooterContent();
  } catch (error) {
    console.error('Error updating footer content:', error);
    throw error;
  }
};

