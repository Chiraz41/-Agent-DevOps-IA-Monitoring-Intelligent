import pandas as pd

df = pd.read_csv(r"C:\Users\MSI\Downloads\archive\systemresources-deeplearning-1000.csv")

print("Colonnes :", df.columns.tolist())
print("\nShape :", df.shape)
print("\nAperçu :")
print(df.head(10))
print("\nTypes :")
print(df.dtypes)
print("\nStatistiques completes :")
print(df.describe())

print("\nValeurs uniques network (premiers 20) :")
print(sorted(df["network"].unique())[:20])