export interface MdxPostMeta {
  slug: string;
  title: string;
  date: string;
  excerpt?: string;
}

export declare function getAllMdxPosts(): MdxPostMeta[];
