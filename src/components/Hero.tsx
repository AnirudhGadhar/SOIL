import { Sprout } from "lucide-react";

const Hero = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-hero py-20 px-6 text-center">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLW9wYWNpdHk9Ii4wNSIvPjwvZz48L3N2Zz4=')] opacity-10"></div>
      
      <div className="relative max-w-4xl mx-auto animate-fade-in">
        <div className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-background/20 backdrop-blur-sm rounded-full">
          <Sprout className="w-8 h-8 text-primary-foreground" />
        </div>
        
        <h1 className="text-5xl md:text-6xl font-bold text-primary-foreground mb-6 tracking-tight">
          Soil Intelligence Platform
        </h1>
        
        <p className="text-xl md:text-2xl text-primary-foreground/90 max-w-2xl mx-auto leading-relaxed">
          Discover your soil's potential. Get instant insights into soil composition, pH levels, and optimal crop recommendations for any location.
        </p>
      </div>
    </div>
  );
};

export default Hero;
