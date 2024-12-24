/**
 * jocarsa | snow - Extended WYSIWYG Editor Library
 * Applies a feature-rich WYSIWYG editor to all textareas on the page.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize WYSIWYG editors for all textareas
    document.querySelectorAll('textarea').forEach(textarea => {
        jocarsaSnow.createEditor(textarea);
    });
});

const jocarsaSnow = {
    createEditor: function (textarea) {
        // Hide the textarea
        textarea.style.display = 'none';

        // Create editor container
        const editorContainer = document.createElement('div');
        editorContainer.className = 'jocarsa-snow-editor-container';

        // Create toolbar
        const toolbar = document.createElement('div');
        toolbar.className = 'jocarsa-snow-toolbar';
        toolbar.innerHTML = `
            <button type="button" data-command="bold"><b>B</b></button>
            <button type="button" data-command="italic"><i>I</i></button>
            <button type="button" data-command="underline"><u>U</u></button>
            <button type="button" data-command="strikeThrough">S</button>
            <button type="button" data-command="justifyLeft">Left</button>
            <button type="button" data-command="justifyCenter">Center</button>
            <button type="button" data-command="justifyRight">Right</button>
            <button type="button" data-command="justifyFull">Justify</button>
            <button type="button" data-command="insertOrderedList">OL</button>
            <button type="button" data-command="insertUnorderedList">UL</button>
            <button type="button" data-command="createLink" data-prompt="Enter URL:">Link</button>
            <button type="button" data-command="unlink">Unlink</button>
            <button type="button" data-command="insertImage" data-prompt="Enter image URL:">Image</button>
            <button type="button" data-command="insertHTML" data-html="<table border='1'><tr><td>Cell 1</td><td>Cell 2</td></tr></table>">Table</button>
            <label> 
                <select id="fontFamilySelector">
                    <option value="Arial">Arial</option>
                    <option value="Courier New">Courier New</option>
                    <option value="Georgia">Georgia</option>
                    <option value="Times New Roman">Times New Roman</option>
                    <option value="Verdana">Verdana</option>
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
            <label><input type="color" id="textColorPicker"></label>
            <label><input type="color" id="bgColorPicker"></label>
            <button type="button" data-command="removeFormat">Clear</button>
        `;

        // Create contenteditable div
        const editor = document.createElement('div');
        editor.className = 'jocarsa-snow-editor';
        editor.contentEditable = true;
        editor.innerHTML = textarea.value;

        // Append toolbar and editor to container
        editorContainer.appendChild(toolbar);
        editorContainer.appendChild(editor);

        // Insert container after textarea
        textarea.parentNode.insertBefore(editorContainer, textarea);

        // Toolbar button event listeners
        toolbar.querySelectorAll('button').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const command = button.getAttribute('data-command');
                const value = button.getAttribute('data-value');
                const promptText = button.getAttribute('data-prompt');
                const htmlContent = button.getAttribute('data-html');

                if (command === 'createLink' || command === 'insertImage') {
                    const url = prompt(promptText);
                    if (url) document.execCommand(command, false, url);
                } else if (command === 'insertHTML') {
                    document.execCommand('insertHTML', false, htmlContent);
                } else if (value) {
                    document.execCommand(command, false, value);
                } else {
                    document.execCommand(command, false, null);
                }

                // Update hidden textarea
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

        // Sync editor content to textarea on input
        editor.addEventListener('input', () => {
            textarea.value = editor.innerHTML;
        });
    }
};

