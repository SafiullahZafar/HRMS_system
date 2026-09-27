const variants = {
  active:       'bg-green-100 text-green-700',
  inactive:     'bg-gray-100 text-gray-600',
  pending:      'bg-yellow-100 text-yellow-700',
  approved:     'bg-green-100 text-green-700',
  rejected:     'bg-red-100 text-red-700',
  cancelled:    'bg-gray-100 text-gray-600',
  present:      'bg-green-100 text-green-700',
  absent:       'bg-red-100 text-red-700',
  late:         'bg-yellow-100 text-yellow-700',
  half_day:     'bg-blue-100 text-blue-700',
  leave:        'bg-purple-100 text-purple-700',
  work_from_home:'bg-teal-100 text-teal-700',
  draft:        'bg-gray-100 text-gray-600',
  calculated:   'bg-blue-100 text-blue-700',
  under_review: 'bg-yellow-100 text-yellow-700',
  paid:         'bg-green-100 text-green-700',
  published:    'bg-green-100 text-green-700',
  closed:       'bg-red-100 text-red-700',
  hired:        'bg-green-100 text-green-700',
  applied:      'bg-blue-100 text-blue-700',
  shortlisted:  'bg-indigo-100 text-indigo-700',
  interview:    'bg-yellow-100 text-yellow-700',
  selected:     'bg-purple-100 text-purple-700',
  offer_sent:   'bg-teal-100 text-teal-700',
  terminated:   'bg-red-100 text-red-700',
  resigned:     'bg-orange-100 text-orange-700',
  full_time:    'bg-indigo-100 text-indigo-700',
  part_time:    'bg-blue-100 text-blue-700',
  contract:     'bg-yellow-100 text-yellow-700',
  intern:       'bg-purple-100 text-purple-700',
  loan:         'bg-blue-100 text-blue-700',
  advance:      'bg-teal-100 text-teal-700',
  completed:    'bg-green-100 text-green-700',
  upcoming:     'bg-blue-100 text-blue-700',
  ongoing:      'bg-yellow-100 text-yellow-700',
  assigned:     'bg-indigo-100 text-indigo-700',
  available:    'bg-green-100 text-green-700',
  maintenance:  'bg-yellow-100 text-yellow-700',
  default:      'bg-gray-100 text-gray-600',
};

export default function Badge({ status, label, className = '' }) {
  const text = label || status?.replace(/_/g, ' ');
  const cls  = variants[status] || variants.default;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${cls} ${className}`}>
      {text}
    </span>
  );
}
