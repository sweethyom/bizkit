import { SprintData } from '@/pages/sprint/model/types';
import { Filter, Tag, Users, X } from 'lucide-react';
import { extractUniqueAssignees, extractUniqueComponents } from '../lib/helpers';

interface SprintFilterSectionProps {
  sprintData: SprintData;
  activeFilter: string | null;
  onFilterChange: (filter: string | null) => void;
  className?: string;
}

export const SprintFilterSection: React.FC<SprintFilterSectionProps> = ({
  sprintData,
  activeFilter,
  onFilterChange,
  className = ''
}) => {
  // 컴포넌트 목록 (중복 제거)
  const allComponents = extractUniqueComponents(sprintData);

  // 모든 이슈에서 담당자 목록 추출 (중복 제거)
  const allAssignees = extractUniqueAssignees(sprintData);

  return (
    <div className={`rounded-lg border border-gray-200 bg-white p-4 shadow-md ${className}`}>
      <div className='mb-4 flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <div className='flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 text-indigo-600'>
            <Filter size={16} />
          </div>
          <h3 className='font-medium text-gray-800'>필터</h3>
        </div>
        {activeFilter && (
          <button
            className='flex items-center gap-1 rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-600 border border-red-100 transition-all hover:bg-red-100'
            onClick={() => onFilterChange(null)}
          >
            초기화
            <X size={14} />
          </button>
        )}
      </div>

      <div className='flex flex-wrap gap-4'>
        {/* 컴포넌트 필터 */}
        <div className='flex flex-wrap items-center gap-2'>
          <div className='flex items-center gap-1.5 mr-1'>
            <div className='flex items-center justify-center w-5 h-5 rounded-full bg-indigo-100 text-indigo-600'>
              <Tag size={12} />
            </div>
            <span className='text-xs font-medium text-gray-600'>컴포넌트:</span>
          </div>
          
          <div className='flex flex-wrap gap-1.5'>
            {allComponents.map((component, index) => (
              <button
                key={index}
                className={`rounded-full px-2.5 py-1 text-xs font-medium ${activeFilter === `component-${component}`
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                  } transition-all`}
                onClick={() =>
                  onFilterChange(
                    activeFilter === `component-${component}` ? null : `component-${component}`,
                  )
                }
              >
                {component}
              </button>
            ))}
          </div>
        </div>

        {/* 담당자 필터 */}
        <div className='flex flex-wrap items-center gap-2'>
          <div className='flex items-center gap-1.5 mr-1'>
            <div className='flex items-center justify-center w-5 h-5 rounded-full bg-indigo-100 text-indigo-600'>
              <Users size={12} />
            </div>
            <span className='text-xs font-medium text-gray-600'>담당자:</span>
          </div>
          
          <div className='flex flex-wrap gap-1.5'>
            {allAssignees.map((assignee, index) => (
              <button
                key={index}
                className={`rounded-full px-2.5 py-1 text-xs font-medium ${activeFilter === `assignee-${assignee}`
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                  } transition-all`}
                onClick={() => {
                  onFilterChange(
                    activeFilter === `assignee-${assignee}` ? null : `assignee-${assignee}`,
                  );
                }}
              >
                {assignee}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
