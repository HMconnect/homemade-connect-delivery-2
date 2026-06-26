import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';

interface TermsStepProps {
  agreed: boolean;
  onAgree: (agreed: boolean) => void;
}

export function TermsStep({ agreed, onAgree }: TermsStepProps) {
  return (
    <div className="space-y-4">
      <ScrollArea className="h-64 border rounded-lg p-4">
        <div className="space-y-4 text-sm">
          <h3 className="font-bold text-lg">Cottage Food Vendor Terms & Conditions</h3>
          
          <div>
            <h4 className="font-semibold">1. License Requirements</h4>
            <p className="text-gray-600">You must maintain a valid Illinois Cottage Food Operation license at all times.</p>
          </div>
          
          <div>
            <h4 className="font-semibold">2. Food Safety</h4>
            <p className="text-gray-600">All food products must comply with Illinois Department of Public Health regulations for cottage food operations.</p>
          </div>
          
          <div>
            <h4 className="font-semibold">3. Product Listings</h4>
            <p className="text-gray-600">Only approved cottage food products may be listed. Prohibited items include meat, dairy, and other potentially hazardous foods.</p>
          </div>
          
          <div>
            <h4 className="font-semibold">4. Sales Limits</h4>
            <p className="text-gray-600">Annual gross sales must not exceed $36,000 as per Illinois cottage food law.</p>
          </div>
          
          <div>
            <h4 className="font-semibold">5. Labeling</h4>
            <p className="text-gray-600">All products must include proper labeling with ingredients, allergens, and required cottage food disclaimers.</p>
          </div>
        </div>
      </ScrollArea>
      
      <div className="flex items-center space-x-2">
        <Checkbox
          id="terms"
          checked={agreed}
          onCheckedChange={(checked) => onAgree(checked as boolean)}
        />
        <Label htmlFor="terms" className="cursor-pointer">
          I agree to the terms and conditions *
        </Label>
      </div>
    </div>
  );
}
