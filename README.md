# jocarsa | snow WYSIWYG Editor

A feature-rich WYSIWYG editor library that transforms `<textarea>` elements into modern and customizable text editors.

## Features

- Bold, italic, underline, and strikethrough text formatting.
- Text alignment options: left, center, right, and justified.
- Create ordered and unordered lists.
- Add links and images.
- Insert custom HTML elements like tables.
- Change font family, font size, text color, and background color.
- Clear formatting with a single click.
- Fully customizable toolbar and editor styles.

## Installation

### Clone the Repository

```bash
git clone https://github.com/jocarsa/jocarsa-snow.git
```

### Include Files

Add the following files to your project:

#### HTML
```html
<link rel="stylesheet" href="wysiwyg_styles.css">
<script src="wysiwyg_editor.js" defer></script>
```

#### File Structure
```
project/
├── index.html
├── wysiwyg_styles.css
└── wysiwyg_editor.js
```

## Usage

### Basic Setup
1. Add a `<textarea>` element to your HTML:

    ```html
    <textarea id="my-editor"></textarea>
    ```

2. Include the library files as shown above.

3. The editor will automatically initialize for all `<textarea>` elements on the page.

### Namespaced Styling
To ensure the editor does not conflict with other styles or scripts, all classes and functions are namespaced under `jocarsa | snow`.

- CSS Classes: Prefixed with `jocarsa-snow-`.
- JavaScript Methods: Accessible via the `jocarsaSnow` object.

### Customizing Toolbar
You can modify the toolbar buttons in the `wysiwyg_editor.js` file by editing the `toolbar.innerHTML` string.

Example:
```javascript
const toolbar = document.createElement('div');
toolbar.innerHTML = `
    <button type="button" data-command="bold">B</button>
    <button type="button" data-command="italic">I</button>
`;
```

### Styling
You can customize the editor appearance by editing the `wysiwyg_styles.css` file. All styles are scoped under `.jocarsa-snow-editor-container` to avoid conflicts.

Example:
```css
.jocarsa-snow-editor {
    background-color: #f0f0f0;
    font-family: 'Courier New', monospace;
}
```

## Example
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>jocarsa | snow Editor</title>
    <link rel="stylesheet" href="wysiwyg_styles.css">
</head>
<body>
    <textarea id="editor1"></textarea>
    <textarea id="editor2">Pre-filled content</textarea>
    <script src="wysiwyg_editor.js" defer></script>
</body>
</html>
```

## Contribution

We welcome contributions! Please fork the repository and submit a pull request with your changes.

1. Fork the project.
2. Create a feature branch: `git checkout -b feature-name`.
3. Commit your changes: `git commit -m 'Add new feature'`.
4. Push the branch: `git push origin feature-name`.
5. Open a pull request.

## License

This project is licensed under the GPL-3.0 License. See the `LICENSE` file for details.

## Contact

For questions or support, please contact info@jocarsa.com
