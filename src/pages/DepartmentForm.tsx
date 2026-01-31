import React, { useState, useEffect } from 'react';
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
import { useToast } from '@/hooks/use-toast';
import { mockUsers } from '@/data/mockData';

interface DepartmentData {
  departmentName: string;
  abbreviation: string;
  reviewerId: string;
}

const DepartmentForm: React.FC = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState(mockUsers);
  const [formData, setFormData] = useState<DepartmentData>({
    departmentName: '',
    abbreviation: '',
    reviewerId: '',
  });

  useEffect(() => {
    setUsers(mockUsers);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'abbreviation') {
      setFormData(prev => ({
        ...prev,
        [name]: value.toUpperCase(),
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleReviewerChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      reviewerId: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.departmentName.trim() || !formData.abbreviation.trim() || !formData.reviewerId) {
      toast({
        title: 'Validation Error',
        description: 'All fields are required.',
        variant: 'destructive',
      });
      return;
    }

    console.log('Department data:', formData);

    toast({
      title: 'Success',
      description: 'Department added successfully.',
    });

    setFormData({
      departmentName: '',
      abbreviation: '',
      reviewerId: '',
    });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-md">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold underline underline-offset-4 decoration-2">
            Department
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
                name="departmentName"
                type="text"
                placeholder="Enter department name"
                value={formData.departmentName}
                onChange={handleInputChange}
                required
                className="bg-background"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="abbreviation" className="text-sm font-medium">
                Abbreviation <span className="text-destructive">*</span>
              </Label>
              <Input
                id="abbreviation"
                name="abbreviation"
                type="text"
                placeholder="e.g., CSE, ECE, ME"
                value={formData.abbreviation}
                onChange={handleInputChange}
                required
                maxLength={10}
                className="bg-background uppercase"
              />
              <p className="text-xs text-muted-foreground">
                Short code for the department (auto-uppercase)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reviewer" className="text-sm font-medium">
                Reviewer <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.reviewerId}
                onValueChange={handleReviewerChange}
                required
              >
                <SelectTrigger className="w-full bg-background">
                  <SelectValue placeholder="Select a reviewer" />
                </SelectTrigger>
                <SelectContent className="bg-popover z-50">
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name} ({user.role})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit" className="px-6">
                Add Department
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default DepartmentForm;
