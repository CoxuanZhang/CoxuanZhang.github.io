import os
import json
import re

def load_geolocations():
    photo_folder = "Personal/Camera/Photos"
    photo_folder_short = "Photos"
    os.chdir(photo_folder)
    locations = [d for d in os.listdir('.') if os.path.isdir(d)]

    os.chdir(os.pardir)

    # Load existing geojson data if it exists
    location_path = "locations.json"
    if os.path.exists(location_path):
        with open(location_path, "r") as f:
            try:
                data = json.load(f)
            except Exception:
                data = []
    else:
        data = []

    # Build a lookup for existing locations
    location_map = {entry["location"]: entry for entry in data}
    updated = False

    for location in locations:
        photo_count = len([
            f for f in os.listdir(os.path.join(photo_folder_short, location))
            if f.lower().endswith('.jpg')
        ])
        if location in location_map:
            # Check if photo_counts needs update
            if location_map[location]["photo_counts"] != photo_count:
                location_map[location]["photo_counts"] = photo_count
                updated = True
        else:
            coordinate = input(f"What is the coordinate of {location}?")
            coordinate = [float(re.sub(r'[^0-9.]', '', s)) for s in coordinate.split(',')]
            ID = input(f"What is the ID of {location}? ")
            location_map[location] = {
                "location": location,
                "path": os.path.join(photo_folder, location),
                "coordinate": coordinate,
                "photo_counts": photo_count,
                "ID": ID
            }
            updated = True
    print(f"locations.json updated: {not updated}")
    # Write only if there are updates or new locations
    if updated:
        with open(location_path, "w") as f:
            json.dump(list(location_map.values()), f, indent=2)
        print(f"locations.json update complete")
    
def photo_locations():
    camera_folder = "Personal/Camera/"
    os.chdir(camera_folder)
    data = {}
    with open("locations.json", "r") as f:
        locations = json.load(f)
    os.chdir("Photos")
    for location in locations:
        data[location["location"]] = []
       #print(f"Current directory: {os.getcwd()}")
        for photo in os.listdir(location["location"]):
            #title = input(f"What is the title of the photo {photo} in {location['location']}? ")
            #date = input(f"What is the date of the photo {photo} in {location['location']}? ")
            data[location["location"]].append({
                "ID": photo.split(".")[0],
                "title": "",
                "description":"",
                "date": "",
                "path": os.path.join(location["path"], photo)
            })
    os.chdir(os.pardir)
    with open("photos_data.json", "w") as f:
        json.dump(data, f, indent=2)

def rename_photos(directory):
    os.chdir("Personal/Camera")
    with open("locations.json", "r") as f:
        locations = json.load(f)
    for location in locations:
        if location["location"] == directory:
            ID = location["ID"]
    path = os.path.join("Photos", directory)
    files = [f for f in os.listdir(path) if f.lower().endswith('.jpg')]
    temp_names = []
    # First pass: rename all to temp names
    for i, filename in enumerate(files):
        temp_name = f"__temp__{i}__.jpg"
        src = os.path.join(path, filename)
        dst = os.path.join(path, temp_name)
        os.rename(src, dst)
        temp_names.append(temp_name)
    # Second pass: rename temp names to final names
    for count, temp_name in enumerate(temp_names):
        final_name = f"{ID}_{count:03d}.jpg"
        src = os.path.join(path, temp_name)
        dst = os.path.join(path, final_name)
        os.rename(src, dst)
    print(f"Renamed {len(files)} photos in {directory}")
    os.chdir(os.path.join(os.pardir, os.pardir))

def load_geojson():
    geojson_path = "Personal/Camera/locations.geojson"
    locations_path = "Personal/Camera/locations.json"
    # Read locations.json
    with open(locations_path, "r") as f:
        locations = json.load(f)
    features = []
    for loc in locations:
        # Expecting coordinate as [lon, lat] or [lat, lon]  
        coord = loc.get("coordinate")
        if coord and len(coord) == 2:
            features.append({
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": coord
                },
                "properties": {
                    "location": loc.get("location"),
                    "ID": loc.get("ID"),
                    "photo_counts": loc.get("photo_counts", 0)
                }
            })
    geojson = {
        "type": "FeatureCollection",
        "features": features
    }
    with open(geojson_path, "w") as f:
        json.dump(geojson, f, indent=2)
    print(f"Wrote {len(features)} points to {geojson_path}")

function_map = {
    "a": load_geolocations,
    "b": photo_locations,
    "c": load_geojson,
}

def decide_task(user_input):
    func = function_map.get(user_input.lower()) 
    while not func:
        print(f"Error: No function found for input '{user_input}'. Please enter 'a', 'b', 'c'.")
        user_input = input("Enter your choice: ")
        func = function_map.get(user_input.lower())
    func()

if __name__ == "__main__":
    user_input_1 = input("Enter (a) load geolocations, (b) photo locations, or (c) load geojson: ")
    decide_task(user_input_1)
    """
    # Rename photos in a specific location
    with open ("Personal/Camera/locations.json", "r") as f:
        locations = json.load(f)
    for location in locations:
        rename_photos(location["location"])
    """
