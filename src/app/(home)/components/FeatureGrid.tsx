import { Card, CardContent } from "@/components/ui/card";
import { BarChart3, Users, MessageCircle, Clock } from "lucide-react";

const features = [
  {
    icon: BarChart3,
    title: "Dashboard at a glance",
    description:
      "See total balance, active groups, and recent activity in one clean view.",
    status: "available",
  },
  {
    icon: Users,
    title: "Group management",
    description: "Create groups, add expenses, and invite friends seamlessly.",
    status: "available",
  },
  {
    icon: MessageCircle,
    title: "Built-in chat",
    description:
      "Keep all conversations next to your expenses to reduce confusion.",
    status: "coming-soon",
  },
];

export default function FeatureGrid() {
  return (
    <div className="grid md:grid-cols-3 gap-8 mb-16">
      {features.map((feature, index) => (
        <Card
          key={index}
          className={`bg-slate-800 border-slate-700 text-white relative ${
            feature.status === "coming-soon" ? "opacity-80" : ""
          }`}
        >
          <CardContent className="pt-6 text-center">
            {feature.status === "coming-soon" && (
              <div className="absolute top-3 right-3 bg-amber-500 text-slate-900 text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Coming Soon
              </div>
            )}
            <div
              className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 mx-auto ${
                feature.status === "coming-soon"
                  ? "bg-slate-600"
                  : "bg-teal-400"
              }`}
            >
              <feature.icon
                className={`w-6 h-6 ${
                  feature.status === "coming-soon"
                    ? "text-slate-400"
                    : "text-slate-900"
                }`}
              />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              {feature.title}
              {feature.status === "coming-soon" && (
                <span className="text-amber-400 text-sm font-normal ml-2">
                  (In Progress)
                </span>
              )}
            </h3>
            <p className="text-gray-400">
              {feature.status === "coming-soon"
                ? "This feature is currently in development and will be available soon. Stay tuned for updates!"
                : feature.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
