import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ links, meta }) {
  if (!links || links.length <= 3) return null;

  return (
    <div className="flex items-center justify-between mt-4 px-1">
      <p className="text-sm text-gray-500">
        Showing {meta?.from ?? '?'} to {meta?.to ?? '?'} of {meta?.total ?? '?'} results
      </p>
      <div className="flex items-center gap-1">
        {links.map((link, i) => {
          if (link.label.includes('Previous')) return (
            <Link key={i} href={link.url || '#'} preserveState
              className={`p-2 rounded-lg text-sm ${!link.url ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'}`}>
              <ChevronLeft size={16} />
            </Link>
          );
          if (link.label.includes('Next')) return (
            <Link key={i} href={link.url || '#'} preserveState
              className={`p-2 rounded-lg text-sm ${!link.url ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'}`}>
              <ChevronRight size={16} />
            </Link>
          );
          return (
            <Link key={i} href={link.url || '#'} preserveState
              className={`min-w-[32px] h-8 flex items-center justify-center rounded-lg text-sm font-medium ${
                link.active ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'
              } ${!link.url ? 'cursor-not-allowed opacity-50' : ''}`}
              dangerouslySetInnerHTML={{ __html: link.label }}
            />
          );
        })}
      </div>
    </div>
  );
}
