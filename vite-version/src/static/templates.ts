import { Post, Project, ContentMeta } from '../types/content'

export const htmlTemplate = (title: string, content: string, metadata?: any) => `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} - Angel Ortega-Melton</title>
    ${metadata ? `
    <meta name="description" content="${metadata.description || ''}">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${metadata.description || ''}">
    <meta property="og:type" content="${metadata.type || 'website'}">
    ` : ''}
    <link rel="stylesheet" href="/assets/index.css">
</head>
<body>
    <div id="root">
        ${content}
    </div>
    <script>
        // Progressive enhancement - React will hydrate this when loaded
        window.__STATIC_CONTENT__ = true;
    </script>
    <script type="module" src="/assets/index.js" defer></script>
</body>
</html>`

export const pageContent = (title: string, html: string, backLink?: { href: string, text: string }) => `
<div class="min-h-screen bg-background text-foreground">
    <header class="border-b">
        <div class="container mx-auto px-4 py-4">
            <nav class="flex justify-between items-center">
                <a href="/" class="text-2xl font-bold">Angel Ortega-Melton</a>
                ${backLink ? `<a href="${backLink.href}" class="text-sm hover:underline">${backLink.text}</a>` : ''}
            </nav>
        </div>
    </header>
    <main class="container mx-auto px-4 py-8">
        <article class="prose prose-lg dark:prose-invert mx-auto">
            ${html}
        </article>
    </main>
</div>`

export const listTemplate = (title: string, items: ContentMeta[], type: 'posts' | 'projects') => `
<div class="min-h-screen bg-background text-foreground">
    <header class="border-b">
        <div class="container mx-auto px-4 py-4">
            <nav class="flex justify-between items-center">
                <a href="/" class="text-2xl font-bold">Angel Ortega-Melton</a>
                <a href="/" class="text-sm hover:underline">Home</a>
            </nav>
        </div>
    </header>
    <main class="container mx-auto px-4 py-8">
        <h1 class="text-4xl font-bold mb-8">${title}</h1>
        <div class="grid gap-6">
            ${items.map(item => `
                <article class="border rounded-lg p-6 hover:shadow-lg transition-shadow">
                    <h2 class="text-2xl font-semibold mb-2">
                        <a href="/${type}/${item.slug}" class="hover:underline">${item.title}</a>
                    </h2>
                    <p class="text-muted-foreground mb-4">${item.description}</p>
                    <div class="flex items-center gap-4 text-sm text-muted-foreground">
                        <time>${new Date(item.date).toLocaleDateString()}</time>
                        ${item.tags ? `<span>${item.tags.slice(0, 3).join(', ')}</span>` : ''}
                    </div>
                </article>
            `).join('')}
        </div>
    </main>
</div>`

export const homeTemplate = (featuredPosts: ContentMeta[], featuredProjects: ContentMeta[]) => `
<div class="min-h-screen bg-background text-foreground">
    <header class="border-b">
        <div class="container mx-auto px-4 py-4">
            <nav class="flex justify-between items-center">
                <span class="text-2xl font-bold">Angel Ortega-Melton</span>
                <div class="flex gap-4">
                    <a href="/posts" class="hover:underline">Posts</a>
                    <a href="/projects" class="hover:underline">Projects</a>
                </div>
            </nav>
        </div>
    </header>
    <main class="container mx-auto px-4 py-8">
        <section class="mb-12">
            <h1 class="text-5xl font-bold mb-4">Angel Ortega-Melton</h1>
            <p class="text-xl text-muted-foreground">Entrepreneur, Developer, Creator</p>
        </section>
        
        <section class="mb-12">
            <h2 class="text-3xl font-bold mb-6">Featured Posts</h2>
            <div class="grid gap-4">
                ${featuredPosts.map(post => `
                    <article class="border rounded-lg p-4">
                        <h3 class="text-xl font-semibold mb-2">
                            <a href="/posts/${post.slug}" class="hover:underline">${post.title}</a>
                        </h3>
                        <p class="text-muted-foreground">${post.description}</p>
                    </article>
                `).join('')}
            </div>
        </section>
        
        <section>
            <h2 class="text-3xl font-bold mb-6">Featured Projects</h2>
            <div class="grid gap-4">
                ${featuredProjects.map(project => `
                    <article class="border rounded-lg p-4">
                        <h3 class="text-xl font-semibold mb-2">
                            <a href="/projects/${project.slug}" class="hover:underline">${project.title}</a>
                        </h3>
                        <p class="text-muted-foreground">${project.description}</p>
                    </article>
                `).join('')}
            </div>
        </section>
    </main>
</div>`