import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Search - Angleito\'s Portfolio',
};

export default function SearchLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return <>{children}</>;
}