import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical, Plus, FileText, Edit, Trash2, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ConfirmModal from '@/components/ui/ConfirmModal';
import MainLayout from '@/components/layout/MainLayout';
import { regulationsApi, Regulation } from '@/services/api';

const RegulationsListing: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [regulations, setRegulations] = useState<Regulation[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [regulationToDelete, setRegulationToDelete] = useState<Regulation | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchRegulations();
  }, []);

  const fetchRegulations = async () => {
    try {
      setLoading(true);
      const data = await regulationsApi.getAll();
      setRegulations(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch regulations. Make sure your backend is running.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddClick = () => {
    navigate('/regulations/add');
  };

  const handleEditClick = (regulation: Regulation) => {
    navigate(`/regulations/edit/${regulation.id}`, { state: { regulation } });
  };

  const handleDeleteClick = (regulation: Regulation) => {
    setRegulationToDelete(regulation);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!regulationToDelete) return;

    try {
      setDeleting(true);
      await regulationsApi.delete(regulationToDelete.id);
      setRegulations((prev) => prev.filter((r) => r.id !== regulationToDelete.id));
      toast({
        title: 'Success',
        description: 'Regulation deleted successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete regulation.',
        variant: 'destructive',
      });
    } finally {
      setDeleting(false);
      setDeleteModalOpen(false);
      setRegulationToDelete(null);
    }
  };

  return (
    <MainLayout>
      <div className="p-6 min-h-[calc(100vh-72px)] relative">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">Regulations</h1>
          <p className="text-muted-foreground mt-1">Manage exam regulations</p>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : regulations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <FileText className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium text-foreground">No regulations found</h3>
            <p className="text-muted-foreground mt-1">Get started by adding a new regulation.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
            {regulations.map((regulation) => (
              <Card
                key={regulation.id}
                className="relative group hover:shadow-md transition-shadow duration-200 border-border"
              >
                <CardContent className="p-5">
                  {/* Three-dots Menu */}
                  <div className="absolute top-3 right-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-popover z-50">
                        <DropdownMenuItem
                          onClick={() => handleEditClick(regulation)}
                          className="cursor-pointer"
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteClick(regulation)}
                          className="cursor-pointer text-destructive focus:text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Regulation Icon and Details */}
                  <div className="flex items-start gap-3 pr-8 mb-4">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-foreground truncate">
                        {regulation.regulation_name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {regulation.section_rules.length} Section(s)
                      </p>
                    </div>
                  </div>

                  {/* Section Rules */}
                  {regulation.section_rules.length > 0 && (
                    <div className="space-y-2 border-t pt-3">
                      {regulation.section_rules.slice(0, 3).map((section, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs">
                          <Badge variant="outline" className="text-xs">
                            {section.section_name}
                          </Badge>
                          <span className="text-muted-foreground">
                            {section.marks} marks • Min {section.min_questions_count}
                          </span>
                        </div>
                      ))}
                      {regulation.section_rules.length > 3 && (
                        <p className="text-xs text-muted-foreground">
                          +{regulation.section_rules.length - 3} more sections
                        </p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Floating Add Button */}
        <Button
          onClick={handleAddClick}
          size="lg"
          className="fixed bottom-8 right-8 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-shadow"
        >
          <Plus className="h-6 w-6" />
        </Button>

        {/* Delete Confirmation Modal */}
        <ConfirmModal
          open={deleteModalOpen}
          onOpenChange={setDeleteModalOpen}
          title="Delete Regulation"
          description={`Are you sure you want to delete "${regulationToDelete?.regulation_name}"? This action cannot be undone.`}
          confirmText={deleting ? 'Deleting...' : 'Delete'}
          cancelText="Cancel"
          onConfirm={confirmDelete}
          variant="destructive"
        />
      </div>
    </MainLayout>
  );
};

export default RegulationsListing;
