import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Upload, FileSpreadsheet, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Cliente } from '@/types/contract';
import * as XLSX from 'xlsx';
interface ImportClientesProps {
  onImport: (clientes: Omit<Cliente, 'id' | 'createdAt'>[]) => void;
}
export function ImportClientes({
  onImport
}: ImportClientesProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const downloadTemplate = () => {
    // Criar dados para o modelo XLSX
    const data = [['RAZAO SOCIAL', 'CNPJ'], ['EMPRESA EXEMPLO LTDA', '12.345.678/0001-90'], ['CONSULTORIA ABC LTDA', '98.765.432/0001-10'], ['TECH SOLUTIONS ME', '11.222.333/0001-44'], ['COMERCIAL XYZ LTDA', '22.333.444/0001-55'], ['INDUSTRIA NOVA S/A', '33.444.555/0001-66']];

    // Criar workbook e worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(data);

    // Definir largura das colunas
    worksheet['!cols'] = [{
      width: 30
    },
    // Coluna A - RAZAO SOCIAL
    {
      width: 20
    } // Coluna B - CNPJ
    ];

    // Adicionar worksheet ao workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Clientes');

    // Fazer download do arquivo
    XLSX.writeFile(workbook, 'modelo_clientes.xlsx');
  };
  const validateCNPJ = (cnpj: string): boolean => {
    const cleanCNPJ = cnpj.replace(/[^\d]/g, '');
    return cleanCNPJ.length === 14;
  };
  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
      const data = e.target?.result;
      const workbook = XLSX.read(data, {
        type: 'binary'
      });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, {
        header: 1
      });
      const clientes: Omit<Cliente, 'id' | 'createdAt'>[] = [];
      const errors: string[] = [];

      // Skip header line (index 0)
      for (let i = 1; i < jsonData.length; i++) {
        const row = jsonData[i] as any[];
        if (row && row.length >= 2) {
          const razaoSocial = row[0]?.toString().trim() || '';
          const cnpj = row[1]?.toString().trim() || '';
          if (!razaoSocial || !cnpj) {
            errors.push(`Linha ${i + 1}: Razão Social e CNPJ são obrigatórios`);
            continue;
          }
          if (!validateCNPJ(cnpj)) {
            errors.push(`Linha ${i + 1}: CNPJ inválido - ${cnpj}`);
            continue;
          }
          clientes.push({
            razaoSocial,
            cnpj
          });
        } else if (row && row.some(cell => cell)) {
          errors.push(`Linha ${i + 1}: Dados incompletos - necessário: Razão Social e CNPJ`);
        }
      }
      if (errors.length > 0) {
        alert(`Erros encontrados:\n${errors.join('\n')}`);
      }
      if (clientes.length > 0) {
        onImport(clientes);
      }
    };
    reader.readAsBinaryString(file);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  return <Card className="shadow-sm border-border/50">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-xl font-light">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <FileSpreadsheet className="h-5 w-5" />
          </div>
          Importação de Clientes via Planilha
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <Button onClick={downloadTemplate} variant="outline" size="lg" className="flex items-center gap-2 h-12 font-medium">
            <Download className="h-5 w-5" />
            Baixar Modelo (XLSX)
          </Button>
          
          <div className="flex items-center gap-2">
            <input ref={fileInputRef} type="file" accept=".xlsx,.xls" onChange={handleFileImport} className="hidden" />
            <Button onClick={() => fileInputRef.current?.click()} size="lg" className="flex items-center gap-2 h-12 font-medium">
              <Upload className="h-5 w-5" />
              Importar Planilha XLSX
            </Button>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-base font-semibold text-foreground">
            <AlertCircle className="h-5 w-5 text-primary" />
            Instruções
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium text-green-700 dark:text-green-400">
                <CheckCircle2 className="h-4 w-4" />
                Como usar o modelo
              </div>
              
              <div className="bg-green-50 dark:bg-green-950/20 rounded-lg p-4 space-y-3 text-sm">
                <div className="grid gap-2">
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-600 mt-2"></div>
                    <span><strong>Passo 1:</strong> Baixe o modelo clicando no botão acima</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-600 mt-2"></div>
                    <span><strong>Passo 2:</strong> Abra o arquivo no Excel ou Google Sheets</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-600 mt-2"></div>
                    <span><strong>Passo 3:</strong> Preencha os dados nas colunas organizadas</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-600 mt-2"></div>
                    <span><strong>Passo 4:</strong> Salve como XLSX e faça o upload</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium text-blue-700 dark:text-blue-400">
                <AlertCircle className="h-4 w-4" />
                Organização das colunas
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4 space-y-3 text-sm">
                <div className="grid gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-red-600 dark:text-red-400">*</span>
                    <span><strong>Coluna A:</strong> RAZAO SOCIAL</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-red-600 dark:text-red-400">*</span>
                    <span><strong>Coluna B:</strong> CNPJ</span>
                  </div>
                  <div className="text-muted-foreground">
                    <span>* Campos obrigatórios</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-muted/50 rounded-lg p-4 text-xs font-mono">
                <div className="font-semibold mb-2">Exemplo de organização:</div>
                <div className="space-y-1">
                  <div className="grid grid-cols-2 gap-4 border-b pb-1">
                    <div className="font-bold">COLUNA A</div>
                    <div className="font-bold">COLUNA B</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>RAZAO SOCIAL</div>
                    <div>CNPJ</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-muted-foreground">
                    <div>EMPRESA ABC LTDA</div>
                    <div>12.345.678/0001-90</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-muted-foreground">
                    <div>CONSULTORIA XYZ</div>
                    <div>98.765.432/0001-10</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50 rounded-lg p-4">
            <div className="flex items-start gap-2 text-amber-800 dark:text-amber-200 text-sm">
              <AlertCircle className="h-4 w-4 mt-0.5" />
              <div>
                <strong>Importante:</strong> 
                <ul className="mt-1 space-y-1 list-disc list-inside">
                  <li>O CNPJ pode ser com ou sem formatação (XX.XXX.XXX/XXXX-XX)</li>
                  <li>Mantenha sempre o cabeçalho da planilha (primeira linha)</li>
                  <li>Use o formato Excel (.xlsx) para melhor compatibilidade</li>
                  <li>Salve o arquivo no formato XLSX antes de importar</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>;
}