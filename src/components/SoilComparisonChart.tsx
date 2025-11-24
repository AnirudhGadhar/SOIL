import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface SoilComparisonChartProps {
  actualData: {
    ph: number;
    organic_carbon: number;
    nitrogen: number;
    clay: number;
    sand: number;
    silt: number;
  };
  primaryCrop: string;
}

const SoilComparisonChart = ({ actualData, primaryCrop }: SoilComparisonChartProps) => {
  // Define ideal soil conditions for the primary recommended crop
  const getIdealSoilConditions = (crop: string) => {
    const ideals: Record<string, any> = {
      Rice: { ph: 6.5, organic_carbon: 2.5, nitrogen: 1.5, clay: 45, sand: 30, silt: 25 },
      Wheat: { ph: 6.8, organic_carbon: 2.0, nitrogen: 1.2, clay: 35, sand: 35, silt: 30 },
      Corn: { ph: 6.5, organic_carbon: 3.0, nitrogen: 1.8, clay: 30, sand: 40, silt: 30 },
      Tomatoes: { ph: 6.5, organic_carbon: 3.5, nitrogen: 2.0, clay: 25, sand: 45, silt: 30 },
      Potatoes: { ph: 5.5, organic_carbon: 2.5, nitrogen: 1.5, clay: 20, sand: 60, silt: 20 },
      Blueberries: { ph: 5.0, organic_carbon: 4.0, nitrogen: 1.5, clay: 15, sand: 65, silt: 20 },
      Carrots: { ph: 6.0, organic_carbon: 2.0, nitrogen: 1.0, clay: 20, sand: 60, silt: 20 },
      Soybeans: { ph: 6.5, organic_carbon: 2.5, nitrogen: 1.3, clay: 35, sand: 35, silt: 30 },
      default: { ph: 6.5, organic_carbon: 2.5, nitrogen: 1.5, clay: 30, sand: 40, silt: 30 }
    };
    return ideals[crop] || ideals.default;
  };

  const ideal = getIdealSoilConditions(primaryCrop);

  // Normalize data to 0-100 scale for better visualization
  const normalizeValue = (value: number, max: number) => (value / max) * 100;

  const chartData = [
    {
      metric: 'pH',
      actual: normalizeValue(actualData.ph, 14),
      ideal: normalizeValue(ideal.ph, 14),
    },
    {
      metric: 'Organic C (%)',
      actual: normalizeValue(actualData.organic_carbon, 5),
      ideal: normalizeValue(ideal.organic_carbon, 5),
    },
    {
      metric: 'Nitrogen',
      actual: normalizeValue(actualData.nitrogen, 3),
      ideal: normalizeValue(ideal.nitrogen, 3),
    },
    {
      metric: 'Clay (%)',
      actual: normalizeValue(actualData.clay, 100),
      ideal: normalizeValue(ideal.clay, 100),
    },
    {
      metric: 'Sand (%)',
      actual: normalizeValue(actualData.sand, 100),
      ideal: normalizeValue(ideal.sand, 100),
    },
    {
      metric: 'Silt (%)',
      actual: normalizeValue(actualData.silt, 100),
      ideal: normalizeValue(ideal.silt, 100),
    },
  ];

  return (
    <Card className="shadow-strong">
      <CardHeader className="bg-gradient-primary text-primary-foreground rounded-t-lg">
        <CardTitle>Comparative Soil Analysis</CardTitle>
        <CardDescription className="text-primary-foreground/80">
          Your soil vs. ideal conditions for {primaryCrop}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <ResponsiveContainer width="100%" height={400}>
          <RadarChart data={chartData}>
            <PolarGrid stroke="hsl(var(--border))" />
            <PolarAngleAxis 
              dataKey="metric" 
              tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
            />
            <PolarRadiusAxis 
              angle={90} 
              domain={[0, 100]} 
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <Radar
              name="Your Soil"
              dataKey="actual"
              stroke="hsl(var(--primary))"
              fill="hsl(var(--primary))"
              fillOpacity={0.5}
            />
            <Radar
              name={`Ideal for ${primaryCrop}`}
              dataKey="ideal"
              stroke="hsl(var(--chart-2))"
              fill="hsl(var(--chart-2))"
              fillOpacity={0.3}
            />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="circle"
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
        <p className="text-sm text-muted-foreground mt-4 text-center">
          The closer the areas overlap, the better your soil matches the ideal conditions for {primaryCrop}.
        </p>
      </CardContent>
    </Card>
  );
};

export default SoilComparisonChart;
