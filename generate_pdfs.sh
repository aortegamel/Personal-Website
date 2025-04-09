#!/bin/bash

# Script to generate PDFs for all articles
echo "Generating PDFs for all articles..."
ruby scripts/generate_pdfs.rb

echo ""
echo "PDF generation complete!"
echo "PDFs are available in the assets/pdfs directory."
