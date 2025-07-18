
import React from 'react';
import { jsPDF } from 'jspdf';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { Cliente, TipoServico, Contrato } from '@/types/contract';
import { contractTemplate, replaceVariables, ContractTemplateData } from '@/utils/contractTemplate';

interface ContratoPDFProps {
  contrato: Contrato;
  cliente: Cliente;
  tipoServico?: TipoServico;
}

export function ContratoPDF({ contrato, cliente, tipoServico }: ContratoPDFProps) {
  const generatePDF = () => {
    console.log('Generating PDF for:', { contrato, cliente, tipoServico });
    
    const templateData: ContractTemplateData = { 
      formData: contrato, 
      cliente: cliente,
      tipoServico 
    };
    
    const processedContract = replaceVariables(contractTemplate, templateData);
    
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.width;
    const pageHeight = pdf.internal.pageSize.height;
    
    // Contract margins (ABNT standard: 3cm left, 2cm right, 3cm top, 2cm bottom)
    const marginLeft = 85; // ~3cm
    const marginRight = 57; // ~2cm
    const marginTop = 85; // ~3cm
    const marginBottom = 57; // ~2cm
    const lineHeight = 6;
    const contentWidth = pageWidth - marginLeft - marginRight;
    let yPosition = marginTop;

    // Helper function to add text with word wrap
    const addText = (text: string, x: number, y: number, maxWidth: number, align: 'left' | 'center' = 'left') => {
      const lines = pdf.splitTextToSize(text, maxWidth);
      if (align === 'center') {
        x = pageWidth / 2;
        pdf.text(lines, x, y, { align: 'center' });
      } else {
        pdf.text(lines, x, y);
      }
      return y + (lines.length * lineHeight);
    };

    // Helper function to check if new page is needed
    const checkNewPage = (linesNeeded: number = 5) => {
      if (yPosition + (linesNeeded * lineHeight) > pageHeight - marginBottom) {
        pdf.addPage();
        yPosition = marginTop;
      }
    };

    // Split the contract into sections
    const sections = processedContract.split('\n\n').filter(section => section.trim() !== '');
    
    sections.forEach((section, index) => {
      const cleanSection = section.replace(/\*\*/g, ''); // Remove markdown bold markers
      
      // Check if we need a new page
      const estimatedLines = Math.ceil(cleanSection.length / 80);
      checkNewPage(estimatedLines);

      // Title
      if (cleanSection.includes('CONTRATO DE PRESTAÇÃO DE SERVIÇOS CONTÁBEIS') && 
          cleanSection.length < 100) {
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        yPosition = addText(cleanSection, 0, yPosition, pageWidth, 'center');
        yPosition += 15;
      }
      // Section headers
      else if (cleanSection.includes('CONTRATANTE:') || 
               cleanSection.includes('CONTRATADA:') || 
               cleanSection.startsWith('CLÁUSULA') ||
               cleanSection.includes('ANEXO I') ||
               cleanSection.includes('TESTEMUNHAS:')) {
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        yPosition = addText(cleanSection, marginLeft, yPosition, contentWidth);
        yPosition += 8;
      }
      // Subsection headers (numbered items)
      else if (cleanSection.match(/^\d+\.\d+\./)) {
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'bold');
        yPosition = addText(cleanSection, marginLeft, yPosition, contentWidth);
        yPosition += 6;
      }
      // Signature lines
      else if (cleanSection.includes('_______')) {
        checkNewPage(10);
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        
        const lines = cleanSection.split('\n');
        lines.forEach(line => {
          if (line.includes('_______')) {
            // Draw signature line
            const lineY = yPosition + 15;
            pdf.line(marginLeft, lineY, marginLeft + 150, lineY);
            yPosition += 20;
            // Add name below line
            const name = line.replace(/_+/g, '').trim();
            if (name) {
              pdf.text(name, marginLeft, yPosition);
              yPosition += 15;
            }
          } else if (line.trim()) {
            yPosition = addText(line, marginLeft, yPosition, contentWidth);
            yPosition += 4;
          }
        });
        yPosition += 10;
      }
      // Regular content
      else {
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        yPosition = addText(cleanSection, marginLeft, yPosition, contentWidth);
        yPosition += 8;
      }
    });

    // Final signature area if not already present
    if (!processedContract.includes('TESTEMUNHAS:')) {
      checkNewPage(15);
      yPosition += 20;
      
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      yPosition = addText('São Paulo, ' + format(new Date(), 'dd/MM/yyyy'), marginLeft, yPosition, contentWidth);
      yPosition += 20;

      // Signature lines
      pdf.line(marginLeft, yPosition, marginLeft + 150, yPosition);
      pdf.line(marginLeft + 200, yPosition, marginLeft + 350, yPosition);
      yPosition += 10;
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text('CONTRATANTE', marginLeft + 30, yPosition);
      pdf.text('CONTRATADA', marginLeft + 230, yPosition);
      yPosition += 8;
      
      pdf.text(cliente.razaoSocial, marginLeft, yPosition);
      pdf.text('JLVIANA CONSULTORIA CONTÁBIL LTDA - ME', marginLeft + 200, yPosition);
    }

    // Save PDF
    const filename = `Contrato_${cliente.razaoSocial.replace(/[^a-zA-Z0-9]/g, '_')}_${format(new Date(), 'yyyyMMdd')}.pdf`;
    pdf.save(filename);
    
    console.log('PDF generated successfully:', filename);
  };

  return (
    <Button onClick={generatePDF} className="flex items-center gap-2" variant="outline">
      <Download className="h-4 w-4" />
      Baixar PDF
    </Button>
  );
}
