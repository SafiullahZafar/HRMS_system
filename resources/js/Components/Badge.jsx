const variants = {
  active:       'bg-blue-50 text-blue-700',
  inactive:     'bg-gray-100 text-gray-600',
  pending:      'bg-blue-50 text-blue-700',
  approved:     'bg-blue-50 text-blue-700',
  rejected:     'bg-blue-50 text-blue-700',
  cancelled:    'bg-gray-100 text-gray-600',
  present:      'bg-blue-50 text-blue-700',
  absent:       'bg-blue-50 text-blue-700',
  late:         'bg-blue-50 text-blue-700',
  half_day:     'bg-blue-50 text-blue-700',
  leave:        'bg-blue-50 text-blue-700',
  work_from_home:'bg-blue-50 text-blue-700',
  draft:        'bg-gray-100 text-gray-600',
  calculated:   'bg-blue-50 text-blue-700',
  under_review: 'bg-blue-50 text-blue-700',
  paid:         'bg-blue-50 text-blue-700',
  published:    'bg-blue-50 text-blue-700',
  closed:       'bg-blue-50 text-blue-700',
  hired:        'bg-blue-50 text-blue-700',
  applied:      'bg-blue-50 text-blue-700',
  shortlisted:  'bg-blue-50 text-blue-700',
  interview:    'bg-blue-50 text-blue-700',
  selected:     'bg-blue-50 text-blue-700',
  offer_sent:   'bg-blue-50 text-blue-700',
  terminated:   'bg-blue-50 text-blue-700',
  resigned:     'bg-blue-50 text-blue-700',
  full_time:    'bg-blue-50 text-blue-700',
  part_time:    'bg-blue-50 text-blue-700',
  contract:     'bg-blue-50 text-blue-700',
  intern:       'bg-blue-50 text-blue-700',
  loan:         'bg-blue-50 text-blue-700',
  advance:      'bg-blue-50 text-blue-700',
  completed:    'bg-blue-50 text-blue-700',
  upcoming:     'bg-blue-50 text-blue-700',
  ongoing:      'bg-blue-50 text-blue-700',
  assigned:     'bg-blue-50 text-blue-700',
  available:    'bg-blue-50 text-blue-700',
  maintenance:  'bg-blue-50 text-blue-700',
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
