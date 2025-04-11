export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <img
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={37}
        />
        <h1 className="text-4xl font-bold text-center sm:text-left">
          Welcome to Next.js Portfolio
        </h1>
        <p className="text-lg text-gray-600 text-center sm:text-left max-w-[600px]">
          A modern, responsive portfolio template built with Next.js, showcasing 
          your projects, skills, and professional journey.
        </p>
        <div className="flex gap-4">
          <a 
            href="/projects" 
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            View Projects
          </a>
          <a 
            href="/posts" 
            className="border border-blue-500 text-blue-500 px-4 py-2 rounded hover:bg-blue-50 transition"
          >
            Read Blog
          </a>
        </div>
      </main>
    </div>
  );
}
