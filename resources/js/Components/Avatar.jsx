export default function Avatar({ name = '', size = 'md', className = '' }) {
  const sizes = { sm: 'w-7 h-7 text-xs', md: 'w-9 h-9 text-sm', lg: 'w-12 h-12 text-base' };
  return (
    <div className={`inline-flex items-center justify-center rounded-full bg-blue-50 text-blue-700 font-semibold ${sizes[size] || sizes.md} ${className}`}>
      {name.split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase()}
    </div>
  );
}
