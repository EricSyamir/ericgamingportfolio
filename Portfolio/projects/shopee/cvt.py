import pandas as pd
import re

def contains_chinese(text):
    """Check if the text contains Chinese characters"""
    if pd.isna(text):
        return False
    # Chinese Unicode ranges: https://stackoverflow.com/a/1366113/12904151
    chinese_pattern = re.compile(
        r'[\u4e00-\u9fff\u3400-\u4dbf\U00020000-\U0002a6df\U0002a700-\U0002b73f\U0002b740-\U0002b81f\U0002b820-\U0002ceaf]'
    )
    return bool(chinese_pattern.search(str(text)))

def filter_chinese_records(input_filepath, output_filepath):
    """Read CSV, filter out records with Chinese characters, and save to new file"""
    try:
        # Read the CSV file
        df = pd.read_csv(input_filepath)
        
        # Check each column for Chinese characters
        has_chinese = df.applymap(contains_chinese).any(axis=1)
        
        # Filter out records with Chinese characters
        filtered_df = df[~has_chinese]
        
        # Save to new CSV file
        filtered_df.to_csv(output_filepath, index=False)
        
        print(f"Success! Filtered data saved to {output_filepath}")
        print(f"Original records: {len(df)}, Filtered records: {len(filtered_df)}")
        
    except Exception as e:
        print(f"An error occurred: {e}")

# Example usage:
input_path = "shopee.csv"  # Replace with your input file path
output_path = "output_filtered.csv"  # Replace with your desired output path
filter_chinese_records(input_path, output_path)