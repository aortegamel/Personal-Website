#!/bin/bash

# Set up colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting component tests for Angleito's Portfolio${NC}"

# Create a directory for test results if it doesn't exist
mkdir -p test-results

# Define all components to test
declare -a components=(
  "src/components/ui/Button.tsx"
  "src/components/ui/Card.tsx"
  "src/components/ui/Input.tsx"
  "src/components/ui/Badge.tsx"
  "src/components/layout/Container.tsx"
  "src/components/layout/Section.tsx"
  "src/components/layout/Grid.tsx"
  "src/components/Header.tsx"
  "src/components/Footer.tsx"
  "src/components/PostPreview.tsx"
  "src/components/ProjectCard.tsx"
  "src/context/ThemeContext.tsx"
  "src/lib/utils.ts"
  "tailwind.config.js"
)

# Initialize counters
total_tests=${#components[@]}
passed_tests=0
failed_tests=0
failed_components=()

# Test each component
for component in "${components[@]}"; do
  component_name=$(basename "$component")
  echo -e "\n${YELLOW}Testing: ${component_name}${NC}"
  
  if [ -f "$component" ]; then
    echo -e "${GREEN}✓ Component exists and is accessible${NC}"
    ((passed_tests++))
  else
    echo -e "${RED}✗ Component does not exist at expected path: ${component}${NC}"
    ((failed_tests++))
    failed_components+=("$component")
  fi
done

# Print summary
echo -e "\n${YELLOW}=== Test Summary ===${NC}"
echo -e "Total tests: ${total_tests}"
echo -e "Passed tests: ${GREEN}${passed_tests}${NC}"
echo -e "Failed tests: ${RED}${failed_tests}${NC}"

# Calculate pass percentage
pass_percentage=$(( (passed_tests * 100) / total_tests ))
echo -e "Pass rate: ${pass_percentage}%"

# List failed components if any
if [ ${#failed_components[@]} -gt 0 ]; then
  echo -e "\n${RED}Failed components:${NC}"
  for component in "${failed_components[@]}"; do
    echo -e "  - ${component}"
  done
fi

# Return success if all tests passed
if [ $passed_tests -eq $total_tests ]; then
  echo -e "\n${GREEN}All components passed!${NC}"
  exit 0
else
  echo -e "\n${RED}Some components failed.${NC}"
  exit 1
fi
