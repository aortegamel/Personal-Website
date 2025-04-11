// contentlayer.config.js
import { defineDocumentType, makeSource } from 'contentlayer/source-files';
import { format } from 'date-fns';

export const Post = defineDocumentType(() => ({
  name: 'Post',
  filePathPattern: 'content/posts/*.md',
  fields: {
    title: { type: 'string', required: true },
    date: { type: 'date', required: true },
    excerpt: { type: 'string', required: false },
    categories: { type: 'list', of: { type: 'string' }, required: false },
    tags: { type: 'list', of: { type: 'string' }, required: false },
  },
  computedFields: {
    url: {
      type: 'string',
      resolve: (post) => `/posts/${post._raw.sourceFileName.replace(/\.md$/, '')}`,
    },
    formattedDate: {
      type: 'string',
      resolve: (post) => {
        return format(new Date(post.date), 'MMMM dd, yyyy');
      },
    },
    slug: {
      type: 'string',
      resolve: (post) => post._raw.sourceFileName.replace(/\.md$/, ''),
    },
  },
}));

export const Project = defineDocumentType(() => ({
  name: 'Project',
  filePathPattern: 'content/projects/*.md',
  fields: {
    name: { type: 'string', required: true },
    description: { type: 'string', required: true },
    techStack: { type: 'list', of: { type: 'string' }, required: true },
    github: { type: 'string', required: false },
    demo: { type: 'string', required: false },
    image: { type: 'string', required: false },
  },
  computedFields: {
    url: {
      type: 'string',
      resolve: (project) => `/projects/${project._raw.sourceFileName.replace(/\.md$/, '')}`,
    },
    slug: {
      type: 'string',
      resolve: (project) => project._raw.sourceFileName.replace(/\.md$/, ''),
    },
  },
}));

export default makeSource({
  contentDirPath: '.',
  documentTypes: [Post, Project],
});
