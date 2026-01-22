import os
import json
import re
from pathlib import Path

def make_data(content, filepath):
    """Extract YAML-style frontmatter from markdown"""

    filename = os.path.basename(filepath).replace('.md', '')
    title_pattern = r'^# \w*'
    title = re.search(title_pattern, content, re.MULTILINE)
    if title:
        title = title.group(0).lstrip('#').strip().split()[-1]
    else:
        title = "Unknown"
    
    date_pattern = r'Last Edited: [\w\d., ]+'
    date_match = re.search(date_pattern, content, re.MULTILINE)
    if date_match:
        date = date_match.group(0).lstrip('#').split(':',1)[1].strip()
    else:
        date = "Unknown"
    
    data = {'id': filename,
                'filepath': filepath,
                'title': title,
                'date': date,
                'tags': [],
                'excerpt': "Unknown",
    }
    for prop, cont in data.items():
        if cont == 'Unknown':
            data[prop] = input(f"Please enter {prop} for {filename}: ")
    
    data['tags'] = input(f"Please enter tags (comma-separated) for {filename}: ").split(',')
    print(data)
    data['date'] = make_date(data)
    return data

def make_date(item):
    # there's a mix of data formats Oct. 2nd, 2025 and Apr. 2025
    date_lst = re.split(r'[^\w\d]+',item['date'])
    print(date_lst)
    year = int(date_lst[-1])
    month_str = re.sub(r'[^a-zA-Z]', '', date_lst[0])
    month_dict = {'Jan':1, 'Feb':2, 'Mar':3, 'Apr':4, 'May':5, 'Jun':6,
                     'Jul':7, 'Aug':8, 'Sep':9, 'Oct':10, 'Nov':11, 'Dec':12}
    month = int(month_dict.get(month_str, 0))
    if len(date_lst) > 2:
        day_str = date_lst[1]
        day = int(re.sub(r'\D', '', day_str))  # remove suffix like 'st', 'nd', 'rd', 'th'
        return f"{year:04d}-{month:02d}-{day:02d}"
    return f"{year:04d}-{month:02d}"

def generate_index(dir):
    directory = dir
    collection = []
    saved = []
    filenames = []
    datafile = ""

    for filename in os.listdir(directory):
        if filename.endswith('.md'):
            filenames.append(filename)
        if filename.endswith('.json'):
            datafile = filename
            filepath = os.path.join(directory, filename)
            with open(filepath, 'r', encoding='utf-8') as f:
                index = json.load(f)
                for item in index:
                    saved.append(item['filepath'])
    for filename in filenames:
        print(f"found file {filename}")
        filepath = os.path.join(directory, filename)
        if filepath in saved:
            print(f"skipping {filename}, already saved..")
            continue
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        print(f"read content: {len(content)} characters..") 
        data = make_data(content, filepath)
        collection.append(data)
    
    # Sort by date (newest first)
    collection.sort(key=lambda x: x['date'], reverse=True)
    if not datafile:
        datafile = os.path.join(directory, f'{directory.split()[-1]}.json')
    print("Saving to", datafile)
    with open(datafile, 'w', encoding='utf-8') as f:
        json.dump(collection, f, indent=2, ensure_ascii=False)
    
    print(f"Generated index with {len(collection)} writings")

if __name__ == '__main__':
    dir = Path(input("Enter the directory path to scan for markdown files: "))
    generate_index(dir)