import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa'
import { site } from '../site'

export function Footer() {
  return (
    <footer className="border-t border-gray-800/50 bg-deepSea-surface/50 backdrop-blur-sm mt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-gray-400 mb-4 md:mb-0">
            © {new Date().getFullYear()} {site.shortName}. All rights reserved.
          </div>

          <div className="flex space-x-4">
            <a
              href={site.social.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-bitcoin-primary transition-colors"
              aria-label="GitHub"
            >
              <FaGithub className="h-5 w-5" />
            </a>
            <a
              href={site.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-bitcoin-primary transition-colors"
              aria-label="LinkedIn"
            >
              <FaLinkedin className="h-5 w-5" />
            </a>
            <a
              href={site.social.twitter}
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
