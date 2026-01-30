import { SubmissionStatus } from '@/types';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: SubmissionStatus;
  className?: string;
}

const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const statusConfig = {
    pending: {
      label: 'Pending',
      className: 'status-pending',
    },
    accepted: {
      label: 'Accepted',
      className: 'status-accepted',
    },
    rejected: {
      label: 'Rejected',
      className: 'status-rejected',
    },
  };

  const config = statusConfig[status];

  return (
    <span
      className={cn(
        'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium',
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
};

export default StatusBadge;
