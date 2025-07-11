
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
    <div className="w-full bg-white p-8 border rounded-lg shadow-sm">
      <div className="prose prose-sm max-w-none">
        <div className="text-center mb-8">
          <h1 className="text-xl font-bold text-gray-900 mb-2">
            CONTRATO DE PRESTAÇÃO DE SERVIÇOS CONTÁBEIS
          </h1>
        </div>
        
        <div className="space-y-6 text-sm leading-relaxed text-gray-800">
          {processedContract.split('\n\n').map((paragraph, index) => {
            if (paragraph.trim() === '') return null;
            
            // Check if it's a header/title
            if (paragraph.includes('CONTRATANTE:') || 
                paragraph.includes('CONTRATADA:') || 
                paragraph.startsWith('CLÁUSULA') ||
                paragraph.includes('ANEXO I')) {
              return (
                <div key={index} className="font-bold text-gray-900 mt-6 mb-3">
                  {paragraph.split('\n').map((line, lineIndex) => (
                    <div key={lineIndex} className={lineIndex > 0 ? 'font-normal mt-2' : ''}>
                      {line}
                    </div>
                  ))}
                </div>
              );
            }
            
            // Regular paragraph
            return (
              <div key={index} className="mb-4">
                {paragraph.split('\n').map((line, lineIndex) => (
                  <div key={lineIndex} className={lineIndex > 0 ? 'mt-1' : ''}>
                    {line}
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
