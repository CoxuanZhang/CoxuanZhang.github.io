const imageCount = 43; // 000.jpg to 042.jpg
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
                    isDragging = true;
                    zIndexCounter++;
                    el.style.zIndex = zIndexCounter;
                    offsetX = e.clientX - el.offsetLeft;
                    offsetY = e.clientY - el.offsetTop;
                    document.body.style.userSelect = 'none';
                    el.style.pointerEvents = 'none';
                    document.addEventListener('mousemove', moveHandler);
                    document.addEventListener('mouseup', upHandler);
                });
                function moveHandler(e) {
                    if (!isDragging) return;
                    el.style.left = (e.clientX - offsetX) + 'px';
                    el.style.top = (e.clientY - offsetY) + 'px';
                }
                function upHandler() {
                    isDragging = false;
                    document.body.style.userSelect = '';
                    el.style.pointerEvents = '';
                    document.removeEventListener('mousemove', moveHandler);
                    document.removeEventListener('mouseup', upHandler);
                }
            }

                        window.addEventListener('DOMContentLoaded', function() {
                                // Load descriptions from sb.js
                                let descriptions = [];
                                fetch('Personal/Scrapbook/sb.js')
                                    .then(resp => resp.text())
                                    .then(text => {
                                        try {
                                            descriptions = JSON.parse(text);
                                        } catch (e) {
                                            console.error('Failed to parse sb.js:', e);
                                        }
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
                                                        // Extract ID from filename (.png only)
                                                        const match = img.src.match(/(\d{3})\.png$/);
                                                        const id = match ? match[1] : null;
                                                        const descObj = id ? descriptions.find(d => d.ID === id) : null;
                                                        const desc = descObj ? descObj.description : 'No description available.';
                                                        // Create modal beside image, above it
                                                        const modal = document.createElement('div');
                                                        modal.style.position = 'absolute';
                                                        // Position modal above and to the right of the image
                                                        const rect = img.getBoundingClientRect();
                                                        modal.style.left = (rect.right + 12) + 'px';
                                                        modal.style.top = (rect.top - 8) + 'px';
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
                                                });
                                                document.body.appendChild(img);
                                        });
                                    });
                        });