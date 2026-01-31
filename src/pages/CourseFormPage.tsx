import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import MainLayout from '@/components/layout/MainLayout';
import { coursesApi, Course } from '@/services/api';

const CourseFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const { toast } = useToast();

  const isEditMode = Boolean(id);
  const courseFromState = location.state?.course as Course | undefined;

  const [courseCode, setCourseCode] = useState('');
  const [courseTitle, setCourseTitle] = useState('');
  const [credits, setCredits] = useState<number | ''>('');
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditMode && courseFromState) {
      setCourseCode(courseFromState.course_code);
      setCourseTitle(courseFromState.course_title);
      setCredits(courseFromState.credits);
    } else if (isEditMode && id) {
      // Fetch from API if not passed via state
      fetchCourse(parseInt(id));
    }
  }, [isEditMode, courseFromState, id]);

  const fetchCourse = async (courseId: number) => {
    try {
      setLoading(true);
      const courses = await coursesApi.getAll();
      const course = courses.find((c) => c.id === courseId);
      if (course) {
        setCourseCode(course.course_code);
        setCourseTitle(course.course_title);
        setCredits(course.credits);
      } else {
        toast({
          title: 'Error',
          description: 'Course not found.',
          variant: 'destructive',
        });
        navigate('/courses');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch course data.',
        variant: 'destructive',
      });
      navigate('/courses');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedCode = courseCode.trim();
    const trimmedTitle = courseTitle.trim();

    if (!trimmedCode || !trimmedTitle || credits === '') {
      toast({
        title: 'Validation Error',
        description: 'All fields are required.',
        variant: 'destructive',
      });
      return;
    }

    if (typeof credits === 'number' && (credits < 1 || credits > 10)) {
      toast({
        title: 'Validation Error',
        description: 'Credits must be between 1 and 10.',
        variant: 'destructive',
      });
      return;
    }

    setSubmitting(true);

    try {
      if (isEditMode && id) {
        await coursesApi.update(parseInt(id), {
          course_code: trimmedCode,
          course_title: trimmedTitle,
          credits: credits as number,
        });
        toast({
          title: 'Success',
          description: 'Course updated successfully.',
        });
      } else {
        await coursesApi.create({
          course_code: trimmedCode,
          course_title: trimmedTitle,
          credits: credits as number,
        });
        toast({
          title: 'Success',
          description: 'Course added successfully.',
        });
      }
      navigate('/courses');
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${isEditMode ? 'update' : 'add'} course.`,
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate('/courses');
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
          Back to Courses
        </Button>

        {/* Form Card */}
        <div className="flex items-center justify-center">
          <Card className="w-full max-w-md shadow-md">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold underline underline-offset-4 decoration-2">
                {isEditMode ? 'Edit Course' : 'Add Course'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="courseCode" className="text-sm font-medium">
                    Course Code <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="courseCode"
                    type="text"
                    placeholder="e.g., CS101"
                    value={courseCode}
                    onChange={(e) => setCourseCode(e.target.value)}
                    disabled={submitting}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="courseTitle" className="text-sm font-medium">
                    Course Title <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="courseTitle"
                    type="text"
                    placeholder="e.g., Introduction to Computer Science"
                    value={courseTitle}
                    onChange={(e) => setCourseTitle(e.target.value)}
                    disabled={submitting}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="credits" className="text-sm font-medium">
                    Credits <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="credits"
                    type="number"
                    min="1"
                    max="10"
                    placeholder="e.g., 3"
                    value={credits}
                    onChange={(e) =>
                      setCredits(e.target.value === '' ? '' : parseInt(e.target.value))
                    }
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

export default CourseFormPage;
