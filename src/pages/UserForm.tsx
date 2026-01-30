import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger, } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff } from 'lucide-react';

const roles = [
    { id: 'admin', label: 'Admin' },
    { id: 'exam_cell', label: 'Exam Cell Faculty' },
    { id: 'faculty', label: 'Faculty' },
];

interface UserData {
    username: string;
    password: string;
    roles: string[];
    name: string;
}


const UserForm = () => {
    const { toast } = useToast();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState<UserData>({
        username: '',
        password: '',
        roles: [],
        name: '',
    });

    const toggleRole = (roleId: string) => {
        setFormData((prev) => ({
            ...prev,
            roles: prev.roles.includes(roleId)
                ? prev.roles.filter((r) => r !== roleId)
                : [...prev.roles, roleId],
        }));
    };

    const removeRole = (roleId: string) => {
        setFormData((prev) => ({
            ...prev,
            roles: prev.roles.filter((r) => r !== roleId),
        }));
    };

    const getSelectedRoleNames = () =>
        formData.roles
            .map((id) => roles.find((r) => r.id === id)?.label)
            .filter(Boolean);


    const handleInputChange = (field: keyof UserData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.username.trim() || !formData.password.trim() || !formData.name.trim()) {
            toast({
                title: 'Validation Error',
                description: 'Please fill in all fields',
                variant: 'destructive',
            });
            return;
        }

        if (formData.roles.length === 0) {
            toast({
                title: 'Validation Error',
                description: 'Please select at least one role',
                variant: 'destructive',
            });
            return;
        }


        if (formData.password.length < 4) {
            toast({
                title: 'Validation Error',
                description: 'Password must be at least 4 characters',
                variant: 'destructive',
            });
            return;
        }

        toast({
            title: 'User Added',
            description: `User "${formData.username}" has been created successfully.`,
        });

        // Reset form
        setFormData({
            username: '',
            password: '',
            roles: [],
            name: '',
        });

    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <Card className="w-full max-w-md shadow-md">
                <CardHeader className="pb-4">
                    <CardTitle className="text-xl font-bold text-foreground underline underline-offset-4">
                        User
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="username" className="text-muted-foreground">
                                Username
                            </Label>
                            <Input
                                id="username"
                                type="text"
                                placeholder="Enter username"
                                value={formData.username}
                                onChange={(e) => handleInputChange('username', e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-muted-foreground">
                                Password
                            </Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Enter password"
                                    value={formData.password}
                                    onChange={(e) => handleInputChange('password', e.target.value)}
                                    className="pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-muted-foreground">
                                Roles <span className="text-destructive">*</span>
                            </Label>

                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        className="w-full justify-between font-normal min-h-11"
                                    >
                                        <div className="flex flex-wrap gap-1 flex-1">
                                            {formData.roles.length === 0 ? (
                                                <span className="text-muted-foreground">Select roles</span>
                                            ) : (
                                                getSelectedRoleNames().map((role, idx) => (
                                                    <Badge
                                                        key={idx}
                                                        variant="secondary"
                                                        className="bg-primary/10 text-primary"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            removeRole(formData.roles[idx]);
                                                        }}
                                                    >
                                                        {role}
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
                                                className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer ${formData.roles.includes(role.id)
                                                    ? 'bg-primary/10'
                                                    : 'hover:bg-muted'
                                                    }`}
                                                onClick={() => toggleRole(role.id)}
                                            >
                                                <Checkbox checked={formData.roles.includes(role.id)} />
                                                <span className="text-sm">{role.label}</span>
                                            </div>
                                        ))}
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </div>


                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-muted-foreground">
                                Name
                            </Label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="Enter full name"
                                value={formData.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                            />
                        </div>

                        <div className="flex justify-end pt-2">
                            <Button type="submit">Add User</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default UserForm;
