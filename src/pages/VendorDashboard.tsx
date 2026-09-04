import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ProductForm } from '@/components/vendor/ProductForm';
import { ProductListItem } from '@/components/vendor/ProductListItem';
import { SalesChart } from '@/components/vendor/SalesChart';
import { VendorProfileForm } from '@/components/vendor/VendorProfileForm';
import { VendorReviewsTab } from '@/components/vendor/VendorReviewsTab';
import { VendorOrdersTab } from '@/components/vendor/VendorOrdersTab';


import { useToast } from '@/hooks/use-toast';

const VendorDashboard: React.FC = () => {
  const { profile, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [products, setProducts] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (loading) return;
    
    if (!profile || profile.role !== 'vendor') {
      navigate('/');
      return;
    }
    
    if (profile.application_status !== 'approved') {
      toast({ title: 'Access Denied', description: 'Your vendor application must be approved first', variant: 'destructive' });
      navigate('/');
      return;
    }
    
    fetchProducts();
  }, [profile, loading, navigate]);


  const fetchProducts = async () => {
    if (!profile) return;
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('vendor_id', profile.id)
      .order('created_at', { ascending: false });
    if (error) {
      toast({ title: 'Could not load products', description: error.message, variant: 'destructive' });
      return;
    }
    if (data) setProducts(data.map((p: any) => ({ ...p, name: p.product_name })));
  };

  // The `products` table stores the dish name as `product_name` and needs a
  // state/city so it shows up in the right customers' location filter — the
  // vendor's own approved profile already has both.
  const toDbRow = (formData: any) => {
    const { name, ...rest } = formData;
    return {
      ...rest,
      product_name: name,
      state: profile?.state,
      city: profile?.city,
    };
  };

  const handleSubmit = async (formData: any) => {
    if (editingProduct) {
      const { error } = await supabase
        .from('products')
        .update({ ...toDbRow(formData), updated_at: new Date().toISOString() })
        .eq('id', editingProduct.id);
      if (!error) {
        toast({ title: 'Success', description: 'Product updated successfully' });
        fetchProducts();
        setShowForm(false);
        setEditingProduct(null);
      } else {
        toast({ title: 'Update failed', description: error.message, variant: 'destructive' });
      }
    } else {
      const { error } = await supabase
        .from('products')
        .insert([{ ...toDbRow(formData), vendor_id: profile?.id }]);
      if (!error) {
        toast({ title: 'Success', description: 'Product added successfully' });
        fetchProducts();
        setShowForm(false);
      } else {
        toast({ title: 'Could not add product', description: error.message, variant: 'destructive' });
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (!error) {
      toast({ title: 'Success', description: 'Product deleted' });
      fetchProducts();
    } else {
      toast({ title: 'Delete failed', description: error.message, variant: 'destructive' });
    }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    const { error } = await supabase.from('products').update({ is_available: isActive }).eq('id', id);
    if (!error) fetchProducts();
    else toast({ title: 'Could not update', description: error.message, variant: 'destructive' });
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Vendor Dashboard</h1>

        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="orders">
            <VendorOrdersTab />
          </TabsContent>



          <TabsContent value="products" className="space-y-4">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input placeholder="Search products..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
              </div>
              <Button onClick={() => { setShowForm(true); setEditingProduct(null); }}>
                <Plus className="h-4 w-4 mr-2" /> Add Product
              </Button>
            </div>

            {showForm && <ProductForm product={editingProduct} onSubmit={handleSubmit} onCancel={() => { setShowForm(false); setEditingProduct(null); }} />}

            <div className="space-y-3">
              {filteredProducts.map(product => (
                <ProductListItem key={product.id} product={product} onEdit={(p) => { setEditingProduct(p); setShowForm(true); }} onDelete={handleDelete} onToggleActive={handleToggleActive} />
              ))}
              {filteredProducts.length === 0 && <p className="text-center text-gray-500 py-8">No products found</p>}
            </div>
          </TabsContent>

          <TabsContent value="reviews">
            <VendorReviewsTab />
          </TabsContent>

          <TabsContent value="analytics">
            <SalesChart />
          </TabsContent>


          <TabsContent value="profile">
            <VendorProfileForm />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default VendorDashboard;

