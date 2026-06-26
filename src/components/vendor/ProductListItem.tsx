import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Eye, EyeOff } from 'lucide-react';

interface ProductListItemProps {
  product: any;
  onEdit: (product: any) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string, isActive: boolean) => void;
}

export const ProductListItem: React.FC<ProductListItemProps> = ({ product, onEdit, onDelete, onToggleActive }) => {
  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-lg border hover:shadow-md transition-shadow">
      <img 
        src={product.image_url || '/placeholder.svg'} 
        alt={product.name}
        className="w-20 h-20 object-cover rounded-lg"
      />
      
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h4 className="font-semibold">{product.name}</h4>
          <Badge variant={product.is_active ? 'default' : 'secondary'}>
            {product.is_active ? 'Active' : 'Inactive'}
          </Badge>
        </div>
        <p className="text-sm text-gray-600 line-clamp-1">{product.description}</p>
        <div className="flex gap-4 mt-1 text-sm">
          <span className="font-medium text-green-600">${parseFloat(product.price).toFixed(2)}</span>
          <span className="text-gray-500">Stock: {product.inventory_count}</span>
          <span className="text-gray-500 capitalize">{product.category?.replace('-', ' ')}</span>
        </div>
      </div>

      <div className="flex gap-2">
        <Button size="sm" variant="outline" onClick={() => onToggleActive(product.id, !product.is_active)}>
          {product.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </Button>
        <Button size="sm" variant="outline" onClick={() => onEdit(product)}>
          <Edit className="h-4 w-4" />
        </Button>
        <Button size="sm" variant="destructive" onClick={() => onDelete(product.id)}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
