
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Shield, Car, Calendar, User } from 'lucide-react';

interface InspectionReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  inspection: {
    id: string;
    vehicle_name: string;
    condition_type: string;
    overall_condition: string;
    created_at: string;
  } | null;
}

export const InspectionReportModal = ({ isOpen, onClose, inspection }: InspectionReportModalProps) => {
  if (!inspection) return null;

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'excellent': return 'text-green-500 font-bold';
      case 'good': return 'text-green-600 font-semibold';
      case 'fair': return 'text-yellow-500 font-semibold';
      case 'poor': return 'text-red-500 font-semibold';
      case 'damaged': return 'text-black dark:text-white font-bold';
      default: return 'text-gray-600';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            Inspection Report
          </DialogTitle>
          <DialogDescription>
            Detailed inspection report for {inspection.vehicle_name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Report ID</label>
              <p className="text-sm font-mono bg-muted p-2 rounded">{inspection.id.slice(0, 8)}...</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Inspection Type</label>
              <p className="text-sm capitalize">{inspection.condition_type.replace('_', ' ')}</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Car className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Vehicle</p>
                <p className="text-sm text-muted-foreground">{inspection.vehicle_name}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Inspection Date</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(inspection.created_at).toLocaleDateString()} at {new Date(inspection.created_at).toLocaleTimeString()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Overall Condition</p>
                <p className={`text-sm capitalize ${getConditionColor(inspection.overall_condition)}`}>
                  {inspection.overall_condition}
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t">
            <div className="bg-muted p-3 rounded-lg">
              <p className="text-sm font-medium mb-2">Condition Status Legend:</p>
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Excellent - Vehicle in perfect condition</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                  <span>Good - Minor wear, fully functional</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span>Fair - Noticeable wear, needs attention</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span>Poor - Significant issues, immediate action needed</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-black dark:bg-white rounded-full"></div>
                  <span>Damaged - Vehicle damaged, requires repair</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
