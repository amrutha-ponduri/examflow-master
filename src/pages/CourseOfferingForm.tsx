import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import {
    ChevronDown,
    X,
    BookOpen,
    Calendar,
    Users,
    Layers,
    Building2,
    GraduationCap,
    Plus,
    Save,
    Eye,
    Trash2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

// Mock data for dropdowns
const mockDepartments = [
    { id: 1, name: "Computer Science & Engineering" },
    { id: 2, name: "Electronics & Communication" },
    { id: 3, name: "Mechanical Engineering" },
    { id: 4, name: "Civil Engineering" },
];

const mockCourses = [
    { id: 1, code: "CS101", title: "Programming Fundamentals" },
    { id: 2, code: "CS201", title: "Data Structures" },
    { id: 3, code: "CS301", title: "Database Systems" },
    { id: 4, code: "EC101", title: "Basic Electronics" },
];

const mockPrograms = [
    { id: 1, name: "B.Tech" },
    { id: 2, name: "M.Tech" },
    { id: 3, name: "MCA" },
    { id: 4, name: "MBA" },
];

const mockRegulations = [
    { id: 1, name: "R18" },
    { id: 2, name: "R20" },
    { id: 3, name: "R22" },
];

const mockUsers = [
    { id: 1, name: "Dr. John Smith" },
    { id: 2, name: "Prof. Sarah Johnson" },
    { id: 3, name: "Dr. Michael Brown" },
    { id: 4, name: "Prof. Emily Davis" },
    { id: 5, name: "Dr. Robert Wilson" },
];

interface Props {
    onAdd: (data: any) => void;
    initialData?: any;
    mode?: "add" | "update";
}


interface ModuleConfig {
    id: number;
    moduleNumber: number | "";
    moduleName: string;
}

interface CourseOfferingData {
    academicYear: string;
    semester: string;
    yearOfStudy: string;
    moduleAmount: number | "";
    departmentId: string;
    courseId: string;
    programId: string;
    regulationId: string;
    submitterId: string;
    instructorIds: string[];
    moduleCount: number | "";
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

const CourseOfferingForm: React.FC<Props> = ({
    onAdd,
    initialData,
    mode = "add",
}) => {

    const { toast } = useToast();
    const [formData, setFormData] = useState<CourseOfferingData>({
        academicYear: "",
        semester: "",
        yearOfStudy: "",
        moduleAmount: "",
        departmentId: "",
        courseId: "",
        programId: "",
        regulationId: "",
        submitterId: "",
        instructorIds: [],
        moduleCount: "",
    });
    const [modules, setModules] = useState<ModuleConfig[]>([]);
    const [instructorPopoverOpen, setInstructorPopoverOpen] = useState(false);

    // Handle module count changes
    useEffect(() => {
        if (initialData) {
            setFormData((prev) => ({
                ...prev,
                ...initialData,
            }));
        }
    }, [initialData]);


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        if (name === "moduleAmount" || name === "moduleCount") {
            const numValue = value === "" ? "" : Math.max(0, parseInt(value) || 0);
            setFormData((prev) => ({ ...prev, [name]: numValue }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSelectChange = (name: keyof CourseOfferingData, value: string) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleInstructorToggle = (userId: string) => {
        setFormData((prev) => ({
            ...prev,
            instructorIds: prev.instructorIds.includes(userId)
                ? prev.instructorIds.filter((id) => id !== userId)
                : [...prev.instructorIds, userId],
        }));
    };

    const removeInstructor = (userId: string) => {
        setFormData((prev) => ({
            ...prev,
            instructorIds: prev.instructorIds.filter((id) => id !== userId),
        }));
    };

    const handleModuleChange = (
        moduleId: number,
        field: keyof Omit<ModuleConfig, "id">,
        value: string
    ) => {
        setModules((prev) =>
            prev.map((module) => {
                if (module.id === moduleId) {
                    if (field === "moduleNumber") {
                        const numValue = value === "" ? "" : Math.max(0, parseInt(value) || 0);
                        return { ...module, [field]: numValue };
                    }
                    return { ...module, [field]: value };
                }
                return module;
            })
        );
    };

    const validateForm = (): boolean => {
        if (!formData.academicYear.trim()) {
            toast({ title: "Validation Error", description: "Academic Year is required.", variant: "destructive" });
            return false;
        }
        if (!formData.semester) {
            toast({ title: "Validation Error", description: "Semester is required.", variant: "destructive" });
            return false;
        }
        if (!formData.yearOfStudy) {
            toast({ title: "Validation Error", description: "Year of Study is required.", variant: "destructive" });
            return false;
        }
        if (formData.moduleAmount === "" || formData.moduleAmount <= 0) {
            toast({ title: "Validation Error", description: "Module Amount must be at least 1.", variant: "destructive" });
            return false;
        }
        if (!formData.departmentId) {
            toast({ title: "Validation Error", description: "Department is required.", variant: "destructive" });
            return false;
        }
        if (!formData.courseId) {
            toast({ title: "Validation Error", description: "Course is required.", variant: "destructive" });
            return false;
        }
        if (!formData.programId) {
            toast({ title: "Validation Error", description: "Program is required.", variant: "destructive" });
            return false;
        }
        if (!formData.regulationId) {
            toast({ title: "Validation Error", description: "Regulation is required.", variant: "destructive" });
            return false;
        }
        if (!formData.submitterId) {
            toast({ title: "Validation Error", description: "Submitter is required.", variant: "destructive" });
            return false;
        }
        if (formData.instructorIds.length === 0) {
            toast({ title: "Validation Error", description: "At least one instructor is required.", variant: "destructive" });
            return false;
        }

        // Validate modules if any
        for (const module of modules) {
            if (module.moduleNumber === "" || module.moduleNumber <= 0) {
                toast({ title: "Validation Error", description: `Module ${module.id}: Module number must be at least 1.`, variant: "destructive" });
                return false;
            }
            if (!module.moduleName.trim()) {
                toast({ title: "Validation Error", description: `Module ${module.id}: Module name is required.`, variant: "destructive" });
                return false;
            }
        }

        return true;
    };

    const getSubmissionData = () => ({
        ...formData,
        academicYear: formData.academicYear.trim(),
        modules: modules.map((m) => ({
            moduleNumber: m.moduleNumber,
            moduleName: m.moduleName.trim(),
        })),
    });

    const handleAdd = () => {
        if (!validateForm()) return;

        const data = {
            ...getSubmissionData(),
            courseTitle: mockCourses.find(
                c => c.id.toString() === formData.courseId
            )?.title,
            programName: mockPrograms.find(
                p => p.id.toString() === formData.programId
            )?.name,
        };

        onAdd(data);
    };


    const getSelectedInstructorNames = () => {
        return formData.instructorIds
            .map((id) => mockUsers.find((u) => u.id.toString() === id)?.name)
            .filter(Boolean);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 flex items-start justify-center p-4 sm:p-6 lg:p-8">
            <Card className="w-full max-w-5xl shadow-xl border-0 bg-card/95 backdrop-blur-sm">
                {/* Header with gradient accent */}
                <CardHeader className="pb-2 pt-8 px-8 relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary/70 to-primary/40" />
                    <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-primary text-primary-foreground shadow-lg">
                            <BookOpen className="w-7 h-7" />
                        </div>
                        <div>
                            <CardTitle className="text-2xl font-bold text-foreground tracking-tight">
                                Course Offering
                            </CardTitle>
                            <p className="text-sm text-muted-foreground mt-1">
                                Configure academic course instance details
                            </p>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="px-8 pb-8">
                    <ScrollArea className="h-[calc(100vh-260px)] pr-4">
                        <form className="space-y-8 pt-6">
                            {/* Academic Details Section */}
                            <div className="rounded-xl border border-border/50 bg-muted/20 p-6 transition-all hover:border-border">
                                <SectionHeader
                                    icon={<Calendar className="w-5 h-5" />}
                                    title="Academic Details"
                                    subtitle="Define the academic period and study parameters"
                                />
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                                    <div className="space-y-2">
                                        <Label htmlFor="academicYear" className="text-sm font-medium text-foreground">
                                            Academic Year <span className="text-destructive">*</span>
                                        </Label>
                                        <Input
                                            id="academicYear"
                                            name="academicYear"
                                            type="text"
                                            placeholder="e.g., 2024-25"
                                            value={formData.academicYear}
                                            onChange={handleInputChange}
                                            className="h-11 bg-background border-border/60 focus:border-primary transition-colors"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="semester" className="text-sm font-medium text-foreground">
                                            Semester <span className="text-destructive">*</span>
                                        </Label>
                                        <Select
                                            value={formData.semester}
                                            onValueChange={(value) => handleSelectChange("semester", value)}
                                        >
                                            <SelectTrigger className="h-11 bg-background border-border/60 focus:border-primary">
                                                <SelectValue placeholder="Select semester" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-popover border shadow-lg">
                                                {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                                                    <SelectItem key={sem} value={sem.toString()} className="cursor-pointer">
                                                        Semester {sem}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="yearOfStudy" className="text-sm font-medium text-foreground">
                                            Year of Study <span className="text-destructive">*</span>
                                        </Label>
                                        <Select
                                            value={formData.yearOfStudy}
                                            onValueChange={(value) => handleSelectChange("yearOfStudy", value)}
                                        >
                                            <SelectTrigger className="h-11 bg-background border-border/60 focus:border-primary">
                                                <SelectValue placeholder="Select year" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-popover border shadow-lg">
                                                {["1st Year", "2nd Year", "3rd Year", "4th Year"].map((year, idx) => (
                                                    <SelectItem key={year} value={`${idx + 1}st`.replace('1st', '1st').replace('2st', '2nd').replace('3st', '3rd').replace('4st', '4th')} className="cursor-pointer">
                                                        {year}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="moduleAmount" className="text-sm font-medium text-foreground">
                                            Module Amount <span className="text-destructive">*</span>
                                        </Label>
                                        <Input
                                            id="moduleAmount"
                                            name="moduleAmount"
                                            type="number"
                                            min="1"
                                            placeholder="Enter amount"
                                            value={formData.moduleAmount}
                                            onChange={handleInputChange}
                                            className="h-11 bg-background border-border/60 focus:border-primary transition-colors"
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
                                        <Label htmlFor="departmentId" className="text-sm font-medium text-foreground">
                                            Department <span className="text-destructive">*</span>
                                        </Label>
                                        <Select
                                            value={formData.departmentId}
                                            onValueChange={(value) => handleSelectChange("departmentId", value)}
                                        >
                                            <SelectTrigger className="h-11 bg-background border-border/60 focus:border-primary">
                                                <SelectValue placeholder="Select department" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-popover border shadow-lg">
                                                {mockDepartments.map((dept) => (
                                                    <SelectItem key={dept.id} value={dept.id.toString()} className="cursor-pointer">
                                                        {dept.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="courseId" className="text-sm font-medium text-foreground">
                                            Course <span className="text-destructive">*</span>
                                        </Label>
                                        <Select
                                            value={formData.courseId}
                                            onValueChange={(value) => handleSelectChange("courseId", value)}
                                        >
                                            <SelectTrigger className="h-11 bg-background border-border/60 focus:border-primary">
                                                <SelectValue placeholder="Select course" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-popover border shadow-lg">
                                                {mockCourses.map((course) => (
                                                    <SelectItem key={course.id} value={course.id.toString()} className="cursor-pointer">
                                                        <span className="font-medium text-primary">{course.code}</span>
                                                        <span className="text-muted-foreground"> — {course.title}</span>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="programId" className="text-sm font-medium text-foreground">
                                            Program <span className="text-destructive">*</span>
                                        </Label>
                                        <Select
                                            value={formData.programId}
                                            onValueChange={(value) => handleSelectChange("programId", value)}
                                        >
                                            <SelectTrigger className="h-11 bg-background border-border/60 focus:border-primary">
                                                <SelectValue placeholder="Select program" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-popover border shadow-lg">
                                                {mockPrograms.map((program) => (
                                                    <SelectItem key={program.id} value={program.id.toString()} className="cursor-pointer">
                                                        {program.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="regulationId" className="text-sm font-medium text-foreground">
                                            Regulation <span className="text-destructive">*</span>
                                        </Label>
                                        <Select
                                            value={formData.regulationId}
                                            onValueChange={(value) => handleSelectChange("regulationId", value)}
                                        >
                                            <SelectTrigger className="h-11 bg-background border-border/60 focus:border-primary">
                                                <SelectValue placeholder="Select regulation" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-popover border shadow-lg">
                                                {mockRegulations.map((reg) => (
                                                    <SelectItem key={reg.id} value={reg.id.toString()} className="cursor-pointer">
                                                        <Badge variant="outline" className="font-semibold">
                                                            {reg.name}
                                                        </Badge>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>

                            {/* User Assignment Section */}
                            <div className="rounded-xl border border-border/50 bg-muted/20 p-6 transition-all hover:border-border">
                                <SectionHeader
                                    icon={<Users className="w-5 h-5" />}
                                    title="User Assignment"
                                    subtitle="Assign submitter and instructors for this offering"
                                />
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div className="space-y-2">
                                        <Label htmlFor="submitterId" className="text-sm font-medium text-foreground">
                                            Submitter <span className="text-destructive">*</span>
                                        </Label>
                                        <Select
                                            value={formData.submitterId}
                                            onValueChange={(value) => handleSelectChange("submitterId", value)}
                                        >
                                            <SelectTrigger className="h-11 bg-background border-border/60 focus:border-primary">
                                                <SelectValue placeholder="Select submitter" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-popover border shadow-lg">
                                                {mockUsers.map((user) => (
                                                    <SelectItem key={user.id} value={user.id.toString()} className="cursor-pointer">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                                                                <span className="text-xs font-medium text-primary">
                                                                    {user.name.split(' ').map(n => n[0]).join('')}
                                                                </span>
                                                            </div>
                                                            {user.name}
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium text-foreground">
                                            Instructor(s) <span className="text-destructive">*</span>
                                        </Label>
                                        <Popover open={instructorPopoverOpen} onOpenChange={setInstructorPopoverOpen}>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    className="w-full justify-between font-normal h-auto min-h-11 bg-background border-border/60 hover:border-primary hover:bg-background"
                                                >
                                                    <div className="flex flex-wrap gap-1.5 flex-1 py-1">
                                                        {formData.instructorIds.length === 0 ? (
                                                            <span className="text-muted-foreground">Select instructors</span>
                                                        ) : (
                                                            getSelectedInstructorNames().map((name, idx) => (
                                                                <Badge
                                                                    key={idx}
                                                                    variant="secondary"
                                                                    className="bg-primary/10 text-primary border-0 hover:bg-primary/20 transition-colors"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        const userId = formData.instructorIds[idx];
                                                                        removeInstructor(userId);
                                                                    }}
                                                                >
                                                                    {name}
                                                                    <X className="ml-1.5 h-3 w-3 cursor-pointer hover:text-destructive transition-colors" />
                                                                </Badge>
                                                            ))
                                                        )}
                                                    </div>
                                                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 text-muted-foreground" />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-[300px] p-0 bg-popover border shadow-lg" align="start">
                                                <div className="p-2 border-b bg-muted/30">
                                                    <p className="text-xs font-medium text-muted-foreground">
                                                        Select one or more instructors
                                                    </p>
                                                </div>
                                                <ScrollArea className="h-[200px]">
                                                    <div className="p-2 space-y-1">
                                                        {mockUsers.map((user) => (
                                                            <div
                                                                key={user.id}
                                                                className={`flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-colors ${formData.instructorIds.includes(user.id.toString())
                                                                    ? 'bg-primary/10 border border-primary/20'
                                                                    : 'hover:bg-muted'
                                                                    }`}
                                                                onClick={() => handleInstructorToggle(user.id.toString())}
                                                            >
                                                                <Checkbox
                                                                    checked={formData.instructorIds.includes(user.id.toString())}
                                                                    onCheckedChange={() => handleInstructorToggle(user.id.toString())}
                                                                    className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                                                />
                                                                <div className="flex items-center gap-2 flex-1">
                                                                    <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                                                                        <span className="text-xs font-medium text-primary">
                                                                            {user.name.split(' ').map(n => n[0]).join('')}
                                                                        </span>
                                                                    </div>
                                                                    <span className="text-sm font-medium">{user.name}</span>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </ScrollArea>
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                </div>
                            </div>

                            {/* Module Configuration Section */}
                            <div className="rounded-xl border border-border/50 bg-muted/20 p-6 transition-all hover:border-border">
                                <SectionHeader
                                    icon={<Layers className="w-5 h-5" />}
                                    title="Module Configuration"
                                    subtitle="Define the structure of course modules"
                                />
                                <div className="space-y-2 max-w-xs">
                                    <Label htmlFor="moduleCount" className="text-sm font-medium text-foreground">
                                        Number of Modules
                                    </Label>
                                    <Input
                                        id="moduleCount"
                                        name="moduleCount"
                                        type="number"
                                        min="0"
                                        placeholder="Enter number of modules"
                                        value={formData.moduleCount}
                                        onChange={handleInputChange}
                                        className="h-11 bg-background border-border/60 focus:border-primary transition-colors"
                                    />
                                </div>

                                {modules.length > 0 && (
                                    <div className="mt-6 space-y-4">
                                        <Separator className="bg-border/50" />
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {modules.map((module) => (
                                                <div
                                                    key={module.id}
                                                    className="p-5 border border-border/60 rounded-xl bg-background shadow-sm hover:shadow-md transition-shadow"
                                                >
                                                    <div className="flex items-center gap-2 mb-4">
                                                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-primary-foreground text-sm font-bold">
                                                            {module.id}
                                                        </div>
                                                        <h4 className="text-sm font-semibold text-foreground">
                                                            Module {module.id}
                                                        </h4>
                                                    </div>
                                                    <div className="space-y-4">
                                                        <div className="space-y-2">
                                                            <Label
                                                                htmlFor={`moduleNumber-${module.id}`}
                                                                className="text-xs font-medium text-muted-foreground"
                                                            >
                                                                Module Number <span className="text-destructive">*</span>
                                                            </Label>
                                                            <Input
                                                                id={`moduleNumber-${module.id}`}
                                                                type="number"
                                                                min="1"
                                                                placeholder="e.g., 1"
                                                                value={module.moduleNumber}
                                                                onChange={(e) =>
                                                                    handleModuleChange(module.id, "moduleNumber", e.target.value)
                                                                }
                                                                className="h-10 bg-muted/30 border-border/60 focus:border-primary"
                                                            />
                                                        </div>

                                                        <div className="space-y-2">
                                                            <Label
                                                                htmlFor={`moduleName-${module.id}`}
                                                                className="text-xs font-medium text-muted-foreground"
                                                            >
                                                                Module Name <span className="text-destructive">*</span>
                                                            </Label>
                                                            <Input
                                                                id={`moduleName-${module.id}`}
                                                                type="text"
                                                                placeholder="e.g., Introduction to Programming"
                                                                value={module.moduleName}
                                                                onChange={(e) =>
                                                                    handleModuleChange(module.id, "moduleName", e.target.value)
                                                                }
                                                                className="h-10 bg-muted/30 border-border/60 focus:border-primary"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-wrap justify-end gap-3 pt-6 border-t border-border/50">
                                <Button type="button" onClick={handleAdd}>
                                    {mode === "add" ? "Add" : "Update"}
                                </Button>

                            </div>
                        </form>
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>
    );
};

export default CourseOfferingForm;
