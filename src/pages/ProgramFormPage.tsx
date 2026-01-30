import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { programApi, Program } from '@/services/programApi';
import MainLayout from '@/components/layout/MainLayout';

const ProgramFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const { toast } = useToast();

  const isEditMode = Boolean(id);
  const programFromState = location.state?.program as Program | undefined;

  const [programName, setProgramName] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isEditMode && programFromState) {
      setProgramName(programFromState.program_name);
    } else if (isEditMode && id) {
      // If no state is passed, we could fetch the program by ID
      // For now, redirect back if no data
      toast({
        title: 'Error',
        description: 'Program data not found.',
        variant: 'destructive',
      });
      navigate('/programs');
    }
  }, [isEditMode, programFromState, id, navigate, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedName = programName.trim();

    if (!trimmedName) {
      toast({
        title: 'Validation Error',
        description: 'Program name is required.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setSubmitting(true);

      if (isEditMode && id) {
        await programApi.update(parseInt(id), { program_name: trimmedName });
        toast({
          title: 'Success',
          description: 'Program updated successfully.',
        });
      } else {
        await programApi.create({ program_name: trimmedName });
        toast({
          title: 'Success',
          description: 'Program added successfully.',
        });
      }

      navigate('/programs');
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${isEditMode ? 'update' : 'add'} program. Please try again.`,
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate('/programs');
  };

  return (
    <MainLayout>
      <div className="p-6 min-h-[calc(100vh-72px)]">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={handleBack}
          className="mb-6 -ml-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Programs
        </Button>

        {/* Form Card */}
        <div className="flex items-center justify-center">
          <Card className="w-full max-w-md shadow-md">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold underline underline-offset-4 decoration-2">
                {isEditMode ? 'Edit Program' : 'Add Program'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="programName" className="text-sm font-medium">
                    Program Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="programName"
                    name="programName"
                    type="text"
                    placeholder="e.g., B.Tech, M.Tech, MCA, MBA"
                    value={programName}
                    onChange={(e) => setProgramName(e.target.value)}
                    className="w-full"
                    disabled={submitting}
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    disabled={submitting}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="px-6" disabled={submitting}>
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        {isEditMode ? 'Updating...' : 'Adding...'}
                      </>
                    ) : (
                      isEditMode ? 'Update' : 'Add'
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProgramFormPage;
