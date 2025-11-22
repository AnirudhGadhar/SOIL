// SoilGrids API service
// Documentation: https://rest.isric.org/soilgrids/v2.0/docs

interface SoilGridsResponse {
  properties: {
    layers: Array<{
      name: string;
      depths: Array<{
        values: {
          mean: number;
        };
      }>;
    }>;
  };
}

export interface SoilData {
  ph: number;
  organic_carbon: number;
  nitrogen: number;
  clay: number;
  sand: number;
  silt: number;
}

export const fetchSoilData = async (lat: number, lon: number): Promise<SoilData> => {
  const baseUrl = "https://rest.isric.org/soilgrids/v2.0/properties/query";
  
  // Properties to fetch from SoilGrids
  const properties = [
    "phh2o",      // pH in H2O
    "soc",        // Soil organic carbon
    "nitrogen",   // Total nitrogen
    "clay",       // Clay content
    "sand",       // Sand content
    "silt"        // Silt content
  ];

  const depth = "0-5cm"; // Top soil layer
  const url = `${baseUrl}?lon=${lon}&lat=${lat}&property=${properties.join("&property=")}&depth=${depth}`;

  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error("Failed to fetch soil data");
    }

    const data: SoilGridsResponse = await response.json();
    
    // Extract values from the response
    const getValue = (propertyName: string): number => {
      const layer = data.properties.layers.find(l => l.name === propertyName);
      if (!layer || !layer.depths[0]) return 0;
      return layer.depths[0].values.mean;
    };

    // Convert units and return
    return {
      ph: getValue("phh2o") / 10, // pH is stored as pH*10
      organic_carbon: getValue("soc") / 10, // g/kg to percentage
      nitrogen: getValue("nitrogen") / 100, // cg/kg to g/kg
      clay: getValue("clay") / 10, // g/kg to percentage
      sand: getValue("sand") / 10, // g/kg to percentage
      silt: getValue("silt") / 10, // g/kg to percentage
    };
  } catch (error) {
    console.error("Error fetching soil data:", error);
    throw error;
  }
};
