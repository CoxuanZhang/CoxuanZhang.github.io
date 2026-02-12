const imageCount = 42; // 000.jpg to 042.jpg
            const images = [];
            for (let i = 0; i <= imageCount; i++) {
                images.push(`Personal/Scrapbook/img/${String(i).padStart(3, '0')}.png`);
            }

            function randomInt(min, max) {
                return Math.floor(Math.random() * (max - min + 1)) + min;
            }

            let zIndexCounter = 1000;
            function makeDraggable(el) {
                let offsetX, offsetY, isDragging = false;
                el.addEventListener('mousedown', function(e) {
                    e.preventDefault();
                    isDragging = true;
                    zIndexCounter++;
                    el.style.zIndex = zIndexCounter;
                    offsetX = e.clientX - el.offsetLeft;
                    offsetY = e.clientY - el.offsetTop;
                    document.body.style.userSelect = 'none';
                    function mouseMoveHandler(ev) {
                        if (!isDragging) return;
                        el.style.left = (ev.clientX - offsetX) + 'px';
                        el.style.top = (ev.clientY - offsetY) + 'px';
                    }
                    function mouseUpHandler(ev) {
                        isDragging = false;
                        document.body.style.userSelect = '';
                        document.removeEventListener('mousemove', mouseMoveHandler);
                        document.removeEventListener('mouseup', mouseUpHandler);
                    }
                    document.addEventListener('mousemove', mouseMoveHandler);
                    document.addEventListener('mouseup', mouseUpHandler);
                });
                // For touch devices
                el.addEventListener('touchstart', function(e) {
                    isDragging = true;
                    zIndexCounter++;
                    el.style.zIndex = zIndexCounter;
                    const touch = e.touches[0];
                    offsetX = touch.clientX - el.offsetLeft;
                    offsetY = touch.clientY - el.offsetTop;
                    document.body.style.userSelect = 'none';
                });
                el.addEventListener('touchmove', function(e) {
                    if (!isDragging) return;
                    const touch = e.touches[0];
                    el.style.left = (touch.clientX - offsetX) + 'px';
                    el.style.top = (touch.clientY - offsetY) + 'px';
                });
                el.addEventListener('touchend', function(e) {
                    isDragging = false;
                    document.body.style.userSelect = '';
                });
            }

                        window.addEventListener('DOMContentLoaded', function() {
                                // Load descriptions from sb.js
                                let descriptions = [];
                                fetch('Personal/Scrapbook/sb.json')
<<<<<<< HEAD
                                    .then(resp => resp.text())
                                    .then(text => {
                                        try {
                                            descriptions = JSON.parse(text);
                                        } catch (e) {
                                            console.error('Failed to parse sb.js:', e);
                                        }
=======
                                    .then(resp => resp.json())
                                    .then(data => {
                                        descriptions = data;
>>>>>>> 708992c (fix scrapbook page)
                                        const header = document.querySelector('header');
                                        const headerHeight = header ? header.offsetHeight : 0;
                                        const minTop = headerHeight + 30;
                                        const maxTop = window.innerHeight - 220;
                                        images.forEach(src => {
                                                const img = document.createElement('img');
                                                img.src = src;
                                                img.className = 'scrapbook-photo';
                                                img.style.position = 'absolute';
                                                img.style.width = randomInt(120, 220) + 'px';
                                                img.style.left = randomInt(0, window.innerWidth - 220) + 'px';
                                                img.style.top = randomInt(minTop, maxTop) + 'px';
                                                img.style.cursor = 'grab';
                                                makeDraggable(img);
                                                // Double-click to show modal
                                                img.addEventListener('dblclick', function() {
                                                        // Remove any existing modal
                                                        const existingModal = document.getElementById('scrapbook-desc-modal');
                                                        if (existingModal) existingModal.remove();
                                                        // Extract ID from filename (.png only)
                                                        const match = img.src.match(/(\d{3})\.png$/);
                                                        const id = match ? match[1] : null;
                                                        const descObj = id ? descriptions.find(d => d.ID === id) : null;
                                                        const desc = descObj ? descObj.description : 'No description available.';
                                                        // Create modal beside cursor
                                                        const modal = document.createElement('div');
                                                        modal.id = 'scrapbook-desc-modal';
                                                        modal.style.position = 'absolute';
                                                        modal.style.background = '#fff';
                                                        modal.style.padding = '24px 18px';
                                                        modal.style.borderRadius = '12px';
                                                        modal.style.boxShadow = '0 4px 24px rgba(0,0,0,0.15)';
                                                        modal.style.maxWidth = '320px';
                                                        modal.style.fontSize = '2.2vh';
                                                        modal.style.textAlign = 'left';
                                                        modal.style.zIndex = 99999;
                                                        modal.innerHTML = `${desc}<br><button style='margin-top:14px;padding:6px 16px;border-radius:8px;border:none;background:#e0c97f;color:#02263D;font-size:1em;cursor:pointer;'>Close</button>`;
                                                        modal.querySelector('button').onclick = () => document.body.removeChild(modal);
                                                        document.body.appendChild(modal);
                                                        // Position beside image, left or right depending on space
                                                        const padding = 16;
                                                        const modalRect = modal.getBoundingClientRect();
                                                        const imgRect = img.getBoundingClientRect();
                                                        const spaceLeft = imgRect.left;
                                                        const spaceRight = window.innerWidth - imgRect.right;
                                                        let left, top;
                                                        top = imgRect.top + (imgRect.height - modalRect.height) / 2;
                                                        // Prevent overflow top
                                                        if (top < padding) top = padding;
                                                        // Prevent overflow bottom
                                                        if (top + modalRect.height + padding > window.innerHeight) {
                                                            top = window.innerHeight - modalRect.height - padding;
                                                        }
                                                        if (spaceRight > spaceLeft) {
                                                            // Place modal to the right
                                                            left = imgRect.right + 18;
                                                            if (left + modalRect.width + padding > window.innerWidth) {
                                                                left = window.innerWidth - modalRect.width - padding;
                                                            }
                                                        } else {
                                                            // Place modal to the left
                                                            left = imgRect.left - modalRect.width - 18;
                                                            if (left < padding) left = padding;
                                                        }
                                                        modal.style.left = left + 'px';
                                                        modal.style.top = top + 'px';
                                                        // Remove modal on close
                                                        modal.querySelector('button').onclick = () => {
                                                            document.body.removeChild(modal);
                                                        };
                                                });
                                                document.body.appendChild(img);
                                        });
                                    });
                        });
