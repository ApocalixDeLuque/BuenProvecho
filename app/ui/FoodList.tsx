import React from 'react';
import fakeItems from '../fakeItems';

export type FoodItem = {
  name: string;
  category: string;
  amount: string;
  unit: string;
  expirationDate: string;
  dateAdded: string;
  location: string;
};

const categorias = [
  'Frutas',
  'Verduras',
  'Carnes',
  'Pescados y mariscos',
  'Lácteos',
  'Huevos',
  'Cereales',
  'Legumbres',
  'Frutos secos',
  'Especias y hierbas',
  'Aceites y grasas',
  'Bebidas',
  'Snacks',
  'Panadería',
  'Dulces y postres',
  'Congelados',
  'Enlatados',
  'Salsas y condimentos',
  'Pastas',
  'Productos veganos',
  'Alimentos para bebés',
  'Comida preparada',
];

const ubicaciones = [
  'Alacena',
  'Aparador',
  'Bodega',
  'Caja hermética',
  'Cajón de frutas',
  'Cajón de verduras',
  'Congelador',
  'Despensa',
  'Especiero',
  'Estante',
  'Frutero',
  'Puerta del refrigerador',
  'Refrigerador',
  'Vinero / bar',
];

const unidadesMedida: string[] = [
  // Unidades de peso
  'kg',
  'g',
  'mg',
  'lb',
  'oz',
  // Unidades de volumen
  'L',
  'mL',
  'taza(s)',
  // Unidades de cantidad
  'pieza(s)',
  'porción(es)',
  'rebanada(s)',
  'rodaja(s)',
  'gajo(s)',
  // Unidades de empaque
  'paquete(s)',
  'caja(s)',
  'lata(s)',
  'botella(s)',
  'frasco(s)',
  'bolsa(s)',
  // Unidades de agrupación
  'docena(s)',
  'racimo(s)',
  'manojo(s)',
  'ramo(s)',
  'puñado(s)',
  // Unidades específicas para ciertos alimentos
  'cabeza(s)',
  'diente(s)',
  // Unidades de área
  'hoja(s)',
];

const CategoryTag: React.FC<{ category: string }> = ({ category }) => {
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

const LocationTag: React.FC<{ location: string }> = ({ location }) => {
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

  return (
    <span className="flex items-center text-sm">
      {emojiMap[location] || '📍'} {location}
    </span>
  );
};

const FoodList: React.FC<{ items: FoodItem[] }> = ({ items }) => {
  return (
    <div className="flex flex-col gap-4">
      {items.map((item, index) => (
        <div key={index} className="flex flex-col items-start w-full border border-gray-300 bg-white rounded-lg p-4">
          <div className="flex w-full justify-between items-start">
            <p className="text-start text-lg leading-tight font-bold">{item.name}</p>
            <CategoryTag category={item.category} />
          </div>
          <div className="flex w-full justify-between text-sm text-gray-500 pt-8">
            <p className="text-nowrap">
              {item.amount} {item.unit}
            </p>
            <LocationTag location={item.location} />
          </div>
          <p className="flex w-full justify-between text-nowrap text-sm pt-2">
            <span className="font-medium text-gray-800">Caduca en:</span>
            <span className="font-semibold text-red-500">{item.expirationDate}</span>
          </p>
          <p className="text-sm text-gray-500 pt-2">Registrado el: {item.dateAdded}</p>
        </div>
      ))}
    </div>
  );
};

export default FoodList;
