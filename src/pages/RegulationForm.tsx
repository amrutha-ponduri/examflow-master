import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

interface SectionConfig {
    id: number;
    sectionName: string;
    numberOfQuestions: number | "";
    marksPerQuestion: number | "";
    minQuestionsToAttempt: number | "";
}

interface RegulationData {
    regulationName: string;
    sectionCount: number | "";
}

const RegulationForm: React.FC = () => {
    const { toast } = useToast();
    const [formData, setFormData] = useState<RegulationData>({
        regulationName: "",
        sectionCount: "",
    });
    const [sections, setSections] = useState<SectionConfig[]>([]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        if (name === "sectionCount") {
            const count = value === "" ? "" : Math.max(0, parseInt(value) || 0);
            setFormData((prev) => ({ ...prev, sectionCount: count }));

            // Generate sections dynamically
            if (typeof count === "number" && count > 0) {
                const newSections: SectionConfig[] = Array.from(
                    { length: count },
                    (_, i) => ({
                        id: i + 1,
                        sectionName: sections[i]?.sectionName || "",
                        numberOfQuestions: sections[i]?.numberOfQuestions ?? "",
                        marksPerQuestion: sections[i]?.marksPerQuestion ?? "",
                        minQuestionsToAttempt: sections[i]?.minQuestionsToAttempt ?? "",
                    })
                );
                setSections(newSections);
            } else {
                setSections([]);
            }
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSectionChange = (
        sectionId: number,
        field: keyof Omit<SectionConfig, "id">,
        value: string
    ) => {
        setSections((prev) =>
            prev.map((section) => {
                if (section.id === sectionId) {
                    if (field === "sectionName") {
                        return { ...section, [field]: value };
                    }
                    const numValue = value === "" ? "" : Math.max(0, parseInt(value) || 0);
                    return { ...section, [field]: numValue };
                }
                return section;
            })
        );
    };

    const validateForm = (): boolean => {
        const trimmedName = formData.regulationName.trim();

        if (!trimmedName) {
            toast({
                title: "Validation Error",
                description: "Regulation name is required.",
                variant: "destructive",
            });
            return false;
        }

        if (formData.sectionCount === "" || formData.sectionCount <= 0) {
            toast({
                title: "Validation Error",
                description: "Section count must be at least 1.",
                variant: "destructive",
            });
            return false;
        }

        for (const section of sections) {
            if (!section.sectionName.trim()) {
                toast({
                    title: "Validation Error",
                    description: `Section ${section.id}: Section name is required.`,
                    variant: "destructive",
                });
                return false;
            }

            if (section.numberOfQuestions === "" || section.numberOfQuestions <= 0) {
                toast({
                    title: "Validation Error",
                    description: `Section ${section.id}: Number of questions must be at least 1.`,
                    variant: "destructive",
                });
                return false;
            }

            if (section.marksPerQuestion === "" || section.marksPerQuestion <= 0) {
                toast({
                    title: "Validation Error",
                    description: `Section ${section.id}: Marks per question must be at least 1.`,
                    variant: "destructive",
                });
                return false;
            }

            if (section.minQuestionsToAttempt === "" || section.minQuestionsToAttempt <= 0) {
                toast({
                    title: "Validation Error",
                    description: `Section ${section.id}: Minimum questions to attempt must be at least 1.`,
                    variant: "destructive",
                });
                return false;
            }

            if (section.minQuestionsToAttempt > section.numberOfQuestions) {
                toast({
                    title: "Validation Error",
                    description: `Section ${section.id}: Minimum questions cannot exceed total questions.`,
                    variant: "destructive",
                });
                return false;
            }
        }

        return true;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        const submissionData = {
            regulationName: formData.regulationName.trim(),
            sectionCount: formData.sectionCount,
            sections: sections.map((s) => ({
                sectionName: s.sectionName.trim(),
                numberOfQuestions: s.numberOfQuestions,
                marksPerQuestion: s.marksPerQuestion,
                minQuestionsToAttempt: s.minQuestionsToAttempt,
            })),
        };

        toast({
            title: "Regulation Added",
            description: `Regulation "${submissionData.regulationName}" with ${submissionData.sectionCount} section(s) has been saved.`,
        });

        console.log("Regulation submitted:", submissionData);

        // Reset form
        setFormData({ regulationName: "", sectionCount: "" });
        setSections([]);
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl shadow-md">
                <CardHeader className="pb-4">
                    <CardTitle className="text-xl font-bold underline underline-offset-4 decoration-2">
                        Regulation
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Top-level fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="regulationName" className="text-sm font-medium">
                                    Regulation Name <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="regulationName"
                                    name="regulationName"
                                    type="text"
                                    placeholder="e.g., R18, R20, R22"
                                    value={formData.regulationName}
                                    onChange={handleInputChange}
                                    className="w-full"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="sectionCount" className="text-sm font-medium">
                                    Section Count <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="sectionCount"
                                    name="sectionCount"
                                    type="number"
                                    min="0"
                                    placeholder="Enter number of sections"
                                    value={formData.sectionCount}
                                    onChange={handleInputChange}
                                    className="w-full"
                                />
                            </div>
                        </div>

                        {/* Dynamic Section Configuration */}
                        {sections.length > 0 && (
                            <>
                                <Separator className="my-6" />
                                <div className="space-y-6">
                                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                                        Section Configuration
                                    </h3>

                                    {sections.map((section) => (
                                        <div
                                            key={section.id}
                                            className="p-4 border rounded-lg bg-muted/30 space-y-4"
                                        >
                                            <h4 className="text-sm font-medium text-foreground">
                                                Section {section.id}
                                            </h4>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                                <div className="space-y-2">
                                                    <Label
                                                        htmlFor={`sectionName-${section.id}`}
                                                        className="text-xs font-medium"
                                                    >
                                                        Section Name <span className="text-destructive">*</span>
                                                    </Label>
                                                    <Input
                                                        id={`sectionName-${section.id}`}
                                                        type="text"
                                                        placeholder="e.g., Part A"
                                                        value={section.sectionName}
                                                        onChange={(e) =>
                                                            handleSectionChange(section.id, "sectionName", e.target.value)
                                                        }
                                                        className="w-full"
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label
                                                        htmlFor={`numberOfQuestions-${section.id}`}
                                                        className="text-xs font-medium"
                                                    >
                                                        No. of Questions <span className="text-destructive">*</span>
                                                    </Label>
                                                    <Input
                                                        id={`numberOfQuestions-${section.id}`}
                                                        type="number"
                                                        min="1"
                                                        placeholder="Total questions"
                                                        value={section.numberOfQuestions}
                                                        onChange={(e) =>
                                                            handleSectionChange(section.id, "numberOfQuestions", e.target.value)
                                                        }
                                                        className="w-full"
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label
                                                        htmlFor={`marksPerQuestion-${section.id}`}
                                                        className="text-xs font-medium"
                                                    >
                                                        Marks/Question <span className="text-destructive">*</span>
                                                    </Label>
                                                    <Input
                                                        id={`marksPerQuestion-${section.id}`}
                                                        type="number"
                                                        min="1"
                                                        placeholder="Marks"
                                                        value={section.marksPerQuestion}
                                                        onChange={(e) =>
                                                            handleSectionChange(section.id, "marksPerQuestion", e.target.value)
                                                        }
                                                        className="w-full"
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label
                                                        htmlFor={`minQuestionsToAttempt-${section.id}`}
                                                        className="text-xs font-medium"
                                                    >
                                                        Min. to Attempt <span className="text-destructive">*</span>
                                                    </Label>
                                                    <Input
                                                        id={`minQuestionsToAttempt-${section.id}`}
                                                        type="number"
                                                        min="1"
                                                        placeholder="Minimum"
                                                        value={section.minQuestionsToAttempt}
                                                        onChange={(e) =>
                                                            handleSectionChange(section.id, "minQuestionsToAttempt", e.target.value)
                                                        }
                                                        className="w-full"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}

                        <div className="flex justify-end pt-4">
                            <Button type="submit" className="px-6">
                                Add Regulation
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default RegulationForm;
