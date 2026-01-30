import React from "react";
import "./QuestionTable.css";

const QuestionTable = ({ questions, limit }) => {
    return (
        <table className="question-table"
            width="100%"
            cellPadding={8}
            style={{
                borderCollapse: "collapse",
                marginBottom: "30px",
                border: "1px solid black"
            }}
        >

            <thead>
                <tr>
                    <th>S.NO</th>
                    <th>QUESTION</th>
                    <th>CO</th>
                    <th>BL</th>
                    <th>MARKS</th>
                </tr>
            </thead>

            <tbody>
                {questions.slice(0, limit).map((q, qIndex) => (
                    <React.Fragment key={qIndex}>
                        {q.subquestions.map((sub, subIndex) => (
                            <tr key={subIndex}>
                                {subIndex === 0 && (
                                    <td rowSpan={q.subquestions.length} className="sno">
                                        {qIndex + 1}
                                    </td>
                                )}

                                <td className="question">
                                    {q.subquestions.length > 1 && (
                                        <strong>{String.fromCharCode(97 + subIndex)}.</strong>
                                    )}{" "}
                                    {sub.content}
                                </td>


                                <td className="co">{q.co}</td>
                                <td className="blooms">{sub.bloomslevel}</td>
                                <td className="mark">{sub.marks}</td>
                            </tr>
                        ))}
                    </React.Fragment>
                ))}
            </tbody>
        </table>
    );
};

export default QuestionTable;
