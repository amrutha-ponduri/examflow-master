import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ProgramData {
    programName: string;
}

const ProgramForm: React.FC = () => {
    const { toast } = useToast();
    const [formData, setFormData] = useState<ProgramData>({
        programName: "",
    });
    const [existingPrograms, setExistingPrograms] = useState<string[]>([
        "B.Tech",
        "M.Tech",
        "MCA",
        "MBA",
    ]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const trimmedName = formData.programName.trim();

        if (!trimmedName) {
            toast({
                title: "Validation Error",
                description: "Program name is required.",
                variant: "destructive",
            });
            return;
        }

        // Check for duplicate program names (case-insensitive)
        const isDuplicate = existingPrograms.some(
            (program) => program.toLowerCase() === trimmedName.toLowerCase()
        );

        if (isDuplicate) {
            toast({
                title: "Duplicate Entry",
                description: "This program already exists.",
                variant: "destructive",
            });
            return;
        }

        // Add to existing programs list
        setExistingPrograms((prev) => [...prev, trimmedName]);

        toast({
            title: "Program Added",
            description: `Program "${trimmedName}" has been added successfully.`,
        });

        console.log("Program submitted:", { programName: trimmedName });

        // Reset form
        setFormData({ programName: "" });
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <Card className="w-full max-w-md shadow-md">
                <CardHeader className="pb-4">
                    <CardTitle className="text-xl font-bold underline underline-offset-4 decoration-2">
                        Program
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="programName" className="text-sm font-medium">
                                Program Name <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="programName"
                                name="programName"
                                type="text"
                                placeholder="e.g., B.Tech, M.Tech, MCA, MBA"
                                value={formData.programName}
                                onChange={handleInputChange}
                                className="w-full"
                            />
                        </div>

                        <div className="flex justify-end pt-2">
                            <Button type="submit" className="px-6">
                                Add Program
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default ProgramForm;
