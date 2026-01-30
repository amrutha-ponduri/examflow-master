import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { mockQuestionBanks } from '@/data/mockData';
import MainLayout from '@/components/layout/MainLayout';
import StatusBadge from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Eye, Plus, FileText, Clock, CheckCircle, XCircle, MessageSquare } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const FacultyDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [questionBanks] = useState(
    mockQuestionBanks.filter((qb) => qb.facultyId === user?.id)
  );

  const stats = {
    total: questionBanks.length,
    pending: questionBanks.filter((qb) => qb.status === 'pending').length,
    accepted: questionBanks.filter((qb) => qb.status === 'accepted').length,
    rejected: questionBanks.filter((qb) => qb.status === 'rejected').length,
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">My Question Banks</h1>
            <p className="text-muted-foreground mt-1">View and manage your question bank submissions</p>
          </div>
          <Button onClick={() => navigate('/upload')}>
            <Plus className="h-4 w-4 mr-2" />
            Upload New
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.total}</p>
                  <p className="text-sm text-muted-foreground">Total Submissions</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-warning/10 rounded-lg">
                  <Clock className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.pending}</p>
                  <p className="text-sm text-muted-foreground">Pending Review</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-success/10 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.accepted}</p>
                  <p className="text-sm text-muted-foreground">Accepted</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-destructive/10 rounded-lg">
                  <XCircle className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.rejected}</p>
                  <p className="text-sm text-muted-foreground">Rejected</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Question Banks Table */}
        <Card>
          <CardHeader>
            <CardTitle>My Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            {questionBanks.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No submissions yet</h3>
                <p className="text-muted-foreground mb-4">Get started by uploading your first question bank</p>
                <Button onClick={() => navigate('/upload')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Upload Question Bank
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold">Subject Name</TableHead>
                    <TableHead className="font-semibold">Submission Status</TableHead>
                    <TableHead className="font-semibold text-center">View Question Bank</TableHead>
                    <TableHead className="font-semibold">Comment</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {questionBanks.map((qb) => (
                    <TableRow key={qb.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="font-medium">{qb.subject}</TableCell>
                      <TableCell>
                        <StatusBadge status={qb.status} />
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/question-bank/${qb.id}?mode=faculty`)}
                          className="hover:bg-primary/10 hover:text-primary"
                        >
                          <Eye className="h-5 w-5" />
                        </Button>
                      </TableCell>
                      <TableCell>
                        {qb.comment ? (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="sm" className="text-destructive">
                                <MessageSquare className="h-4 w-4 mr-1" />
                                View
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs">
                              <p>{qb.comment}</p>
                            </TooltipContent>
                          </Tooltip>
                        ) : (
                          <span className="text-muted-foreground text-sm">—</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default FacultyDashboard;
