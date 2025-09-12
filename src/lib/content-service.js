// Content Service for Alibaba CMS Integration
// This file provides a clean interface for fetching content from CMS

import { getAllEntries, getEntryById, getEntriesWithPagination } from './alibaba-cms.js';

/**
 * Get all team members
 * @returns {Promise<Array>} Array of team member objects
 */
export async function getTeamMembers() {
  try {
    const teamMembers = await getAllEntries('team');
    return teamMembers.map(member => ({
      id: member.id || member._id,
      ...member.attributes || member
    }));
  } catch (error) {
    console.error('[Content Service] Error fetching team members:', error);
    return [];
  }
}

/**
 * Get a specific team member by ID
 * @param {string} id - Team member ID
 * @returns {Promise<object|null>} Team member object or null if not found
 */
export async function getTeamMemberById(id) {
  try {
    const member = await getEntryById('team', id);
    if (!member) return null;
    
    return {
      id: member.id || member._id,
      ...member.attributes || member
    };
  } catch (error) {
    console.error(`[Content Service] Error fetching team member ${id}:`, error);
    return null;
  }
}

/**
 * Get all reviews
 * @returns {Promise<Array>} Array of review objects
 */
export async function getReviews() {
  try {
    const reviews = await getAllEntries('reviews');
    return reviews.map(review => ({
      id: review.id || review._id,
      ...review.attributes || review
    }));
  } catch (error) {
    console.error('[Content Service] Error fetching reviews:', error);
    return [];
  }
}

/**
 * Get reviews with pagination
 * @param {number} page - Page number (1-based)
 * @param {number} limit - Number of items per page
 * @returns {Promise<object>} Object with reviews and pagination info
 */
export async function getReviewsPaginated(page = 1, limit = 10) {
  try {
    const result = await getEntriesWithPagination('reviews', page, limit);
    return {
      items: result.items.map(review => ({
        id: review.id || review._id,
        ...review.attributes || review
      })),
      pagination: result.pagination
    };
  } catch (error) {
    console.error('[Content Service] Error fetching paginated reviews:', error);
    return {
      items: [],
      pagination: {}
    };
  }
}

/**
 * Get all blog posts
 * @returns {Promise<Array>} Array of blog post objects
 */
export async function getBlogPosts() {
  try {
    const posts = await getAllEntries('blog');
    return posts.map(post => ({
      id: post.id || post._id,
      ...post.attributes || post
    }));
  } catch (error) {
    console.error('[Content Service] Error fetching blog posts:', error);
    return [];
  }
}

/**
 * Get a specific blog post by ID or slug
 * @param {string} identifier - Post ID or slug
 * @returns {Promise<object|null>} Blog post object or null if not found
 */
export async function getBlogPostByIdentifier(identifier) {
  try {
    // First try to get by ID
    let post = await getEntryById('blog', identifier);
    
    // If not found by ID, try to find by slug
    if (!post) {
      const allPosts = await getBlogPosts();
      post = allPosts.find(p => 
        p.slug === identifier || 
        p.attributes?.slug === identifier
      );
    }
    
    if (!post) return null;
    
    return {
      id: post.id || post._id,
      ...post.attributes || post
    };
  } catch (error) {
    console.error(`[Content Service] Error fetching blog post ${identifier}:`, error);
    return null;
  }
}

export default {
  getTeamMembers,
  getTeamMemberById,
  getReviews,
  getReviewsPaginated,
  getBlogPosts,
  getBlogPostByIdentifier
};