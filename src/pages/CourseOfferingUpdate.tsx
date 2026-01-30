import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CourseOfferingForm from "./CourseOfferingForm";

/**
 * Shape MUST match what you store in state
 */
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
    onUpdate: (id: string, data: any) => void;
}

const CourseOfferingUpdate: React.FC<Props> = ({ offerings, onUpdate }) => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [existingData, setExistingData] = useState<any | null>(null);

    useEffect(() => {
        const found = offerings.find((o) => o.id === id);

        if (!found) {
            navigate("/course-offerings");
            return;
        }

        // Map list data → form structure
        setExistingData({
            academicYear: found.academicYear,
            semester: found.semester,
            yearOfStudy: found.yearOfStudy,
            courseTitle: found.courseName,
            programName: found.programName,
        });
    }, [id, offerings, navigate]);

    if (!existingData) return null;

    return (
        <CourseOfferingForm
            mode="update"
            initialData={existingData}
            onAdd={(updatedData) => {
                onUpdate(id!, updatedData);
                navigate("/course-offerings");
            }}
        />
    );
};

export default CourseOfferingUpdate;
