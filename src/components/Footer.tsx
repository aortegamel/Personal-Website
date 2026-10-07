import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa'

export function Footer() {
  return (
    <footer className="border-t border-gray-800/50 bg-deepSea-surface/50 backdrop-blur-sm mt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-gray-400 mb-4 md:mb-0">
            © 2025 Angleito. All rights reserved.
          </div>
          
          <div className="flex space-x-4">
            <a
              href="https://github.com/angleito"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-bitcoin-primary transition-colors"
              aria-label="GitHub"
            >
              <FaGithub className="h-5 w-5" />
            </a>
            <a
              href="https://linkedin.com/in/angelortegamelton"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-bitcoin-primary transition-colors"
              aria-label="LinkedIn"
            >
              <FaLinkedin className="h-5 w-5" />
            </a>
            <a
              href="https://twitter.com/angleito5"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-bitcoin-primary transition-colors"
              aria-label="Twitter"
            >
              <FaTwitter className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}