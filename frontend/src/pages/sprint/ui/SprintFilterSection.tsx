import { SprintData } from '@/pages/sprint/model/types';
import { Filter, Tag, Users, X } from 'lucide-react';
import { extractUniqueAssignees, extractUniqueComponents } from '../lib/helpers';

interface SprintFilterSectionProps {
  sprintData: SprintData;
  activeFilter: string | null;
  onFilterChange: (filter: string | null) => void;
}

export const SprintFilterSection: React.FC<SprintFilterSectionProps> = ({
  sprintData,
  activeFilter,
  onFilterChange,
}) => {
  // 컴포넌트 목록 (중복 제거)
  const allComponents = extractUniqueComponents(sprintData);

  // 모든 이슈에서 담당자 목록 추출 (중복 제거)
  const allAssignees = extractUniqueAssignees(sprintData);

  return (
    <div className='rounded-lg border border-gray-100 bg-white p-6 shadow-sm'>
      <div className='mb-6 flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <Filter size={18} className='text-primary' />
          <h3 className='font-semibold text-gray-800'>필터</h3>
        </div>
        {activeFilter && (
          <button
            className='flex items-center gap-1 rounded-md bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-200'
            onClick={() => onFilterChange(null)}
          >
            필터 초기화
            <X size={16} />
          </button>
        )}
      </div>

      <div className='flex flex-col gap-6'>
        {/* 컴포넌트 필터 */}
        <div>
          <div className='mb-3 flex items-center gap-2'>
            <Tag size={16} className='text-primary' />
            <span className='text-sm font-medium text-gray-700'>컴포넌트</span>
          </div>
          <div className='flex flex-wrap gap-2'>
            {allComponents.map((component, index) => (
              <button
                key={index}
                className={`rounded-full px-3 py-1.5 text-sm font-medium ${activeFilter === `component-${component}`
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  } transition-colors`}
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
        <div>
          <div className='mb-3 flex items-center gap-2'>
            <Users size={16} className='text-point' />
            <span className='text-sm font-medium text-gray-700'>담당자</span>
          </div>
          <div className='flex flex-wrap gap-2'>
            {allAssignees.map((assignee, index) => (
              <button
                key={index}
                className={`rounded-full px-3 py-1.5 text-sm font-medium ${activeFilter === `assignee-${assignee}`
                    ? 'bg-point text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  } transition-colors`}
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
