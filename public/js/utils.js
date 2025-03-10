function decodeHtmlEntities(text) {
  return text
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");
}

function processBoldText(content) {
  let processedContent = content.replace(/<strong>(.*?)<\/strong>/g, '<b>$1</b>');
  processedContent = processedContent.replace(/<b\s*>(.*?)<\/b>/g, '<b>$1</b>');
  processedContent = decodeHtmlEntities(processedContent);
  return processedContent;
}
