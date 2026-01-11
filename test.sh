#!/bin/zsh

# Function to normalize input to test file name
normalize_to_test_file() {
    local input="$1"
    
    # If it already ends with .test.jsx, return as is
    if [[ "$input" == *.test.jsx ]]; then
        echo "$input"
    else
        # Remove any extension if present
        local base_name="${input%.*}"
        
        # If it starts with "TimeInput", it's likely a class name or file name
        if [[ "$base_name" == TimeInput* ]]; then
            # Add .test.jsx extension
            echo "${base_name}.test.jsx"
        else
            # For other cases, add .test.jsx
            echo "${input}.test.jsx"
        fi
    fi
}

# Check if a test file argument is provided
if [ -z "$1" ]; then
    echo "Running full test suite..."
    docker-compose exec app npm test
    exit 0
fi

# Normalize the input to test file name
test_file=$(normalize_to_test_file "$1")

# Check if Docker Compose is available
if ! command -v docker-compose &> /dev/null; then
    echo "Error: docker-compose is not installed or not in PATH"
    exit 1
fi

# Check if the test file exists in the current location or in src/games/clock/__tests__/
if [ ! -f "$test_file" ]; then
    # Try to find the test file in the games clock tests directory
    test_file_path="src/games/clock/__tests__/$test_file"
    if [ -f "$test_file_path" ]; then
        test_file="$test_file_path"
    else
        echo "Error: Test file '$test_file' not found"
        echo "Normalized from: $1"
        echo "Searched in: $test_file and src/games/clock/__tests__/$test_file"
        exit 1
    fi
fi

# Run the test using Docker Compose
echo "Running test: $test_file"
docker-compose exec app npm test -- "$test_file"
