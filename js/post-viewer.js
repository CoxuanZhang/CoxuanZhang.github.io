// js/post-viewer.js
async function loadPost() {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');
    
    if (!postId) {
        document.getElementById('post-content').innerHTML = 
            '<p>No post specified.</p>';
        return;
    }
    
    try {
        // Load the index to get post metadata
        const indexResponse = await fetch('personal/writing/writing.json');
        const writings = await indexResponse.json();
        const writing = writings.find(w => w.id === postId);
        
        if (!writing) {
            throw new Error('Post not found');
        }
        
        // Load the markdown file
        const mdResponse = await fetch(writing.filepath);
        const markdown = await mdResponse.text();
        
        // Remove frontmatter
        const content = markdown
        
        // Render markdown to HTML
        const html = marked.parse(content);
        
        // Display the post
        document.getElementById('post-content').innerHTML = `
            <div class="content">
                ${html}
            </div>
        `;
        
        document.title = writing.title;
        
    } catch (error) {
        console.error('Error loading post:', error);
        document.getElementById('post-content').innerHTML = 
            '<p>Error loading post. Please try again later.</p>';
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}

loadPost();