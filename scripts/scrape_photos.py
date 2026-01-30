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
        photo_count = len(os.listdir(os.path.join(photo_folder_short, location)))
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
    count = 0
    for filename in os.listdir(path):
        new_name = f"{ID}_{count:03d}.jpg"
        os.rename(os.path.join(path, filename), os.path.join(path, new_name))
        count += 1
    print(f"Renamed {count} photos in {directory}")
    os.chdir(os.path.join(os.pardir, os.pardir))

function_map = {
    "a": load_geolocations,
    "b": photo_locations,
}

def decide_task(user_input):
    func = function_map.get(user_input.lower()) 
    while not func:
        print(f"Error: No function found for input '{user_input}'. Please enter 'a', 'b'.")
        user_input = input("Enter your choice: ")
        func = function_map.get(user_input.lower())
    func()

if __name__ == "__main__":
    #user_input_1 = input("Enter (a) load geolocations or (b) photo locations: ")
    #decide_task(user_input_1)
    """
    # Rename photos in a specific location
    with open ("Personal/Camera/locations.json", "r") as f:
        locations = json.load(f)
    for location in locations:
        rename_photos(location["location"])
        """
    rename_photos("Boston, USA")
