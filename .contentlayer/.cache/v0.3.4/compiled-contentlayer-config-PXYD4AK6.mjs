// contentlayer.config.ts
import { defineDocumentType, makeSource } from "contentlayer/source-files";
var Post = defineDocumentType(() => ({
  name: "Post",
  filePathPattern: `posts/**/*.md`,
  fields: {
    title: { type: "string", required: true },
    date: { type: "date", required: true },
    author: { type: "string", required: true },
    categories: { type: "list", of: { type: "string" }, required: true },
    tags: { type: "list", of: { type: "string" } },
    excerpt: { type: "string" }
  },
  computedFields: {
    slug: {
      type: "string",
      resolve: (post) => post._raw.sourceFileName.replace(/\.md$/, "")
    },
    url: {
      type: "string",
      resolve: (post) => `/posts/${post._raw.sourceFileName.replace(/\.md$/, "")}`
    }
  }
}));
var Project = defineDocumentType(() => ({
  name: "Project",
  filePathPattern: `projects/**/*.md`,
  fields: {
    name: { type: "string", required: true },
    description: { type: "string", required: true },
    tech_stack: { type: "list", of: { type: "string" }, required: true },
    github: { type: "string" },
    private_full_version: { type: "boolean" },
    has_demo: { type: "boolean" },
    contact: { type: "string" },
    features: { type: "list", of: { type: "string" }, required: true }
  },
  computedFields: {
    slug: {
      type: "string",
      resolve: (project) => project._raw.sourceFileName.replace(/\.md$/, "")
    },
    url: {
      type: "string",
      resolve: (project) => `/projects/${project._raw.sourceFileName.replace(/\.md$/, "")}`
    }
  }
}));
var contentlayer_config_default = makeSource({
  contentDirPath: "content",
  documentTypes: [Post, Project],
  disableImportAliasWarning: true
});
export {
  Post,
  Project,
  contentlayer_config_default as default
};
//# sourceMappingURL=compiled-contentlayer-config-PXYD4AK6.mjs.map
