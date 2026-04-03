interface Breadcrumb {
  label: string;
  path?: string;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
  breadcrumbs?: Breadcrumb[];
}

export default function PageHeader({ title, subtitle, description }: PageHeaderProps) {
  return (
    <div className="mb-4">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
      {(subtitle || description) && (
        <p className="text-gray-600 dark:text-gray-400 mt-1">{subtitle || description}</p>
      )}
    </div>
  );
}
