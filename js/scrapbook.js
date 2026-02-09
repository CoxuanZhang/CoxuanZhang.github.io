const imageCount = 43; // 000.jpg to 042.jpg
            const images = [];
            for (let i = 0; i <= imageCount; i++) {
                images.push(`Personal/Scrapbook/img/${String(i).padStart(3, '0')}.jpg`);
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
                });
                document.addEventListener('mousemove', function(e) {
                    if (!isDragging) return;
                    el.style.left = (e.clientX - offsetX) + 'px';
                    el.style.top = (e.clientY - offsetY) + 'px';
                });
                document.addEventListener('mouseup', function() {
                    isDragging = false;
                    document.body.style.userSelect = '';
                });
            }

            window.addEventListener('DOMContentLoaded', function() {
                const header = document.querySelector('header');
                const headerHeight = header ? header.offsetHeight : 0;
                const minTop = headerHeight + 16; // 16px margin below header
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
                    document.body.appendChild(img);
                });
            });