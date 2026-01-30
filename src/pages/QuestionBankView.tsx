import { useState } from 'react';
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

const QuestionBankView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isFacultyMode = searchParams.get('mode') === 'faculty';
  const { toast } = useToast();

  const [questionBank, setQuestionBank] = useState<QuestionBank | undefined>(
    mockQuestionBanks.find((qb) => qb.id === id)
  );
  const [comment, setComment] = useState(questionBank?.comment || '');
  const [commentError, setCommentError] = useState('');
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);

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
            <StatusBadge status={questionBank.status} />
            {(isFacultyMode || questionBank.status === 'pending') && (
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
              {questionBank.modules.length === 0 ? (
                <div className="text-center text-muted-foreground py-12">
                  <p>No questions have been added yet.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {questionBank.modules.map((module) => (
                    <div key={module.id} className="space-y-4">
                      <h3 className="text-lg font-semibold text-primary border-b border-border pb-2">
                        Module {module.moduleNumber}
                      </h3>
                      {module.categories.map((category) => (
                        <div key={category.id} className="ml-4 space-y-2">
                          <h4 className="font-medium text-foreground">
                            Category {category.categoryNumber} ({category.marks} marks)
                          </h4>
                          <div className="ml-4 space-y-2">
                            {category.questions.map((question) => (
                              <div
                                key={question.id}
                                className="p-3 bg-card rounded border border-border"
                              >
                                <span className="text-sm font-medium text-muted-foreground">
                                  Q{question.sno}.{' '}
                                </span>
                                <span>{question.content}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
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
