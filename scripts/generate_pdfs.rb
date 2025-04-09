#!/usr/bin/env ruby
require 'fileutils'
require 'yaml'
require 'date'
require 'kramdown'
require 'prawn'
require 'prawn/table'
require 'open-uri'

# Configuration
SITE_DIR = File.expand_path('..', __dir__)
POSTS_DIR = File.join(SITE_DIR, '_posts')
PDF_OUTPUT_DIR = File.join(SITE_DIR, 'assets', 'pdfs')

# Create output directory if it doesn't exist
FileUtils.mkdir_p(PDF_OUTPUT_DIR)

# Get all posts
posts = []
Dir.glob(File.join(POSTS_DIR, '*.md')).each do |post_file|
  content = File.read(post_file)

  # Extract front matter
  if content =~ /\A---\s*\n(.*?)\n---\s*\n/m
    front_matter = YAML.safe_load($1, permitted_classes: [Date, Time])

    # Extract post content (everything after front matter)
    post_content = content.sub(/\A---\s*\n.*?\n---\s*\n/m, '')

    posts << {
      title: front_matter['title'],
      date: front_matter['date'],
      author: front_matter['author'],
      categories: front_matter['categories'],
      content: post_content,
      filename: File.basename(post_file, '.md')
    }
  end
end

puts "Found #{posts.length} posts"

# Generate PDFs for each post
posts.each do |post|
  pdf_filename = "#{post[:filename]}.pdf"
  pdf_path = File.join(PDF_OUTPUT_DIR, pdf_filename)

  puts "Generating PDF for: #{post[:title]}"

  Prawn::Document.generate(pdf_path, margin: 50) do |pdf|
    # Add a fancy header
    pdf.fill_color "003366"
    pdf.font("Helvetica", size: 24, style: :bold) do
      pdf.text post[:title], align: :center
    end

    # Add metadata
    pdf.fill_color "666666"
    pdf.font("Helvetica", size: 12, style: :italic) do
      pdf.text "Date: #{post[:date].strftime('%B %d, %Y') if post[:date].respond_to?(:strftime)}", align: :center
      pdf.text "Author: #{post[:author]}", align: :center if post[:author]

      # Add categories if available
      if post[:categories] && !post[:categories].empty?
        categories_text = post[:categories].is_a?(Array) ? post[:categories].join(', ') : post[:categories].to_s
        pdf.text "Categories: #{categories_text}", align: :center
      end
    end

    pdf.move_down 20

    # Add a horizontal line
    pdf.stroke_color "CCCCCC"
    pdf.stroke_horizontal_rule

    pdf.move_down 20

    # Convert markdown to text for PDF
    pdf.fill_color "000000"
    pdf.font("Helvetica", size: 12) do
      # Simple markdown parsing (this is basic - for complex markdown you might need more processing)
      post[:content].split("\n\n").each do |paragraph|
        if paragraph.start_with?('#')
          # Handle headers
          level = paragraph.match(/^(#+)/)[1].length
          text = paragraph.sub(/^#+\s*/, '')
          size = 20 - (level * 2)
          pdf.font("Helvetica", size: size, style: :bold) do
            pdf.text text
          end
        elsif paragraph.start_with?('>')
          # Handle blockquotes
          text = paragraph.sub(/^>\s*/, '')
          pdf.font("Helvetica", size: 12, style: :italic) do
            pdf.text text
            pdf.move_down 10
          end
        elsif paragraph.start_with?('- ') || paragraph.start_with?('* ')
          # Handle simple lists
          items = paragraph.split("\n").map { |i| i.sub(/^[*-]\s*/, '') }
          items.each do |item|
            pdf.text "• #{item}"
          end
        elsif paragraph.start_with?('1. ')
          # Handle simple numbered lists
          items = paragraph.split("\n").map { |i| i.sub(/^\d+\.\s*/, '') }
          items.each_with_index do |item, index|
            pdf.text "#{index + 1}. #{item}"
          end
        elsif paragraph.start_with?('```')
          # Handle code blocks
          code = paragraph.gsub(/^```.*\n/, '').gsub(/```$/, '')
          pdf.font("Courier", size: 10) do
            pdf.text code
          end
        elsif paragraph.start_with?('![')
          # Handle images - note: this is simplified and may not work for all image references
          alt_text = paragraph.match(/!\[(.*?)\]/)[1] rescue "Image"
          pdf.text "[Image: #{alt_text}]"
        else
          # Regular paragraph
          # Handle basic inline formatting
          text = paragraph
            .gsub(/\*\*(.*?)\*\*/, '\1') # Bold
            .gsub(/\*(.*?)\*/, '\1')      # Italic
            .gsub(/`(.*?)`/, '\1')        # Code

          pdf.text text
        end

        pdf.move_down 10
      end
    end

    # Add page numbers
    pdf.number_pages "Page <page> of <total>",
                    { start_count_at: 1,
                      page_filter: :all,
                      at: [pdf.bounds.right - 150, 0],
                      align: :right,
                      size: 9 }
  end

  puts "PDF generated: #{pdf_path}"
end

puts "PDF generation complete. #{posts.length} PDFs created in #{PDF_OUTPUT_DIR}"
