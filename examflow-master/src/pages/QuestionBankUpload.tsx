import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import { Check, Plus, Trash2, Save, Eye, Upload, Image } from 'lucide-react';

interface Question {
  id: string;
  sno: number;
  content: string;
  imageUrl?: string;
}

interface Category {
  id: string;
  categoryNumber: number;
  marks: number;
  numberOfQuestions: number;
  questions: Question[];
  confirmed: boolean;
}

interface Module {
  id: string;
  moduleNumber: number;
  categories: Category[];
}

const QuestionBankUpload = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Step 1: Module Setup
  const [numberOfModules, setNumberOfModules] = useState('');
  const [modulesConfirmed, setModulesConfirmed] = useState(false);
  const [modules, setModules] = useState<Module[]>([]);

  // Step 2: Category Setup
  const [selectedModuleId, setSelectedModuleId] = useState('');
  const [numCategories, setNumCategories] = useState('');

  // Step 3: Question Management
  const [selectedCategoryId, setSelectedCategoryId] = useState('');

  // Modals
  const [deleteQuestionId, setDeleteQuestionId] = useState<string | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Step 1: Confirm Modules
  const handleConfirmModules = () => {
    const num = parseInt(numberOfModules);
    if (isNaN(num) || num < 1 || num > 10) {
      toast({
        title: 'Invalid Input',
        description: 'Please enter a valid number of modules (1-10)',
        variant: 'destructive',
      });
      return;
    }

    const newModules: Module[] = Array.from({ length: num }, (_, i) => ({
      id: `module-${i + 1}`,
      moduleNumber: i + 1,
      categories: [],
    }));

    setModules(newModules);
    setModulesConfirmed(true);
  };

  // Step 2: Category Setup Functions
  const handleConfirmCategories = () => {
    if (!selectedModuleId) return;
    
    const num = parseInt(numCategories);
    if (isNaN(num) || num < 1 || num > 10) {
      toast({
        title: 'Invalid Input',
        description: 'Please enter a valid number of categories (1-10)',
        variant: 'destructive',
      });
      return;
    }

    setModules((prev) =>
      prev.map((mod) => {
        if (mod.id === selectedModuleId) {
          const existingCategories = mod.categories.length;
          const newCategories: Category[] = Array.from({ length: num }, (_, i) => ({
            id: `${mod.id}-cat-${existingCategories + i + 1}`,
            categoryNumber: existingCategories + i + 1,
            marks: 0,
            numberOfQuestions: 0,
            questions: [],
            confirmed: false,
          }));
          return { ...mod, categories: [...mod.categories, ...newCategories] };
        }
        return mod;
      })
    );
    setNumCategories('');
  };

  const updateCategoryConfig = (
    moduleId: string,
    categoryId: string,
    field: 'marks' | 'numberOfQuestions',
    value: string
  ) => {
    const numValue = parseInt(value) || 0;
    setModules((prev) =>
      prev.map((mod) => {
        if (mod.id === moduleId) {
          return {
            ...mod,
            categories: mod.categories.map((cat) =>
              cat.id === categoryId ? { ...cat, [field]: numValue } : cat
            ),
          };
        }
        return mod;
      })
    );
  };

  const confirmCategory = (moduleId: string, categoryId: string) => {
    setModules((prev) =>
      prev.map((mod) => {
        if (mod.id === moduleId) {
          return {
            ...mod,
            categories: mod.categories.map((cat) => {
              if (cat.id === categoryId) {
                const questions: Question[] = Array.from(
                  { length: cat.numberOfQuestions },
                  (_, i) => ({
                    id: `${cat.id}-q-${i + 1}`,
                    sno: i + 1,
                    content: '',
                  })
                );
                return { ...cat, questions, confirmed: true };
              }
              return cat;
            }),
          };
        }
        return mod;
      })
    );
  };

  // Step 3: Question Management Functions
  const getSelectedCategory = (): Category | undefined => {
    for (const mod of modules) {
      const cat = mod.categories.find((c) => c.id === selectedCategoryId);
      if (cat) return cat;
    }
    return undefined;
  };

  const getSelectedModuleForCategory = (): Module | undefined => {
    return modules.find((mod) =>
      mod.categories.some((c) => c.id === selectedCategoryId)
    );
  };

  const updateQuestion = (questionId: string, content: string) => {
    setModules((prev) =>
      prev.map((mod) => ({
        ...mod,
        categories: mod.categories.map((cat) => ({
          ...cat,
          questions: cat.questions.map((q) =>
            q.id === questionId ? { ...q, content } : q
          ),
        })),
      }))
    );
  };

  const addQuestion = () => {
    const mod = getSelectedModuleForCategory();
    const cat = getSelectedCategory();
    if (!mod || !cat) return;

    const newQuestion: Question = {
      id: `${cat.id}-q-${Date.now()}`,
      sno: cat.questions.length + 1,
      content: '',
    };

    setModules((prev) =>
      prev.map((m) => {
        if (m.id === mod.id) {
          return {
            ...m,
            categories: m.categories.map((c) =>
              c.id === cat.id
                ? { ...c, questions: [...c.questions, newQuestion] }
                : c
            ),
          };
        }
        return m;
      })
    );
  };

  const deleteQuestion = (questionId: string) => {
    setModules((prev) =>
      prev.map((mod) => ({
        ...mod,
        categories: mod.categories.map((cat) => ({
          ...cat,
          questions: cat.questions
            .filter((q) => q.id !== questionId)
            .map((q, i) => ({ ...q, sno: i + 1 })),
        })),
      }))
    );
    setDeleteQuestionId(null);
  };

  const handleSave = () => {
    toast({
      title: 'Saved',
      description: 'Question bank draft has been saved.',
    });
  };

  const handleUpload = () => {
    setShowUploadModal(false);
    toast({
      title: 'Uploaded',
      description: 'Question bank has been uploaded successfully.',
    });
    navigate('/faculty');
  };

  const selectedCategory = getSelectedCategory();

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Upload Question Bank</h1>
            <p className="text-muted-foreground mt-1">Create and upload a new question bank</p>
          </div>
          {modulesConfirmed && (
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Save Draft
              </Button>
              <Button variant="outline" onClick={() => navigate('/question-bank/preview')}>
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button onClick={() => setShowUploadModal(true)}>
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </Button>
            </div>
          )}
        </div>

        {/* Step 1: Module Setup */}
        <Card>
          <CardHeader>
            <CardTitle>Step 1: Module Setup</CardTitle>
            <CardDescription>Define the number of modules in your question bank</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-3">
              <div className="space-y-2 flex-1 max-w-xs">
                <Label htmlFor="numModules">Number of Modules</Label>
                <Input
                  id="numModules"
                  type="number"
                  min="1"
                  max="10"
                  placeholder="Enter number of modules"
                  value={numberOfModules}
                  onChange={(e) => setNumberOfModules(e.target.value.replace(/\D/g, ''))}
                  disabled={modulesConfirmed}
                />
              </div>
              <Button
                onClick={handleConfirmModules}
                disabled={!numberOfModules || modulesConfirmed}
              >
                <Check className="h-4 w-4 mr-2" />
                Confirm
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Step 2: Category Setup */}
        {modulesConfirmed && (
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle>Step 2: Category Setup</CardTitle>
              <CardDescription>Configure categories for each module</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Module Selection & Category Count */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Select Module</Label>
                  <Select value={selectedModuleId} onValueChange={setSelectedModuleId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select module" />
                    </SelectTrigger>
                    <SelectContent>
                      {modules.map((mod) => (
                        <SelectItem key={mod.id} value={mod.id}>
                          Module {mod.moduleNumber}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Number of Categories</Label>
                  <Input
                    type="number"
                    min="1"
                    max="10"
                    placeholder="Enter number"
                    value={numCategories}
                    onChange={(e) => setNumCategories(e.target.value.replace(/\D/g, ''))}
                    disabled={!selectedModuleId}
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    onClick={handleConfirmCategories}
                    disabled={!selectedModuleId || !numCategories}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Add Categories
                  </Button>
                </div>
              </div>

              {/* Categories per Module */}
              {modules.map(
                (mod) =>
                  mod.categories.length > 0 && (
                    <div key={mod.id} className="space-y-3">
                      <h4 className="font-semibold text-foreground">Module {mod.moduleNumber}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {mod.categories.map((cat) => (
                          <div
                            key={cat.id}
                            className={`p-4 rounded-lg border ${
                              cat.confirmed
                                ? 'bg-success/5 border-success/20'
                                : 'bg-muted/50 border-border'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-3">
                              <span className="font-medium">Category {cat.categoryNumber}</span>
                              {cat.confirmed && (
                                <span className="text-xs text-success font-medium">✓ Configured</span>
                              )}
                            </div>
                            <div className="space-y-3">
                              <div className="space-y-1">
                                <Label className="text-xs">Marks</Label>
                                <Input
                                  type="number"
                                  min="1"
                                  placeholder="Marks"
                                  value={cat.marks || ''}
                                  onChange={(e) =>
                                    updateCategoryConfig(mod.id, cat.id, 'marks', e.target.value)
                                  }
                                  disabled={cat.confirmed}
                                  className="h-9"
                                />
                              </div>
                              <div className="flex items-end gap-2">
                                <div className="flex-1 space-y-1">
                                  <Label className="text-xs">Questions</Label>
                                  <Input
                                    type="number"
                                    min="1"
                                    placeholder="Count"
                                    value={cat.numberOfQuestions || ''}
                                    onChange={(e) =>
                                      updateCategoryConfig(
                                        mod.id,
                                        cat.id,
                                        'numberOfQuestions',
                                        e.target.value
                                      )
                                    }
                                    disabled={cat.confirmed}
                                    className="h-9"
                                  />
                                </div>
                                {!cat.confirmed && (
                                  <Button
                                    size="sm"
                                    onClick={() => confirmCategory(mod.id, cat.id)}
                                    disabled={!cat.marks || !cat.numberOfQuestions}
                                  >
                                    <Check className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
              )}
            </CardContent>
          </Card>
        )}

        {/* Step 3: Question Management */}
        {modulesConfirmed && modules.some((m) => m.categories.some((c) => c.confirmed)) && (
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle>Step 3: Question Management</CardTitle>
              <CardDescription>Add and edit questions for each category</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Category Selection */}
              <div className="space-y-2 max-w-md">
                <Label>Select Category</Label>
                <Select value={selectedCategoryId} onValueChange={setSelectedCategoryId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category to manage questions" />
                  </SelectTrigger>
                  <SelectContent>
                    {modules.map((mod) =>
                      mod.categories
                        .filter((c) => c.confirmed)
                        .map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            Module {mod.moduleNumber} - Category {cat.categoryNumber} ({cat.marks}{' '}
                            marks)
                          </SelectItem>
                        ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Questions Table */}
              {selectedCategory && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">
                      Questions ({selectedCategory.marks} marks each)
                    </h4>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button size="sm" onClick={addQuestion}>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Question
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Add a new question to this category</TooltipContent>
                    </Tooltip>
                  </div>

                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="w-16">SNO</TableHead>
                        <TableHead>Question Content</TableHead>
                        <TableHead className="w-24 text-center">Image</TableHead>
                        <TableHead className="w-16 text-center">Delete</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedCategory.questions.map((question) => (
                        <TableRow key={question.id}>
                          <TableCell className="font-medium">{question.sno}</TableCell>
                          <TableCell>
                            <Textarea
                              placeholder="Enter question content..."
                              value={question.content}
                              onChange={(e) => updateQuestion(question.id, e.target.value)}
                              rows={2}
                              className="min-h-[60px]"
                            />
                          </TableCell>
                          <TableCell className="text-center">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <Image className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Upload image for this question</TooltipContent>
                            </Tooltip>
                          </TableCell>
                          <TableCell className="text-center">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-destructive hover:text-destructive"
                                  onClick={() => setDeleteQuestionId(question.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Delete this question</TooltipContent>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  <div className="flex justify-center pt-4">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" onClick={addQuestion}>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Question
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Add a new question to this category</TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              )}

              {/* Formula Editor Panel */}
              <div className="border border-border rounded-lg p-4 bg-muted/30">
                <h4 className="font-semibold mb-3">Formula Editor</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Use CodeCogs Formula Editor to create mathematical formulas and copy them into
                  your questions.
                </p>
                <Button
                  variant="outline"
                  onClick={() => window.open('https://editor.codecogs.com/', '_blank')}
                >
                  Open Formula Editor
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Delete Question Modal */}
      <ConfirmModal
        open={!!deleteQuestionId}
        onOpenChange={(open) => !open && setDeleteQuestionId(null)}
        title="Delete Question"
        description="Do you want to delete this question? This action cannot be undone."
        confirmText="Yes, Delete"
        cancelText="No, Keep"
        onConfirm={() => deleteQuestionId && deleteQuestion(deleteQuestionId)}
        variant="destructive"
      />

      {/* Upload Confirmation Modal */}
      <ConfirmModal
        open={showUploadModal}
        onOpenChange={setShowUploadModal}
        title="Upload Question Bank"
        description="Are you sure you want to upload this question bank? It will be submitted for review."
        confirmText="Upload"
        onConfirm={handleUpload}
      />
    </MainLayout>
  );
};

export default QuestionBankUpload;
