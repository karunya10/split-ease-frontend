import { Card, CardContent } from "@/components/ui/card";
import { BarChart3, Users, MessageCircle } from "lucide-react";

const features = [
  {
    icon: BarChart3,
    title: "Dashboard at a glance",
    description:
      "See total balance, active groups, and recent activity in one clean view.",
  },
  {
    icon: Users,
    title: "Group management",
    description: "Create groups, add expenses, and invite friends seamlessly.",
  },
  {
    icon: MessageCircle,
    title: "Built-in chat",
    description:
      "Keep all conversations next to your expenses to reduce confusion.",
  },
];

export default function FeatureGrid() {
  return (
    <div className="grid md:grid-cols-3 gap-8 mb-16">
      {features.map((feature, index) => (
        <Card key={index} className="bg-slate-800 border-slate-700 text-white">
          <CardContent className="pt-6 text-center">
            <div className="w-12 h-12 bg-teal-400 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <feature.icon className="w-6 h-6 text-slate-900" />
            </div>
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-gray-400">{feature.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
