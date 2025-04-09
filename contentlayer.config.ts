import { defineDocumentType, makeSource } from 'contentlayer/source-files'

export const Post = defineDocumentType(() => ({
  name: 'Post',
  filePathPattern: `posts/**/*.md`,
  contentType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
    date: { type: 'date', required: true },
    author: { type: 'string', required: true },
    layout: { type: 'string' },
    categories: { type: 'list', of: { type: 'string' }, required: true },
    tags: { type: 'list', of: { type: 'string' } },
    excerpt: { type: 'string' }
  },
  computedFields: {
    slug: {
      type: 'string',
      resolve: (post) => post._raw.sourceFileName.replace(/\.md$/, '')
    },
    url: {
      type: 'string',
      resolve: (post) => `/posts/${post._raw.sourceFileName.replace(/\.md$/, '')}`
    }
  },
}))

export const Project = defineDocumentType(() => ({
  name: 'Project',
  filePathPattern: `projects/**/*.md`,
  contentType: 'mdx',
  fields: {
    name: { type: 'string', required: true },
    description: { type: 'string', required: true },
    tech_stack: { type: 'list', of: { type: 'string' }, required: true },
    github: { type: 'string' },
    private_full_version: { type: 'boolean' },
    has_demo: { type: 'boolean' },
    contact: { type: 'string' },
    features: { type: 'list', of: { type: 'string' }, required: true }
  },
  computedFields: {
    slug: {
      type: 'string',
      resolve: (project) => project._raw.sourceFileName.replace(/\.md$/, '')
    },
    url: {
      type: 'string',
      resolve: (project) => `/projects/${project._raw.sourceFileName.replace(/\.md$/, '')}`
    }
  },
}))

export default makeSource({
  contentDirPath: 'content',
  documentTypes: [Post, Project],
  disableImportAliasWarning: true,
})