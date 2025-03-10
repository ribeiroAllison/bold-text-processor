const express = require('express');
const mammoth = require('mammoth');
const multer = require('multer');
const path = require('path');

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

// Serve static files from current directory
app.use(express.static(__dirname));

// Handle file upload and processing
app.post('/process', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send('No file uploaded');
        }

        const result = await mammoth.convertToHtml({ buffer: req.file.buffer });
        res.send(result.value);
    } catch (error) {
        console.error('Processing error:', error);
        res.status(500).send('Error processing file');
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
