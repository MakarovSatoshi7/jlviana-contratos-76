
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
    console.log('Cliente representante orgao emissor:', cliente?.representanteOrgaoEmissor);
    
    // Garantir que todos os dados do cliente estejam disponíveis
    const templateData: ContractTemplateData = { 
      formData: contrato, 
      cliente: cliente, // Garantir que o cliente seja passado corretamente
      tipoServico 
    };
    
    console.log('Template data being passed:', templateData);
    console.log('Cliente data in template:', templateData.cliente);
    
    const processedContract = replaceVariables(contractTemplate, templateData);
    
    console.log('Processed contract preview:', processedContract.substring(0, 1000));
    
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.width;
    
    // --- ALTERAÇÕES DE MARGEM ---
    // Margens padrão para contrato (base ABNT: 3cm esquerda, 2cm direita)
    // 1 cm = ~28.35 pontos no jsPDF
    const marginLeft = 85; // Aprox. 3cm
    const marginRight = 57; // Aprox. 2cm
    const lineHeight = 7; // Aumentado um pouco para o novo tamanho da fonte
    let yPosition = 20;

    // Helper function to add text with word wrap
    const addText = (text: string, x: number, y: number, maxWidth: number, align: 'left' | 'center' = 'left') => {
      const lines = pdf.splitTextToSize(text, maxWidth);
      if (align === 'center') {
        // O alinhamento central não usa as margens laterais
        x = (pageWidth - maxWidth) / 2;
      }
      pdf.text(lines, x, y);
      return y + (lines.length * lineHeight);
    };

    // Split the contract into sections
    const sections = processedContract.split('\n\n').filter(section => section.trim() !== '');
    
    sections.forEach((section, index) => {
      // Check if we need a new page
      if (yPosition > 250) {
        pdf.addPage();
        yPosition = 20;
      }

      // --- ALTERAÇÕES DE FONTE E TAMANHO ---
      const contentWidth = pageWidth - marginLeft - marginRight;

      if (section.includes('CONTRATO DE PRESTAÇÃO DE SERVIÇOS CONTÁBEIS')) {
        pdf.setFontSize(18); // Tamanho do título aumentado
        pdf.setFont('helvetica', 'light'); // Helvetica é o padrão para Arial
        yPosition = addText(section, 0, yPosition, pageWidth, 'center');
        yPosition += 10;
      } else if (section.includes('CONTRATANTE:') || 
                 section.includes('CONTRATADA:') || 
                 section.startsWith('CLÁUSULA') ||
                 section.includes('ANEXO I')) {
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'light'); // Corrigido para 'light' minúsculo
        yPosition = addText(section, marginLeft, yPosition, contentWidth);
        yPosition += 5;
      } else {
        // Regular content
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'normal');
        yPosition = addText(section, marginLeft, yPosition, contentWidth);
        yPosition += 8;
      }
    });

    // Add signature area if not already present
    if (yPosition > 200) {
      pdf.addPage();
      yPosition = 20;
    }

    yPosition += 20;
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'normal');
    
    const contentWidth = pageWidth - marginLeft - marginRight;

    // Signature lines
    yPosition = addText('CONTRATANTE:', marginLeft, yPosition, contentWidth);
    yPosition += 15;
    pdf.line(marginLeft, yPosition, pageWidth - marginRight, yPosition);
    yPosition += 5;
    yPosition = addText(cliente.razaoSocial, marginLeft, yPosition, contentWidth);
    yPosition += 20;

    yPosition = addText('CONTRATADA:', marginLeft, yPosition, contentWidth);
    yPosition += 15;
    pdf.line(marginLeft, yPosition, pageWidth - marginRight, yPosition);
    yPosition += 5;
    yPosition = addText('JLVIANA CONSULTORIA CONTÁBIL LTDA - ME', marginLeft, yPosition, contentWidth);

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
