import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { StarRating } from './StarRating';
import { Label } from '@/components/ui/label';

interface ReviewFormProps {
  productId: string;
  vendorId: string;
  onSubmit: (review: {
    rating: number;
    title: string;
    comment: string;
  }) => Promise<void>;
  onCancel?: () => void;
}

export function ReviewForm({ productId, vendorId, onSubmit, onCancel }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0 || !comment.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({ rating, title, comment });
      setRating(0);
      setTitle('');
      setComment('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-xl font-bold mb-4">Write a Review</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label>Rating *</Label>
          <StarRating 
            rating={rating} 
            interactive 
            onRatingChange={setRating}
            size={32}
          />
        </div>

        <div>
          <Label htmlFor="title">Review Title (Optional)</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Sum up your experience"
            maxLength={100}
          />
        </div>

        <div>
          <Label htmlFor="comment">Your Review *</Label>
          <Textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your thoughts about this product..."
            rows={5}
            required
          />
        </div>

        <div className="flex gap-2">
          <Button type="submit" disabled={rating === 0 || !comment.trim() || isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </Button>
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
        </div>
      </form>
    </Card>
  );
}
