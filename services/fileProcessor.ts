
// This makes TypeScript happy about pdfjsLib being in the global scope
declare const pdfjsLib: any;

export const extractTextFromFile = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (file.type === 'application/pdf') {
      const reader = new FileReader();
      reader.onload = async (event) => {
        if (event.target?.result) {
          try {
            const pdf = await pdfjsLib.getDocument({ data: event.target.result as ArrayBuffer }).promise;
            let text = '';
            for (let i = 1; i <= pdf.numPages; i++) {
              const page = await pdf.getPage(i);
              const textContent = await page.getTextContent();
              text += textContent.items.map((s: any) => s.str).join(' ');
            }
            resolve(text);
          } catch (error) {
            reject(new Error('Failed to parse PDF file.'));
          }
        } else {
            reject(new Error('Could not read PDF file.'));
        }
      };
      reader.onerror = () => reject(new Error('Error reading file.'));
      reader.readAsArrayBuffer(file);
    } else if (file.type === 'text/plain') {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          resolve(event.target.result as string);
        } else {
            reject(new Error('Could not read text file.'));
        }
      };
      reader.onerror = () => reject(new Error('Error reading file.'));
      reader.readAsText(file);
    } else {
      reject(new Error('Unsupported file type. Please upload a PDF or a plain text file.'));
    }
  });
};
