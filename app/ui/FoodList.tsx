import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import cn from 'classnames';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from './Dialog';

export type FoodItem = {
  _id: string;
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
  'kg',
  'g',
  'mg',
  'lb',
  'oz',
  'L',
  'mL',
  'taza(s)',
  'pieza(s)',
  'porción(es)',
  'rebanada(s)',
  'rodaja(s)',
  'gajo(s)',
  'paquete(s)',
  'caja(s)',
  'lata(s)',
  'botella(s)',
  'frasco(s)',
  'bolsa(s)',
  'docena(s)',
  'racimo(s)',
  'manojo(s)',
  'ramo(s)',
  'puñado(s)',
  'cabeza(s)',
  'diente(s)',
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

function convertHours(hours: string | number): { text: string; colorClass: string } {
  const hoursNum = typeof hours === 'string' ? parseInt(hours, 10) : hours;

  if (isNaN(hoursNum) || hoursNum < 0) {
    return { text: 'Tiempo inválido', colorClass: 'text-gray-500' };
  }

  const days = Math.floor(hoursNum / 24);
  const years = Math.floor(days / 365);
  const months = Math.floor((days % 365) / 30);
  const remainingDays = days % 30;
  const remainingHours = hoursNum % 24;

  const parts = [];
  if (years > 0) parts.push(`${years} año${years > 1 ? 's' : ''}`);
  if (months > 0) parts.push(`${months} mes${months > 1 ? 'es' : ''}`);
  if (remainingDays > 0) parts.push(`${remainingDays} día${remainingDays > 1 ? 's' : ''}`);
  if (remainingHours > 0) parts.push(`${remainingHours} hora${remainingHours > 1 ? 's' : ''}`);

  let text = parts.join(', ');
  let colorClass: string;

  if (hoursNum <= 0) {
    text = 'Expirado';
    colorClass = 'text-red-500';
  } else if (hoursNum <= 72) {
    // 3 días
    colorClass = 'text-orange-500';
  } else if (hoursNum <= 168) {
    // 1 semana
    colorClass = 'text-yellow-500';
  } else {
    colorClass = 'text-green-500';
  }

  if (text === '') {
    text = 'Menos de una hora';
  }

  return { text, colorClass };
}

const FoodList: React.FC<{ items: FoodItem[] }> = ({ items }) => {
  const [selectedItem, setSelectedItem] = useState<FoodItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [foodItems, setFoodItems] = useState(items); // Use foodItems here

  const handleDeleteClick = (item: FoodItem) => {
    setSelectedItem(item);
    setIsDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedItem) {
      try {
        const response = await fetch('/api/deleteFood', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: selectedItem._id }),
        });

        if (response.ok) {
          // Update foodItems state to reflect the deletion
          setFoodItems((prevItems) => prevItems.filter((item) => item._id !== selectedItem._id));
          console.log(`Item deleted: ${selectedItem.name}`);
        } else {
          console.error('Failed to delete item');
        }
      } catch (error) {
        console.error('Error deleting item:', error);
      }
    }

    setIsDialogOpen(false);
  };

  return (
    <div className="flex flex-col gap-4">
      {foodItems.map((item, index) => (
        // Render items based on foodItems state
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
          <p className="flex w-full text-nowrap text-sm pt-2 gap-1">
            <span className="font-medium text-gray-800">Caduca en:</span>
            {(() => {
              const { text, colorClass } = convertHours(item.expirationDate);
              return <span className={cn('font-semibold', colorClass)}>{text}</span>;
            })()}
          </p>
          <div className="flex w-full items-end justify-between text-sm">
            <p className="text-gray-500 pt-2">Registrado el: {item.dateAdded}</p>
            <button
              onClick={() => handleDeleteClick(item)}
              className={cn(
                'flex items-center justify-center',
                'bg-red-500/10 text-red-500 border border-red-500',
                'rounded h-6 w-6'
              )}
            >
              <FontAwesomeIcon icon={faTrash} className="h-3 w-3" />
            </button>
          </div>
        </div>
      ))}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Confirmar eliminación</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            ¿Estás seguro de que quieres eliminar este artículo? Esta acción no se puede deshacer.
          </DialogDescription>
          <DialogFooter className="flex flex-col gap-2">
            <DialogClose asChild>
              <button className="bg-gray-300 px-4 py-2 rounded">Cancelar</button>
            </DialogClose>
            <button onClick={handleConfirmDelete} className="bg-red-500 text-white px-4 py-2 rounded">
              Eliminar
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FoodList;
