// contentlayer.config.ts
import { defineDocumentType, makeSource } from "contentlayer/source-files";
var Post = defineDocumentType(() => ({
  name: "Post",
  filePathPattern: `src/content/posts/**/*.md`,
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    date: { type: "date", required: true },
    categories: { type: "list", of: { type: "string" }, required: true },
    author: { type: "string", required: true }
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
  filePathPattern: `src/content/projects/**/*.md`,
  contentType: "mdx",
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
  contentDirPath: ".",
  documentTypes: [Post, Project],
  disableImportAliasWarning: true,
  onUnknownDocuments: "skip-ignore"
});
export {
  Post,
  Project,
  contentlayer_config_default as default
};
//# sourceMappingURL=compiled-contentlayer-config-QIBTNKJG.mjs.map
