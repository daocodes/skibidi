from flask import Flask, render_template
import ee

ee.Initialize(project='lucid-fountain-466101-v0')

app = Flask(__name__)

@app.route("/")
def index():
    point = ee.Geometry.Point([-90.0715, 29.9511])

    # Sentinel-1 SAR collection
    collection = (ee.ImageCollection('COPERNICUS/S1_GRD')
        .filterBounds(point)
        .filterDate('2023-06-01', '2023-06-30')
        .filter(ee.Filter.eq('instrumentMode', 'IW'))
        .filter(ee.Filter.listContains('transmitterReceiverPolarisation', 'VV')))

    image = collection.first()


    vis_params = {"bands": ["VV"], "min": -25, "max": 0}

    map_id_dict = ee.Image(image).getMapId(vis_params)

    tile_url = map_id_dict['tile_fetcher'].url_format

    return render_template("index.html", tile_url=tile_url)

if __name__ == "__main__":
    app.run(debug=True)
