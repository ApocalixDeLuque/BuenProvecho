import React from 'react';

export type FoodItem = {
  nombre: string;
  cantidad: string;
  categoría: string;
  'fecha de caducidad': string;
  'fecha del registro': string;
};

const FoodList: React.FC<{ items: FoodItem[] }> = ({ items }) => {
  function convertHours(hours: number) {
    let days = Math.floor(hours / 24);
    const years = Math.floor(days / 365);
    days %= 365;
    const months = Math.floor(days / 30);
    days %= 30;
    return { years, months, days };
  }

  return (
    <div className="flex flex-col gap-4">
      {items.map((item, index) => (
        <div
          key={index}
          className="flex flex-col items-start w-full border-2 border-bpgreen/50 bg-bpgreen/5 rounded-lg p-4"
        >
          <div className="flex w-full justify-between">
            <p className="text-start font-bold">{item.nombre}</p>
            <p className="min-w-fit text-gray-500">{item.categoría}</p>
          </div>
          <p className="min-w-fit text-gray-500">Cantidad: {item.cantidad}</p>
          <br />
          <p>
            Caducidad estimada:{' '}
            <span className="text-gray-500">
              {(() => {
                const { years, months, days } = convertHours(Number(item['fecha de caducidad']));
                let result = '';
                if (years > 0) result += `${years} años `;
                if (months > 0) result += `${months} meses `;
                if (days > 0) result += `${days} días`;
                return result;
              })()}
            </span>
          </p>
          <p className="text-gray-500">Registrado: {item['fecha del registro']}</p>
        </div>
      ))}
    </div>
  );
};

export default FoodList;
