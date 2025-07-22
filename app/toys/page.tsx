"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Plus, ExternalLink, Cpu, Wifi, WifiOff } from "lucide-react";
import { Navbar } from "@/components/ui/navbar";
import { supabaseService, type Toy } from "@/lib/supabase/service";

export default function ToysPage() {
  const [toys, setToys] = useState<Toy[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadToys();
  }, []);

  const loadToys = async () => {
    try {
      setLoading(true);
      const toysData = await supabaseService.getToys();
      // Filter out trial toys
      const filteredToys = toysData.filter(
        (toy) => toy.name !== "Cheeko Trial"
      );
      setToys(filteredToys);
    } catch (error) {
      console.error("Failed to load toys:", error);
    } finally {
      setLoading(false);
    }
  };

  const featureCards = [
    {
      title: "Smart Learning Journey",
      description:
        "Cheeko tailors stories to your child's pace for fun, ongoing growth.",
      icon: "🎯",
    },
    {
      title: "Parental Dashboard",
      description:
        "Track activity, set limits, and view learning insights with ease.",
      icon: "📊",
    },
    {
      title: "Creative Content",
      description:
        "Stories, games, and fun activities to spark young imaginations.",
      icon: "✨",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar
        title={
          <Image src="/images/logo.png" alt="Cheeko" width={100} height={24} />
        }
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <button
            onClick={() => router.push("/toys/activate")}
            className="btn-primary flex items-center justify-center gap-2 flex-1"
          >
            <Plus className="w-5 h-5" />
            Add Toy
          </button>
          <a
            href="https://cheekoai.myshopify.com/products/cheeko-ai-toy"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary flex items-center justify-center gap-2 flex-1"
          >
            Purchase Toy
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-orange border-t-transparent rounded-full animate-spin" />
          </div>
        ) : toys.length > 0 ? (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {toys.map((toy) => (
                <div
                  key={toy.id}
                  onClick={() => router.push(`/toys/${toy.id}`)}
                  className="card hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-orange/10 rounded-16 flex items-center justify-center">
                      <Cpu className="w-6 h-6 text-orange" />
                    </div>
                    {toy.is_wifi_provisioned ? (
                      <Wifi className="w-5 h-5 text-green" />
                    ) : (
                      <WifiOff className="w-5 h-5 text-grey" />
                    )}
                  </div>

                  <h3 className="text-lg font-semibold text-black mb-1">
                    {toy.name}
                  </h3>

                  <div className="space-y-1 text-sm">
                    {toy.kid_name && (
                      <div className="flex justify-between">
                        <span className="text-grey">Child:</span>
                        <span className="text-black">{toy.kid_name}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-grey">Role:</span>
                      <span className="text-black">{toy.role_type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-grey">Language:</span>
                      <span className="text-black">
                        {toy.language || "English"}
                      </span>
                    </div>
                    {/*<div className="flex justify-between">
                      <span className="text-grey">Voice:</span>
                      <span className="text-black truncate ml-2">
                        {toy.voice || "Default"}
                      </span>
                    </div>*/}
                  </div>
                </div>
              ))}
            </div>

            {/* Feature cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featureCards.map((feature, index) => (
                <div key={index} className="card text-center">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-lg font-semibold text-black mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-grey text-sm">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Empty state */}
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-orange/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Cpu className="w-12 h-12 text-orange" />
              </div>
              <h2 className="text-2xl font-bold text-black mb-2">
                No toys yet
              </h2>
              <p className="text-grey mb-6">
                Add your first Cheeko toy to get started
              </p>
              <button
                onClick={() => router.push("/toys/activate")}
                className="btn-primary inline-flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Your First Toy
              </button>
            </div>

            {/* Feature cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featureCards.map((feature, index) => (
                <div key={index} className="card text-center">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-lg font-semibold text-black mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-grey text-sm">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
