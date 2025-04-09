import { NextRequest, NextResponse } from 'next/server';
import { getPostBySlug } from '@/lib/mdx';
import { generatePDF } from '@/lib/pdf';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const post = getPostBySlug(params.slug);
    
    if (!post) {
      return new NextResponse('Post not found', { status: 404 });
    }
    
    const pdfBuffer = await generatePDF(post);
    
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${post.slug}.pdf"`,
      },
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    return new NextResponse('Error generating PDF', { status: 500 });
  }
}
