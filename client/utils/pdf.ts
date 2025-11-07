import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';

export type SavedResume = {
  id: string;
  name: string;
  pdfData: string; // base64 PDF data
  createdAt: string;
  updatedAt: string;
};

export async function generateResumePDF(
  elementId: string,
  resumeName: string
): Promise<SavedResume> {
  try {
    // Get the HTML element to convert
    const element = document.getElementById(elementId);
    if (!element) throw new Error('Resume element not found');

    // Convert HTML to PNG
    const pngData = await toPng(element, {
      quality: 0.95,
      backgroundColor: '#ffffff',
    });

    // Create PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: 'a4',
    });

    // Calculate dimensions to fit A4
    const imgProps = pdf.getImageProperties(pngData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    // Add image to PDF
    pdf.addImage(pngData, 'PNG', 0, 0, pdfWidth, pdfHeight);

    // Convert to base64
    const pdfData = pdf.output('datauristring');

    // Create saved resume object
    const savedResume: SavedResume = {
      id: crypto.randomUUID(),
      name: resumeName,
      pdfData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return savedResume;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
}