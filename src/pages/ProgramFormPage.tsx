import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import MainLayout from '@/components/layout/MainLayout';

interface Program {
  id: number;
  program_name: string;
}

const BASE_URL = 'http://localhost:8080';

const ProgramFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const { toast } = useToast();

  const isEditMode = Boolean(id);
  const programFromState = location.state?.program as Program | undefined;

  const [programName, setProgramName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);

  /* ---------------- LOAD PROGRAM (EDIT) ---------------- */
  useEffect(() => {
    const fetchProgram = async () => {
      if (!isEditMode || !id) return;

      try {
        setLoading(true);

        // If program came via navigation state, use it
        if (programFromState) {
          setProgramName(programFromState.program_name);
          return;
        }

        // Else fetch from API
        const res = await fetch(`${BASE_URL}/programs/${id}`);
        if (!res.ok) throw new Error('Fetch failed');

        const data: Program = await res.json();
        setProgramName(data.program_name);
      } catch {
        toast({
          title: 'Error',
          description: 'Program data not found.',
          variant: 'destructive',
        });
        navigate('/programs');
      } finally {
        setLoading(false);
      }
    };

    fetchProgram();
  }, [isEditMode, id, programFromState, toast, navigate]);

  /* ---------------- SUBMIT ---------------- */
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

    setSubmitting(true);

    try {
      if (isEditMode && id) {
        /* -------- UPDATE -------- */
        const res = await fetch(`${BASE_URL}/programs/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ program_name: trimmedName }),
        });

        if (!res.ok) throw new Error('Update failed');

        toast({
          title: 'Success',
          description: 'Program updated successfully.',
        });
      } else {
        /* -------- CREATE -------- */
        const res = await fetch(`${BASE_URL}/programs`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ program_name: trimmedName }),
        });

        if (!res.ok) throw new Error('Create failed');

        toast({
          title: 'Success',
          description: 'Program added successfully.',
        });
      }

      navigate('/programs');
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to save program.',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate('/programs');
  };

  /* ---------------- UI ---------------- */
  return (
    <MainLayout>
      <div className="p-6 min-h-[calc(100vh-72px)]">
        <Button
          variant="ghost"
          onClick={handleBack}
          className="mb-6 -ml-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Programs
        </Button>

        <div className="flex items-center justify-center">
          <Card className="w-full max-w-md shadow-md">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold underline underline-offset-4 decoration-2">
                {isEditMode ? 'Edit Program' : 'Add Program'}
              </CardTitle>
            </CardHeader>

            <CardContent>
              {loading ? (
                <p className="text-muted-foreground">Loading program...</p>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="programName">
                      Program Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="programName"
                      type="text"
                      placeholder="e.g., B.Tech, M.Tech, MCA, MBA"
                      value={programName}
                      onChange={(e) => setProgramName(e.target.value)}
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
                    <Button type="submit" disabled={submitting}>
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
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProgramFormPage;