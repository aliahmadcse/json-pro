// Custom icon component for better fallback support
const Icon = ({ name, className = "", ...props }) => {
  const iconMap = {
    'code': '⌨️',
    'play': '▶️',
    'eraser': '🗑️',
    'file-code': '📄',
    'magic': '✨',
    'copy': '📋',
    'minus-circle': '➖',
    'plus-circle': '➕',
    'info-circle': 'ℹ️',
    'rocket': '🚀',
    'lightbulb': '💡',
    'github': '🔗',
    'star': '⭐',
    'share-alt': '📤',
    'heart': '❤️',
    'search': '🔍',
    'exclamation-triangle': '⚠️'
  };

  const emoji = iconMap[name] || '•';
  
  return (
    <span className={`inline-block ${className}`} {...props}>
      {emoji}
    </span>
  );
};

export default Icon;