import { FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { jsPDF } from "jspdf";
import { toast } from "sonner";

interface GeneratePDFReportProps {
  data: {
    ph: number;
    organic_carbon: number;
    nitrogen: number;
    clay: number;
    sand: number;
    silt: number;
  };
  locationName: string;
  recommendedCrops: string[];
  soilTexture: string;
}

const GeneratePDFReport = ({ data, locationName, recommendedCrops, soilTexture }: GeneratePDFReportProps) => {
  
  const getAmendments = () => {
    const amendments: string[] = [];
    
    // pH amendments
    if (data.ph < 6.0) {
      amendments.push("Add agricultural lime (2-3 tons/acre) to raise pH");
    } else if (data.ph > 7.5) {
      amendments.push("Add elemental sulfur (300-500 lbs/acre) to lower pH");
    }
    
    // Organic matter
    if (data.organic_carbon < 2.0) {
      amendments.push("Incorporate compost or well-rotted manure (5-10 tons/acre)");
    }
    
    // Nitrogen
    if (data.nitrogen < 1.0) {
      amendments.push("Apply nitrogen-rich fertilizer (e.g., urea 46-0-0) at 100-150 lbs/acre");
    }
    
    // Texture-based amendments
    if (data.clay > 50) {
      amendments.push("Add coarse sand or gypsum to improve drainage");
    } else if (data.sand > 70) {
      amendments.push("Add organic matter to improve water retention");
    }
    
    if (amendments.length === 0) {
      amendments.push("No major amendments needed - soil is in good condition");
    }
    
    return amendments;
  };
  
  const getPlantingSchedule = () => {
    const crop = recommendedCrops[0] || "General Crops";
    const schedules: Record<string, any> = {
      Rice: {
        prep: "March - April: Prepare field, ensure water availability",
        plant: "May - June: Transplant seedlings in flooded field",
        maintain: "June - September: Maintain water levels, apply fertilizer",
        harvest: "October - November: Drain field and harvest when golden"
      },
      Wheat: {
        prep: "September: Prepare field with deep plowing",
        plant: "October - November: Direct seed at 100-120 lbs/acre",
        maintain: "December - March: Monitor for pests, apply nitrogen in spring",
        harvest: "April - May: Harvest when moisture content is 12-14%"
      },
      Corn: {
        prep: "March - April: Prepare seedbed, apply pre-plant fertilizer",
        plant: "April - May: Plant seeds 1.5-2 inches deep",
        maintain: "May - August: Side-dress nitrogen, control weeds",
        harvest: "September - October: Harvest when kernels are hard"
      },
      Tomatoes: {
        prep: "March: Start seeds indoors, prepare soil with compost",
        plant: "April - May: Transplant after last frost",
        maintain: "May - August: Stake plants, water regularly, prune suckers",
        harvest: "July - September: Harvest when fully colored"
      },
      Potatoes: {
        prep: "February - March: Prepare soil, ensure good drainage",
        plant: "March - April: Plant seed potatoes 4 inches deep",
        maintain: "April - July: Hill soil around plants, water consistently",
        harvest: "July - August: Harvest 2-3 weeks after foliage dies"
      },
      default: {
        prep: "Early Spring: Prepare soil, test nutrients",
        plant: "Spring: Plant after last frost date",
        maintain: "Growing Season: Water, fertilize, and monitor regularly",
        harvest: "Late Summer/Fall: Harvest when mature"
      }
    };
    return schedules[crop] || schedules.default;
  };

  const generatePDF = () => {
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 20;
      let yPosition = 20;

      // Title
      doc.setFontSize(22);
      doc.setTextColor(40, 40, 40);
      doc.text("Comprehensive Soil Analysis Report", pageWidth / 2, yPosition, { align: 'center' });
      
      yPosition += 12;
      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      doc.text(`Location: ${locationName}`, pageWidth / 2, yPosition, { align: 'center' });
      doc.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth / 2, yPosition + 6, { align: 'center' });
      
      // Section 1: Soil Summary
      yPosition += 20;
      doc.setFontSize(16);
      doc.setTextColor(0, 102, 204);
      doc.text("1. SOIL SUMMARY", margin, yPosition);
      
      yPosition += 8;
      doc.setFontSize(11);
      doc.setTextColor(60, 60, 60);
      
      const summaryLines = [
        `pH Level: ${data.ph.toFixed(1)} (${data.ph < 6.5 ? 'Acidic' : data.ph < 7.5 ? 'Neutral' : 'Alkaline'})`,
        `Organic Carbon: ${data.organic_carbon.toFixed(1)}%`,
        `Nitrogen Content: ${data.nitrogen.toFixed(2)} g/kg`,
        `Soil Texture: ${soilTexture}`,
        `  - Clay: ${data.clay.toFixed(1)}%`,
        `  - Sand: ${data.sand.toFixed(1)}%`,
        `  - Silt: ${data.silt.toFixed(1)}%`,
      ];
      
      summaryLines.forEach(line => {
        doc.text(line, margin, yPosition);
        yPosition += 6;
      });

      // Section 2: Recommended Amendments
      yPosition += 8;
      doc.setFontSize(16);
      doc.setTextColor(0, 102, 204);
      doc.text("2. RECOMMENDED SOIL AMENDMENTS", margin, yPosition);
      
      yPosition += 8;
      doc.setFontSize(11);
      doc.setTextColor(60, 60, 60);
      
      const amendments = getAmendments();
      amendments.forEach((amendment, idx) => {
        const lines = doc.splitTextToSize(`${idx + 1}. ${amendment}`, pageWidth - 2 * margin);
        lines.forEach((line: string) => {
          if (yPosition > 270) {
            doc.addPage();
            yPosition = 20;
          }
          doc.text(line, margin, yPosition);
          yPosition += 6;
        });
      });

      // Section 3: Recommended Crops
      yPosition += 8;
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
      doc.setFontSize(16);
      doc.setTextColor(0, 102, 204);
      doc.text("3. RECOMMENDED CROPS", margin, yPosition);
      
      yPosition += 8;
      doc.setFontSize(11);
      doc.setTextColor(60, 60, 60);
      doc.text(`Based on your soil conditions, we recommend:`, margin, yPosition);
      yPosition += 6;
      
      recommendedCrops.forEach((crop, idx) => {
        doc.text(`${idx + 1}. ${crop}`, margin + 5, yPosition);
        yPosition += 6;
      });

      // Section 4: Planting Schedule
      yPosition += 8;
      if (yPosition > 240) {
        doc.addPage();
        yPosition = 20;
      }
      doc.setFontSize(16);
      doc.setTextColor(0, 102, 204);
      doc.text(`4. PLANTING SCHEDULE FOR ${recommendedCrops[0]?.toUpperCase() || 'CROPS'}`, margin, yPosition);
      
      yPosition += 8;
      doc.setFontSize(11);
      doc.setTextColor(60, 60, 60);
      
      const schedule = getPlantingSchedule();
      Object.entries(schedule).forEach(([phase, description]) => {
        const phaseTitle = phase.charAt(0).toUpperCase() + phase.slice(1);
        doc.setFont(undefined, 'bold');
        doc.text(`${phaseTitle}:`, margin, yPosition);
        doc.setFont(undefined, 'normal');
        yPosition += 6;
        
        const lines = doc.splitTextToSize(description as string, pageWidth - 2 * margin - 5);
        lines.forEach((line: string) => {
          if (yPosition > 270) {
            doc.addPage();
            yPosition = 20;
          }
          doc.text(line, margin + 5, yPosition);
          yPosition += 6;
        });
        yPosition += 3;
      });

      // Footer
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(9);
        doc.setTextColor(150, 150, 150);
        doc.text(
          `Report generated by SoilIntel | Page ${i} of ${pageCount}`,
          pageWidth / 2,
          doc.internal.pageSize.getHeight() - 10,
          { align: 'center' }
        );
      }

      // Save the PDF
      doc.save(`soil-report-${locationName.replace(/[^a-z0-9]/gi, '-')}.pdf`);
      toast.success("PDF report generated successfully!");
      
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF report");
    }
  };

  return (
    <Button onClick={generatePDF} className="gap-2" size="lg">
      <FileDown className="w-5 h-5" />
      Generate PDF Report
    </Button>
  );
};

export default GeneratePDFReport;
