import {
  Folder,
  FolderOpen,
  FileText,
  Video,
  Map,
  Beaker,
  ChevronRight,
  ChevronDown,
  Edit3,
  Trash2,
  Plus,
  GripVertical,
  MoreHorizontal
} from 'lucide-react';

/**
 * Icon components for the application
 */

export const FolderIcon = ({ isOpen = false, ...props }) => {
  const Icon = isOpen ? FolderOpen : Folder;
  return <Icon {...props} />;
};

export const ContentIcon = ({ type, ...props }) => {
  const iconMap = {
    document: FileText,
    video: Video,
    map: Map,
    science: Beaker,
  };

  const Icon = iconMap[type] || FileText;
  return <Icon {...props} />;
};

export const ExpandIcon = ({ isExpanded = false, ...props }) => {
  const Icon = isExpanded ? ChevronDown : ChevronRight;
  return <Icon {...props} />;
};

export const EditIcon = Edit3;
export const DeleteIcon = Trash2;
export const PlusIcon = Plus;
export const DragIcon = GripVertical;
export const MoreIcon = MoreHorizontal;

export const XIcon = ({ size = 16, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="m18 6-12 12"/>
    <path d="m6 6 12 12"/>
  </svg>
);
