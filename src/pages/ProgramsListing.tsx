import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical, Plus, GraduationCap, Edit, Trash2, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { programApi, Program } from '@/services/programApi';
import ConfirmModal from '@/components/ui/ConfirmModal';
import MainLayout from '@/components/layout/MainLayout';

const ProgramsListing: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [programToDelete, setProgramToDelete] = useState<Program | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      setLoading(true);
      const data = await programApi.getAll();
      setPrograms(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch programs. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddClick = () => {
    navigate('/programs/add');
  };

  const handleEditClick = (program: Program) => {
    navigate(`/programs/edit/${program.id}`, { state: { program } });
  };

  const handleDeleteClick = (program: Program) => {
    setProgramToDelete(program);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!programToDelete) return;

    try {
      setDeleting(true);
      await programApi.delete(programToDelete.id);
      setPrograms(prev => prev.filter(p => p.id !== programToDelete.id));
      toast({
        title: 'Success',
        description: 'Program deleted successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete program. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setDeleting(false);
      setDeleteModalOpen(false);
      setProgramToDelete(null);
    }
  };

  return (
    <MainLayout>
      <div className="p-6 min-h-[calc(100vh-72px)] relative">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">Programs</h1>
          <p className="text-muted-foreground mt-1">Manage academic programs</p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : programs.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <GraduationCap className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium text-foreground">No programs found</h3>
            <p className="text-muted-foreground mt-1">Get started by adding a new program.</p>
          </div>
        ) : (
          /* Programs Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {programs.map((program) => (
              <Card
                key={program.id}
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
                          onClick={() => handleEditClick(program)}
                          className="cursor-pointer"
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteClick(program)}
                          className="cursor-pointer text-destructive focus:text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Program Icon and Name */}
                  <div className="flex items-center gap-3 pr-8">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <GraduationCap className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-foreground truncate">
                        {program.program_name}
                      </h3>
                      <p className="text-xs text-muted-foreground">Program ID: {program.id}</p>
                    </div>
                  </div>
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
          title="Delete Program"
          description={`Are you sure you want to delete "${programToDelete?.program_name}"? This action cannot be undone.`}
          confirmText={deleting ? 'Deleting...' : 'Delete'}
          cancelText="Cancel"
          onConfirm={confirmDelete}
          variant="destructive"
        />
      </div>
    </MainLayout>
  );
};

export default ProgramsListing;
