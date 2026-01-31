import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { mockQuestionBanks } from '@/data/mockData';
import { QuestionBank } from '@/types';
import MainLayout from '@/components/layout/MainLayout';
import StatusBadge from '@/components/ui/StatusBadge';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Edit, Check, X, MessageSquare, AlertCircle } from 'lucide-react';
import html2pdf from "html2pdf.js";
import data from "./data.json";
import QuestionTable from "./QuestionTable";
import "./QuestionPaper1.css";

const QuestionBankView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isFacultyMode = searchParams.get('mode') === 'faculty';
  const { toast } = useToast();

  const [questionBank, setQuestionBank] = useState<QuestionBank | undefined>(
    mockQuestionBanks.find((qb) => String(qb.id) === id)
  );

  const [comment, setComment] = useState(questionBank?.comment || '');
  const [commentError, setCommentError] = useState('');
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [paperData, setPaperData] = useState<any>(null);
  const pdfRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setPaperData(data);
  }, []);
  if (!paperData) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading question paper...</p>
        </div>
      </MainLayout>
    );
  }

  const moduleData = paperData.questionbank?.[0];
  const questionsData = moduleData?.questions || {};

  const twoMarksQuestions = questionsData?.twomarks ?? [];
  const tenMarksQuestions = questionsData?.tenmarks?.[0] ?? [];

  const twoMarksLimit = Number(questionsData?.twomarksquestioncount ?? 0);
  const tenMarksLimit = Number(questionsData?.tenmarksquestioncount ?? 0);

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

  if (!questionBank) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold">Question Bank not found</h2>
          <Button onClick={() => navigate(-1)} className="mt-4">
            Go Back
          </Button>
        </div>
      </MainLayout>
    );
  }

  const handleAccept = () => {
    setQuestionBank({ ...questionBank, status: 'accepted' });
    setShowAcceptModal(false);
    toast({
      title: 'Question Bank Accepted',
      description: 'The question bank has been approved successfully.',
    });
  };

  const handleReject = () => {
    if (!comment.trim()) {
      setCommentError('Comment is required when rejecting a question bank');
      setShowRejectModal(false);
      return;
    }
    setQuestionBank({ ...questionBank, status: 'rejected', comment });
    setShowRejectModal(false);
    toast({
      title: 'Question Bank Rejected',
      description: 'The question bank has been rejected with feedback.',
      variant: 'destructive',
    });
  };

  const handleEdit = () => {
    navigate(`/upload?edit=${id}`);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{questionBank.subject}</h1>
              <p className="text-muted-foreground mt-1">
                Submitted by {questionBank.facultyName} on {questionBank.submittedAt}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {questionBank.date}
            {(isFacultyMode || questionBank.date === 'pending') && (
              <Button variant="outline" size="sm" onClick={handleEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            )}
          </div>
        </div>

        {/* Question Bank Content */}
        <Card>
          <CardHeader>
            <CardTitle>Question Bank Content</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-muted/50 rounded-lg p-8 min-h-[400px] border-2 border-dashed border-border">

              <div className="space-y-6">
                <div className="paper-container" ref={pdfRef}>

                  <div className="college-header">
                    <img src="/college.jpeg" alt="college" className="center-img" />
                    <h3>{paperData?.fullform}</h3>
                    <p><strong>Class:</strong> {paperData?.yos}</p>

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
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rejected Comment Display */}
        {questionBank.status === 'rejected' && questionBank.comment && (
          <Card className="border-destructive/20 bg-destructive/5">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <MessageSquare className="h-5 w-5 text-destructive mt-0.5" />
                <div>
                  <h4 className="font-medium text-destructive mb-1">Rejection Comment</h4>
                  <p className="text-foreground">{questionBank.comment}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Admin/Exam Cell Actions */}
        {!isFacultyMode && (
          <Card>
            <CardContent className="p-6 space-y-4">
              {/* Comment Section */}
              <div className="space-y-2">
                <Label htmlFor="comment">Comment (Required for rejection)</Label>
                <Textarea
                  id="comment"
                  placeholder="Enter your feedback or comments..."
                  value={comment}
                  onChange={(e) => {
                    setComment(e.target.value);
                    setCommentError('');
                  }}
                  rows={4}
                  className={commentError ? 'border-destructive' : ''}
                />
                {commentError && (
                  <div className="flex items-center gap-2 text-destructive text-sm animate-fade-in">
                    <AlertCircle className="h-4 w-4" />
                    <span>{commentError}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-4 pt-4 border-t border-border">
                <Button
                  onClick={() => setShowAcceptModal(true)}
                  className="bg-success text-success-foreground hover:bg-success/90"
                >
                  <Check className="h-4 w-4 mr-2" />
                  Accept
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    if (!comment.trim()) {
                      setCommentError('Comment is required when rejecting a question bank');
                      return;
                    }
                    setShowRejectModal(true);
                  }}
                >
                  <X className="h-4 w-4 mr-2" />
                  Reject
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Modals */}
      <ConfirmModal
        open={showAcceptModal}
        onOpenChange={setShowAcceptModal}
        title="Accept Question Bank"
        description="Are you sure you want to accept this question bank? This action will approve it for use."
        confirmText="Accept"
        onConfirm={handleAccept}
      />

      <ConfirmModal
        open={showRejectModal}
        onOpenChange={setShowRejectModal}
        title="Reject Question Bank"
        description="Are you sure you want to reject this question bank? The faculty will be notified with your comment."
        confirmText="Reject"
        onConfirm={handleReject}
        variant="destructive"
      />
    </MainLayout>
  );
};

export default QuestionBankView;
