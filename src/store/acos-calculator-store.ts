import { create } from "zustand";
import {
  AcosCampaignData,
  ManualCampaignInput,
} from "@/components/amazon-seller-tools/acos-calculator/types";

interface AcosCalculatorState {
  campaigns: AcosCampaignData[];
  manualCampaign: ManualCampaignInput;
  manualErrors: { campaign: string; adSpend: string; sales: string };
  isLoading: boolean;
  setCampaigns: (campaigns: AcosCampaignData[]) => void;
  setManualCampaign: (manualCampaign: ManualCampaignInput) => void;
  setManualErrors: (errors: {
    campaign: string;
    adSpend: string;
    sales: string;
  }) => void;
  setIsLoading: (isLoading: boolean) => void;
  clearAllData: () => void;
}

export const useAcosCalculatorStore = create<AcosCalculatorState>((set) => ({
  campaigns: [],
  manualCampaign: { campaign: "", adSpend: "", sales: "" },
  manualErrors: { campaign: "", adSpend: "", sales: "" },
  isLoading: false,
  setCampaigns: (campaigns) => set({ campaigns }),
  setManualCampaign: (manualCampaign) => set({ manualCampaign }),
  setManualErrors: (manualErrors) => set({ manualErrors }),
  setIsLoading: (isLoading) => set({ isLoading }),
  clearAllData: () =>
    set({
      campaigns: [],
      manualCampaign: { campaign: "", adSpend: "", sales: "" },
      manualErrors: { campaign: "", adSpend: "", sales: "" },
      isLoading: false,
    }),
}));
