document.addEventListener('DOMContentLoaded', () => {
    // Initialize WYSIWYG editors for all textareas
    document.querySelectorAll('textarea').forEach(textarea => {
        jocarsaSnow.createEditor(textarea);
    });
});

const jocarsaSnow = {
    createEditor: function (textarea) {
        const baseUrl = 'https://jocarsa.github.io/jocarsa-snow/svg/';

        // Hide the original textarea
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

            <!-- Toggle button for switching to/from HTML view -->
            <button type="button" id="toggleCodeView">HTML</button>
        `;

        // Create the WYSIWYG editor DIV
        const editorDiv = document.createElement('div');
        editorDiv.className = 'jocarsa-snow-editor';
        editorDiv.contentEditable = true;
        editorDiv.innerHTML = textarea.value;

        // Create a hidden <textarea> for HTML code editing
        const codeTextarea = document.createElement('textarea');
        codeTextarea.style.display = 'none';
        codeTextarea.className = 'jocarsa-snow-code-editor';

        // Append toolbar, WYSIWYG div, and code textarea to container
        editorContainer.appendChild(toolbar);
        editorContainer.appendChild(editorDiv);
        editorContainer.appendChild(codeTextarea);

        // Insert container before original textarea
        textarea.parentNode.insertBefore(editorContainer, textarea);

        // -----------------------
        // Toolbar button handlers
        // -----------------------
        toolbar.querySelectorAll('button[data-command]').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const command = button.getAttribute('data-command');
                document.execCommand(command, false, null);
                textarea.value = editorDiv.innerHTML;
            });
        });

        // Font family
        toolbar.querySelector('#fontFamilySelector').addEventListener('change', (e) => {
            document.execCommand('fontName', false, e.target.value);
            textarea.value = editorDiv.innerHTML;
        });

        // Font size
        toolbar.querySelector('#fontSizeSelector').addEventListener('change', (e) => {
            document.execCommand('fontSize', false, e.target.value);
            textarea.value = editorDiv.innerHTML;
        });

        // Text color
        toolbar.querySelector('#textColorPicker').addEventListener('input', (e) => {
            document.execCommand('foreColor', false, e.target.value);
            textarea.value = editorDiv.innerHTML;
        });

        // Background color
        toolbar.querySelector('#bgColorPicker').addEventListener('input', (e) => {
            document.execCommand('backColor', false, e.target.value);
            textarea.value = editorDiv.innerHTML;
        });

        // Block style
        toolbar.querySelector('#blockStyleSelector').addEventListener('change', (e) => {
            document.execCommand('formatBlock', false, e.target.value);
            textarea.value = editorDiv.innerHTML;
        });

        // -----------------------
        // Image uploader logic
        // -----------------------
        const insertImageButton = toolbar.querySelector('#insertImageButton');
        const imageUploader = toolbar.querySelector('#imageUploader');

        insertImageButton.addEventListener('click', () => {
            imageUploader.click();
        });

        imageUploader.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const base64String = event.target.result;

                    // Insert resizable placeholder
                    const tempImg = new Image();
                    tempImg.src = base64String;
                    tempImg.onload = function () {
                        const naturalWidth = tempImg.width;
                        const naturalHeight = tempImg.height;

                        const defaultDisplayWidth = Math.min(naturalWidth, 300);
                        const ratio = naturalHeight / naturalWidth;
                        const defaultDisplayHeight = defaultDisplayWidth * ratio;

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

                        // Attach resizing logic
                        const allContainers = editorDiv.querySelectorAll('.resizable-image-container');
                        const thisContainer = allContainers[allContainers.length - 1];
                        const thisImage = thisContainer.querySelector('img');
                        const thisHandle = thisContainer.querySelector('.resizable-image-handle');

                        let isResizing = false;
                        let startX, startY;
                        let startWidth, startHeight;
                        const aspectRatio = naturalHeight / naturalWidth;

                        thisHandle.addEventListener('mousedown', (evt) => {
                            evt.preventDefault();
                            isResizing = true;
                            startX = evt.clientX;
                            startY = evt.clientY;
                            startWidth = parseInt(window.getComputedStyle(thisImage).width, 10);
                            startHeight = parseInt(window.getComputedStyle(thisImage).height, 10);

                            document.addEventListener('mousemove', doDrag);
                            document.addEventListener('mouseup', stopDrag);
                        });

                        function doDrag(evt) {
                            if (!isResizing) return;
                            const dx = evt.clientX - startX;
                            const newWidth = startWidth + dx;
                            const newHeight = newWidth * aspectRatio;

                            if (newWidth > 20 && newHeight > 20) {
                                thisImage.style.width = newWidth + 'px';
                                thisImage.style.height = newHeight + 'px';
                            }
                        }

                        function stopDrag() {
                            isResizing = false;
                            document.removeEventListener('mousemove', doDrag);
                            document.removeEventListener('mouseup', stopDrag);
                            textarea.value = editorDiv.innerHTML;
                        }
                        
                        textarea.value = editorDiv.innerHTML;
                    };
                };
                reader.readAsDataURL(file);
            }
        });

        // Sync editor to original textarea
        editorDiv.addEventListener('input', () => {
            textarea.value = editorDiv.innerHTML;
        });

        // ---------------------------------------------------
        // Toggle between code view and WYSIWYG
        // ---------------------------------------------------
        let isCodeView = false;
        const toggleCodeViewBtn = toolbar.querySelector('#toggleCodeView');

        toggleCodeViewBtn.addEventListener('click', () => {
            if (!isCodeView) {
                // ------------------------------------------
                // Switching from WYSIWYG to HTML code view
                // ------------------------------------------
                // 1) Put current WYSIWYG HTML into code textarea
                codeTextarea.value = editorDiv.innerHTML;

                // 2) Hide the WYSIWYG editor
                editorDiv.style.display = 'none';

                // 3) Show the code editor
                codeTextarea.style.display = 'block';
                codeTextarea.focus();

                // 4) Update button text
                toggleCodeViewBtn.textContent = 'WYSIWYG';

            } else {
                // ------------------------------------------
                // Switching from HTML code view back to WYSIWYG
                // ------------------------------------------
                // 1) Apply changes to WYSIWYG
                editorDiv.innerHTML = codeTextarea.value;

                // 2) Hide the code textarea
                codeTextarea.style.display = 'none';

                // 3) Show the WYSIWYG editor
                editorDiv.style.display = 'block';
                editorDiv.focus();

                // 4) Update button text
                toggleCodeViewBtn.textContent = 'HTML';

                // 5) Sync to hidden <textarea>
                textarea.value = editorDiv.innerHTML;
            }

            isCodeView = !isCodeView;
        });
    }
};

