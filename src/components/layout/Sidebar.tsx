import { NavLink } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Home, 
  FileText, 
  Upload, 
  Settings,
  ClipboardList,
  GraduationCap,
  BookOpen,
  Users,
  Building2,
  Layers
} from 'lucide-react';
import { cn } from '@/lib/utils';

const Sidebar = () => {
  const { user } = useAuth();

  const getNavItems = () => {
    if (user?.role === 'faculty') {
      return [
        { to: '/faculty', icon: Home, label: 'Dashboard' },
        { to: '/upload', icon: Upload, label: 'Upload Question Bank' },
        { to: '/generate', icon: Settings, label: 'Generate Questions' },
      ];
    }
    
    // Admin and Exam Cell Faculty
    if (user?.role == "exam_cell") {
      return [
        { to: '/exam_cell', icon: Home, label: 'Dashboard' },
        { to: '/generate', icon: ClipboardList, label: 'Question Generation' },
        { to: '/programs', icon: GraduationCap, label: 'Programs' },
        { to: '/courses', icon: BookOpen, label: 'Courses' },
        { to: '/users', icon: Users, label: 'Users' },
        { to: '/departments', icon: Building2, label: 'Departments' },
        { to: '/regulations', icon: FileText, label: 'Regulations' },
        { to: '/course-offerings', icon: Layers, label: 'Course Offerings' },
      ];
    } 
    return [
      { to: '/admin', icon: Home, label: 'Dashboard' }
    ]
  };

  const navItems = getNavItems();

  return (
    <aside className="w-64 min-h-[calc(100vh-72px)] bg-card border-r border-border">
      <nav className="p-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
                'text-muted-foreground hover:text-foreground hover:bg-accent',
                isActive && 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground'
              )
            }
          >
            <item.icon className="h-5 w-5" />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
