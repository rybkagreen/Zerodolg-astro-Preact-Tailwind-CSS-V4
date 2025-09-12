// Content Models for Alibaba CMS
// This file defines the structure of content types used in the ZeroDolg Astro website

export const contentModels = {
  // Team member model
  team: {
    name: "Team Member",
    description: "Information about team members",
    fields: [
      {
        name: "name",
        type: "string",
        required: true,
        description: "Full name of the team member"
      },
      {
        name: "position",
        type: "string",
        required: true,
        description: "Position/role in the company"
      },
      {
        name: "photo",
        type: "media",
        required: false,
        description: "Profile photo of the team member"
      },
      {
        name: "bio",
        type: "text",
        required: true,
        description: "Short biography of the team member"
      },
      {
        name: "experience",
        type: "string",
        required: true,
        description: "Years of experience"
      },
      {
        name: "specializations",
        type: "array",
        items: {
          type: "string"
        },
        required: true,
        description: "List of specializations"
      },
      {
        name: "achievements",
        type: "array",
        items: {
          type: "string"
        },
        required: true,
        description: "List of achievements"
      },
      {
        name: "contacts",
        type: "object",
        properties: {
          phone: {
            type: "string",
            required: false
          },
          email: {
            type: "string",
            required: false
          }
        },
        required: false,
        description: "Contact information"
      }
    ]
  },
  
  // Review model
  reviews: {
    name: "Review",
    description: "Customer reviews and testimonials",
    fields: [
      {
        name: "author",
        type: "string",
        required: true,
        description: "Name of the reviewer"
      },
      {
        name: "rating",
        type: "number",
        required: true,
        min: 1,
        max: 5,
        description: "Rating from 1 to 5 stars"
      },
      {
        name: "date",
        type: "date",
        required: true,
        description: "Date of the review"
      },
      {
        name: "text",
        type: "text",
        required: true,
        description: "Review content"
      },
      {
        name: "caseDetails",
        type: "object",
        properties: {
          debt: {
            type: "string",
            required: false
          },
          duration: {
            type: "string",
            required: false
          },
          result: {
            type: "string",
            required: false
          }
        },
        required: false,
        description: "Details about the case"
      }
    ]
  },
  
  // Blog post model
  blog: {
    name: "Blog Post",
    description: "Blog articles and educational content",
    fields: [
      {
        name: "title",
        type: "string",
        required: true,
        description: "Title of the blog post"
      },
      {
        name: "description",
        type: "text",
        required: false,
        description: "Short description/summary of the post"
      },
      {
        name: "pubDate",
        type: "date",
        required: true,
        description: "Publication date"
      },
      {
        name: "updatedDate",
        type: "date",
        required: false,
        description: "Last updated date"
      },
      {
        name: "heroImage",
        type: "media",
        required: false,
        description: "Featured image for the post"
      },
      {
        name: "tags",
        type: "array",
        items: {
          type: "string"
        },
        required: false,
        description: "Tags for categorization"
      },
      {
        name: "content",
        type: "richtext",
        required: true,
        description: "Main content of the blog post"
      }
    ]
  }
};

export default contentModels;