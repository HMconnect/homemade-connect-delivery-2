import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { ReviewCard } from './reviews/ReviewCard';
import { ReviewForm } from './reviews/ReviewForm';
import { StarRating } from './reviews/StarRating';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { useToast } from '@/hooks/use-toast';
import { Separator } from './ui/separator';

interface ProductReviewsProps {
  productId: string;
  vendorId: string;
}

export function ProductReviews({ productId, vendorId }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [stats, setStats] = useState({ average: 0, count: 0 });
  const { user, userProfile } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    loadReviews();
  }, [productId]);

  const loadReviews = async () => {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('product_id', productId)
      .eq('status', 'approved')
      .order('created_at', { ascending: false });

    if (data) {
      setReviews(data);
      const avg = data.length > 0 
        ? data.reduce((sum, r) => sum + r.rating, 0) / data.length 
        : 0;
      setStats({ average: avg, count: data.length });
    }
  };

  const handleSubmitReview = async (reviewData: any) => {
    if (!user || !userProfile) {
      toast({ title: 'Please log in to submit a review', variant: 'destructive' });
      return;
    }

    const { error } = await supabase.from('reviews').insert({
      product_id: productId,
      vendor_id: vendorId,
      customer_id: user.id,
      customer_name: userProfile.full_name || 'Anonymous',
      ...reviewData,
    });

    if (error) {
      toast({ title: 'Failed to submit review', variant: 'destructive' });
    } else {
      toast({ title: 'Review submitted successfully!' });
      setShowForm(false);
      loadReviews();
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-2xl font-bold mb-4">Customer Reviews</h3>
        {stats.count > 0 && (
          <div className="flex items-center gap-4 mb-4">
            <div className="text-4xl font-bold">{stats.average.toFixed(1)}</div>
            <div>
              <StarRating rating={stats.average} size={24} />
              <p className="text-sm text-gray-600">{stats.count} reviews</p>
            </div>
          </div>
        )}
        
        {user && !showForm && (
          <Button onClick={() => setShowForm(true)}>Write a Review</Button>
        )}
      </Card>

      {showForm && (
        <ReviewForm
          productId={productId}
          vendorId={vendorId}
          onSubmit={handleSubmitReview}
          onCancel={() => setShowForm(false)}
        />
      )}

      <div className="space-y-4">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
        {reviews.length === 0 && (
          <p className="text-center text-gray-500 py-8">No reviews yet. Be the first to review!</p>
        )}
      </div>
    </div>
  );
}
