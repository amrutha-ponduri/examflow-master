import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
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

interface SubBlock {
  id: string;
  content: string;
  imageUrls: string[];
}

interface Question {
  id: string;
  sno: number;
  blocks: SubBlock[];
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

interface DepartmentDropdown {
  id: string;
  abbreviation: string;
}

interface CourseDropdown {
  id: string;
  course_code: string;
  course_title: string;
}

interface ProgramDropdown {
  id: string;
  program_name: string;
}

interface RegulationDropdown {
  id: string;
  regulation: string;
}

interface SectionRule {
  section_name: string;
  min_questions_count: number;
  marks: number;
}




const renderLatex = (text: string) => {
  const parts = text.split(/(\$[^$]+\$)/g);

  return parts.map((part, i) => {
    if (part.startsWith('$') && part.endsWith('$')) {
      return <InlineMath key={i} math={part.slice(1, -1)} />;
    }
    return <span key={i}>{part}</span>;
  });
};

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

  const [department, setDepartment] = useState<string>("");
  const [course, setCourse] = useState<string>("");
  const [program, setProgram] = useState<string>("");
  const [regulation, setRegulation] = useState<string>("");


  const [departments, setDepartments] = useState<DepartmentDropdown[]>([]);
  const [courses, setCourses] = useState<CourseDropdown[]>([]);
  const [programs, setPrograms] = useState<ProgramDropdown[]>([]);
  const [regulations, setRegulations] = useState<RegulationDropdown[]>([]);

  const [configLoaded, setConfigLoaded] = useState(false);
  const [minQuestionsMap, setMinQuestionsMap] = useState<Record<string, number>>({});


  const fetchConfiguration = async () => {
    try {
      // 🔍 Frontend validation (important)
      if (!department || !course || !program || !regulation) {
        toast({
          title: "Missing selection",
          description: "Please select Department, Course, Program and Regulation",
          variant: "destructive",
        });
        return;
      }

      const res = await fetch(
        "http://localhost:8080/questionbanks/configuration_details",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            department_id: Number(department),
            course_id: Number(course),
            program_id: Number(program),
            regulation_id: Number(regulation),
          }),
        }
      );

      // 🔴 Handle backend errors explicitly
      if (!res.ok) {
        const errorText = await res.text();
        console.error("Backend error:", errorText);

        throw new Error(`Backend responded with ${res.status}`);
      }

      const data = await res.json();
      console.log("Config response:", data);

      // ✅ SAFETY CHECK
      if (!data.module_info || !data.section_rules) {
        throw new Error("Invalid configuration response");
      }

      // 🔹 Build modules
      const backendModules: Module[] = data.modules_info.map((m: any) => ({
        id: `module-${m.module_no}`,
        moduleNumber: m.module_no,
        categories: data.sections_rules.map((sec: any, idx: number) => ({
          id: `module-${m.module_no}-cat-${idx + 1}`,
          categoryNumber: idx + 1,
          marks: sec.marks,
          numberOfQuestions: sec.min_questions_count,
          confirmed: true,
          questions: Array.from(
            { length: sec.min_questions_count },
            (_, i) => ({
              id: `m${m.module_no}-c${idx + 1}-q${i + 1}`,
              sno: i + 1,
              blocks: [
                {
                  id: crypto.randomUUID(),
                  content: "",
                  imageUrls: [],
                },
              ],
            })
          ),
        })),
      }));

      setModules(backendModules);
      setModulesConfirmed(true);
      setConfigLoaded(true);
    } catch (err: any) {
      console.error("Fetch config failed:", err);

      toast({
        title: "Configuration error",
        description:
          err?.message || "Failed to load question bank configuration",
        variant: "destructive",
      });
    }
  };


  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const baseUrl = "http://localhost:8080";

        const [
          deptRes,
          courseRes,
          programRes,
          regulationRes,
        ] = await Promise.all([
          fetch(`${baseUrl}/departments/dropdown`),
          fetch(`${baseUrl}/courses/dropdown`),
          fetch(`${baseUrl}/programs/dropdown`),
          fetch(`${baseUrl}/regulations/dropdown`),
        ]);

        if (!deptRes.ok || !courseRes.ok || !programRes.ok || !regulationRes.ok) {
          throw new Error("Failed to fetch dropdown data");
        }

        setDepartments(await deptRes.json());
        setCourses(await courseRes.json());
        setPrograms(await programRes.json());
        setRegulations(await regulationRes.json());
      } catch (error) {
        console.error(error);
        toast({
          title: "Error",
          description: "Failed to load dropdown data",
          variant: "destructive",
        });
      }
    };

    fetchDropdowns();
  }, []);



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
                    blocks: [
                      {
                        id: crypto.randomUUID(),
                        content: '',
                        imageUrls: [],
                      },
                    ],
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
      blocks: [
        {
          id: crypto.randomUUID(),
          content: '',
          imageUrls: [],
        },
      ],
    };

    setModules((prev) =>
      prev.map((m) =>
        m.id === mod.id
          ? {
            ...m,
            categories: m.categories.map((c) =>
              c.id === cat.id
                ? { ...c, questions: [...c.questions, newQuestion] }
                : c
            ),
          }
          : m
      )
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
    for (const mod of modules) {
      for (const cat of mod.categories) {
        const minRequired = cat.numberOfQuestions;

        if (cat.questions.length < minRequired) {
          toast({
            title: "Not enough questions",
            description: `Module ${mod.moduleNumber}, Category ${cat.categoryNumber} requires at least ${minRequired} questions`,
            variant: "destructive",
          });
          return;
        }
      }
    }

    // ✅ All validations passed
    toast({
      title: "Uploaded",
      description: "Question bank uploaded successfully",
    });

    navigate("/faculty");
  };


  const selectedCategory = getSelectedCategory();

  const uploadBlockImage = async (
    questionId: string,
    blockId: string,
    file: File
  ) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "Images_set");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dpga42aiq/image/upload",
      { method: "POST", body: data }
    );

    const result = await res.json();

    setModules(prev =>
      prev.map(mod => ({
        ...mod,
        categories: mod.categories.map(cat => ({
          ...cat,
          questions: cat.questions.map(q =>
            q.id === questionId
              ? {
                ...q,
                blocks: q.blocks.map(b =>
                  b.id === blockId
                    ? { ...b, imageUrls: [...b.imageUrls, result.secure_url] }
                    : b
                ),
              }
              : q
          ),
        })),
      }))
    );
  };





  const removeBlockImage = (
    questionId: string,
    blockId: string,
    index: number
  ) => {
    setModules(prev =>
      prev.map(mod => ({
        ...mod,
        categories: mod.categories.map(cat => ({
          ...cat,
          questions: cat.questions.map(q =>
            q.id === questionId
              ? {
                ...q,
                blocks: q.blocks.map(b =>
                  b.id === blockId
                    ? {
                      ...b,
                      imageUrls: b.imageUrls.filter((_, i) => i !== index),
                    }
                    : b
                ),
              }
              : q
          ),
        })),
      }))
    );
  };




  const addBlock = (questionId: string) => {
    setModules(prev =>
      prev.map(mod => ({
        ...mod,
        categories: mod.categories.map(cat => ({
          ...cat,
          questions: cat.questions.map(q =>
            q.id === questionId
              ? {
                ...q,
                blocks: [
                  ...q.blocks,
                  {
                    id: crypto.randomUUID(),
                    content: '',
                    imageUrls: [],
                  },
                ],
              }
              : q
          ),
        })),
      }))
    );
  };


  const updateBlockContent = (
    questionId: string,
    blockId: string,
    value: string
  ) => {
    setModules(prev =>
      prev.map(mod => ({
        ...mod,
        categories: mod.categories.map(cat => ({
          ...cat,
          questions: cat.questions.map(q =>
            q.id === questionId
              ? {
                ...q,
                blocks: q.blocks.map(b =>
                  b.id === blockId
                    ? { ...b, content: value }
                    : b
                ),
              }
              : q
          ),
        })),
      }))
    );
  };





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
            <CardTitle>Select Program, Department, Regulation</CardTitle>
            <CardDescription>
              Choose the academic structure for the question bank
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

              {/* Regulation */}
              <div className="space-y-2">
                <Label htmlFor="regulation">Regulation</Label>
                <select
                  id="regulation"
                  value={regulation}
                  onChange={(e) => setRegulation(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">Select Regulation</option>
                  {regulations.map((reg) => (
                    <option key={reg.id} value={reg.id}>
                      {reg.regulation}
                    </option>
                  ))}
                </select>

              </div>

              {/* Department */}
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <select
                  id="department"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.abbreviation}
                    </option>
                  ))}
                </select>

              </div>

              <div className="space-y-2">
                <Label htmlFor="course">Course</Label>
                <select
                  id="course"
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">Select Course</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.course_code}-{course.course_title}
                    </option>
                  ))}
                </select>

              </div>

              {/* Program */}
              <div className="space-y-2">
                <Label htmlFor="program">Program</Label>
                <select
                  id="program"
                  value={program}
                  onChange={(e) => setProgram(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">Select Program</option>
                  {programs.map((prog) => (
                    <option key={prog.id} value={prog.id}>
                      {prog.program_name}
                    </option>
                  ))}
                </select>

              </div>

            </div>
          </CardContent>

        </Card>

        <Card><Button onClick={fetchConfiguration}>
          Load Question Pattern
        </Button>
        </Card>
        {/* Step 3: Question Management */}
        {configLoaded && (
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
                        <TableHead className="w-16 text-center">Delete</TableHead>
                        <TableHead className="w-16 text-center">Add</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedCategory.questions.map((question) => (
                        <TableRow key={question.id}>
                          <TableCell className="font-medium">{question.sno}</TableCell>
                          <TableCell>
                            <div className="space-y-4">

                              {question.blocks.map((block) => (
                                <div
                                  key={block.id}
                                  className="p-3 border rounded-md space-y-2"
                                >
                                  {/* Textarea */}
                                  <Textarea
                                    placeholder="Enter content (LaTeX supported)"
                                    value={block.content}
                                    onChange={(e) =>
                                      updateBlockContent(question.id, block.id, e.target.value)
                                    }
                                    rows={3}
                                  />

                                  {/* LaTeX Preview */}
                                  {block.content && (
                                    <div className="p-2 bg-muted rounded-md text-sm">
                                      <span className="text-xs text-muted-foreground block mb-1">
                                        Preview:
                                      </span>
                                      {renderLatex(block.content)}
                                    </div>
                                  )}

                                  {/* Images BELOW preview */}
                                  {block.imageUrls.length > 0 && (
                                    <div className="flex gap-2 flex-wrap pt-2">
                                      {block.imageUrls.map((url, index) => (
                                        <div
                                          key={index}
                                          className="relative w-28 h-20 border rounded-md overflow-hidden"
                                        >
                                          <img
                                            src={url}
                                            alt="uploaded"
                                            className="w-full h-full object-cover"
                                          />

                                          {/* ❌ Delete */}
                                          <button
                                            type="button"
                                            onClick={() =>
                                              removeBlockImage(question.id, block.id, index)
                                            }
                                            className="absolute -top-2 -right-2 bg-red-600 text-white w-5 h-5 rounded-full text-xs flex items-center justify-center hover:bg-red-700"
                                          >
                                            ✕
                                          </button>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                  {/* Upload image */}
                                  <Input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={(e) => {
                                      const files = e.target.files;
                                      if (!files) return;

                                      Array.from(files).forEach(file =>
                                        uploadBlockImage(question.id, block.id, file)
                                      );

                                      e.target.value = "";
                                    }}
                                  />

                                </div>
                              ))}

                              {/* Add new textarea block */}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => addBlock(question.id)}
                              >
                                + Add sub question
                              </Button>

                            </div>
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
