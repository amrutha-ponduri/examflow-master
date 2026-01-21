import { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Check, Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CategoryConfig {
  id: string;
  numberOfQuestions: number;
  marksPerQuestion: number;
}

const QuestionGeneration = () => {
  const { toast } = useToast();
  const [moduleNumber, setModuleNumber] = useState('');
  const [numberOfCategories, setNumberOfCategories] = useState('');
  const [categoriesConfirmed, setCategoriesConfirmed] = useState(false);
  const [categories, setCategories] = useState<CategoryConfig[]>([]);

  const handleConfirmCategories = () => {
    const numCategories = parseInt(numberOfCategories);
    if (isNaN(numCategories) || numCategories < 1 || numCategories > 10) {
      toast({
        title: 'Invalid Input',
        description: 'Please enter a valid number of categories (1-10)',
        variant: 'destructive',
      });
      return;
    }

    const newCategories: CategoryConfig[] = Array.from({ length: numCategories }, (_, i) => ({
      id: `cat-${i + 1}`,
      numberOfQuestions: 0,
      marksPerQuestion: 0,
    }));

    setCategories(newCategories);
    setCategoriesConfirmed(true);
  };

  const updateCategory = (index: number, field: 'numberOfQuestions' | 'marksPerQuestion', value: string) => {
    const numValue = parseInt(value) || 0;
    setCategories((prev) =>
      prev.map((cat, i) => (i === index ? { ...cat, [field]: numValue } : cat))
    );
  };

  const handleGenerate = () => {
    if (!moduleNumber) {
      toast({
        title: 'Invalid Input',
        description: 'Please enter a module number',
        variant: 'destructive',
      });
      return;
    }

    const isValid = categories.every((cat) => cat.numberOfQuestions > 0 && cat.marksPerQuestion > 0);
    if (!isValid) {
      toast({
        title: 'Invalid Configuration',
        description: 'Please fill in all category details',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Questions Generated',
      description: `Successfully generated question template for Module ${moduleNumber}`,
    });
  };

  const handleReset = () => {
    setModuleNumber('');
    setNumberOfCategories('');
    setCategoriesConfirmed(false);
    setCategories([]);
  };

  return (
    <MainLayout>
      <div className="space-y-6 max-w-3xl">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Question Generation</h1>
          <p className="text-muted-foreground mt-1">
            Configure the structure for generating question papers
          </p>
        </div>

        {/* Module Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>Module Configuration</CardTitle>
            <CardDescription>Enter the module number and configure categories</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Module Number Input */}
            <div className="space-y-2">
              <Label htmlFor="moduleNumber">Module Number</Label>
              <Input
                id="moduleNumber"
                type="number"
                min="1"
                placeholder="Enter module number"
                value={moduleNumber}
                onChange={(e) => setModuleNumber(e.target.value.replace(/\D/g, ''))}
                className="max-w-xs"
              />
            </div>

            {/* Number of Categories Input */}
            <div className="space-y-2">
              <Label htmlFor="numCategories">Number of Categories</Label>
              <div className="flex items-center gap-3">
                <Input
                  id="numCategories"
                  type="number"
                  min="1"
                  max="10"
                  placeholder="Enter number of categories"
                  value={numberOfCategories}
                  onChange={(e) => {
                    setNumberOfCategories(e.target.value.replace(/\D/g, ''));
                    setCategoriesConfirmed(false);
                  }}
                  className="max-w-xs"
                  disabled={categoriesConfirmed}
                />
                <Button
                  size="icon"
                  onClick={handleConfirmCategories}
                  disabled={!numberOfCategories || categoriesConfirmed}
                  className="flex-shrink-0"
                >
                  <Check className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Category Configuration */}
        {categoriesConfirmed && categories.length > 0 && (
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle>Category Configuration</CardTitle>
              <CardDescription>Configure questions and marks for each category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categories.map((category, index) => (
                  <div
                    key={category.id}
                    className="p-4 bg-muted/50 rounded-lg border border-border"
                  >
                    <h4 className="font-medium text-foreground mb-4">Category {index + 1}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`questions-${index}`}>Number of Questions</Label>
                        <Input
                          id={`questions-${index}`}
                          type="number"
                          min="1"
                          placeholder="Enter number"
                          value={category.numberOfQuestions || ''}
                          onChange={(e) =>
                            updateCategory(index, 'numberOfQuestions', e.target.value.replace(/\D/g, ''))
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`marks-${index}`}>Marks per Question</Label>
                        <Input
                          id={`marks-${index}`}
                          type="number"
                          min="1"
                          placeholder="Enter marks"
                          value={category.marksPerQuestion || ''}
                          onChange={(e) =>
                            updateCategory(index, 'marksPerQuestion', e.target.value.replace(/\D/g, ''))
                          }
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-4 mt-6 pt-6 border-t border-border">
                <Button onClick={handleGenerate}>
                  <Plus className="h-4 w-4 mr-2" />
                  Generate Template
                </Button>
                <Button variant="outline" onClick={handleReset}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
};

export default QuestionGeneration;
