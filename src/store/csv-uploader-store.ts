import { create } from "zustand";
import { GenericCsvRow } from "@/components/amazon-seller-tools/CsvUploader";

interface CsvUploaderState {
  isParsing: boolean;
  progress: number;
  parsingError: string | null;
  fileNameDisplay: string | null;
  accumulatedData: GenericCsvRow[];
  setData: (data: GenericCsvRow[]) => void;
  setParsingStatus: (isParsing: boolean) => void;
  setProgress: (progress: number) => void;
  setError: (error: string | null) => void;
  setFileName: (name: string | null) => void;
  clearState: () => void;
}

export const useCsvUploaderStore = create<CsvUploaderState>((set) => ({
  isParsing: false,
  progress: 0,
  parsingError: null,
  fileNameDisplay: null,
  accumulatedData: [],
  setData: (data) => set({ accumulatedData: data }),
  setParsingStatus: (isParsing) => set({ isParsing }),
  setProgress: (progress) => set({ progress }),
  setError: (error) => set({ parsingError: error }),
  setFileName: (name) => set({ fileNameDisplay: name }),
  clearState: () =>
    set({
      isParsing: false,
      progress: 0,
      parsingError: null,
      fileNameDisplay: null,
      accumulatedData: [],
    }),
}));
