# Bangladesh NDVI Monitoring — Google Earth Engine Project

This repository contains the Google Earth Engine (GEE) workflow and assets used to:
- compute NDVI time-series for a point,
- create cloud-masked seasonal NDVI composites,
- compute district-wise mean NDVI,
- visualize choropleth maps,
- export district-level NDVI statistics.

**What’s included**
- `gee_script.js` : The main GEE Code Editor script (copy-paste into code.earthengine.google.com)
- `README.md` : This file
- `EXPORT_INSTRUCTIONS.md` : How to run exports and download CSVs from Earth Engine
- `LICENSE` : MIT License
- `images/` : Example screenshots (NDVI chart, district choropleth)

**Notes**
- Replace asset IDs in `gee_script.js` with your own (district asset path or cloud asset path). Example placeholders are provided.
- This code uses Sentinel-2 Level-2A (`COPERNICUS/S2_SR`) and assumes you have an uploaded districts shapefile (`users/yourname/bd_districts`) or a cloud asset path `projects/.../assets/bd_districts`.
- If you encounter memory errors, increase `tileScale` in reduceRegions or run exports on smaller regions first.

**How to use**
1. Clone or download this repo.
2. Open the `gee_script.js` in the Earth Engine Code Editor at https://code.earthengine.google.com
3. Update the `districtsAsset` variable with your asset id.
4. Run step-by-step: first run NDVI single image, then time-series, then composites, then district zonal statistics.
5. Use the Tasks tab to export images and CSVs.

If you want, I can also prepare a GitHub repo for you and push this zip directly. Ask me to "create GitHub repo and push" and provide your GitHub repo name and PAT (or I can give instructions to upload manually).
