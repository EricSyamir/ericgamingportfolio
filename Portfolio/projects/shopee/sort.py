import pandas as pd

def sort_by_title(input_filepath, output_filepath):
    """Read CSV, sort by title alphabetically, and save to new file"""
    try:
        # Read the CSV file
        df = pd.read_csv(input_filepath)
        
        # Sort by title in alphabetical order (A-Z)
        sorted_df = df.sort_values(by='title', ascending=True)
        
        # Save to new CSV file
        sorted_df.to_csv(output_filepath, index=False)
        
        print(f"Success! Sorted data saved to {output_filepath}")
        print(f"Original records: {len(df)}, Sorted records: {len(sorted_df)}")
        
    except Exception as e:
        print(f"An error occurred: {e}")

# Example usage:
input_path = "output_filtered.csv"  # Use the filtered file from previous step
output_path = "output_sorted.csv"  # Replace with your desired output path
sort_by_title(input_path, output_path)