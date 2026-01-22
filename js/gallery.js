let allWritings = [];
let selectedTags = new Set();

async function loadWritings() {
    try {
        const response = await fetch('personal/writing/writing.json');
        allWritings = await response.json();
        renderTagFilter();
        renderGallery();
    } catch (error) {
        console.error('Error loading writings:', error);
        document.getElementById('gallery').innerHTML = 
            '<p>Error loading writings. Please try again later.</p>';
    }
}

function renderTagFilter() {
    const allTags = new Set();
    allWritings.forEach(writing => {
        writing.tags.forEach(tag => allTags.add(tag));
    });
    
    const filterDiv = document.getElementById('tag-filter');
    filterDiv.innerHTML = '<span>Filter by tag: </span>';
    
    allTags.forEach(tag => {
        const button = document.createElement('button');
        button.className = 'tag-button';
        button.textContent = tag;
        button.onclick = () => toggleTag(tag);
        filterDiv.appendChild(button);
    });
}

function toggleTag(tag) {
    if (selectedTags.has(tag)) {
        selectedTags.delete(tag);
    } else {
        selectedTags.add(tag);
    }
    renderGallery();
    updateTagButtons();
}

function updateTagButtons() {
    document.querySelectorAll('.tag-button').forEach(button => {
        if (selectedTags.has(button.textContent)) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
}

function renderGallery() {
    const gallery = document.getElementById('gallery');
    
    const filteredWritings = selectedTags.size === 0 
        ? allWritings 
        : allWritings.filter(writing => 
            writing.tags.some(tag => selectedTags.has(tag))
        );
    
    if (filteredWritings.length === 0) {
        gallery.innerHTML = '<p class="no-results">No writings found with selected tags.</p>';
        return;
    }
    
    gallery.innerHTML = filteredWritings.map(writing => `
        <div class="card" onclick="viewPost('${writing.id}')">
            <h2>${writing.title}</h2>
            <p class="date">${formatDate(writing.date)}</p>
            <p class="excerpt">${writing.excerpt}</p>
            <div class="tags">
                ${writing.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
        </div>
    `).join('');
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}

function viewPost(id) {
    window.location.href = `post.html?id=${id}`;
}

// Load writings on page load
loadWritings();