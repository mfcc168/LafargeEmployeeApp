import { ReportEntry } from "./index";

export interface ReportEntryFormProps {
  entries: ReportEntry[];
  submitting: boolean;
  isLoading: boolean;
  collapsedStates: boolean[];
  pagedDate: string;
  currentPage: number;
  sortedDates: string[];
  setCurrentPage: (page: number) => void;
  handleChange: <T extends keyof ReportEntry>(
    index: number, 
    field: T, 
    value: ReportEntry[T]
  ) => void;
  handleSubmitEntry: (index: number) => Promise<void>;
  handleDelete: (index: number) => Promise<void>;
  toggleCollapse: (index: number) => void;
  addEmptyEntry: () => void;
}