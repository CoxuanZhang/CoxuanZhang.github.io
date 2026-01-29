import os
import json
import re

def load_geolocations():
    photo_folder = "Personal/Camera/Photos"
    photo_folder_short = "Photos"
    os.chdir(photo_folder)
    locations = [d for d in os.listdir('.') if os.path.isdir(d)]

    os.chdir(os.pardir)

    data = []
    for location in locations:
        coordinate = input(f"What is the coordinate of {location}?")
        coordinate = [float(re.sub(r'[^0-9.]', '', s)) for s in coordinate.split(',')]
        ID = input(f"What is the ID of {location}? ")
        data.append({
            "location": os.path.join(photo_folder, location),
            "coordinate": coordinate,
            "photo_counts": len(os.listdir(os.path.join(photo_folder_short, location))),
            "ID": ID
        })

    with open("locations.json", "w") as f:
        json.dump(data, f, indent=2)
    
def photo_locations():
    pass

function_map = {
    "a": load_geolocations,
    "b": photo_locations
}

def decide_task(user_input):
    func = function_map.get(user_input.lower()) 
    while not func:
        print(f"Error: No function found for input '{user_input}'. Please enter 'a' or 'b'.")
        user_input = input("Enter your choice: ")
        func = function_map.get(user_input.lower())
    func()

if __name__ == "__main__":
    user_input_1 = input("Enter (a) load geolocations or (b) photo locations: ")
    decide_task(user_input_1)