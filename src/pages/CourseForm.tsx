import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface CourseData {
    courseCode: string;
    courseTitle: string;
    credits: number | '';
}

const CourseForm = () => {
    const { toast } = useToast();
    const [formData, setFormData] = useState<CourseData>({
        courseCode: '',
        courseTitle: '',
        credits: '',
    });

    const handleInputChange = (field: keyof CourseData, value: string) => {
        if (field === 'credits') {
            const numValue = value === '' ? '' : parseInt(value.replace(/\D/g, ''));
            setFormData((prev) => ({ ...prev, [field]: numValue }));
        } else {
            setFormData((prev) => ({ ...prev, [field]: value }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.courseCode.trim() || !formData.courseTitle.trim() || formData.credits === '') {
            toast({
                title: 'Validation Error',
                description: 'Please fill in all fields',
                variant: 'destructive',
            });
            return;
        }

        toast({
            title: 'Course Added',
            description: `${formData.courseCode} - ${formData.courseTitle} has been added successfully.`,
        });

        // Reset form
        setFormData({ courseCode: '', courseTitle: '', credits: '' });
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <Card className="w-full max-w-md card-elevated">
                <CardHeader className="pb-4">
                    <CardTitle className="text-xl font-bold text-foreground">Course</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="courseCode" className="text-muted-foreground">
                                Course Code
                            </Label>
                            <Input
                                id="courseCode"
                                type="text"
                                placeholder="e.g., CS101"
                                value={formData.courseCode}
                                onChange={(e) => handleInputChange('courseCode', e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="courseTitle" className="text-muted-foreground">
                                Course Title
                            </Label>
                            <Input
                                id="courseTitle"
                                type="text"
                                placeholder="e.g., Introduction to Computer Science"
                                value={formData.courseTitle}
                                onChange={(e) => handleInputChange('courseTitle', e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="credits" className="text-muted-foreground">
                                Credits
                            </Label>
                            <Input
                                id="credits"
                                type="number"
                                min="1"
                                max="10"
                                placeholder="e.g., 3"
                                value={formData.credits}
                                onChange={(e) => handleInputChange('credits', e.target.value)}
                            />
                            {/* <p className="text-xs text-muted-foreground">number</p> */}
                        </div>

                        <div className="flex justify-end pt-2">
                            <Button type="submit">Add Course</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default CourseForm;
