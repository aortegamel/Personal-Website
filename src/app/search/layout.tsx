import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Search - Angel Ortega-Melton\'s Portfolio',
};

export default function SearchLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return <>{children}</>;
}