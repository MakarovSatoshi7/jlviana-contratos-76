
import React from 'react';

export function ContractImagePreview() {
  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <iframe 
          src="https://gamma.app/embed/g6ew0f6q35x0jj1" 
          style={{ width: '700px', maxWidth: '100%', height: '450px' }}
          allow="fullscreen" 
          title="Copy of CONTRATO DE PRESTAÇÃO DE SERVIÇOS CONTÁBEIS"
          className="w-full"
        />
      </div>
    </div>
  );
}
