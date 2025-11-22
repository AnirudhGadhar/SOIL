import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LocationSearchProps {
  onLocationSubmit: (lat: number, lon: number, locationName: string) => void;
  isLoading: boolean;
}

const LocationSearch = ({ onLocationSubmit, isLoading }: LocationSearchProps) => {
  const [location, setLocation] = useState("");
  const { toast } = useToast();

  const searchLocation = async () => {
    if (!location.trim()) {
      toast({
        title: "Location required",
        description: "Please enter a location to search",
        variant: "destructive",
      });
      return;
    }

    try {
      // Use Nominatim API for geocoding
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon, display_name } = data[0];
        onLocationSubmit(parseFloat(lat), parseFloat(lon), display_name);
      } else {
        toast({
          title: "Location not found",
          description: "Please try a different location",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to search location. Please try again.",
        variant: "destructive",
      });
    }
  };

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Not supported",
        description: "Geolocation is not supported by your browser",
        variant: "destructive",
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        onLocationSubmit(
          position.coords.latitude,
          position.coords.longitude,
          "Current Location"
        );
      },
      (error) => {
        toast({
          title: "Location error",
          description: "Unable to retrieve your location",
          variant: "destructive",
        });
      }
    );
  };

  return (
    <div className="max-w-2xl mx-auto p-6 animate-slide-up">
      <div className="bg-card rounded-lg shadow-soft p-8 border border-border">
        <h2 className="text-2xl font-semibold text-foreground mb-6 flex items-center gap-2">
          <MapPin className="w-6 h-6 text-primary" />
          Enter Location
        </h2>
        
        <div className="flex gap-3 mb-4">
          <Input
            type="text"
            placeholder="Enter city, region, or coordinates..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && searchLocation()}
            className="flex-1"
            disabled={isLoading}
          />
          <Button 
            onClick={searchLocation} 
            disabled={isLoading}
            className="bg-gradient-primary hover:opacity-90 transition-opacity"
          >
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
        </div>
        
        <Button
          onClick={useCurrentLocation}
          variant="outline"
          disabled={isLoading}
          className="w-full"
        >
          <MapPin className="w-4 h-4 mr-2" />
          Use Current Location
        </Button>
      </div>
    </div>
  );
};

export default LocationSearch;
