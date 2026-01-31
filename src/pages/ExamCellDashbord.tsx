import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockQuestionBanks } from '@/data/mockData';
import MainLayout from '@/components/layout/MainLayout';
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
import { Eye, FileText, Clock, CheckCircle, XCircle } from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [questionBanks] = useState(mockQuestionBanks);

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
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage and review question bank submissions</p>
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
        </div>

        {/* Question Banks Table */}
        <Card>
          <CardHeader>
            <CardTitle>Question Bank Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">Faculty Name</TableHead>
                  <TableHead className="font-semibold">Reviwer</TableHead>
                  <TableHead className="font-semibold">Subject</TableHead>
                  <TableHead className="font-semibold">Submitted at</TableHead>
                  <TableHead className="font-semibold text-center">View Question Bank</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {questionBanks.map((qb) => (
                  <TableRow key={qb.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="font-medium">{qb.facultyName}</TableCell>
                    <TableCell className="font-medium">{qb.reviewer}</TableCell>
                    <TableCell>{qb.subject}</TableCell>
                    <TableCell>{qb.date}
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/question-bank/${qb.id}`)}
                        className="hover:bg-primary/10 hover:text-primary"
                      >
                        <Eye className="h-5 w-5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default AdminDashboard;
