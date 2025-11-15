// Google Earth Engine script: Bangladesh NDVI Monitoring
// Paste into https://code.earthengine.google.com

// ======== User settings - CHANGE these to match your assets ==========
var districtsAsset = 'users/redwanferdous/bd_districts'; // or 'projects/.../assets/bd_districts'
var usePoint = ee.Geometry.Point([90.43, 23.72]); // example point (Dhaka) - change as needed

// ======== Step 1: Basic dataset check ========
print('Sentinel-2 SR sample:', ee.ImageCollection('COPERNICUS/S2_SR').first());

// ======== Step 2: Single scene NDVI ========
var s2_single = ee.ImageCollection('COPERNICUS/S2_SR')
  .filterBounds(usePoint)
  .filterDate('2024-11-01', '2024-12-01')
  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20))
  .first();

print('Selected image:', s2_single);
var ndvi_single = s2_single.normalizedDifference(['B8','B4']).rename('NDVI');
Map.centerObject(usePoint, 11);
Map.addLayer(ndvi_single, {min: -0.2, max: 0.8, palette: ['white','yellow','green']}, 'NDVI Single');

// ======== Step 3: NDVI time-series at point ========
var s2_col = ee.ImageCollection('COPERNICUS/S2_SR')
  .filterBounds(usePoint)
  .filterDate('2024-01-01','2024-12-31')
  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 40));

var addNDVI = function(img) {
  return img.addBands(img.normalizedDifference(['B8','B4']).rename('NDVI'));
};
var ndviCol = s2_col.map(addNDVI);

print(ui.Chart.image.series({
  imageCollection: ndviCol.select('NDVI'),
  region: usePoint,
  reducer: ee.Reducer.mean(),
  scale: 10
}).setOptions({title: 'NDVI Time Series at Point (2024)', vAxis: {title: 'NDVI'}}));

// ======== Step 4: Cloud mask (SCL) and seasonal composite ========
function maskS2clouds(image) {
  var scl = image.select('SCL');
  var mask = scl.eq(4).or(scl.eq(5)).or(scl.eq(6)).or(scl.eq(7));
  return image.updateMask(mask);
}

var region = usePoint.buffer(5000);
var s2_clean = ee.ImageCollection('COPERNICUS/S2_SR')
  .filterBounds(region)
  .filterDate('2024-06-01','2024-09-30') // monsoon
  .map(maskS2clouds);

var composite = s2_clean.median();
var ndvi_clean = composite.normalizedDifference(['B8','B4']).rename('NDVI_clean');
Map.addLayer(ndvi_clean, {min: 0, max: 0.8, palette:['white','yellow','green']}, 'NDVI_clean');

// ======== Step 5: District-wise zonal stats ========
var districts = ee.FeatureCollection(districtsAsset);
print('District count:', districts.size());
Map.addLayer(districts.style({color:'000000', fillColor:'00000000', width:1}), {}, 'Districts');

var ndvi_singleBand = ndvi_clean.select('NDVI_clean');

var districtStats = ndvi_singleBand.reduceRegions({
  collection: districts,
  reducer: ee.Reducer.mean(),
  scale: 10,
  tileScale: 2
});

print('District NDVI sample:', districtStats.limit(10));

// Optional: filter nulls
var validStats = districtStats.filter(ee.Filter.notNull(['mean']));
print('Valid stats count:', validStats.size());

// Create choropleth raster
var districtMeanImage = validStats.reduceToImage({
  properties: ['mean'],
  reducer: ee.Reducer.first()
});

Map.addLayer(districtMeanImage, {min:0, max:0.8, palette:['white','yellow','green']}, 'District mean NDVI');
Map.addLayer(districts.style({color:'000000', fillColor:'00000000', width:1}), {}, 'District borders');

// ======== Exports (uncomment & run tasks in Tasks tab) ========
// Export.table.toDrive({collection: validStats, description: 'BD_District_Mean_NDVI_2024', fileFormat: 'CSV'});
// Export.image.toDrive({image: ndvi_clean, description: 'NDVI_clean_monsoon_2024', scale: 10, region: region.bounds()});
