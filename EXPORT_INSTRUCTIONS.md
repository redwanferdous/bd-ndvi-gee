# Export Instructions (Google Earth Engine)

## Exporting Images (GeoTIFF)
- Use `Export.image.toDrive({...})` in the script.
- Example:
  ```
  Export.image.toDrive({
    image: ndvi_clean,
    description: 'NDVI_clean_monsoon_2024',
    scale: 10,
    region: region.buffer(5000).bounds()
  });
  ```
- Go to the **Tasks** tab, click **Run**, choose folder in Google Drive, then **Run** again.
- After the task completes, download from your Google Drive.

## Exporting Tables (CSV)
- Use `Export.table.toDrive({...})`.
- Example:
  ```
  Export.table.toDrive({
    collection: validStats,
    description: 'BD_District_Mean_NDVI_2024',
    fileFormat: 'CSV'
  });
  ```
- Run task in **Tasks** tab and download from Drive.

## Tips
- For large exports, increase `tileScale` (e.g., `tileScale: 2` or 4) to reduce memory per tile.
- Test with a small region first.
- Ensure your export `region` is in the same CRS/projection if using other tools.
