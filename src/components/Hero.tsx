import { Sprout, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const Hero = () => {
  const scrollToSearch = () => {
    const searchElement = document.getElementById('search');
    if (searchElement) {
      searchElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="relative overflow-hidden bg-gradient-hero py-24 md:py-32 px-6 text-center" id="home">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLW9wYWNpdHk9Ii4wNSIvPjwvZz48L3N2Zz4=')] opacity-10"></div>
      
      <div className="relative max-w-5xl mx-auto animate-fade-in">
        <div className="inline-flex items-center justify-center w-20 h-20 mb-8 bg-background/20 backdrop-blur-sm rounded-full shadow-strong">
          <Sprout className="w-10 h-10 text-primary-foreground" />
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold text-primary-foreground mb-6 tracking-tight leading-tight">
          Soil Intelligence Platform
        </h1>
        
        <p className="text-xl md:text-2xl text-primary-foreground/90 max-w-3xl mx-auto leading-relaxed mb-8">
          Unlock the secrets beneath your feet. Get instant, science-backed insights into soil composition, pH levels, and optimal crop recommendations for any location worldwide.
        </p>

        <Button
          onClick={scrollToSearch}
          size="lg"
          className="bg-background text-primary hover:bg-background/90 shadow-strong text-lg px-8 py-6"
        >
          Get Started
          <ArrowDown className="ml-2 w-5 h-5 animate-bounce" />
        </Button>
      </div>

      {/* Features Preview */}
      <div className="relative max-w-6xl mx-auto mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up">
        <div className="bg-background/10 backdrop-blur-sm rounded-lg p-6 border border-primary-foreground/20">
          <div className="text-4xl mb-3">🌍</div>
          <h3 className="text-xl font-semibold text-primary-foreground mb-2">Global Coverage</h3>
          <p className="text-primary-foreground/80 text-sm">Access soil data from anywhere in the world</p>
        </div>
        <div className="bg-background/10 backdrop-blur-sm rounded-lg p-6 border border-primary-foreground/20">
          <div className="text-4xl mb-3">🔬</div>
          <h3 className="text-xl font-semibold text-primary-foreground mb-2">Scientific Analysis</h3>
          <p className="text-primary-foreground/80 text-sm">Powered by ISRIC SoilGrids research data</p>
        </div>
        <div className="bg-background/10 backdrop-blur-sm rounded-lg p-6 border border-primary-foreground/20">
          <div className="text-4xl mb-3">🌾</div>
          <h3 className="text-xl font-semibold text-primary-foreground mb-2">Smart Recommendations</h3>
          <p className="text-primary-foreground/80 text-sm">Get personalized crop and plant suggestions</p>
        </div>
      </div>
    </div>
  );
};

export default Hero;
