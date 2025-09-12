// Alibaba Cloud Content Management System Integration
// This file contains functions to interact with Alibaba CMS API

// Configuration - these values should be set in environment variables
const CMS_API_BASE = import.meta.env.CMS_API_BASE || 'https://your-cms-endpoint.alibabacloud.com';
const CMS_API_KEY = import.meta.env.CMS_API_KEY || 'your-api-key-here';

/**
 * Fetch data from Alibaba CMS
 * @param {string} endpoint - The API endpoint to fetch data from
 * @param {object} params - Query parameters for the request
 * @returns {Promise<object>} The response data
 */
export async function fetchFromCMS(endpoint, params = {}) {
  try {
    // Construct query string from params
    const queryString = new URLSearchParams(params).toString();
    const url = `${CMS_API_BASE}${endpoint}${queryString ? `?${queryString}` : ''}`;
    
    console.log(`[Alibaba CMS] Fetching data from: ${url}`);
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${CMS_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`CMS API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log(`[Alibaba CMS] Successfully fetched data from: ${endpoint}`);
    return data;
  } catch (error) {
    console.error(`[Alibaba CMS] Error fetching from ${endpoint}:`, error);
    throw error;
  }
}

/**
 * Get all entries of a specific content type
 * @param {string} contentType - The content type to fetch (e.g., 'team', 'reviews')
 * @param {object} params - Additional query parameters
 * @returns {Promise<Array>} Array of content entries
 */
export async function getAllEntries(contentType, params = {}) {
  try {
    const response = await fetchFromCMS(`/api/v1/content/${contentType}`, {
      ...params,
      limit: params.limit || 100 // Default limit
    });
    
    return response.data || response.items || [];
  } catch (error) {
    console.error(`[Alibaba CMS] Error fetching all entries for ${contentType}:`, error);
    return [];
  }
}

/**
 * Get a single entry by ID
 * @param {string} contentType - The content type
 * @param {string} id - The entry ID
 * @returns {Promise<object>} The content entry
 */
export async function getEntryById(contentType, id) {
  try {
    const response = await fetchFromCMS(`/api/v1/content/${contentType}/${id}`);
    return response.data || response;
  } catch (error) {
    console.error(`[Alibaba CMS] Error fetching entry ${id} for ${contentType}:`, error);
    return null;
  }
}

/**
 * Get entries with pagination
 * @param {string} contentType - The content type
 * @param {number} page - Page number (1-based)
 * @param {number} limit - Number of items per page
 * @returns {Promise<object>} Object with items and pagination info
 */
export async function getEntriesWithPagination(contentType, page = 1, limit = 10) {
  try {
    const response = await fetchFromCMS(`/api/v1/content/${contentType}`, {
      page,
      limit
    });
    
    return {
      items: response.data || response.items || [],
      pagination: response.pagination || response.meta || {}
    };
  } catch (error) {
    console.error(`[Alibaba CMS] Error fetching entries with pagination for ${contentType}:`, error);
    return {
      items: [],
      pagination: {}
    };
  }
}

export default {
  fetchFromCMS,
  getAllEntries,
  getEntryById,
  getEntriesWithPagination
};