import { useState } from "react";
import Hero from "@/components/Hero";
import LocationSearch from "@/components/LocationSearch";
import SoilData from "@/components/SoilData";
import { fetchSoilData, SoilData as SoilDataType } from "@/services/soilApi";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const Index = () => {
  const [soilData, setSoilData] = useState<SoilDataType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [locationName, setLocationName] = useState("");
  const { toast } = useToast();

  const handleLocationSubmit = async (lat: number, lon: number, name: string) => {
    setIsLoading(true);
    setLocationName(name);
    
    try {
      const data = await fetchSoilData(lat, lon);
      setSoilData(data);
      toast({
        title: "Success!",
        description: "Soil data retrieved successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch soil data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Hero />
      
      <div className="py-12">
        <LocationSearch onLocationSubmit={handleLocationSubmit} isLoading={isLoading} />
        
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Analyzing soil data...</p>
          </div>
        )}
        
        {soilData && !isLoading && (
          <SoilData data={soilData} locationName={locationName} />
        )}
      </div>
      
      <footer className="bg-muted py-8 mt-20">
        <div className="max-w-6xl mx-auto px-6 text-center text-muted-foreground">
          <p>Data powered by SoilGrids — Global gridded soil information</p>
          <p className="text-sm mt-2">© 2024 Soil Intelligence Platform</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
