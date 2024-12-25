document.addEventListener('DOMContentLoaded', () => {
    // Initialize WYSIWYG editors for all textareas
    document.querySelectorAll('textarea').forEach(textarea => {
        jocarsaSnow.createEditor(textarea);
    });
});

const jocarsaSnow = {
    createEditor: function (textarea) {
        const baseUrl = 'https://jocarsa.github.io/jocarsa-snow/svg/';
        // Hide the textarea
        textarea.style.display = 'none';

        // Create editor container
        const editorContainer = document.createElement('div');
        editorContainer.className = 'jocarsa-snow-editor-container';

        // Create toolbar
        const toolbar = document.createElement('div');
        toolbar.className = 'jocarsa-snow-toolbar';
        toolbar.innerHTML = `
            <button type="button" data-command="bold"><img src="${baseUrl}/bold.svg" alt="Negrita"></button>
            <button type="button" data-command="italic"><img src="${baseUrl}/italic.svg" alt="Itálica"></button>
            <button type="button" data-command="underline"><img src="${baseUrl}/underline.svg" alt="Subrayado"></button>
            <button type="button" data-command="strikeThrough"><img src="${baseUrl}/strike.svg" alt="Tachado"></button>
            <button type="button" data-command="justifyLeft"><img src="${baseUrl}/left.svg" alt="Justificar a la izquierda"></button>
            <button type="button" data-command="justifyCenter"><img src="${baseUrl}/center.svg" alt="Justificar al centro"></button>
            <button type="button" data-command="justifyRight"><img src="${baseUrl}/right.svg" alt="Justificar a la derecha"></button>
            <button type="button" data-command="justifyFull"><img src="${baseUrl}/justify.svg" alt="Justificación completa"></button>
            <button type="button" data-command="insertOrderedList"><img src="${baseUrl}/ul.svg" alt="Lista ordenada"></button>
            <button type="button" data-command="insertUnorderedList"><img src="${baseUrl}/ol.svg" alt="Lista no ordenada"></button>
            <button type="button" id="insertImageButton"><img src="${baseUrl}/image.svg" alt="Imagen"></button>
            <input type="file" id="imageUploader" accept="image/*" style="display: none;">
            <button type="button" data-command="removeFormat">Clear</button>
            <label>
                <select id="fontFamilySelector">
                    <option value="serif">Serif</option>
                    <option value="sans-serif">Sans Serif</option>
                    <option value="monospace">Monospace</option>
                    <option value="cursive">Cursive</option>
                    <option value="fantasy">Fantasy</option>
                </select>
            </label>
            <label>
                <select id="fontSizeSelector">
                    <option value="1">Small</option>
                    <option value="3">Normal</option>
                    <option value="5">Large</option>
                    <option value="7">Extra Large</option>
                </select>
            </label>
            <label>
                <select id="blockStyleSelector">
                    <option value="p">Paragraph</option>
                    <option value="h1">Heading 1</option>
                    <option value="h2">Heading 2</option>
                    <option value="h3">Heading 3</option>
                    <option value="h4">Heading 4</option>
                    <option value="h5">Heading 5</option>
                    <option value="h6">Heading 6</option>
                    <option value="pre">Preformatted</option>
                </select>
            </label>
            <label><input type="color" id="textColorPicker"></label>
            <label><input type="color" id="bgColorPicker"></label>
        `;

        // Create contenteditable div
        const editor = document.createElement('div');
        editor.className = 'jocarsa-snow-editor';
        editor.contentEditable = true;
        editor.innerHTML = textarea.value;

        // Append toolbar and editor to container
        editorContainer.appendChild(toolbar);
        editorContainer.appendChild(editor);

        // Insert container before textarea
        textarea.parentNode.insertBefore(editorContainer, textarea);

        // Toolbar button event listeners
        toolbar.querySelectorAll('button[data-command]').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const command = button.getAttribute('data-command');
                document.execCommand(command, false, null);
                textarea.value = editor.innerHTML;
            });
        });

        // Font family selector
        toolbar.querySelector('#fontFamilySelector').addEventListener('change', (e) => {
            document.execCommand('fontName', false, e.target.value);
            textarea.value = editor.innerHTML;
        });

        // Font size selector
        toolbar.querySelector('#fontSizeSelector').addEventListener('change', (e) => {
            document.execCommand('fontSize', false, e.target.value);
            textarea.value = editor.innerHTML;
        });

        // Text color picker
        toolbar.querySelector('#textColorPicker').addEventListener('input', (e) => {
            document.execCommand('foreColor', false, e.target.value);
            textarea.value = editor.innerHTML;
        });

        // Background color picker
        toolbar.querySelector('#bgColorPicker').addEventListener('input', (e) => {
            document.execCommand('backColor', false, e.target.value);
            textarea.value = editor.innerHTML;
        });

        // Block style selector
        toolbar.querySelector('#blockStyleSelector').addEventListener('change', (e) => {
            document.execCommand('formatBlock', false, e.target.value);
            textarea.value = editor.innerHTML;
        });

        // Image uploader logic
        const insertImageButton = toolbar.querySelector('#insertImageButton');
        const imageUploader = toolbar.querySelector('#imageUploader');

        insertImageButton.addEventListener('click', () => {
            imageUploader.click();
        });

        // --- MODIFIED IMAGE INSERT LOGIC FOR RESIZABLE PLACEHOLDER ---
        imageUploader.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const base64String = event.target.result;
                    
                    // 1) Create a temporary Image to measure its natural size
                    const tempImg = new Image();
                    tempImg.src = base64String;
                    tempImg.onload = function() {
                        const naturalWidth = tempImg.width;
                        const naturalHeight = tempImg.height;
                        
                        // Choose some default display width; maintain aspect ratio
                        // You can tweak this as you like
                        const defaultDisplayWidth = Math.min(naturalWidth, 300);
                        const ratio = naturalHeight / naturalWidth;
                        const defaultDisplayHeight = defaultDisplayWidth * ratio;
                        
                        // 2) Insert a container (instead of a bare <img>) with a resize handle
                        const resizableHTML = `
                          <div class="resizable-image-container" contenteditable="false">
                            <img 
                              src="${base64String}" 
                              alt="Inserted Image"
                              style="width: ${defaultDisplayWidth}px; height: ${defaultDisplayHeight}px;"
                            />
                            <div class="resizable-image-handle"></div>
                          </div>
                        `;
                        document.execCommand('insertHTML', false, resizableHTML);

                        // 3) Attach event listeners for resizing
                        // Get the container we just inserted:
                        //   - Use :last-of-type to get the most recently inserted .resizable-image-container
                        const allContainers = editor.querySelectorAll('.resizable-image-container');
                        const thisContainer = allContainers[allContainers.length - 1];
                        const thisImage = thisContainer.querySelector('img');
                        const thisHandle = thisContainer.querySelector('.resizable-image-handle');
                        
                        let isResizing = false;
                        let startX, startY;
                        let startWidth, startHeight;

                        // track the natural aspect ratio of the actual image
                        const aspectRatio = naturalHeight / naturalWidth;

                        // Mousedown on the handle => prepare to resize
                        thisHandle.addEventListener('mousedown', (evt) => {
                            evt.preventDefault();
                            isResizing = true;
                            startX = evt.clientX;
                            startY = evt.clientY;
                            // current sizes in px
                            startWidth = parseInt(window.getComputedStyle(thisImage).width, 10);
                            startHeight = parseInt(window.getComputedStyle(thisImage).height, 10);
                            
                            // Listen on the document so we can track mouse move outside the container
                            document.addEventListener('mousemove', doDrag);
                            document.addEventListener('mouseup', stopDrag);
                        });

                        function doDrag(evt) {
                            if (!isResizing) return;
                            
                            // Calculate how far we've dragged
                            const dx = evt.clientX - startX;
                            // Scale width by dx
                            const newWidth = startWidth + dx;
                            // Enforce aspect ratio for new height
                            const newHeight = newWidth * aspectRatio;
                            
                            if (newWidth > 20 && newHeight > 20) {
                                thisImage.style.width = newWidth + 'px';
                                thisImage.style.height = newHeight + 'px';
                            }
                        }

                        function stopDrag(evt) {
                            isResizing = false;
                            document.removeEventListener('mousemove', doDrag);
                            document.removeEventListener('mouseup', stopDrag);
                            // Finally update the underlying textarea
                            textarea.value = editor.innerHTML;
                        }
                        
                        // Also update the textarea after inserting
                        textarea.value = editor.innerHTML;
                    };
                };
                reader.readAsDataURL(file);
            }
        });

        // Sync editor content to textarea on input
        editor.addEventListener('input', () => {
            textarea.value = editor.innerHTML;
        });
    }
};
