import { CompanyData } from '@/types';

interface CompanyInfoProps {
  data: CompanyData;
}

export default function CompanyInfo({ data }: CompanyInfoProps) {
  return (
    <div className="bg-white rounded-lg border border-[#e9ecef] shadow-[0_1px_3px_rgba(0,0,0,0.1)] p-6 h-full">
      <h2 className="text-lg font-semibold text-[#212529] mb-4 pb-2 border-b border-[#e9ecef]">
        Company Information
      </h2>
      <p className="text-[#212529] leading-relaxed">
        {data.company_info || 'No company information available.'}
      </p>
    </div>
  );
}
