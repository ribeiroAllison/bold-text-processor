const mammoth = require('mammoth');
const fs = require('fs');
const path = require('path');

// Function to process bold text
function processBoldText(content) {
    // Convert <strong> tags to <b> tags
    let processedContent = content.replace(/<strong>(.*?)<\/strong>/g, '<b>$1</b>');
    
    // Also handle potential <b> tags that might already exist
    processedContent = processedContent.replace(/<b\s*>(.*?)<\/b>/g, '<b>$1</b>');
    
    return processedContent;
}

// Define the input file path
const inputPath = path.join(__dirname, 'text.docx');

// Check if file exists before processing
if (!fs.existsSync(inputPath)) {
    console.error(`Error: File not found at ${inputPath}`);
    console.log('Please ensure that text.docx exists in the same directory as the script.');
    process.exit(1);
}

// Read and process the .docx file
mammoth.convertToHtml({ path: inputPath })
    .then((result) => {
        const html = result.value;
        const processedText = processBoldText(html);
        console.log('Processed Text:', processedText);

        // Save the processed text to a new file
        const outputPath = path.join(__dirname, 'output.txt');
        fs.writeFile(outputPath, processedText, 'utf8', (err) => {
            if (err) {
                console.error('Error writing the file:', err);
                return;
            }
            console.log(`Processed text saved to ${outputPath}`);
        });
    })
    .catch((err) => {
        console.error('Error converting to HTML:', err);
    });
