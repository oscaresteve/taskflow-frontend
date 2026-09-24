import {
  Trash2,
  Archive,
  ShieldMinus,
  UserX,
  LogOut,
  CalendarIcon,
  CalendarPlus,
  CircleAlertIcon,
  ListSortAscending,
  ListSortDescending,
  Loader2Icon,
  MoreHorizontal,
  MoreVertical,
  XIcon,
  CheckIcon,
  EyeIcon,
  EyeOffIcon,
  SearchIcon,
  Palette,
  Info,
  SquarePen,
  Sun,
  Moon,
  Monitor,
  ChevronDown,
  ChevronsUpDown,
  Settings,
  Settings2,
  Users,
  LayoutDashboard,
  Kanban,
  List,
  Orbit,
  FolderKanban,
  SquareCheck,
  Plus,
  ExternalLink,
  Workflow,
  Building2,
  UserCircle,
  UserIcon,
  ListTodo,
  AlertTriangle,
  CheckCircle2,
  CircleCheckIcon,
  ClockIcon,
  CircleMinusIcon,
  UserCheck,
  UserCog,
  UserPlus,
  CircleDashedIcon,
  CircleDotDashedIcon,
  CircleEllipsisIcon,
  CircleCheckBigIcon,
  ChevronDownIcon,
  EqualIcon,
  ChevronUpIcon,
  ChevronsUpIcon,
  CrownIcon,
  ShieldIcon,
  UsersIcon,
  ListFilter,
  CalendarClock,
  Star,
  ChevronRightIcon,
  type LucideIcon,
  MessagesSquare,
} from "lucide-react";

export const ICONS = {
  // Acciones destructivas / ciclo de vida
  delete: Trash2,
  archive: Archive,
  deactivate: ShieldMinus,
  removeMember: UserX,
  logOut: LogOut,

  // Fecha limite
  dueDate: CalendarIcon,
  dueDateEmpty: CalendarPlus,
  overdue: CircleAlertIcon,

  // Orden
  sortAsc: ListSortAscending,
  sortDesc: ListSortDescending,

  // Estado de carga
  loading: Loader2Icon,

  // Menus / Acciones
  moreActions: MoreHorizontal,
  moreOptions: MoreVertical,

  // Familia "X" — mismo glifo hoy, clave propia por significado para no acoplar cambios futuros
  close: XIcon,
  cancel: XIcon,
  clear: XIcon,
  removeChip: XIcon,

  // Formularios
  confirm: CheckIcon,
  edit: SquarePen,
  passwordShow: EyeIcon,
  passwordHide: EyeOffIcon,
  search: SearchIcon,
  colorSwatch: Palette,
  info: Info,

  // Tema
  themeLight: Sun,
  themeDark: Moon,
  themeSystem: Monitor,

  // Navegacion / chrome
  expand: ChevronDown,
  chevronRight: ChevronRightIcon,
  chevronUpDown: ChevronsUpDown,
  settings: Settings,
  preferences: Settings2,
  members: Users,
  overview: LayoutDashboard,
  kanban: Kanban,
  list: List,
  workspace: Orbit,
  project: FolderKanban,
  task: SquareCheck,
  addNew: Plus,
  favorite: Star,
  openExternal: ExternalLink,
  logo: Workflow,
  createWorkspace: Building2,
  mySpace: UserCircle,
  person: UserIcon,
  messages: MessagesSquare,

  // Stat cards de los dashboards
  statOpenTasks: ListTodo,
  statOverdue: AlertTriangle,
  statCompleted: CheckCircle2,
  statUnassigned: UserX,

  // Estado de miembros
  memberActive: CircleCheckIcon,
  memberPending: ClockIcon,
  memberInactive: CircleMinusIcon,
  memberActivate: UserCheck,
  memberChangeRole: UserCog,
  memberAdd: UserPlus,

  // Task enums
  statusTodo: CircleDashedIcon,
  statusInProgress: CircleDotDashedIcon,
  statusInReview: CircleEllipsisIcon,
  statusDone: CircleCheckBigIcon,
  priorityLow: ChevronDownIcon,
  priorityMedium: EqualIcon,
  priorityHigh: ChevronUpIcon,
  priorityUrgent: ChevronsUpIcon,
  priorityAll: ListFilter,
  dueDateThisWeek: CalendarClock,

  // Member enums
  roleOwner: CrownIcon,
  roleAdmin: ShieldIcon,
  roleMember: UserIcon,
  roleAll: UsersIcon,
} as const satisfies Record<string, LucideIcon>;

// Derivado del propio registro, no reexportado a mano: si algun dia se cambia de libreria de
// iconos (p.ej. a Tabler), este tipo se actualiza solo con los valores de ICONS, sin depender de
// que el nombre del tipo de la nueva libreria siga llamandose igual.
export type Icon = (typeof ICONS)[keyof typeof ICONS];
