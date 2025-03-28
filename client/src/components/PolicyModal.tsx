import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface PolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
}

export default function PolicyModal({ isOpen, onClose, onAccept }: PolicyModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle className="text-xl font-bold text-primary">Booking Policy</DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="py-4">
          <h4 className="font-semibold text-lg mb-4">Client Policy for Beautify by Angel</h4>
          
          <div className="space-y-4 text-gray-700">
            <p><strong className="text-primary">Prices:</strong> ALL PRICES ARE FIXED, and due considerations have been taken. The tagged prices are exclusively for labour, in case you would wish to purchase from us, please find the attached braids/hairpiece pricelist.</p>
            
            <p><strong className="text-primary">Deposits:</strong> A 30% deposit is required to secure your appointment. This deposit goes towards your total service fee. The remaining balance for your service can be paid in cash or via M-Pesa upon completion.</p>
            
            <p><strong className="text-primary">Hair Preparation:</strong> Please arrive with your hair washed, detangled, stretched, and properly blow-dried. If you prefer, you can add shampoo and conditioning to your service for an additional fee.</p>
            
            <p><strong className="text-primary">Product Use:</strong> Do not use any oil in your hair on the day of your appointment as it can affect the styling process.</p>
            
            <p><strong className="text-primary">Cleanliness:</strong> If your hair is not clean upon arrival, I will refuse service, your appointment will be canceled.</p>
            
            <p><strong className="text-primary">Booking the Right Style:</strong> Ensure you book the hairstyle you want before your appointment. Changes cannot be made on the day of the appointment.</p>
            
            <p><strong className="text-primary">Attitude:</strong> Please arrive with a positive attitude; it creates a pleasant working environment for both of us.</p>
            
            <p><strong className="text-primary">Dress Code:</strong> Dress in a manner that makes you feel good as we take pictures and videos after your hair is styled, with your permission of course.</p>
            
            <h5 className="font-semibold text-primary mt-6 mb-2">Cancellations and Rescheduling:</h5>
            <p>All cancellations or reschedules must be made at least 24 hours before your appointment. If not, or if you do not show up, 10% of the service fee will be charged from your deposit.</p>
            
            <p><strong className="text-primary">Emergency Appointments:</strong> For emergency or last-minute appointments, please send me a direct message. Note that there might be an additional fee of Ksh 250 for such requests.</p>
            
            <p><strong className="text-primary">Booking on Event Days:</strong> Please avoid booking on days you have events as I prefer not to rush through my work to ensure quality.</p>
            
            <p><strong className="text-primary">Location:</strong> Services are provided at your location within Nairobi. Please provide your exact address when booking. For all home services transport to and fro shall be catered for by you.</p>
            
            <p><strong className="text-primary">Home Service Fee:</strong> For all home services, an additional fee of 200 KSH will be added to cover transportation costs.</p>
            
            <p><strong className="text-primary">Inquiries:</strong> For any inquiries, feel free to message me directly at 0706805891.</p>
            
            <p className="mt-6">Thank you for choosing Beautify by Angel. I look forward to providing you with a wonderful beauty experience!</p>
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            onClick={onAccept}
          >
            I Understand and Accept
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
