/**
 * jocarsa | snow - Enhanced WYSIWYG Editor Library
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
            <button type="button" data-command="italic"><img src="${baseUrl}/italic.svg" alt="Italica"></button>
            <button type="button" data-command="underline"><img src="${baseUrl}/underline.svg" alt="Subrayado"></button>
            <button type="button" data-command="strikeThrough"><img src="s${baseUrl}/strike.svg" alt="Tachado"></button>
            <button type="button" data-command="justifyLeft"><img src="${baseUrl}/left.svg" alt="Justificar a la izquierda"></button>
            <button type="button" data-command="justifyCenter"><img src="${baseUrl}/center.svg" alt="Jupstificar al centro"></button>
            <button type="button" data-command="justifyRight"><img src="${baseUrl}/right.svg" alt="Justificar a la derecha"></button>
            <button type="button" data-command="justifyFull"><img src="${baseUrl}/justify.svg" alt="Justificación completa"></button>
            <button type="button" data-command="insertOrderedList"><img src="${baseUrl}/ul.svg" alt="Lista no ordenada"></button>
            <button type="button" data-command="insertUnorderedList"><img src="${baseUrl}/ol.svg" alt="Lista ordenada"></button>
            <button type="button" data-command="createLink" data-prompt="Enter URL:"><img src="${baseUrl}/link.svg" alt="Vinculo"></button>
            <button type="button" data-command="unlink"><img src="${baseUrl}/unlink.svg" alt="Desvincular"></button>
            <button type="button" data-command="insertImage" data-prompt="Enter image URL:"><img src="${baseUrl}/image.svg" alt="Imagen"></button>
            <button type="button" data-command="insertHTML" data-html="<table border='1'><tr><td>Cell 1</td><td>Cell 2</td></tr></table>"><img src="${baseUrl}/table.svg" alt="Tabla"></button>
            <label> 
                <select id="fontFamilySelector">
                    <option value="serif">Serif</option>
                    <option value="sans Serif">Sans Serif</option>
                    <option value="monospace">Monospace</option>
                    <option value="cursive">Cursive</option>
                    <option value="fantasy">Fantasy</option>
                    <option value="system-ui">System UI</option>
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
        // Add event listener for block style selector
			toolbar.querySelector('#blockStyleSelector').addEventListener('change', (e) => {
				 const selectedValue = e.target.value;
				 document.execCommand('formatBlock', false, selectedValue);

				 // Sync editor content to textarea
				 textarea.value = editor.innerHTML;
			});
    }
};

