import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { StarRating } from './StarRating';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';

interface Review {
  id: string;
  customer_name: string;
  rating: number;
  title?: string;
  comment: string;
  vendor_response?: string;
  vendor_response_date?: string;
  is_verified_purchase: boolean;
  created_at: string;
}

interface ReviewCardProps {
  review: Review;
  isVendor?: boolean;
  onRespond?: (reviewId: string, response: string) => Promise<void>;
}

export function ReviewCard({ review, isVendor, onRespond }: ReviewCardProps) {
  const [showResponseForm, setShowResponseForm] = useState(false);
  const [response, setResponse] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitResponse = async () => {
    if (!response.trim() || !onRespond) return;
    setIsSubmitting(true);
    try {
      await onRespond(review.id, response);
      setShowResponseForm(false);
      setResponse('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold">{review.customer_name}</span>
            {review.is_verified_purchase && (
              <Badge variant="secondary" className="text-xs">
                <CheckCircle className="w-3 h-3 mr-1" />
                Verified Purchase
              </Badge>
            )}
          </div>
          <StarRating rating={review.rating} />
        </div>
        <span className="text-sm text-gray-500">
          {format(new Date(review.created_at), 'MMM d, yyyy')}
        </span>
      </div>
      
      {review.title && <h4 className="font-semibold mb-2">{review.title}</h4>}
      <p className="text-gray-700 mb-4">{review.comment}</p>

      {review.vendor_response && (
        <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-orange-500">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="w-4 h-4 text-orange-600" />
            <span className="font-semibold text-sm">Vendor Response</span>
            <span className="text-xs text-gray-500">
              {format(new Date(review.vendor_response_date!), 'MMM d, yyyy')}
            </span>
          </div>
          <p className="text-sm text-gray-700">{review.vendor_response}</p>
        </div>
      )}

      {isVendor && !review.vendor_response && !showResponseForm && (
        <Button variant="outline" size="sm" onClick={() => setShowResponseForm(true)}>
          <MessageSquare className="w-4 h-4 mr-2" />
          Respond
        </Button>
      )}

      {showResponseForm && (
        <div className="mt-4 space-y-2">
          <Textarea
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            placeholder="Write your response..."
            rows={3}
          />
          <div className="flex gap-2">
            <Button onClick={handleSubmitResponse} disabled={isSubmitting} size="sm">
              Submit Response
            </Button>
            <Button variant="outline" onClick={() => setShowResponseForm(false)} size="sm">
              Cancel
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
