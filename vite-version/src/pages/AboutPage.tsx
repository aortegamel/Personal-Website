import { useState } from 'react'

export function AboutPage() {
  const [activeSection, setActiveSection] = useState('about')

  const sections = {
    about: 'About',
    experience: 'Experience', 
    contact: 'Contact'
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-bitcoin-400 via-bitcoin-300 to-abyss-400 bg-clip-text text-transparent">
            About Angleito
          </h1>
          <p className="text-xl text-abyss-200 max-w-2xl mx-auto">
            Software Engineer passionate about blockchain technology, DeFi protocols, and building innovative web applications.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-12">
          <div className="bg-deepSea-surface/50 backdrop-blur-sm border border-abyss-400/20 rounded-lg p-1 inline-flex">
            {Object.entries(sections).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setActiveSection(key)}
                className={`px-6 py-2 rounded-md transition-all duration-300 ${
                  activeSection === key
                    ? 'bg-bitcoin-500 text-deepSea-abyss shadow-bitcoin'
                    : 'text-abyss-300 hover:text-white'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-12">
          {/* About Section */}
          {activeSection === 'about' && (
            <section className="space-y-8 animate-fade-in">
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <h2 className="text-3xl font-bold mb-6 text-bitcoin-400">Who I Am</h2>
                <p className="text-lg leading-relaxed mb-6 text-abyss-200">
                  I'm a software engineer with a deep passion for blockchain technology and decentralized finance. 
                  My journey in tech began with traditional web development, but I quickly became fascinated by the 
                  potential of blockchain to revolutionize how we think about money, ownership, and trust.
                </p>
                
                <p className="text-lg leading-relaxed mb-6 text-abyss-200">
                  Currently, I focus on building DeFi protocols, smart contracts, and full-stack applications that 
                  bridge the gap between traditional finance and the decentralized future. I believe in creating 
                  technology that not only solves real problems but also empowers users to have more control over 
                  their financial lives.
                </p>

                <h3 className="text-2xl font-semibold mb-4 text-bitcoin-400">What I Do</h3>
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div className="abyss-card">
                    <h4 className="text-xl font-semibold mb-3 text-bitcoin-300">Blockchain Development</h4>
                    <p className="text-abyss-300">
                      Smart contracts, DeFi protocols, and blockchain infrastructure using Solidity, 
                      Rust, and various blockchain platforms including Ethereum and Sui.
                    </p>
                  </div>
                  
                  <div className="abyss-card">
                    <h4 className="text-xl font-semibold mb-3 text-bitcoin-300">Full-Stack Development</h4>
                    <p className="text-abyss-300">
                      Modern web applications using React, TypeScript, Node.js, and various databases. 
                      I create seamless user experiences for complex financial applications.
                    </p>
                  </div>
                  
                  <div className="abyss-card">
                    <h4 className="text-xl font-semibold mb-3 text-bitcoin-300">AI Integration</h4>
                    <p className="text-abyss-300">
                      Incorporating machine learning and AI into financial applications, from trading 
                      algorithms to intelligent user interfaces that adapt to user behavior.
                    </p>
                  </div>
                  
                  <div className="abyss-card">
                    <h4 className="text-xl font-semibold mb-3 text-bitcoin-300">Technical Writing</h4>
                    <p className="text-abyss-300">
                      Sharing knowledge through technical blog posts, documentation, and educational 
                      content about blockchain technology and software development.
                    </p>
                  </div>
                </div>

                <h3 className="text-2xl font-semibold mb-4 text-bitcoin-400">Technologies I Work With</h3>
                <div className="flex flex-wrap gap-3">
                  {[
                    'Solidity', 'Rust', 'TypeScript', 'React', 'Node.js', 'Python',
                    'Ethereum', 'Sui', 'PostgreSQL', 'MongoDB', 'Docker', 'AWS',
                    'Next.js', 'Tailwind CSS', 'GraphQL', 'Web3.js', 'Ethers.js'
                  ].map((tech) => (
                    <span 
                      key={tech}
                      className="badge badge-bitcoin"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Experience Section */}
          {activeSection === 'experience' && (
            <section className="space-y-8 animate-fade-in">
              <h2 className="text-3xl font-bold mb-8 text-bitcoin-400">Professional Journey</h2>
              
              <div className="space-y-8">
                <div className="border-l-4 border-bitcoin-500 pl-6">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-2">
                    <h3 className="text-xl font-semibold text-bitcoin-300">Senior Blockchain Developer</h3>
                    <span className="text-abyss-400">2023 - Present</span>
                  </div>
                  <p className="text-abyss-300 mb-3">DeFi Protocol Development</p>
                  <p className="leading-relaxed text-abyss-200">
                    Leading the development of next-generation DeFi protocols with focus on yield optimization, 
                    cross-chain functionality, and user experience. Built several successful protocols that 
                    manage millions in total value locked (TVL).
                  </p>
                </div>

                <div className="border-l-4 border-abyss-500 pl-6">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-2">
                    <h3 className="text-xl font-semibold text-bitcoin-300">Full-Stack Developer</h3>
                    <span className="text-abyss-400">2021 - 2023</span>
                  </div>
                  <p className="text-abyss-300 mb-3">Fintech Startup</p>
                  <p className="leading-relaxed text-abyss-200">
                    Developed and maintained financial applications serving thousands of users. 
                    Specialized in building secure, scalable systems for payment processing and 
                    financial data analysis.
                  </p>
                </div>

                <div className="border-l-4 border-abyss-500 pl-6">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-2">
                    <h3 className="text-xl font-semibold text-bitcoin-300">Software Engineer</h3>
                    <span className="text-abyss-400">2019 - 2021</span>
                  </div>
                  <p className="text-abyss-300 mb-3">Tech Consulting</p>
                  <p className="leading-relaxed text-abyss-200">
                    Worked with various clients to build custom web applications and mobile apps. 
                    Gained experience across multiple industries and technology stacks.
                  </p>
                </div>
              </div>

              <div className="abyss-card mt-8">
                <h3 className="text-xl font-semibold mb-4 text-bitcoin-300">Key Achievements</h3>
                <ul className="space-y-2 text-abyss-300">
                  <li>• Built DeFi protocols managing $10M+ in total value locked</li>
                  <li>• Created automated trading systems with 95%+ uptime</li>
                  <li>• Open-sourced multiple blockchain tools used by 100+ developers</li>
                  <li>• Published technical articles reaching 50K+ readers</li>
                  <li>• Mentored junior developers in blockchain development</li>
                </ul>
              </div>
            </section>
          )}

          {/* Contact Section */}
          {activeSection === 'contact' && (
            <section className="space-y-8 animate-fade-in">
              <h2 className="text-3xl font-bold mb-8 text-bitcoin-400">Get In Touch</h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <p className="text-lg leading-relaxed text-abyss-200">
                    I'm always interested in discussing new opportunities, innovative projects, 
                    or just chatting about the latest developments in blockchain and web3.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <svg className="h-5 w-5 text-bitcoin-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                      </svg>
                      <a 
                        href="mailto:contact@angleito.dev" 
                        className="abyss-link"
                      >
                        contact@angleito.dev
                      </a>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <svg className="h-5 w-5 text-bitcoin-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                      <a 
                        href="https://github.com/Angleito" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="abyss-link"
                      >
                        GitHub
                      </a>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <svg className="h-5 w-5 text-bitcoin-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                      <a 
                        href="https://linkedin.com/in/angelortegamelton" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="abyss-link"
                      >
                        LinkedIn
                      </a>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <svg className="h-5 w-5 text-bitcoin-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                      </svg>
                      <a 
                        href="https://twitter.com/angleito5" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="abyss-link"
                      >
                        Twitter
                      </a>
                    </div>
                  </div>
                </div>
                
                <div className="abyss-card">
                  <h3 className="text-xl font-semibold mb-4 text-bitcoin-300">Let's Collaborate</h3>
                  <p className="text-abyss-300 mb-4">
                    I'm particularly interested in projects involving:
                  </p>
                  <ul className="space-y-2 text-abyss-300">
                    <li>• DeFi protocol development</li>
                    <li>• Cross-chain applications</li>
                    <li>• AI-powered financial tools</li>
                    <li>• Open-source blockchain projects</li>
                    <li>• Educational content creation</li>
                  </ul>
                  
                  <div className="mt-6">
                    <a 
                      href="mailto:contact@angleito.dev?subject=Collaboration Opportunity"
                      className="bitcoin-button inline-block"
                    >
                      Send Message
                    </a>
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}