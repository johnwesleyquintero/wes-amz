import AmazonSellerTools from "@/pages/AmazonSellerTools";
import MainLayout from "@/components/layout/MainLayout";

const Tools = () => {
  return (
    <MainLayout>
      <AmazonSellerTools
        showCategories={true}
        showTable={true}
        showDetails={true}
        showCTA={true}
      />
    </MainLayout>
  );
};

export default Tools;
