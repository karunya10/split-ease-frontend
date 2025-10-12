const features = [
  {
    icon: "📊",
    title: "Dashboard at a glance",
    description:
      "See total balance, active groups, and recent activity in one clean view.",
  },
  {
    icon: "👥",
    title: "Group management",
    description: "Create groups, add expenses, and invite friends seamlessly.",
  },
  {
    icon: "💬",
    title: "Built-in chat",
    description:
      "Keep all conversations next to your expenses to reduce confusion.",
  },
];

export default function FeatureGrid() {
  return (
    <div className="grid md:grid-cols-3 gap-8 mb-16">
      {features.map((feature, index) => (
        <div key={index} className="bg-slate-800 rounded-lg p-6">
          <div className="w-12 h-12 bg-teal-400 rounded-lg flex items-center justify-center mb-4 mx-auto">
            <span className="text-slate-900 font-bold">{feature.icon}</span>
          </div>
          <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
          <p className="text-gray-400">{feature.description}</p>
        </div>
      ))}
    </div>
  );
}
