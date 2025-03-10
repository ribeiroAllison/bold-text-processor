const fileInput = document.getElementById('fileInput');
const processButton = document.getElementById('processButton');
const status = document.getElementById('status');

fileInput.addEventListener('change', () => {
    processButton.disabled = !fileInput.files.length;
    status.textContent = '';
    status.className = '';
});

processButton.addEventListener('click', async () => {
    const file = fileInput.files[0];
    if (!file) return;

    try {
        const formData = new FormData();
        formData.append('file', file);

        // Send file to Netlify function
        const response = await fetch('/.netlify/functions/processFile', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) throw new Error('Processing failed');

        const result = await response.text();
        const processedText = processBoldText(result);

        // Create download
        const blob = new Blob([processedText], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.name.replace('.docx', '_processed.txt');
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        status.textContent = 'File processed successfully!';
        status.className = 'success';
    } catch (error) {
        status.textContent = 'Error processing file: ' + error.message;
        status.className = 'error';
    }
});
