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
import { MoreVertical, Plus, BookOpen, Edit, Trash2, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ConfirmModal from '@/components/ui/ConfirmModal';
import MainLayout from '@/components/layout/MainLayout';
import { courseOfferingsApi, CourseOfferingListItem } from '@/services/api';

const CourseOfferingsListing: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [offerings, setOfferings] = useState<CourseOfferingListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [offeringToDelete, setOfferingToDelete] = useState<CourseOfferingListItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchOfferings();
  }, []);

  const fetchOfferings = async () => {
    try {
      setLoading(true);
      const data = await courseOfferingsApi.getAll();
      setOfferings(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch course offerings. Make sure your backend is running.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddClick = () => {
    navigate('/course-offerings/add');
  };

  const handleEditClick = (offering: CourseOfferingListItem) => {
    navigate(`/course-offerings/edit/${offering.id}`);
  };

  const handleDeleteClick = (offering: CourseOfferingListItem) => {
    setOfferingToDelete(offering);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!offeringToDelete) return;

    try {
      setDeleting(true);
      await courseOfferingsApi.delete(offeringToDelete.id);
      setOfferings((prev) => prev.filter((o) => o.id !== offeringToDelete.id));
      toast({
        title: 'Success',
        description: 'Course offering deleted successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete course offering.',
        variant: 'destructive',
      });
    } finally {
      setDeleting(false);
      setDeleteModalOpen(false);
      setOfferingToDelete(null);
    }
  };

  return (
    <MainLayout>
      <div className="p-6 min-h-[calc(100vh-72px)] relative">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">Course Offerings</h1>
          <p className="text-muted-foreground mt-1">Manage course offerings for academic terms</p>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : offerings.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <BookOpen className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium text-foreground">No course offerings found</h3>
            <p className="text-muted-foreground mt-1">Get started by adding a new course offering.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {offerings.map((offering) => (
              <Card
                key={offering.id}
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
                          onClick={() => handleEditClick(offering)}
                          className="cursor-pointer"
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteClick(offering)}
                          className="cursor-pointer text-destructive focus:text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Offering Icon and Details */}
                  <div className="flex items-start gap-3 pr-8">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <BookOpen className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-foreground truncate">
                        {offering.course_code}
                      </h3>
                      <p className="text-sm text-muted-foreground truncate">
                        {offering.course_title}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        <Badge variant="secondary" className="text-xs bg-primary/10 text-primary">
                          {offering.program}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {offering.department}
                        </Badge>
                      </div>
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
          title="Delete Course Offering"
          description={`Are you sure you want to delete "${offeringToDelete?.course_code} - ${offeringToDelete?.course_title}"? This action cannot be undone.`}
          confirmText={deleting ? 'Deleting...' : 'Delete'}
          cancelText="Cancel"
          onConfirm={confirmDelete}
          variant="destructive"
        />
      </div>
    </MainLayout>
  );
};

export default CourseOfferingsListing;
