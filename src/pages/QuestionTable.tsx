import React from "react";
import { InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import "./QuestionTable.css";

const renderLatex = (text) => {
    if (!text) return null;

    const parts = text.split(/(\$[^$]+\$)/g);

    return parts.map((part, i) => {
        if (part.startsWith("$") && part.endsWith("$")) {
            return (
                <InlineMath
                    key={i}
                    math={part.slice(1, -1)}
                />
            );
        }
        return <span key={i}>{part}</span>;
    });
};

const QuestionTable = ({ questions, limit }) => {
    return (
        <table
            className="question-table"
            width="100%"
            cellPadding={8}
            style={{
                borderCollapse: "collapse",
                marginBottom: "30px",
                border: "1px solid black",
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
                                    <td
                                        rowSpan={q.subquestions.length}
                                        className="sno"
                                    >
                                        {qIndex + 1}
                                    </td>
                                )}

                                <td className="question">
                                    {q.subquestions.length > 1 && (
                                        <strong>
                                            {String.fromCharCode(97 + subIndex)}.
                                        </strong>
                                    )}{" "}
                                    {renderLatex(sub.content)}
                                </td>

                                <td className="co">{q.co}</td>
                                <td className="blooms">
                                    {renderLatex(sub.bloomslevel)}
                                </td>
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
