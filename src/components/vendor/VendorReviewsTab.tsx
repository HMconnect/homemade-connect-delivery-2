import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { StarRating } from '@/components/reviews/StarRating';
import { MessageSquare, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Review {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  title: string;
  comment: string;
  vendor_response: string | null;
  created_at: string;
  product_name?: string;
  user_name?: string;
}

export const VendorReviewsTab: React.FC = () => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [filterProduct, setFilterProduct] = useState('all');
  const [filterRating, setFilterRating] = useState('all');
  const [filterResponse, setFilterResponse] = useState('all');
  const [respondingTo, setRespondingTo] = useState<string | null>(null);
  const [response, setResponse] = useState('');

  useEffect(() => {
    if (profile?.id) {
      fetchProducts();
      fetchReviews();
    }
  }, [profile?.id]);


  const fetchProducts = async () => {
    if (!profile) return;
    const { data } = await supabase
      .from('vendor_products')
      .select('id, name')
      .eq('vendor_id', profile.id);
    if (data) setProducts(data);
  };

  const fetchReviews = async () => {
    if (!profile) return;
    const { data: productData } = await supabase
      .from('vendor_products')
      .select('id')
      .eq('vendor_id', profile.id);
    
    if (!productData || productData.length === 0) {
      setReviews([]);
      return;
    }
    
    const productIds = productData.map(p => p.id);
    const { data } = await supabase
      .from('reviews')
      .select('*')
      .in('product_id', productIds)
      .eq('status', 'approved')
      .order('created_at', { ascending: false });

    if (data) {
      const reviewsWithDetails = await Promise.all(data.map(async (review) => {
        const { data: pData } = await supabase
          .from('vendor_products')
          .select('name')
          .eq('id', review.product_id)
          .single();
        
        const { data: uData } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', review.user_id)
          .single();

        return {
          ...review,
          product_name: pData?.name || 'Unknown',
          user_name: uData?.full_name || 'Anonymous'
        };
      }));
      
      setReviews(reviewsWithDetails);
    }
  };

  const handleRespond = async (reviewId: string) => {
    if (!response.trim()) return;
    const { error } = await supabase
      .from('reviews')
      .update({ vendor_response: response })
      .eq('id', reviewId);

    if (!error) {
      toast({ title: 'Success', description: 'Response posted' });
      setRespondingTo(null);
      setResponse('');
      fetchReviews();
    }
  };

  const filteredReviews = reviews.filter(r => {
    if (filterProduct !== 'all' && r.product_id !== filterProduct) return false;
    if (filterRating !== 'all' && r.rating !== parseInt(filterRating)) return false;
    if (filterResponse === 'needs' && r.vendor_response) return false;
    if (filterResponse === 'responded' && !r.vendor_response) return false;
    return true;
  });

  const needsResponseCount = reviews.filter(r => !r.vendor_response).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Customer Reviews</h2>
          <p className="text-gray-600">{reviews.length} total</p>
        </div>
        {needsResponseCount > 0 && (
          <div className="flex items-center gap-2 bg-orange-50 text-orange-700 px-4 py-2 rounded-lg">
            <AlertCircle className="h-5 w-5" />
            <span className="font-semibold">{needsResponseCount} need response</span>
          </div>
        )}
      </div>

      <div className="flex gap-4">
        <Select value={filterProduct} onValueChange={setFilterProduct}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="All Products" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Products</SelectItem>
            {products.map(p => (
              <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filterRating} onValueChange={setFilterRating}>
          <SelectTrigger className="w-[150px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Ratings</SelectItem>
            <SelectItem value="5">5 Stars</SelectItem>
            <SelectItem value="4">4 Stars</SelectItem>
            <SelectItem value="3">3 Stars</SelectItem>
            <SelectItem value="2">2 Stars</SelectItem>
            <SelectItem value="1">1 Star</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filterResponse} onValueChange={setFilterResponse}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Reviews</SelectItem>
            <SelectItem value="needs">Needs Response</SelectItem>
            <SelectItem value="responded">Responded</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        {filteredReviews.map(review => (
          <Card key={review.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{review.title}</CardTitle>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <span className="font-medium">{review.user_name}</span>
                    <span>•</span>
                    <span>{review.product_name}</span>
                    <span>•</span>
                    <span>{new Date(review.created_at).toLocaleDateString()}</span>
                  </div>
                  <StarRating rating={review.rating} />
                </div>
                {!review.vendor_response && (
                  <Button size="sm" variant="outline" onClick={() => setRespondingTo(review.id)}>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Respond
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">{review.comment}</p>
              
              {review.vendor_response && (
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                  <p className="text-sm font-semibold text-blue-900 mb-1">Your Response:</p>
                  <p className="text-gray-700">{review.vendor_response}</p>
                </div>
              )}

              {respondingTo === review.id && (
                <div className="space-y-3 pt-2">
                  <Textarea
                    placeholder="Write your response..."
                    value={response}
                    onChange={(e) => setResponse(e.target.value)}
                    rows={4}
                  />
                  <div className="flex gap-2">
                    <Button onClick={() => handleRespond(review.id)}>Post Response</Button>
                    <Button variant="outline" onClick={() => { setRespondingTo(null); setResponse(''); }}>
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
        {filteredReviews.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center text-gray-500">
              No reviews found
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
