import React from 'react';

const colorMap: { [key: string]: string } = {
  Frutas: 'bg-lime-100 text-lime-700',
  Verduras: 'bg-green-200 text-green-900',
  Carnes: 'bg-red-200 text-red-900',
  'Pescados y mariscos': 'bg-blue-200 text-blue-800',
  Lácteos: 'bg-yellow-200 text-yellow-800',
  Huevos: 'bg-yellow-100 text-yellow-800',
  Cereales: 'bg-amber-200 text-amber-800',
  Legumbres: 'bg-lime-200 text-lime-800',
  'Frutos secos': 'bg-orange-200 text-orange-800',
  'Especias y hierbas': 'bg-emerald-200 text-emerald-800',
  'Aceites y grasas': 'bg-yellow-300 text-yellow-800',
  Bebidas: 'bg-cyan-200 text-cyan-800',
  Snacks: 'bg-purple-200 text-purple-800',
  Panadería: 'bg-amber-100 text-amber-800',
  'Dulces y postres': 'bg-pink-100 text-pink-800',
  Congelados: 'bg-indigo-200 text-indigo-800',
  Enlatados: 'bg-gray-200 text-gray-800',
  'Salsas y condimentos': 'bg-red-100 text-red-800',
  Pastas: 'bg-yellow-100 text-yellow-800',
  'Productos veganos': 'bg-green-100 text-green-800',
  'Alimentos para bebés': 'bg-blue-100 text-blue-800',
  'Comida preparada': 'bg-orange-100 text-orange-800',
};

export const CategoryTag: React.FC<{ category: string }> = ({ category }) => {
  return (
    <span
      className={`px-2 py-1 text-nowrap rounded-full text-xs font-semibold ${
        colorMap[category] || 'bg-gray-200 text-gray-800'
      }`}
    >
      {category}
    </span>
  );
};

const emojiMap: { [key: string]: string } = {
  Alacena: '🍶',
  Aparador: '🍽️',
  Bodega: '🧺',
  'Caja hermética': '🥡',
  'Cajón de frutas': '🍎',
  'Cajón de verduras': '🥦',
  Congelador: '❄️',
  Despensa: '🥫',
  Especiero: '🧂',
  Estante: '🏷️',
  Frutero: '🍇',
  'Puerta del refrigerador': '🥛',
  Refrigerador: '🧊',
  'Vinero / bar': '🍷',
};

export const LocationTag: React.FC<{ location: string }> = ({ location }) => {
  return (
    <span className="flex items-center text-sm">
      {emojiMap[location] || '📍'} {location}
    </span>
  );
};
