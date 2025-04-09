import Link from 'next/link';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-100 py-8 mt-12 border-t border-gray-200">
      <div className="container mx-auto px-4">
        <p className="text-center text-gray-600">
          &copy; {currentYear} Angleito. All rights reserved.
        </p>
        <div className="flex justify-center mt-4">
          <Link 
            href="https://github.com/Angleito" 
            target="_blank" 
            className="text-blue-600 hover:text-blue-800 mx-2"
          >
            GitHub
          </Link>
          <span className="text-gray-400">|</span>
          <Link 
            href="mailto:arainey555@gmail.com" 
            className="text-blue-600 hover:text-blue-800 mx-2"
          >
            Email
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
