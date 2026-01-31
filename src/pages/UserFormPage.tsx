import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ArrowLeft, Loader2, Eye, EyeOff, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import MainLayout from '@/components/layout/MainLayout';
import { usersApi, Role, User } from '@/services/api';

const UserFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const { toast } = useToast();

  const isEditMode = Boolean(id);
  const userFromState = location.state?.user as User | undefined;

  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRoleIds, setSelectedRoleIds] = useState<number[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRoles();
  }, []);

  useEffect(() => {
    if (isEditMode && userFromState && roles.length > 0) {
      setName(userFromState.name);
      setUsername(userFromState.username || '');
      // Match role names to IDs
      const matchedRoleIds = roles
        .filter((r) => userFromState.roles.includes(r.role_name))
        .map((r) => r.id);
      setSelectedRoleIds(matchedRoleIds);
    }
  }, [isEditMode, userFromState, roles]);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const data = await usersApi.getRolesDropdown();
      setRoles(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch roles.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleRole = (roleId: number) => {
    setSelectedRoleIds((prev) =>
      prev.includes(roleId)
        ? prev.filter((id) => id !== roleId)
        : [...prev, roleId]
    );
  };

  const removeRole = (roleId: number) => {
    setSelectedRoleIds((prev) => prev.filter((id) => id !== roleId));
  };

  const getSelectedRoleNames = () => {
    return selectedRoleIds
      .map((id) => roles.find((r) => r.id === id)?.role_name)
      .filter(Boolean);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedUsername = username.trim();
    const trimmedName = name.trim();

    if (!trimmedUsername || !trimmedName) {
      toast({
        title: 'Validation Error',
        description: 'Username and Name are required.',
        variant: 'destructive',
      });
      return;
    }

    if (!isEditMode && !password) {
      toast({
        title: 'Validation Error',
        description: 'Password is required.',
        variant: 'destructive',
      });
      return;
    }

    if (password && password.length < 4) {
      toast({
        title: 'Validation Error',
        description: 'Password must be at least 4 characters.',
        variant: 'destructive',
      });
      return;
    }

    if (selectedRoleIds.length === 0) {
      toast({
        title: 'Validation Error',
        description: 'Please select at least one role.',
        variant: 'destructive',
      });
      return;
    }

    setSubmitting(true);

    try {
      const payload: any = {
        username: trimmedUsername,
        name: trimmedName,
        roles: selectedRoleIds.map((id) => ({ id })),
      };

      if (password) {
        payload.password = password;
      }

      if (isEditMode && id) {
        await usersApi.update(parseInt(id), payload);
        toast({
          title: 'Success',
          description: 'User updated successfully.',
        });
      } else {
        await usersApi.create(payload);
        toast({
          title: 'Success',
          description: 'User added successfully.',
        });
      }
      navigate('/users');
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${isEditMode ? 'update' : 'add'} user.`,
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate('/users');
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

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
          Back to Users
        </Button>

        {/* Form Card */}
        <div className="flex items-center justify-center">
          <Card className="w-full max-w-md shadow-md">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold underline underline-offset-4 decoration-2">
                {isEditMode ? 'Edit User' : 'Add User'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">
                    Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={submitting}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username" className="text-sm font-medium">
                    Username <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={submitting}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password {!isEditMode && <span className="text-destructive">*</span>}
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder={isEditMode ? 'Leave blank to keep current' : 'Enter password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={submitting}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Roles <span className="text-destructive">*</span>
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between font-normal min-h-11"
                        disabled={submitting}
                      >
                        <div className="flex flex-wrap gap-1 flex-1">
                          {selectedRoleIds.length === 0 ? (
                            <span className="text-muted-foreground">Select roles</span>
                          ) : (
                            getSelectedRoleNames().map((roleName, idx) => (
                              <Badge
                                key={idx}
                                variant="secondary"
                                className="bg-primary/10 text-primary"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeRole(selectedRoleIds[idx]);
                                }}
                              >
                                {roleName}
                                <X className="ml-1 h-3 w-3" />
                              </Badge>
                            ))
                          )}
                        </div>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[250px] p-0" align="start">
                      <div className="p-2 border-b text-xs font-medium text-muted-foreground">
                        Select one or more roles
                      </div>
                      <div className="p-2 space-y-1">
                        {roles.map((role) => (
                          <div
                            key={role.id}
                            className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer ${
                              selectedRoleIds.includes(role.id)
                                ? 'bg-primary/10'
                                : 'hover:bg-muted'
                            }`}
                            onClick={() => toggleRole(role.id)}
                          >
                            <Checkbox checked={selectedRoleIds.includes(role.id)} />
                            <span className="text-sm">{role.role_name}</span>
                          </div>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="flex justify-end gap-3 pt-2">
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

export default UserFormPage;
