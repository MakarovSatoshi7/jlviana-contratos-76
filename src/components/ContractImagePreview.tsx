
import React from 'react';

export function ContractImagePreview() {
  const contractImages = [
    '/lovable-uploads/1a795651-7f44-4d98-953a-af0fab382527.png',
    '/lovable-uploads/a72332f2-6880-411d-bad6-001637b6b00a.png',
    '/lovable-uploads/ae6295ad-140f-422a-9a90-ebbc03f72c8c.png'
  ];

  return (
    <div className="w-full max-w-5xl mx-auto space-y-4">
      {contractImages.map((image, index) => (
        <div key={index} className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <img
            src={image}
            alt={`Página ${index + 1} do contrato`}
            className="w-full h-auto object-contain"
            style={{ maxHeight: '80vh' }}
          />
        </div>
      ))}
    </div>
  );
}
