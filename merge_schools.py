import pandas as pd

# Read the CSV files
df_equip = pd.read_csv('build/escolas_processed_equip.csv')
df_schools = pd.read_csv('build/escolas.csv')

# Merge the dataframes on the 'Escola' column
merged_df = pd.merge(
    df_equip,
    df_schools,
    on='Escola',
    how='outer'  # Use outer join to keep all schools from both datasets
)

# Remove duplicate columns if any exist
# Keep the first occurrence of any duplicated column
merged_df = merged_df.loc[:, ~merged_df.columns.duplicated()]

# Save the merged dataset
merged_df.to_csv('build/escolas_merged.csv', index=False)

print(f"Successfully merged files. Output saved to 'build/escolas_merged.csv'")
print(f"Number of rows in merged file: {len(merged_df)}")
print(f"Number of columns in merged file: {len(merged_df.columns)}") 