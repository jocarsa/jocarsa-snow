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
        editorContainer.style.position = 'relative'; // To position the CSS pane absolutely within this container

        // Create toolbar
        const toolbar = document.createElement('div');
        toolbar.className = 'jocarsa-snow-toolbar';
        toolbar.innerHTML = `
            <!-- Existing toolbar buttons -->
            <button type="button" data-command="bold" title="Bold"><img src="${baseUrl}/bold.svg" alt="Bold"></button>
            <button type="button" data-command="italic" title="Italic"><img src="${baseUrl}/italic.svg" alt="Italic"></button>
            <button type="button" data-command="underline" title="Underline"><img src="${baseUrl}/underline.svg" alt="Underline"></button>
            <button type="button" data-command="strikeThrough" title="Strikethrough"><img src="${baseUrl}/strike.svg" alt="Strikethrough"></button>
            <button type="button" data-command="justifyLeft" title="Align Left"><img src="${baseUrl}/left.svg" alt="Align Left"></button>
            <button type="button" data-command="justifyCenter" title="Align Center"><img src="${baseUrl}/center.svg" alt="Align Center"></button>
            <button type="button" data-command="justifyRight" title="Align Right"><img src="${baseUrl}/right.svg" alt="Align Right"></button>
            <button type="button" data-command="justifyFull" title="Justify"><img src="${baseUrl}/justify.svg" alt="Justify"></button>
            <button type="button" data-command="insertOrderedList" title="Ordered List"><img src="${baseUrl}/ol.svg" alt="Ordered List"></button>
            <button type="button" data-command="insertUnorderedList" title="Unordered List"><img src="${baseUrl}/ul.svg" alt="Unordered List"></button>
            <button type="button" id="insertImageButton" title="Insert Image"><img src="${baseUrl}/image.svg" alt="Insert Image"></button>
            <input type="file" id="imageUploader" accept="image/*" style="display: none;">
            <button type="button" data-command="removeFormat" title="Clear Formatting">Clear</button>

            <!-- Font Family Selector -->
            <label>
                <select id="fontFamilySelector" title="Font Family">
                    <option value="">Font Family</option>
                    <option value="serif">Serif</option>
                    <option value="sans-serif">Sans Serif</option>
                    <option value="monospace">Monospace</option>
                    <option value="cursive">Cursive</option>
                    <option value="fantasy">Fantasy</option>
                </select>
            </label>

            <!-- Font Size Selector -->
            <label>
                <select id="fontSizeSelector" title="Font Size">
                    <option value="">Font Size</option>
                    <option value="1">Small</option>
                    <option value="3">Normal</option>
                    <option value="5">Large</option>
                    <option value="7">Extra Large</option>
                </select>
            </label>

            <!-- Block Style Selector -->
            <label>
                <select id="blockStyleSelector" title="Block Style">
                    <option value="">Block Style</option>
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

            <!-- Text Color Picker -->
            <label>
                <input type="color" id="textColorPicker" title="Text Color">
            </label>

            <!-- Background Color Picker -->
            <label>
                <input type="color" id="bgColorPicker" title="Background Color">
            </label>

            <!-- Toggle Code View Button -->
            <button type="button" id="toggleCodeView" title="Toggle HTML Code View">HTML</button>

            <!-- CSS Stylizer Button -->
            <button type="button" id="toggleCssPane" title="CSS Stylizer">CSS</button>

            <!-- Structural Tags Dropdown -->
            <label>
                <select id="structuralTagSelector" title="Structural Tags">
                    <option value="">Structure</option>
                    <option value="div">Div</option>
                    <option value="article">Article</option>
                    <option value="header">Header</option>
                    <option value="main">Main</option>
                    <option value="section">Section</option>
                    <option value="aside">Aside</option>
                    <option value="footer">Footer</option>
                    <!-- Add more structural tags as needed -->
                </select>
            </label>
        `;

        // Create the WYSIWYG editor DIV
        const editorDiv = document.createElement('div');
        editorDiv.className = 'jocarsa-snow-editor';
        editorDiv.contentEditable = true;
        editorDiv.innerHTML = textarea.value;
        editorDiv.style.minHeight = '200px'; // Set a minimum height for the editor
        editorDiv.style.border = '1px solid #ccc';
        editorDiv.style.padding = '10px';
        editorDiv.style.boxSizing = 'border-box';

        // Create a hidden <textarea> for HTML code editing
        const codeTextarea = document.createElement('textarea');
        codeTextarea.style.display = 'none';
        codeTextarea.className = 'jocarsa-snow-code-editor';
        codeTextarea.style.width = '100%';
        codeTextarea.style.height = '200px';
        codeTextarea.style.boxSizing = 'border-box';

        // Create the CSS pane
        const cssPane = document.createElement('div');
        cssPane.className = 'jocarsa-snow-css-pane';
        cssPane.style.display = 'none'; // Hidden by default
        cssPane.innerHTML = `
            <h3>CSS Stylizer</h3>
            <div class="css-property">
                <label for="css-padding">Padding:</label>
                <input type="text" id="css-padding" placeholder="e.g., 10px">
            </div>
            <div class="css-property">
                <label for="css-margin">Margin:</label>
                <input type="text" id="css-margin" placeholder="e.g., 10px">
            </div>
            <div class="css-property">
                <label for="css-color">Color:</label>
                <input type="color" id="css-color">
            </div>
            <div class="css-property">
                <label for="css-background">Background:</label>
                <input type="color" id="css-background">
            </div>
            <!-- Add more CSS properties as needed -->
            <button type="button" id="closeCssPane">Close</button>
        `;
        cssPane.style.position = 'absolute';
        cssPane.style.zIndex = '1000'; // Ensure it appears above other elements

        // Append toolbar, WYSIWYG div, code textarea, and CSS pane to container
        editorContainer.appendChild(toolbar);
        editorContainer.appendChild(editorDiv);
        editorContainer.appendChild(codeTextarea);
        editorContainer.appendChild(cssPane);

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
                updateTextarea();
            });
        });

        // Font family
        toolbar.querySelector('#fontFamilySelector').addEventListener('change', (e) => {
            const font = e.target.value;
            if (font) {
                document.execCommand('fontName', false, font);
                updateTextarea();
            }
        });

        // Font size
        toolbar.querySelector('#fontSizeSelector').addEventListener('change', (e) => {
            const size = e.target.value;
            if (size) {
                document.execCommand('fontSize', false, size);
                updateTextarea();
            }
        });

        // Text color
        toolbar.querySelector('#textColorPicker').addEventListener('input', (e) => {
            document.execCommand('foreColor', false, e.target.value);
            updateTextarea();
        });

        // Background color
        toolbar.querySelector('#bgColorPicker').addEventListener('input', (e) => {
            document.execCommand('backColor', false, e.target.value);
            updateTextarea();
        });

        // Block style
        toolbar.querySelector('#blockStyleSelector').addEventListener('change', (e) => {
            const block = e.target.value;
            if (block) {
                document.execCommand('formatBlock', false, block);
                updateTextarea();
            }
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
                          <div class="resizable-image-container" contenteditable="false" style="position: relative; display: inline-block;">
                            <img
                              src="${base64String}"
                              alt="Inserted Image"
                              style="width: ${defaultDisplayWidth}px; height: ${defaultDisplayHeight}px;"
                            />
                            <div class="resizable-image-handle" style="
                                width: 10px;
                                height: 10px;
                                background: #fff;
                                border: 1px solid #000;
                                position: absolute;
                                bottom: 0;
                                right: 0;
                                cursor: se-resize;
                            "></div>
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
                            updateTextarea();
                        }

                        updateTextarea();
                    };
                };
                reader.readAsDataURL(file);
            }
        });

        // -----------------------
        // Sync editor to original textarea
        // -----------------------
        editorDiv.addEventListener('input', () => {
            updateTextarea();
        });

        // -----------------------
        // Toggle between code view and WYSIWYG
        // -----------------------
        let isCodeView = false;
        const toggleCodeViewBtn = toolbar.querySelector('#toggleCodeView');

        toggleCodeViewBtn.addEventListener('click', () => {
            if (!isCodeView) {
                // Switching to HTML code view
                codeTextarea.value = editorDiv.innerHTML;
                editorDiv.style.display = 'none';
                codeTextarea.style.display = 'block';
                codeTextarea.focus();
                toggleCodeViewBtn.textContent = 'WYSIWYG';
            } else {
                // Switching back to WYSIWYG
                editorDiv.innerHTML = codeTextarea.value;
                codeTextarea.style.display = 'none';
                editorDiv.style.display = 'block';
                editorDiv.focus();
                toggleCodeViewBtn.textContent = 'HTML';
                updateTextarea();
            }
            isCodeView = !isCodeView;
        });

        // ---------------------------------------------------
        // CSS Stylizer Implementation
        // ---------------------------------------------------
        // Variables to keep track of the selected element
        let selectedElement = null;

        // Function to show the CSS pane
        function showCssPane(element) {
            selectedElement = element;
            // Position the CSS pane near the selected element
            const rect = element.getBoundingClientRect();
            const containerRect = editorContainer.getBoundingClientRect();

            // Calculate position relative to the editor container
            const topPosition = element.offsetTop + element.offsetHeight + 10;
            const leftPosition = element.offsetLeft;

            cssPane.style.top = `${topPosition}px`;
            cssPane.style.left = `${leftPosition}px`;
            cssPane.style.display = 'block';

            // Populate the CSS pane with current styles
            const computedStyle = window.getComputedStyle(element);
            document.getElementById('css-padding').value = computedStyle.padding;
            document.getElementById('css-margin').value = computedStyle.margin;
            document.getElementById('css-color').value = rgbToHex(computedStyle.color);
            document.getElementById('css-background').value = rgbToHex(computedStyle.backgroundColor);
        }

        // Function to hide the CSS pane
        function hideCssPane() {
            cssPane.style.display = 'none';
            selectedElement = null;
        }

        // Utility function to convert RGB/RGBA to HEX
        function rgbToHex(rgb) {
            const result = rgb.match(/\d+/g);
            if (!result) return '#000000';
            return `#${result.slice(0, 3).map(x => {
                const hex = parseInt(x).toString(16);
                return hex.length === 1 ? '0' + hex : hex;
            }).join('')}`;
        }

        // Event listener for element selection within the editor
        editorDiv.addEventListener('click', (e) => {
            // Prevent triggering when clicking on the resizable image handle
            if (e.target.classList.contains('resizable-image-handle')) return;

            // Updated selector to include inline elements like <b>, <strong>, <i>, <em>, <u>, etc.
            const element = e.target.closest('[contenteditable="false"], [contenteditable="true"], p, h1, h2, h3, h4, h5, h6, pre, div, span, img, ul, ol, li, blockquote, a, b, strong, i, em, u, article, header, main, section, aside, footer'); // Added structural tags

            if (element && element !== editorDiv) {
                showCssPane(element);
            } else {
                hideCssPane();
            }
        });

        // Close CSS pane when clicking outside
        document.addEventListener('click', (e) => {
            if (
                !cssPane.contains(e.target) &&
                e.target !== toolbar.querySelector('#toggleCssPane') &&
                !editorContainer.contains(e.target)
            ) {
                hideCssPane();
            }
        });

        // Event listener for CSS pane inputs
        document.getElementById('css-padding').addEventListener('input', (e) => {
            if (selectedElement) {
                selectedElement.style.padding = e.target.value;
                updateTextarea();
            }
        });

        document.getElementById('css-margin').addEventListener('input', (e) => {
            if (selectedElement) {
                selectedElement.style.margin = e.target.value;
                updateTextarea();
            }
        });

        document.getElementById('css-color').addEventListener('input', (e) => {
            if (selectedElement) {
                selectedElement.style.color = e.target.value;
                updateTextarea();
            }
        });

        document.getElementById('css-background').addEventListener('input', (e) => {
            if (selectedElement) {
                selectedElement.style.backgroundColor = e.target.value;
                updateTextarea();
            }
        });

        // Event listener for Close button in CSS pane
        document.getElementById('closeCssPane').addEventListener('click', hideCssPane);

        // Function to update the hidden textarea
        function updateTextarea() {
            textarea.value = editorDiv.innerHTML;
        }

        // -----------------------
        // Structural Tags Dropdown Handler
        // -----------------------
        const structuralTagSelector = toolbar.querySelector('#structuralTagSelector');

        structuralTagSelector.addEventListener('change', (e) => {
            const selectedTag = e.target.value;
            if (selectedTag) {
                wrapSelectionWithTag(selectedTag);
                // Reset the dropdown to default
                structuralTagSelector.value = '';
            }
        });

        /**
         * Function to wrap the current selection with the specified HTML tag
         * @param {string} tag - The HTML tag to wrap the selection with (e.g., 'div', 'article')
         */
        function wrapSelectionWithTag(tag) {
            const selection = window.getSelection();
            if (!selection.rangeCount) return;

            const range = selection.getRangeAt(0);
            if (range.collapsed) {
                alert('Please select some text to apply the structural tag.');
                return;
            }

            // Create the new element
            const wrapper = document.createElement(tag);
            wrapper.appendChild(range.extractContents());
            range.insertNode(wrapper);

            // Update the textarea
            updateTextarea();

            // Optionally, select the newly wrapped element
            selection.removeAllRanges();
            const newRange = document.createRange();
            newRange.selectNodeContents(wrapper);
            selection.addRange(newRange);
        }

        // -----------------------
        // CSS Stylizer Toggle Button Handler
        // -----------------------
        const toggleCssPaneBtn = toolbar.querySelector('#toggleCssPane');
        toggleCssPaneBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (cssPane.style.display === 'none') {
                // Show CSS pane only if an element is selected
                if (selectedElement) {
                    // Reposition the CSS pane in case the selected element has moved
                    showCssPane(selectedElement);
                } else {
                    alert('Please select an element within the editor to style.');
                }
            } else {
                hideCssPane();
            }
        });
    }
};

