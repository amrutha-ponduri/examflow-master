import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import MainLayout from '@/components/layout/MainLayout';
import { departmentsApi, usersApi, Department } from '@/services/api';

interface UserDropdown {
  id: number;
  username: string;
  name: string;
}

const DepartmentFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const { toast } = useToast();

  const isEditMode = Boolean(id);
  const departmentFromState = location.state?.department as Department | undefined;

  const [departmentName, setDepartmentName] = useState('');
  const [abbreviation, setAbbreviation] = useState('');
  const [reviewerId, setReviewerId] = useState('');
  const [users, setUsers] = useState<UserDropdown[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (isEditMode && departmentFromState && users.length > 0) {
      setDepartmentName(departmentFromState.department_name);
      setAbbreviation(departmentFromState.abbreviation || '');
      // Find reviewer by name
      const reviewer = users.find((u) => u.name === departmentFromState.reviewer_name);
      if (reviewer) {
        setReviewerId(reviewer.id.toString());
      }
    }
  }, [isEditMode, departmentFromState, users]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await usersApi.getDropdown();
      setUsers(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch users.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedName = departmentName.trim();
    const trimmedAbbr = abbreviation.trim().toUpperCase();

    if (!trimmedName || !trimmedAbbr || !reviewerId) {
      toast({
        title: 'Validation Error',
        description: 'All fields are required.',
        variant: 'destructive',
      });
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        department: {
          department_name: trimmedName,
          abbreviation: trimmedAbbr,
        },
        user_id: parseInt(reviewerId),
      };

      if (isEditMode && id) {
        await departmentsApi.update(parseInt(id), payload);
        toast({
          title: 'Success',
          description: 'Department updated successfully.',
        });
      } else {
        await departmentsApi.create(payload);
        toast({
          title: 'Success',
          description: 'Department added successfully.',
        });
      }
      navigate('/departments');
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${isEditMode ? 'update' : 'add'} department.`,
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate('/departments');
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

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
          Back to Departments
        </Button>

        {/* Form Card */}
        <div className="flex items-center justify-center">
          <Card className="w-full max-w-md shadow-md">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold underline underline-offset-4 decoration-2">
                {isEditMode ? 'Edit Department' : 'Add Department'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="departmentName" className="text-sm font-medium">
                    Department Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="departmentName"
                    type="text"
                    placeholder="Enter department name"
                    value={departmentName}
                    onChange={(e) => setDepartmentName(e.target.value)}
                    disabled={submitting}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="abbreviation" className="text-sm font-medium">
                    Abbreviation <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="abbreviation"
                    type="text"
                    placeholder="e.g., CSE, ECE, ME"
                    value={abbreviation}
                    onChange={(e) => setAbbreviation(e.target.value.toUpperCase())}
                    disabled={submitting}
                    maxLength={10}
                    className="uppercase"
                  />
                  <p className="text-xs text-muted-foreground">
                    Short code for the department (auto-uppercase)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reviewer" className="text-sm font-medium">
                    Reviewer <span className="text-destructive">*</span>
                  </Label>
                  <Select value={reviewerId} onValueChange={setReviewerId} disabled={submitting}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a reviewer" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover z-50">
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.id.toString()}>
                          {user.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                    ) : isEditMode ? (
                      'Update'
                    ) : (
                      'Add'
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

export default DepartmentFormPage;
