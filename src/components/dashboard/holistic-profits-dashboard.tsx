import React from "react";
import { ToolContainer } from "../amazon-seller-tools/shared/ToolContainer";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";

const HolisticProfitsDashboard: React.FC = () => {
  return (
    <ToolContainer
      title="Holistic Profits Dashboard"
      description="A central hub for a seller's financial health, showing real-time Net Profit and Margin with trends over time."
    >
      <div className="grid gap-4 py-4">
        <Card>
          <CardHeader>
            <CardTitle>Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">$12,345.67</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Ad Spend</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">-$1,234.56</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Amazon Fees</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">-$2,345.67</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Cost of Goods (COGS)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">-$3,456.78</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Other Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">-$123.45</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Net Profit</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">$5,185.11</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Net Margin</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">42.00%</p>
          </CardContent>
        </Card>
      </div>
    </ToolContainer>
  );
};

export default HolisticProfitsDashboard;
