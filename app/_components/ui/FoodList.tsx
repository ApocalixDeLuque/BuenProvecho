import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';
import cn from 'classnames';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from './Dialog';
import { FoodItem } from '../../../utils/types';
import { CategoryTag, LocationTag } from './Tags';
import { convertHours } from '../../../utils/timeConversion';

interface FoodList {
  _id: string;
  image: string | null;
  items: FoodItem[];
}

interface FoodListProps {
  foodLists: FoodList[];
  setFoodLists: React.Dispatch<React.SetStateAction<FoodList[]>>;
}

const FoodList: React.FC<FoodListProps> = ({ foodLists, setFoodLists }) => {
  const [selectedItem, setSelectedItem] = useState<{ listId: string; item: FoodItem } | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'all' | 'lists'>('all');

  const allItems = foodLists.flatMap((list) => list.items.map((item) => ({ listId: list._id, ...item })));

  const handleDeleteClick = (listId: string, item: FoodItem) => {
    setSelectedItem({ listId, item });
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
          body: JSON.stringify({ listId: selectedItem.listId, itemId: selectedItem.item._id }),
        });

        if (response.ok) {
          setFoodLists(
            (prevLists) =>
              prevLists
                .map((list) =>
                  list._id === selectedItem.listId
                    ? { ...list, items: list.items.filter((item) => item._id !== selectedItem.item._id) }
                    : list
                )
                .filter((list) => list.items.length > 0) // Remove empty lists
          );
          console.log(`Item deleted: ${selectedItem.item.name}`);
        } else {
          console.error('Failed to delete item');
        }
      } catch (error) {
        console.error('Error deleting item:', error);
      }
    }

    setIsDialogOpen(false);
  };

  const renderItem = (listId: string, item: FoodItem) => (
    <div key={item._id} className="flex flex-col items-start w-full border border-gray-300 bg-white rounded-lg p-4">
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
          onClick={() => handleDeleteClick(listId, item)}
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
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-center gap-4 mb-4">
        <button
          onClick={() => setViewMode('all')}
          className={`px-4 py-2 rounded ${viewMode === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Todos los artículos
        </button>
        <button
          onClick={() => setViewMode('lists')}
          className={`px-4 py-2 rounded ${viewMode === 'lists' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Listas de escaneo
        </button>
      </div>

      {viewMode === 'all'
        ? allItems.map((item) => renderItem(item.listId, item))
        : foodLists.map((list, index) => (
            <div key={list._id} className="border border-gray-300 rounded-lg p-4 mb-4">
              <h3 className="text-xl font-bold mb-2">Lista de escaneo {index + 1}</h3>
              {list.image && (
                <div className="relative w-full h-48 mb-4">
                  <Image src={list.image} alt="Scanned items" layout="fill" objectFit="cover" className="rounded-lg" />
                </div>
              )}
              <p className="mb-2">Artículos escaneados: {list.items.length}</p>
              {list.items.map((item) => renderItem(list._id, item))}
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
