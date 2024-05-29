#!/bin/bash

# Define the original file name and the number of copies you want to create
original_file="input-p1234.json"
num_copies=15

# Loop through the desired number of copies
for ((i=1; i<=num_copies; i++)); do
    # Generate a random name for the new file
    new_file=$(mktemp -u input-d-p.json)
    
    # Copy the original file to the new file
    cp "$original_file" "$new_file"
    
    # Rename the new file to include the copy number
    mv "$new_file" "${new_file%.*}-$((i)).json"
done

