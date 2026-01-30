import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, GraduationCap } from "lucide-react";

interface CourseOffering {
    id: string;
    academicYear: string;
    semester: string;
    yearOfStudy: string;
    courseName: string;
    programName: string;
}

interface Props {
    offerings: CourseOffering[];
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
}

const CourseOfferingList: React.FC<Props> = ({
    offerings,
    onEdit,
    onDelete,
}) => {
    return (
        <div className="min-h-screen p-6 bg-muted/30">
            {/* Header */}
            <div className="mb-8 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <GraduationCap className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-semibold tracking-tight">
                    Course Offerings
                </h2>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {offerings.map((item) => (
                    <Card
                        key={item.id}
                        className="group rounded-xl border bg-background shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                    >
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors">
                                {item.courseName}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">
                                {item.programName}
                            </p>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            {/* Meta badges */}
                            <div className="flex flex-wrap gap-2">
                                <Badge variant="outline" className="rounded-md">
                                    Year {item.yearOfStudy}
                                </Badge>
                                <Badge variant="outline" className="rounded-md">
                                    Semester {item.semester}
                                </Badge>
                                <Badge variant="secondary" className="rounded-md">
                                    {item.academicYear}
                                </Badge>
                            </div>

                            <div className="h-px bg-border/60" />

                            {/* Actions */}
                            <div className="flex justify-end gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() => onEdit(item.id)}
                                >
                                    Edit
                                </Button>

                                <Button
                                    size="sm"
                                    variant="destructive"
                                    className="gap-1.5"
                                    onClick={() => onDelete(item.id)}
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Delete
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Empty state */}
            {offerings.length === 0 && (
                <div className="mt-20 text-center text-muted-foreground">
                    No course offerings added yet.
                </div>
            )}
        </div>
    );
};

export default CourseOfferingList;
