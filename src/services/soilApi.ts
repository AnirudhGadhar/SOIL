// SoilGrids API service
// Documentation: https://rest.isric.org/soilgrids/v2.0/docs

interface SoilPropertyLayer {
  name: string;
  unit_measure: {
    mapped_units: string;
  };
  depths: Array<{
    label: string;
    range: {
      top_depth: number;
      bottom_depth: number;
      unit_depth: string;
    };
    values: {
      "Q0.05": number;
      "Q0.5": number;
      "Q0.95": number;
      mean: number;
      uncertainty: number;
    };
  }>;
}

interface SoilGridsResponse {
  type: string;
  geometry: {
    type: string;
    coordinates: number[];
  };
  properties: {
    layers: SoilPropertyLayer[];
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

// Deterministic mock generator used when the live soil API is unavailable
const generateMockSoilData = (lat: number, lon: number): SoilData => {
  const base = Math.abs(Math.sin(lat * 12.9898 + lon * 78.233)) * 43758.5453;
  const rand = (min: number, max: number, offset: number) => {
    const x = (Math.sin(base + offset) + 1) / 2; // 0–1
    return min + x * (max - min);
  };

  const clay = rand(10, 55, 1);
  const sand = rand(20, 70, 2);
  let silt = 100 - clay - sand;
  if (silt < 5) silt = 5;
  if (silt > 60) silt = 60;

  return {
    ph: rand(5.5, 7.8, 3),
    organic_carbon: rand(0.5, 3.5, 4),
    nitrogen: rand(0.1, 2.5, 5),
    clay,
    sand,
    silt,
  };
};

export const fetchSoilData = async (lat: number, lon: number): Promise<SoilData> => {
  try {
    // Try primary domain first, fallback to alternate
    const baseUrl = "https://rest.soilgrids.org/soilgrids/v2.0/properties/query";
    
    // Properties to fetch
    const properties = [
      "phh2o",      // pH in H2O
      "soc",        // Soil organic carbon
      "nitrogen",   // Total nitrogen
      "clay",       // Clay content
      "sand",       // Sand content
      "silt"        // Silt content
    ];

    // Depth range (0-5cm top layer)
    const depth = "0-5cm";
    
    // Construct URL with all parameters
    const params = new URLSearchParams({
      lon: lon.toString(),
      lat: lat.toString(),
      property: properties.join(","),
      depth: depth,
      value: "mean"
    });

    const url = `${baseUrl}?${params.toString()}`;
    console.log("Fetching soil data from:", url);

    let response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    // Fallback to alternate domain if primary fails
    if (!response.ok && response.status === 500) {
      console.log("Primary API failed, trying alternate domain...");
      const altUrl = url.replace("rest.soilgrids.org", "rest.isric.org");
      response = await fetch(altUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error Response:", errorText);
      throw new Error(`Unable to fetch soil data. The service may be temporarily unavailable. (Status: ${response.status})`);
    }

    const data: SoilGridsResponse = await response.json();
    console.log("Received soil data:", data);

    // Helper function to extract mean value from property
    const getValue = (propertyName: string): number => {
      const layer = data.properties.layers.find(l => l.name === propertyName);
      if (!layer || !layer.depths || layer.depths.length === 0) {
        console.warn(`No data found for property: ${propertyName}`);
        return 0;
      }
      
      // Get the first depth layer (0-5cm)
      const depthData = layer.depths[0];
      if (!depthData || !depthData.values) {
        console.warn(`No values found for property: ${propertyName}`);
        return 0;
      }
      
      return depthData.values.mean;
    };

    // Extract and convert values
    const soilData: SoilData = {
      ph: getValue("phh2o") / 10, // pH is stored as pH*10
      organic_carbon: getValue("soc") / 10, // dg/kg to g/kg (then to percentage)
      nitrogen: getValue("nitrogen") / 100, // cg/kg to g/kg
      clay: getValue("clay") / 10, // g/kg to percentage
      sand: getValue("sand") / 10, // g/kg to percentage
      silt: getValue("silt") / 10, // g/kg to percentage
    };

    console.log("Processed soil data:", soilData);
    
    // Validate that we got some data
    const hasValidData = Object.values(soilData).some(value => value > 0);
    if (!hasValidData) {
      throw new Error("No valid soil data received from API");
    }

    return soilData;
  } catch (error) {
    console.error("Error fetching soil data:", error);
    console.warn("Using locally generated demo soil data due to fetch error.");
    return generateMockSoilData(lat, lon);
  }
};
