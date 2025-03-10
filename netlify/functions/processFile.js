// netlify/functions/processFile.js
const mammoth = require('mammoth');
const busboy = require('busboy');

function parseMultipartForm(event) {
    return new Promise((resolve, reject) => {
        const bb = busboy({ headers: event.headers });
        const result = {};

        bb.on('file', (name, file, info) => {
            const chunks = [];
            file.on('data', (data) => chunks.push(data));
            file.on('end', () => {
                result.file = Buffer.concat(chunks);
            });
        });

        bb.on('finish', () => resolve(result));
        bb.on('error', (error) => reject(error));

        bb.write(Buffer.from(event.body, 'base64'));
        bb.end();
    });
}

exports.handler = async function(event, context) {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: 'Method Not Allowed'
        };
    }

    try {
        // Parse the multipart form data
        const formData = await parseMultipartForm(event);
        
        // Convert DOCX to HTML
        const result = await mammoth.convertToHtml({
            buffer: formData.file
        });

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'text/plain'
            },
            body: result.value
        };
    } catch (error) {
        console.error('Processing error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to process file' })
        };
    }
};
