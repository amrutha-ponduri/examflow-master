import React, { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import html2pdf from "html2pdf.js";
import data from "./data.json";
import QuestionTable from "./QuestionTable";
import "./QuestionPaper1.css";

const QuestionPaper = () => {
  const [paperData, setPaperData] = useState<any>(null);
  const pdfRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setPaperData(data);
  }, []);

  if (!paperData) return <p>Loading...</p>;

  const moduleData = paperData.questionbank[0];
  const questionsData = moduleData.questions;

  const twoMarksQuestions = questionsData.twomarks || [];
  const tenMarksQuestions = questionsData.tenmarks?.[0] || [];

  const twoMarksLimit = Number(questionsData.twomarksquestioncount);
  const tenMarksLimit = Number(questionsData.tenmarksquestioncount);

  const downloadPDF = () => {
    if (!pdfRef.current) return;

    html2pdf()
      .from(pdfRef.current)
      .set({
        margin: 0,
        filename: `${paperData.coursecode}_Question_Bank.pdf`,
        image: { type: "jpeg", quality: 1 },
        html2canvas: {
          scale: 2,
          scrollY: 0,
          useCORS: true,
        },
        jsPDF: {
          unit: "mm",
          format: "a4",
          orientation: "portrait",
        },
      })
      .save();
  };

  return (
    <>
      <div className="paper-container" ref={pdfRef}>

        <div className="college-header">
          <img src="/college.jpeg" alt="college" className="center-img" />
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

        <div className="pdf-content">
          <h3 className="section-title">2 MARK QUESTIONS</h3>
          <QuestionTable
            questions={twoMarksQuestions}
            limit={twoMarksLimit}
          />

          <div className="page-break" />

          <h3 className="section-title">10 MARK QUESTIONS</h3>
          <QuestionTable
            questions={tenMarksQuestions}
            limit={tenMarksLimit}
          />
        </div>

      </div>

      <div className="dwnl flex justify-end pt-4">
        <Button onClick={downloadPDF}>Download</Button>
      </div>
    </>
  );
};

export default QuestionPaper;
