import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import MainLayout from '@/components/layout/MainLayout';
import { regulationsApi, Regulation, SectionRule } from '@/services/api';

interface SectionConfig {
  id: number;
  section_name: string;
  marks: number | '';
  min_questions_count: number | '';
}

const RegulationFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const { toast } = useToast();

  const isEditMode = Boolean(id);
  const regulationFromState = location.state?.regulation as Regulation | undefined;

  const [regulationName, setRegulationName] = useState('');
  const [sectionCount, setSectionCount] = useState<number | ''>('');
  const [sections, setSections] = useState<SectionConfig[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isEditMode && regulationFromState) {
      setRegulationName(regulationFromState.regulation_name);
      const count = regulationFromState.section_rules.length;
      setSectionCount(count);
      setSections(
        regulationFromState.section_rules.map((s, idx) => ({
          id: idx + 1,
          section_name: s.section_name,
          marks: s.marks,
          min_questions_count: s.min_questions_count,
        }))
      );
    }
  }, [isEditMode, regulationFromState]);

  const handleSectionCountChange = (value: string) => {
    const count = value === '' ? '' : Math.max(0, parseInt(value) || 0);
    setSectionCount(count);

    if (typeof count === 'number' && count > 0) {
      const newSections: SectionConfig[] = Array.from({ length: count }, (_, i) => ({
        id: i + 1,
        section_name: sections[i]?.section_name || '',
        marks: sections[i]?.marks ?? '',
        min_questions_count: sections[i]?.min_questions_count ?? '',
      }));
      setSections(newSections);
    } else {
      setSections([]);
    }
  };

  const handleSectionChange = (
    sectionId: number,
    field: keyof Omit<SectionConfig, 'id'>,
    value: string
  ) => {
    setSections((prev) =>
      prev.map((section) => {
        if (section.id === sectionId) {
          if (field === 'section_name') {
            return { ...section, [field]: value };
          }
          const numValue = value === '' ? '' : Math.max(0, parseInt(value) || 0);
          return { ...section, [field]: numValue };
        }
        return section;
      })
    );
  };

  const validateForm = (): boolean => {
    const trimmedName = regulationName.trim();

    if (!trimmedName) {
      toast({
        title: 'Validation Error',
        description: 'Regulation name is required.',
        variant: 'destructive',
      });
      return false;
    }

    if (sectionCount === '' || sectionCount <= 0) {
      toast({
        title: 'Validation Error',
        description: 'Section count must be at least 1.',
        variant: 'destructive',
      });
      return false;
    }

    for (const section of sections) {
      if (!section.section_name.trim()) {
        toast({
          title: 'Validation Error',
          description: `Section ${section.id}: Section name is required.`,
          variant: 'destructive',
        });
        return false;
      }

      if (section.marks === '' || section.marks <= 0) {
        toast({
          title: 'Validation Error',
          description: `Section ${section.id}: Marks must be at least 1.`,
          variant: 'destructive',
        });
        return false;
      }

      if (section.min_questions_count === '' || section.min_questions_count <= 0) {
        toast({
          title: 'Validation Error',
          description: `Section ${section.id}: Minimum questions must be at least 1.`,
          variant: 'destructive',
        });
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setSubmitting(true);

    try {
      const payload = {
        regulation_name: regulationName.trim(),
        section_rules: sections.map((s) => ({
          section_name: s.section_name.trim(),
          marks: s.marks as number,
          min_questions_count: s.min_questions_count as number,
        })),
      };

      if (isEditMode && id) {
        await regulationsApi.update(parseInt(id), payload);
        toast({
          title: 'Success',
          description: 'Regulation updated successfully.',
        });
      } else {
        await regulationsApi.create(payload);
        toast({
          title: 'Success',
          description: 'Regulation added successfully.',
        });
      }
      navigate('/regulations');
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${isEditMode ? 'update' : 'add'} regulation.`,
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate('/regulations');
  };

  return (
    <MainLayout>
      <div className="p-6 min-h-[calc(100vh-72px)]">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={handleBack}
          className="mb-6 -ml-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Regulations
        </Button>

        {/* Form Card */}
        <div className="flex items-center justify-center">
          <Card className="w-full max-w-2xl shadow-md">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold underline underline-offset-4 decoration-2">
                {isEditMode ? 'Edit Regulation' : 'Add Regulation'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Top-level fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="regulationName" className="text-sm font-medium">
                      Regulation Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="regulationName"
                      type="text"
                      placeholder="e.g., R18, R20, R22"
                      value={regulationName}
                      onChange={(e) => setRegulationName(e.target.value)}
                      disabled={submitting}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sectionCount" className="text-sm font-medium">
                      Section Count <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="sectionCount"
                      type="number"
                      min="0"
                      placeholder="Enter number of sections"
                      value={sectionCount}
                      onChange={(e) => handleSectionCountChange(e.target.value)}
                      disabled={submitting}
                    />
                  </div>
                </div>

                {/* Dynamic Section Configuration */}
                {sections.length > 0 && (
                  <>
                    <Separator className="my-6" />
                    <div className="space-y-6">
                      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                        Section Configuration
                      </h3>

                      {sections.map((section) => (
                        <div
                          key={section.id}
                          className="p-4 border rounded-lg bg-muted/30 space-y-4"
                        >
                          <h4 className="text-sm font-medium text-foreground">
                            Section {section.id}
                          </h4>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <Label className="text-xs font-medium">
                                Section Name <span className="text-destructive">*</span>
                              </Label>
                              <Input
                                type="text"
                                placeholder="e.g., Part A"
                                value={section.section_name}
                                onChange={(e) =>
                                  handleSectionChange(section.id, 'section_name', e.target.value)
                                }
                                disabled={submitting}
                              />
                            </div>

                            <div className="space-y-2">
                              <Label className="text-xs font-medium">
                                Marks <span className="text-destructive">*</span>
                              </Label>
                              <Input
                                type="number"
                                min="1"
                                placeholder="Marks"
                                value={section.marks}
                                onChange={(e) =>
                                  handleSectionChange(section.id, 'marks', e.target.value)
                                }
                                disabled={submitting}
                              />
                            </div>

                            <div className="space-y-2">
                              <Label className="text-xs font-medium">
                                Min. Questions <span className="text-destructive">*</span>
                              </Label>
                              <Input
                                type="number"
                                min="1"
                                placeholder="Minimum"
                                value={section.min_questions_count}
                                onChange={(e) =>
                                  handleSectionChange(
                                    section.id,
                                    'min_questions_count',
                                    e.target.value
                                  )
                                }
                                disabled={submitting}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    disabled={submitting}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="px-6" disabled={submitting}>
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        {isEditMode ? 'Updating...' : 'Adding...'}
                      </>
                    ) : isEditMode ? (
                      'Update'
                    ) : (
                      'Add'
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default RegulationFormPage;
