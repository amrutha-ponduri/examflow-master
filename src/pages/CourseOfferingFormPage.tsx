import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  ArrowLeft,
  Loader2,
  BookOpen,
  Calendar,
  Building2,
  Users,
  Layers,
  X,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import MainLayout from '@/components/layout/MainLayout';
import {
  courseOfferingsApi,
  departmentsApi,
  coursesApi,
  programsApi,
  regulationsApi,
  usersApi,
  CourseOfferingDetail,
} from '@/services/api';

interface ModuleConfig {
  id: number;
  module_no: number | '';
  module_name: string;
}

interface SectionHeaderProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ icon, title, subtitle }) => (
  <div className="flex items-center gap-3 mb-6">
    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary">
      {icon}
    </div>
    <div>
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
    </div>
  </div>
);

const CourseOfferingFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();

  const isEditMode = Boolean(id);

  // Dropdown data
  const [departments, setDepartments] = useState<{ id: number; abbreviation: string }[]>([]);
  const [courses, setCourses] = useState<{ id: number; course_code: string; course_title: string }[]>([]);
  const [programs, setPrograms] = useState<{ id: number; program_name: string }[]>([]);
  const [regulations, setRegulations] = useState<{ id: number; regulation: string }[]>([]);
  const [users, setUsers] = useState<{ id: number; username: string; name: string }[]>([]);

  // Form data
  const [academicYear, setAcademicYear] = useState('');
  const [semester, setSemester] = useState('');
  const [yearOfStudy, setYearOfStudy] = useState('');
  const [moduleCount, setModuleCount] = useState<number | ''>('');
  const [departmentId, setDepartmentId] = useState('');
  const [courseId, setCourseId] = useState('');
  const [programId, setProgramId] = useState('');
  const [regulationId, setRegulationId] = useState('');
  const [submitterId, setSubmitterId] = useState('');
  const [instructorIds, setInstructorIds] = useState<number[]>([]);
  const [modules, setModules] = useState<ModuleConfig[]>([]);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchDropdownData();
  }, []);

  useEffect(() => {
    if (isEditMode && id) {
      fetchOfferingDetails(parseInt(id));
    }
  }, [isEditMode, id, departments, courses, programs, regulations, users]);

  const fetchDropdownData = async () => {
    try {
      setLoading(true);
      const [depts, coursesData, progs, regs, usersData] = await Promise.all([
        departmentsApi.getDropdown(),
        coursesApi.getDropdown(),
        programsApi.getDropdown(),
        regulationsApi.getDropdown(),
        usersApi.getDropdown(),
      ]);
      setDepartments(depts);
      setCourses(coursesData);
      setPrograms(progs);
      setRegulations(regs);
      setUsers(usersData);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch dropdown data.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchOfferingDetails = async (offeringId: number) => {
    if (departments.length === 0) return; // Wait for dropdowns to load

    try {
      const data = await courseOfferingsApi.getById(offeringId);
      setAcademicYear(data.academic_year);
      setSemester(data.semester);
      setYearOfStudy(data.year_of_study);
      setModuleCount(data.modules_info.length);

      // Find IDs by names
      const dept = departments.find((d) => d.abbreviation === data.department_name);
      if (dept) setDepartmentId(dept.id.toString());

      const course = courses.find(
        (c) => c.course_code === data.course_code && c.course_title === data.course_title
      );
      if (course) setCourseId(course.id.toString());

      const prog = programs.find((p) => p.program_name === data.program_name);
      if (prog) setProgramId(prog.id.toString());

      const reg = regulations.find((r) => r.regulation === data.regulation_name);
      if (reg) setRegulationId(reg.id.toString());

      const submitter = users.find((u) => u.name === data.submitter_name);
      if (submitter) setSubmitterId(submitter.id.toString());

      const instructors = users
        .filter((u) => data.instructor_names.includes(u.name))
        .map((u) => u.id);
      setInstructorIds(instructors);

      setModules(
        data.modules_info.map((m, idx) => ({
          id: idx + 1,
          module_no: m.module_no,
          module_name: m.module_name,
        }))
      );
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch course offering details.',
        variant: 'destructive',
      });
      navigate('/course-offerings');
    }
  };

  const handleModuleCountChange = (value: string) => {
    const count = value === '' ? '' : Math.max(0, parseInt(value) || 0);
    setModuleCount(count);

    if (typeof count === 'number' && count > 0) {
      const newModules: ModuleConfig[] = Array.from({ length: count }, (_, i) => ({
        id: i + 1,
        module_no: modules[i]?.module_no ?? i + 1,
        module_name: modules[i]?.module_name || '',
      }));
      setModules(newModules);
    } else {
      setModules([]);
    }
  };

  const handleModuleChange = (
    moduleId: number,
    field: keyof Omit<ModuleConfig, 'id'>,
    value: string
  ) => {
    setModules((prev) =>
      prev.map((module) => {
        if (module.id === moduleId) {
          if (field === 'module_no') {
            const numValue = value === '' ? '' : Math.max(0, parseInt(value) || 0);
            return { ...module, [field]: numValue };
          }
          return { ...module, [field]: value };
        }
        return module;
      })
    );
  };

  const toggleInstructor = (userId: number) => {
    setInstructorIds((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const removeInstructor = (userId: number) => {
    setInstructorIds((prev) => prev.filter((id) => id !== userId));
  };

  const getSelectedInstructorNames = () => {
    return instructorIds.map((id) => users.find((u) => u.id === id)?.name).filter(Boolean);
  };

  const validateForm = (): boolean => {
    if (!academicYear.trim()) {
      toast({ title: 'Validation Error', description: 'Academic Year is required.', variant: 'destructive' });
      return false;
    }
    if (!semester) {
      toast({ title: 'Validation Error', description: 'Semester is required.', variant: 'destructive' });
      return false;
    }
    if (!yearOfStudy) {
      toast({ title: 'Validation Error', description: 'Year of Study is required.', variant: 'destructive' });
      return false;
    }
    if (!departmentId) {
      toast({ title: 'Validation Error', description: 'Department is required.', variant: 'destructive' });
      return false;
    }
    if (!courseId) {
      toast({ title: 'Validation Error', description: 'Course is required.', variant: 'destructive' });
      return false;
    }
    if (!programId) {
      toast({ title: 'Validation Error', description: 'Program is required.', variant: 'destructive' });
      return false;
    }
    if (!regulationId) {
      toast({ title: 'Validation Error', description: 'Regulation is required.', variant: 'destructive' });
      return false;
    }
    if (!submitterId) {
      toast({ title: 'Validation Error', description: 'Submitter is required.', variant: 'destructive' });
      return false;
    }
    if (instructorIds.length === 0) {
      toast({ title: 'Validation Error', description: 'At least one instructor is required.', variant: 'destructive' });
      return false;
    }

    for (const module of modules) {
      if (module.module_no === '' || module.module_no <= 0) {
        toast({ title: 'Validation Error', description: `Module ${module.id}: Module number must be at least 1.`, variant: 'destructive' });
        return false;
      }
      if (!module.module_name.trim()) {
        toast({ title: 'Validation Error', description: `Module ${module.id}: Module name is required.`, variant: 'destructive' });
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setSubmitting(true);

    try {
      const payload = {
        academic_year: academicYear.trim(),
        semester,
        year_of_study: yearOfStudy,
        module_count: modules.length,
        department: { id: parseInt(departmentId) },
        course: { id: parseInt(courseId) },
        program: { id: parseInt(programId) },
        regulation: { id: parseInt(regulationId) },
        submitter: { id: parseInt(submitterId) },
        instructor: instructorIds.map((id) => ({ id })),
        module_infos: modules.map((m) => ({
          module_no: m.module_no as number,
          module_name: m.module_name.trim(),
        })),
      };

      if (isEditMode && id) {
        await courseOfferingsApi.update(parseInt(id), payload);
        toast({
          title: 'Success',
          description: 'Course offering updated successfully.',
        });
      } else {
        await courseOfferingsApi.create(payload);
        toast({
          title: 'Success',
          description: 'Course offering added successfully.',
        });
      }
      navigate('/course-offerings');
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${isEditMode ? 'update' : 'add'} course offering.`,
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate('/course-offerings');
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
          Back to Course Offerings
        </Button>

        {/* Form Card */}
        <Card className="w-full max-w-5xl mx-auto shadow-xl border-0 bg-card/95 backdrop-blur-sm">
          <CardHeader className="pb-2 pt-8 px-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary/70 to-primary/40" />
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-primary text-primary-foreground shadow-lg">
                <BookOpen className="w-7 h-7" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-foreground tracking-tight">
                  {isEditMode ? 'Edit Course Offering' : 'Add Course Offering'}
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Configure academic course instance details
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="px-8 pb-8">
            <ScrollArea className="h-[calc(100vh-300px)] pr-4">
              <form onSubmit={handleSubmit} className="space-y-8 pt-6">
                {/* Academic Details Section */}
                <div className="rounded-xl border border-border/50 bg-muted/20 p-6 transition-all hover:border-border">
                  <SectionHeader
                    icon={<Calendar className="w-5 h-5" />}
                    title="Academic Details"
                    subtitle="Define the academic period and study parameters"
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="academicYear" className="text-sm font-medium">
                        Academic Year <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="academicYear"
                        type="text"
                        placeholder="e.g., 2024-25"
                        value={academicYear}
                        onChange={(e) => setAcademicYear(e.target.value)}
                        disabled={submitting}
                        className="h-11"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="semester" className="text-sm font-medium">
                        Semester <span className="text-destructive">*</span>
                      </Label>
                      <Select value={semester} onValueChange={setSemester} disabled={submitting}>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Select semester" />
                        </SelectTrigger>
                        <SelectContent className="bg-popover">
                          <SelectItem value="I">I</SelectItem>
                          <SelectItem value="II">II</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="yearOfStudy" className="text-sm font-medium">
                        Year of Study <span className="text-destructive">*</span>
                      </Label>
                      <Select value={yearOfStudy} onValueChange={setYearOfStudy} disabled={submitting}>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                        <SelectContent className="bg-popover">
                          <SelectItem value="I">I</SelectItem>
                          <SelectItem value="II">II</SelectItem>
                          <SelectItem value="III">III</SelectItem>
                          <SelectItem value="IV">IV</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="moduleCount" className="text-sm font-medium">
                        Module Count
                      </Label>
                      <Input
                        id="moduleCount"
                        type="number"
                        min="0"
                        placeholder="Enter count"
                        value={moduleCount}
                        onChange={(e) => handleModuleCountChange(e.target.value)}
                        disabled={submitting}
                        className="h-11"
                      />
                    </div>
                  </div>
                </div>

                {/* Academic Mapping Section */}
                <div className="rounded-xl border border-border/50 bg-muted/20 p-6 transition-all hover:border-border">
                  <SectionHeader
                    icon={<Building2 className="w-5 h-5" />}
                    title="Academic Mapping"
                    subtitle="Link course to department, program, and regulation"
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">
                        Department <span className="text-destructive">*</span>
                      </Label>
                      <Select value={departmentId} onValueChange={setDepartmentId} disabled={submitting}>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent className="bg-popover">
                          {departments.map((dept) => (
                            <SelectItem key={dept.id} value={dept.id.toString()}>
                              {dept.abbreviation}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">
                        Course <span className="text-destructive">*</span>
                      </Label>
                      <Select value={courseId} onValueChange={setCourseId} disabled={submitting}>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Select course" />
                        </SelectTrigger>
                        <SelectContent className="bg-popover">
                          {courses.map((course) => (
                            <SelectItem key={course.id} value={course.id.toString()}>
                              {course.course_code} - {course.course_title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">
                        Program <span className="text-destructive">*</span>
                      </Label>
                      <Select value={programId} onValueChange={setProgramId} disabled={submitting}>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Select program" />
                        </SelectTrigger>
                        <SelectContent className="bg-popover">
                          {programs.map((prog) => (
                            <SelectItem key={prog.id} value={prog.id.toString()}>
                              {prog.program_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">
                        Regulation <span className="text-destructive">*</span>
                      </Label>
                      <Select value={regulationId} onValueChange={setRegulationId} disabled={submitting}>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Select regulation" />
                        </SelectTrigger>
                        <SelectContent className="bg-popover">
                          {regulations.map((reg) => (
                            <SelectItem key={reg.id} value={reg.id.toString()}>
                              {reg.regulation}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Personnel Section */}
                <div className="rounded-xl border border-border/50 bg-muted/20 p-6 transition-all hover:border-border">
                  <SectionHeader
                    icon={<Users className="w-5 h-5" />}
                    title="Personnel"
                    subtitle="Assign submitter and instructors"
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">
                        Submitter <span className="text-destructive">*</span>
                      </Label>
                      <Select value={submitterId} onValueChange={setSubmitterId} disabled={submitting}>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Select submitter" />
                        </SelectTrigger>
                        <SelectContent className="bg-popover">
                          {users.map((user) => (
                            <SelectItem key={user.id} value={user.id.toString()}>
                              {user.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">
                        Instructors <span className="text-destructive">*</span>
                      </Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            className="w-full justify-between font-normal min-h-11"
                            disabled={submitting}
                          >
                            <div className="flex flex-wrap gap-1 flex-1">
                              {instructorIds.length === 0 ? (
                                <span className="text-muted-foreground">Select instructors</span>
                              ) : (
                                getSelectedInstructorNames().map((name, idx) => (
                                  <Badge
                                    key={idx}
                                    variant="secondary"
                                    className="bg-primary/10 text-primary"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      removeInstructor(instructorIds[idx]);
                                    }}
                                  >
                                    {name}
                                    <X className="ml-1 h-3 w-3" />
                                  </Badge>
                                ))
                              )}
                            </div>
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[300px] p-0" align="start">
                          <div className="p-2 border-b text-xs font-medium text-muted-foreground">
                            Select one or more instructors
                          </div>
                          <div className="p-2 space-y-1 max-h-48 overflow-auto">
                            {users.map((user) => (
                              <div
                                key={user.id}
                                className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer ${
                                  instructorIds.includes(user.id)
                                    ? 'bg-primary/10'
                                    : 'hover:bg-muted'
                                }`}
                                onClick={() => toggleInstructor(user.id)}
                              >
                                <Checkbox checked={instructorIds.includes(user.id)} />
                                <span className="text-sm">{user.name}</span>
                              </div>
                            ))}
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </div>

                {/* Module Configuration */}
                {modules.length > 0 && (
                  <div className="rounded-xl border border-border/50 bg-muted/20 p-6 transition-all hover:border-border">
                    <SectionHeader
                      icon={<Layers className="w-5 h-5" />}
                      title="Module Configuration"
                      subtitle="Define course module details"
                    />
                    <div className="space-y-4">
                      {modules.map((module) => (
                        <div
                          key={module.id}
                          className="p-4 border rounded-lg bg-background/50 space-y-4"
                        >
                          <h4 className="text-sm font-medium text-foreground">
                            Module {module.id}
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label className="text-xs font-medium">
                                Module Number <span className="text-destructive">*</span>
                              </Label>
                              <Input
                                type="number"
                                min="1"
                                placeholder="Module number"
                                value={module.module_no}
                                onChange={(e) =>
                                  handleModuleChange(module.id, 'module_no', e.target.value)
                                }
                                disabled={submitting}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-xs font-medium">
                                Module Name <span className="text-destructive">*</span>
                              </Label>
                              <Input
                                type="text"
                                placeholder="Module name"
                                value={module.module_name}
                                onChange={(e) =>
                                  handleModuleChange(module.id, 'module_name', e.target.value)
                                }
                                disabled={submitting}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-4">
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
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default CourseOfferingFormPage;
