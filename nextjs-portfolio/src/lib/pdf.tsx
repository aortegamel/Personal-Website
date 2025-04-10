import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font, pdf } from '@react-pdf/renderer';
import { Post } from './mdx';

// Register fonts
Font.register({
  family: 'Helvetica',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/helveticaneue/v70/1Ptsg8zYS_SKggPNyC0IT0kLW-43aMEzIO6XUTLjad8.ttf', fontWeight: 'normal' },
    { src: 'https://fonts.gstatic.com/s/helveticaneue/v70/1Ptsg8zYS_SKggPNyC0IT0kLW-43aMEzIO6XUTLjad8.ttf', fontWeight: 'bold' },
    { src: 'https://fonts.gstatic.com/s/helveticaneue/v70/1Ptsg8zYS_SKggPNyC0IT0kLW-43aMEzIO6XUTLjad8.ttf', fontStyle: 'italic' },
  ],
});

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 50,
  },
  header: {
    marginBottom: 20,
    textAlign: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#003366',
    marginBottom: 10,
  },
  metadata: {
    fontSize: 12,
    fontStyle: 'italic',
    color: '#666666',
    marginBottom: 5,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
    marginVertical: 20,
  },
  content: {
    fontSize: 12,
    lineHeight: 1.6,
    textAlign: 'justify',
  },
  paragraph: {
    marginBottom: 10,
  },
  heading1: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#003366',
  },
  heading2: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 8,
    color: '#003366',
  },
  heading3: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 6,
    color: '#003366',
  },
  blockquote: {
    paddingLeft: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#CCCCCC',
    fontStyle: 'italic',
    color: '#555555',
    marginVertical: 10,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 10,
    color: '#666666',
  },
  pageNumber: {
    position: 'absolute',
    bottom: 30,
    right: 50,
    fontSize: 9,
    color: '#666666',
  },
});

// Simple Markdown parser for PDF
const parseMarkdown = (content: string) => {
  const paragraphs = content.split('\n\n');
  
  return paragraphs.map((paragraph, index) => {
    // Handle headings
    if (paragraph.startsWith('# ')) {
      return <Text key={index} style={styles.heading1}>{paragraph.substring(2)}</Text>;
    }
    if (paragraph.startsWith('## ')) {
      return <Text key={index} style={styles.heading2}>{paragraph.substring(3)}</Text>;
    }
    if (paragraph.startsWith('### ')) {
      return <Text key={index} style={styles.heading3}>{paragraph.substring(4)}</Text>;
    }
    
    // Handle blockquotes
    if (paragraph.startsWith('> ')) {
      return <Text key={index} style={styles.blockquote}>{paragraph.substring(2)}</Text>;
    }
    
    // Handle horizontal rules
    if (paragraph === '---') {
      return <View key={index} style={styles.divider} />;
    }
    
    // Default paragraph
    return <Text key={index} style={styles.paragraph}>{paragraph}</Text>;
  });
};

// PDF Document component
export const PostPDF = ({ post }: { post: Post }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>{post.title}</Text>
        <Text style={styles.metadata}>Date: {post.formattedDate}</Text>
        {post.author && <Text style={styles.metadata}>Author: {post.author}</Text>}
        {post.categories.length > 0 && (
          <Text style={styles.metadata}>Categories: {post.categories.join(', ')}</Text>
        )}
      </View>
      
      <View style={styles.divider} />
      
      <View style={styles.content}>
        {parseMarkdown(post.content)}
      </View>
      
      <Text style={styles.footer}>
        © {new Date().getFullYear()} Angleito. All rights reserved.
        Generated from Angleito&apos;s Portfolio - https://Angleito.github.io
      </Text>
      
      <Text 
        style={styles.pageNumber} 
        render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} 
        fixed 
      />
    </Page>
  </Document>
);

// Generate PDF buffer
export const generatePDF = async (post: Post): Promise<Buffer> => {
  const pdfDocument = pdf(<PostPDF post={post} />);
  const pdfBlob = await pdfDocument.toBlob();
  return Buffer.from(await pdfBlob.arrayBuffer());
};
