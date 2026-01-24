import React, { useEffect, useState } from "react";
import data from "./data.json";
import QuestionTable from "./QuestionTable";
import "./QuestionPaper1.css";

const QuestionPaper = () => {
  const [paperData, setPaperData] = useState<any>(null);

  useEffect(() => {
    setPaperData(data);
  }, []);

  if (!paperData) return <p>Loading...</p>;

  // 🔹 CORRECT DATA PATH
  const moduleData = paperData.questionbank[0];
  const questionsData = moduleData.questions;

  const twoMarksQuestions = questionsData.twomarks || [];
  const tenMarksQuestions = questionsData.tenmarks?.[0] || [];

  // 🔹 Convert string → number
  const twoMarksLimit = Number(questionsData.twomarksquestioncount);
  const tenMarksLimit = Number(questionsData.tenmarksquestioncount);

  return (
    <div className="paper-container">

      <div className="college-header">
        <img src="./public/college.jpeg" alt="" className="center-img" />
        <br></br>
        <h3>{paperData.fullform}</h3>
      </div>

      <div className="course-box">
        <div>
          <p><strong>Class:</strong> {paperData.yos}</p>
          <p><strong>Course Title:</strong> {paperData.coursetitle}</p>
          <p><strong>Course Code:</strong> {paperData.coursecode}</p>
          <p><strong>Credits:</strong> {paperData.credits}</p>
          <p><strong>Faculty:</strong> {paperData.facultylist.join(", ")}</p>
        </div>

        <div>
          <p><strong>Semester:</strong> {paperData.sem}</p>
          <p><strong>Academic Year:</strong> {paperData.academicyear}</p>
          <p><strong>Regulation:</strong> {paperData.regulation}</p>
          <p><strong>Program/Dept:</strong> {paperData.dept}</p>
        </div>
      </div>

      <h2 className="unit-title">{paperData.modulename}</h2>

      <div style={{ width: "900px", margin: "auto" }}>

        <h3 style={{ textAlign: "center" }}>2 MARK QUESTIONS</h3>
        <QuestionTable
          questions={twoMarksQuestions}
          limit={twoMarksLimit}
        />

        <h3 style={{ textAlign: "center" }}>10 MARK QUESTIONS</h3>
        <QuestionTable
          questions={tenMarksQuestions}
          limit={tenMarksLimit}
        />

      </div>

    </div>
  );
};

export default QuestionPaper;
