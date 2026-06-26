import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StarRating } from '@/components/reviews/StarRating';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

export function ReviewModeration() {
  const [reviews, setReviews] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    const { data } = await supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setReviews(data);
  };

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from('reviews')
      .update({ status })
      .eq('id', id);
    
    if (!error) {
      toast({ title: `Review ${status}` });
      loadReviews();
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Review Moderation</h2>
      {reviews.map((review) => (
        <Card key={review.id} className="p-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="font-semibold">{review.customer_name}</p>
              <StarRating rating={review.rating} size={16} />
            </div>
            <Badge variant={review.status === 'approved' ? 'default' : 'secondary'}>
              {review.status}
            </Badge>
          </div>
          {review.title && <h4 className="font-semibold mb-1">{review.title}</h4>}
          <p className="text-sm mb-3">{review.comment}</p>
          <div className="flex gap-2">
            <Button size="sm" onClick={() => updateStatus(review.id, 'approved')}>
              Approve
            </Button>
            <Button size="sm" variant="destructive" onClick={() => updateStatus(review.id, 'rejected')}>
              Reject
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}
