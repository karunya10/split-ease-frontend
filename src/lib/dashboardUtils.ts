export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

  if (diffInHours < 1) {
    return `${Math.round(diffInHours * 60)}m ago`;
  } else if (diffInHours < 24) {
    return `${Math.round(diffInHours)}h ago`;
  } else if (diffInHours < 48) {
    return "Yesterday";
  } else {
    return date.toLocaleDateString();
  }
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
};

export const getBalanceColor = (balance: number) => {
  if (balance > 0) return "text-green-400";
  if (balance < 0) return "text-red-400";
  return "text-gray-400";
};

export const getGroupAvatar = (groupName: string) => {
  const avatars = ["🚗", "🏠", "🍽️", "✈️", "🎉", "💼", "🏖️", "🎮", "📚", "🏃"];
  const index = groupName.charCodeAt(0) % avatars.length;
  return avatars[index];
};
