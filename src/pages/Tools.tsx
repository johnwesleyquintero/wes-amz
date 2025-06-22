import AmazonSellerTools from "@/pages/AmazonSellerTools";
import MainLayout from "@/components/layout/MainLayout";

interface ToolsProps {
  showCategories: boolean;
  showTable: boolean;
  showDetails: boolean;
  showCTA: boolean;
}

const Tools = ({
  showCategories,
  showTable,
  showDetails,
  showCTA,
}: ToolsProps) => {
  return (
    <MainLayout>
      <AmazonSellerTools
        showCategories={showCategories}
        showTable={showTable}
        showDetails={showDetails}
        showCTA={showCTA}
      />
    </MainLayout>
  );
};

export default Tools;
