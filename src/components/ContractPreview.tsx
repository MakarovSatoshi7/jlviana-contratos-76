
import { Cliente, TipoServico, Contrato } from '@/types/contract';
import { contractTemplate, replaceVariables, ContractTemplateData } from '@/utils/contractTemplate';

interface ContractPreviewProps {
  formData: Partial<Contrato>;
  cliente?: Cliente;
  tipoServico?: TipoServico;
}

export function ContractPreview({ formData, cliente, tipoServico }: ContractPreviewProps) {
  const templateData: ContractTemplateData = { formData, cliente, tipoServico };
  const processedContract = replaceVariables(contractTemplate, templateData);

  return (
    <div className="w-full max-w-4xl bg-white p-8 border rounded-lg shadow-sm mx-auto">
      <div className="prose prose-sm max-w-none">
        <div className="space-y-4 text-sm leading-relaxed text-gray-800">
          {processedContract.split('\n\n').map((paragraph, index) => {
            if (paragraph.trim() === '') return null;
            
            // Title styling
            if (paragraph.includes('CONTRATO DE PRESTAÇÃO DE SERVIÇOS CONTÁBEIS') && 
                paragraph.length < 100) {
              return (
                <div key={index} className="text-center mb-8">
                  <h1 className="text-xl font-bold text-gray-900 mb-4">
                    {paragraph.trim()}
                  </h1>
                </div>
              );
            }
            
            // Section headers (CONTRATANTE, CONTRATADA, CLÁUSULAS)
            if (paragraph.includes('**CONTRATANTE:**') || 
                paragraph.includes('**CONTRATADA:**') || 
                paragraph.startsWith('**CLÁUSULA') ||
                paragraph.includes('**ANEXO I') ||
                paragraph.includes('**TESTEMUNHAS:**')) {
              return (
                <div key={index} className="font-bold text-gray-900 mt-6 mb-3">
                  {paragraph.split('\n').map((line, lineIndex) => {
                    // Remove markdown bold markers and format
                    const cleanLine = line.replace(/\*\*/g, '');
                    return (
                      <div key={lineIndex} className={lineIndex > 0 ? 'font-normal mt-2' : ''}>
                        {cleanLine}
                      </div>
                    );
                  })}
                </div>
              );
            }
            
            // Subsection headers (numbered items within clauses)
            if (paragraph.match(/^\d+\.\d+\./)) {
              return (
                <div key={index} className="font-semibold text-gray-900 mt-4 mb-2">
                  {paragraph.split('\n').map((line, lineIndex) => (
                    <div key={lineIndex} className={lineIndex > 0 ? 'font-normal mt-1' : ''}>
                      {line}
                    </div>
                  ))}
                </div>
              );
            }
            
            // Lists with bullet points
            if (paragraph.includes('•')) {
              return (
                <div key={index} className="mb-4">
                  {paragraph.split('\n').map((line, lineIndex) => {
                    if (line.trim().startsWith('•')) {
                      return (
                        <div key={lineIndex} className="ml-4 mb-1">
                          {line.trim()}
                        </div>
                      );
                    }
                    return (
                      <div key={lineIndex} className={lineIndex > 0 ? 'mt-1' : ''}>
                        {line}
                      </div>
                    );
                  })}
                </div>
              );
            }
            
            // Signature lines
            if (paragraph.includes('_______')) {
              return (
                <div key={index} className="mt-8 mb-4">
                  {paragraph.split('\n').map((line, lineIndex) => {
                    if (line.includes('_______')) {
                      return (
                        <div key={lineIndex} className="mb-8">
                          <div className="border-b border-gray-400 w-64 mb-2"></div>
                          <div className="text-sm font-medium">
                            {line.replace(/_+/g, '').trim()}
                          </div>
                        </div>
                      );
                    }
                    return (
                      <div key={lineIndex} className={lineIndex > 0 ? 'mt-1' : ''}>
                        {line}
                      </div>
                    );
                  })}
                </div>
              );
            }
            
            // Regular paragraphs
            return (
              <div key={index} className="mb-4 text-justify">
                {paragraph.split('\n').map((line, lineIndex) => (
                  <div key={lineIndex} className={lineIndex > 0 ? 'mt-1' : ''}>
                    {line.replace(/\*\*/g, '')} {/* Remove markdown bold markers */}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-8">
            <div className="text-center">
              <div className="border-b border-gray-400 mb-2 pb-12"></div>
              <p className="text-sm font-medium">CONTRATANTE</p>
              <p className="text-xs text-gray-600 mt-1">
                {cliente?.razaoSocial || 'Nome do Contratante'}
              </p>
            </div>
            <div className="text-center">
              <div className="border-b border-gray-400 mb-2 pb-12"></div>
              <p className="text-sm font-medium">CONTRATADA</p>
              <p className="text-xs text-gray-600 mt-1">
                JLVIANA CONSULTORIA CONTÁBIL LTDA - ME
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
