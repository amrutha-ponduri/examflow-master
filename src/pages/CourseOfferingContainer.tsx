import { Routes, Route, useNavigate } from "react-router-dom";
import { useState } from "react";
import CourseOfferingForm from "./CourseOfferingForm";
import CourseOfferingList from "./CourseOfferingList";
import CourseOfferingUpdate from "./CourseOfferingUpdate";
import { v4 as uuidv4 } from "uuid";

const CourseOfferingContainer = () => {
    const navigate = useNavigate();
    const [offerings, setOfferings] = useState<any[]>([]);

    const handleAdd = (data: any) => {
        setOfferings(prev => [
            ...prev,
            {
                id: uuidv4(),
                academicYear: data.academicYear,
                semester: data.semester,
                yearOfStudy: data.yearOfStudy,
                courseName: data.courseTitle,
                programName: data.programName,
            }
        ]);

        navigate("course-offerings");
    };

    const handleDelete = (id: string) => {
        setOfferings(prev => prev.filter(o => o.id !== id));
    };

    const handleUpdate = (id: string, data: any) => {
    setOfferings((prev) =>
      prev.map((o) =>
        o.id === id
          ? {
              ...o,
              academicYear: data.academicYear,
              semester: data.semester,
              yearOfStudy: data.yearOfStudy,
              courseName: data.courseTitle,
              programName: data.programName,
            }
          : o
      )
    );

    navigate("course-offerings");
  };
    
    return (
        <Routes>
            <Route
                path="/"
                element={<CourseOfferingForm onAdd={handleAdd} />}
            />

            <Route
                path="course-offerings"
                element={
                    <CourseOfferingList
                        offerings={offerings}
                        onEdit={(id) => navigate(`edit/${id}`)}
                        onDelete={handleDelete}
                    />
                }
            />
            <Route
                path="edit-course-offerings/:id"
                element={
                    <CourseOfferingUpdate
                        offerings={offerings}
                        onUpdate={handleUpdate}
                    />
                }
            />
        </Routes>
    );
};

export default CourseOfferingContainer;
