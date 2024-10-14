import React, { useEffect, useState } from 'react';
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
import { FoodItem, ScannedCollection } from '../../../utils/types';
import { CategoryTag, LocationTag } from './Tags';
import { convertHours } from '../../../utils/timeConversion';

interface FoodListProps {
  scannedCollections: ScannedCollection[];
  setScannedCollections: React.Dispatch<React.SetStateAction<ScannedCollection[]>>;
  allFoodItems: FoodItem[];
}

const FoodList: React.FC<FoodListProps> = ({ scannedCollections, setScannedCollections, allFoodItems }) => {
  const [selectedItem, setSelectedItem] = useState<{ collectionId: string; item: FoodItem } | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'all' | 'collections'>('all');

  const handleDeleteClick = (collectionId: string, item: FoodItem) => {
    setSelectedItem({ collectionId, item });
    setIsDialogOpen(true);
  };

  useEffect(() => {
    console.log('scannedCollections received:', scannedCollections);
    console.log('allFoodItems received:', allFoodItems);
  }, [scannedCollections, allFoodItems]);

  const handleConfirmDelete = async () => {
    if (selectedItem && selectedItem.item._id) {
      try {
        const response = await fetch('/api/deleteFood', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ collectionId: selectedItem.collectionId, itemId: selectedItem.item._id }),
        });

        if (response.ok) {
          setScannedCollections(
            (prevCollections) =>
              prevCollections
                .map((collection) =>
                  collection._id === selectedItem.collectionId
                    ? {
                        ...collection,
                        items: collection.items.filter((item) => item._id !== selectedItem.item._id),
                      }
                    : collection
                )
                .filter((collection) => collection.items.length > 0) // Remove empty collections
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

  const renderItem = (collectionId: string, item: FoodItem) => (
    <div
      key={item._id || `${item.name}-${item.dateAdded}`}
      className="flex flex-col items-start w-full border border-gray-300 bg-white rounded-lg p-4"
    >
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
          onClick={() => handleDeleteClick(collectionId, item)}
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
          onClick={() => setViewMode('collections')}
          className={`px-4 py-2 rounded ${viewMode === 'collections' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Colecciones escaneadas
        </button>
      </div>

      {viewMode === 'all' ? (
        allFoodItems.length > 0 ? (
          allFoodItems.map((item) => {
            const collection = scannedCollections.find((c) => c.items.some((i) => i._id === item._id));
            return collection ? renderItem(collection._id || '', item) : null;
          })
        ) : (
          <p>No se encontraron artículos.</p>
        )
      ) : scannedCollections.length > 0 ? (
        scannedCollections.map((collection) => (
          <div key={collection._id} className="border border-gray-300 rounded-lg p-4 mb-4">
            <h3 className="text-xl font-bold mb-2">{collection.title}</h3>
            {collection.image && (
              <div className="relative w-full h-48 mb-4">
                <Image
                  src={collection.image}
                  alt="Scanned items"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg"
                />
              </div>
            )}
            <p className="mb-2">Artículos escaneados: {collection.items.length}</p>
            <p className="mb-4">Fecha de escaneo: {new Date(collection.dateAdded).toLocaleString()}</p>
            {collection.items.map((item) => renderItem(collection._id || '', item))}
          </div>
        ))
      ) : (
        <p>No se encontraron colecciones.</p>
      )}

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
