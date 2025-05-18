// settings/ui/ComponentSettingPage.tsx
import {
  addComponent,
  deleteComponent,
  getComponents,
  updateComponent,
  updateComponentContent,
  updateComponentName,
} from '@/pages/settings/api/settingsApi';
import { Component } from '@/pages/settings/model/types';
import { clsx } from 'clsx';
import { AlertCircle, CheckCircle, Edit, Plus, Puzzle, Search, Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';

const ComponentSettingPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [components, setComponents] = useState<Component[]>([]);
  const [filteredComponents, setFilteredComponents] = useState<Component[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null); // 삭제 중인 컴포넌트 ID
  const [showAddModal, setShowAddModal] = useState(false);
  const [showModifyModal, setShowModifyModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [componentName, setComponentName] = useState('');
  const [componentContent, setComponentContent] = useState('');
  const [selectedComponent, setSelectedComponent] = useState<Component | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchComponents = async () => {
      if (!projectId) return;

      setIsLoading(true);
      try {
        const data = await getComponents(projectId);
        setComponents(data);
        setFilteredComponents(data);
      } catch (error) {
        console.error('Failed to fetch components:', error);
        setError('컴포넌트 목록을 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchComponents();
  }, [projectId]);

  // 검색 기능
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredComponents(components);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = components.filter(
        (comp) =>
          comp.name.toLowerCase().includes(query) ||
          (comp.content && comp.content.toLowerCase().includes(query)),
      );
      setFilteredComponents(filtered);
    }
  }, [searchQuery, components]);

  const handleAddComponent = async () => {
    if (!projectId || !componentName.trim()) return;

    setIsAdding(true);
    setError(null);
    try {
      const newComponent = await addComponent(projectId, {
        id: '',
        name: componentName.trim(),
        content: componentContent.trim() || undefined,
      });

      setComponents([...components, newComponent]);
      setFilteredComponents([...components, newComponent]);
      setSuccess('컴포넌트가 성공적으로 추가되었습니다.');
      setComponentName('');
      setComponentContent('');
      setShowAddModal(false);

      // 3초 후 성공 메시지 제거
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Failed to add component:', error);
      setError('컴포넌트 추가에 실패했습니다.');
    } finally {
      setIsAdding(false);
    }
  };

  const handleModifyComponent = async () => {
    if (!projectId || !selectedComponent || !componentName.trim()) return;

    setIsAdding(true);
    setError(null);

    try {
      // 수정된 API 함수 시그니처에 따라 이름과 설명 변경을 별도로 호출
      const componentId = typeof selectedComponent.id === 'string' 
        ? parseInt(selectedComponent.id) 
        : selectedComponent.id;
      
      // 이름이 변경되었는지 확인
      if (componentName.trim() !== selectedComponent.name) {
        await updateComponentName(componentId, componentName.trim());
      }
      
      // 설명이 변경되었는지 확인
      if (componentContent.trim() !== (selectedComponent.content || '')) {
        await updateComponentContent(componentId, componentContent.trim());
      }

      // 업데이트된 컴포넌트 객체 생성
      const updatedComponent = {
        ...selectedComponent,
        name: componentName.trim(),
        content: componentContent.trim() || undefined,
      };

      const updatedComponents = components.map((comp) =>
        comp.id === updatedComponent.id ? updatedComponent : comp,
      );

      setComponents(updatedComponents);
      setFilteredComponents(updatedComponents);
      setSuccess('컴포넌트가 성공적으로 수정되었습니다.');
      setShowModifyModal(false);

      // 3초 후 성공 메시지 제거
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Failed to update component:', error);
      setError('컴포넌트 수정에 실패했습니다.');
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteClick = (component: Component) => {
    setSelectedComponent(component);
    setShowDeleteModal(true);
  };

  const handleDeleteComponent = async () => {
    if (!projectId || !selectedComponent) return;

    setIsDeleting(selectedComponent.id);
    setError(null);

    try {
      // 수정된 API 함수 시그니처에 따라 projectId 제외
      const success = await deleteComponent(parseInt(selectedComponent.id));
      if (success) {
        const updatedComponents = components.filter((comp) => comp.id !== selectedComponent.id);
        setComponents(updatedComponents);
        setFilteredComponents(updatedComponents);
        setSuccess('컴포넌트가 성공적으로 삭제되었습니다.');
        setShowDeleteModal(false);

        // 3초 후 성공 메시지 제거
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (error) {
      console.error('Failed to delete component:', error);
      setError('컴포넌트 삭제에 실패했습니다.');
    } finally {
      setIsDeleting(null);
    }
  };

  const openModifyModal = (component: Component) => {
    setSelectedComponent(component);
    setComponentName(component.name);
    setComponentContent(component.content || '');
    setShowModifyModal(true);
  };

  const resetForm = () => {
    setComponentName('');
    setComponentContent('');
    setSelectedComponent(null);
    setError(null);
  };

  return (
    <div className='min-h-screen bg-gray-50 p-8'>
      <div className='mx-auto max-w-6xl'>
        <div className='flex items-center justify-between'>
          <h1 className='flex items-center text-3xl font-bold text-gray-800'>
            <Puzzle className='mr-3' size={28} />
            컴포넌트 관리
          </h1>

          <button
            type='button'
            onClick={() => {
              resetForm();
              setShowAddModal(true);
            }}
            className='flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none'
          >
            <Plus size={18} className='mr-2' />
            컴포넌트 추가
          </button>
        </div>

        {/* 에러 및 성공 메시지 */}
        {error && (
          <div className='mt-4 flex items-start rounded-md border-l-4 border-red-500 bg-red-50 p-4 text-red-700'>
            <AlertCircle size={20} className='mt-0.5 mr-2 flex-shrink-0' />
            <p>{error}</p>
            <button
              onClick={() => setError(null)}
              className='ml-auto text-red-700 hover:text-red-900'
              aria-label='닫기'
            >
              <X size={18} />
            </button>
          </div>
        )}

        {success && (
          <div
            className={clsx(
              'animate-fadeIn mt-4 flex items-start rounded-md border-l-4 border-green-500 bg-green-50 p-4 text-green-700',
            )}
          >
            <CheckCircle size={20} className={clsx('mr-2 flex-shrink-0')} />
            <p>{success}</p>
          </div>
        )}

        <div className={clsx('mt-6')}>
          <div className={clsx('overflow-hidden rounded-xl bg-white shadow-sm')}>
            {/* 검색 및 필터링 */}
            <div className={clsx('border-b border-gray-200 bg-gray-50 p-4')}>
              <div className={clsx('relative flex items-center')}>
                <div
                  className={clsx(
                    'pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3',
                  )}
                >
                  <Search size={18} className={clsx('text-gray-400')} />
                </div>
                <input
                  type='text'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder='컴포넌트 이름이나 설명으로 검색'
                  className={clsx(
                    'w-full rounded-lg border border-gray-300 py-2 pr-4 pl-10 focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs',
                  )}
                />
              </div>
            </div>

            {/* 컴포넌트 목록 테이블 */}
            <div className={clsx('overflow-x-auto')}>
              {isLoading ? (
                <div className={clsx('flex items-center justify-center py-20')}>
                  <div
                    className={clsx(
                      'h-10 w-10 animate-spin rounded-full border-t-2 border-b-2 border-indigo-500',
                    )}
                  ></div>
                  <span className={clsx('ml-3 text-gray-500')}>컴포넌트 정보를 불러오는 중...</span>
                </div>
              ) : filteredComponents.length > 0 ? (
                <table className={clsx('min-w-full divide-y divide-gray-200')}>
                  <thead className={clsx('bg-gray-50')}>
                    <tr>
                      <th
                        scope='col'
                        className={clsx(
                          'px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase',
                        )}
                      >
                        이름
                      </th>
                      <th
                        scope='col'
                        className={clsx(
                          'px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase',
                        )}
                      >
                        설명
                      </th>
                      <th
                        scope='col'
                        className={clsx(
                          'px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase',
                        )}
                      >
                        작업
                      </th>
                    </tr>
                  </thead>
                  <tbody className={clsx('divide-y divide-gray-200 bg-white')}>
                    {filteredComponents.map((component) => (
                      <tr key={component.id} className={clsx('transition-colors hover:bg-gray-50')}>
                        <td className={clsx('px-6 py-4 whitespace-nowrap')}>
                          <div className={clsx('flex items-center')}>
                            <div
                              className={clsx(
                                'flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600',
                              )}
                            >
                              <Puzzle size={20} />
                            </div>
                            <div className={clsx('ml-4')}>
                              <div className={clsx('text-sm font-medium text-gray-900')}>
                                {component.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className={clsx('px-6 py-4')}>
                          <div className={clsx('max-w-md text-sm break-words text-gray-500')}>
                            {component.content || (
                              <span className={clsx('text-gray-400 italic')}>설명 없음</span>
                            )}
                          </div>
                        </td>
                        <td
                          className={clsx(
                            'px-6 py-4 text-right text-sm font-medium whitespace-nowrap',
                          )}
                        >
                          <div className={clsx('flex items-center justify-end space-x-3')}>
                            <button
                              onClick={() => openModifyModal(component)}
                              className={clsx(
                                'flex items-center text-indigo-600 transition-colors hover:text-indigo-900',
                              )}
                            >
                              <Edit size={16} className={clsx('mr-1')} />
                              수정
                            </button>
                            <button
                              onClick={() => handleDeleteClick(component)}
                              disabled={isDeleting === component.id}
                              className={clsx(
                                'flex items-center text-red-600 transition-colors hover:text-red-800',
                                isDeleting === component.id && 'cursor-not-allowed opacity-50',
                              )}
                            >
                              {isDeleting === component.id ? (
                                <>
                                  <div
                                    className={clsx(
                                      'mr-1 h-4 w-4 animate-spin rounded-full border-t-2 border-b-2 border-red-600',
                                    )}
                                  ></div>
                                  삭제 중...
                                </>
                              ) : (
                                <>
                                  <Trash2 size={16} className={clsx('mr-1')} />
                                  삭제
                                </>
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className={clsx('py-20 text-center')}>
                  <Puzzle className={clsx('mx-auto h-12 w-12 text-gray-300')} />
                  <h3 className={clsx('mt-2 text-sm font-medium text-gray-900')}>
                    {searchQuery ? '검색 결과가 없습니다' : '컴포넌트가 없습니다'}
                  </h3>
                  <p className={clsx('mt-1 text-sm text-gray-500')}>
                    {searchQuery ? '다른 검색어로 시도해보세요' : '새로운 컴포넌트를 추가해보세요'}
                  </p>
                  {searchQuery ? (
                    <div className={clsx('mt-6')}>
                      <button
                        type='button'
                        onClick={() => setSearchQuery('')}
                        className={clsx(
                          'inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none',
                        )}
                      >
                        검색 초기화
                      </button>
                    </div>
                  ) : (
                    <div className={clsx('mt-6')}>
                      <button
                        type='button'
                        onClick={() => {
                          resetForm();
                          setShowAddModal(true);
                        }}
                        className={clsx(
                          'inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none',
                        )}
                      >
                        <Plus className={clsx('mr-2 -ml-1 h-5 w-5')} aria-hidden='true' />
                        컴포넌트 추가하기
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 컴포넌트 추가 모달 */}
      {showAddModal && (
        <div
          className={clsx(
            'bg-opacity-50 animate-fadeIn fixed inset-0 z-50 flex items-center justify-center bg-black p-4',
          )}
        >
          <div
            className={clsx('animate-scaleIn w-full max-w-md rounded-xl bg-white p-6 shadow-lg')}
          >
            <div className={clsx('mb-4 flex items-center justify-between')}>
              <h3 className={clsx('flex items-center text-xl font-bold text-gray-900')}>
                <Plus size={20} className={clsx('mr-2 text-indigo-600')} />
                컴포넌트 추가
              </h3>
              <button
                type='button'
                onClick={() => {
                  setShowAddModal(false);
                  resetForm();
                }}
                className={clsx('text-gray-400 transition-colors hover:text-gray-500')}
              >
                <X size={20} />
              </button>
            </div>

            {error && (
              <div
                className={clsx(
                  'mb-4 flex items-start rounded-md border-l-4 border-red-500 bg-red-50 p-3 text-red-700',
                )}
              >
                <AlertCircle size={20} className={clsx('mr-2 flex-shrink-0')} />
                <p className={clsx('text-sm')}>{error}</p>
              </div>
            )}

            <div className={clsx('space-y-4')}>
              <div>
                <label
                  htmlFor='componentName'
                  className={clsx('mb-1 block text-sm font-medium text-gray-700')}
                >
                  이름 <span className={clsx('text-red-500')}>*</span>
                </label>
                <input
                  type='text'
                  id='componentName'
                  value={componentName}
                  onChange={(e) => setComponentName(e.target.value)}
                  className={clsx(
                    'w-full rounded-lg border border-gray-300 px-4 py-2 shadow-sm transition-colors focus:border-indigo-500 focus:ring-indigo-500',
                  )}
                  placeholder='컴포넌트 이름 (예: 프론트엔드, 백엔드)'
                  disabled={isAdding}
                />
              </div>

              <div>
                <label
                  htmlFor='componentContent'
                  className={clsx('mb-1 block text-sm font-medium text-gray-700')}
                >
                  설명
                </label>
                <textarea
                  id='componentContent'
                  value={componentContent}
                  onChange={(e) => setComponentContent(e.target.value)}
                  rows={3}
                  className={clsx(
                    'w-full resize-none rounded-lg border border-gray-300 px-4 py-2 shadow-sm transition-colors focus:border-indigo-500 focus:ring-indigo-500',
                  )}
                  placeholder='컴포넌트 설명 (선택사항)'
                  disabled={isAdding}
                />
              </div>
            </div>

            <div className={clsx('mt-6 flex justify-end space-x-3 border-t border-gray-200 pt-4')}>
              <button
                type='button'
                onClick={() => {
                  setShowAddModal(false);
                  resetForm();
                }}
                className={clsx(
                  'rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50',
                )}
                disabled={isAdding}
              >
                취소
              </button>
              <button
                type='button'
                onClick={handleAddComponent}
                disabled={isAdding || !componentName.trim()}
                className={clsx(
                  'flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 focus:outline-none disabled:opacity-50',
                )}
              >
                {isAdding ? (
                  <>
                    <div
                      className={clsx(
                        'mr-2 h-4 w-4 animate-spin rounded-full border-t-2 border-b-2 border-white',
                      )}
                    ></div>
                    추가 중...
                  </>
                ) : (
                  <>
                    <Plus size={16} className={clsx('mr-2')} />
                    추가
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 컴포넌트 수정 모달 */}
      {showModifyModal && selectedComponent && (
        <div
          className={clsx(
            'bg-opacity-50 animate-fadeIn fixed inset-0 z-50 flex items-center justify-center bg-black p-4',
          )}
        >
          <div
            className={clsx('animate-scaleIn w-full max-w-md rounded-xl bg-white p-6 shadow-lg')}
          >
            <div className={clsx('mb-4 flex items-center justify-between')}>
              <h3 className={clsx('flex items-center text-xl font-bold text-gray-900')}>
                <Edit size={20} className={clsx('mr-2 text-indigo-600')} />
                컴포넌트 수정
              </h3>
              <button
                type='button'
                onClick={() => {
                  setShowModifyModal(false);
                  resetForm();
                }}
                className={clsx('text-gray-400 transition-colors hover:text-gray-500')}
              >
                <X size={20} />
              </button>
            </div>

            {error && (
              <div
                className={clsx(
                  'mb-4 flex items-start rounded-md border-l-4 border-red-500 bg-red-50 p-3 text-red-700',
                )}
              >
                <AlertCircle size={20} className={clsx('mr-2 flex-shrink-0')} />
                <p className={clsx('text-sm')}>{error}</p>
              </div>
            )}

            <div className={clsx('space-y-4')}>
              <div>
                <label
                  htmlFor='componentName'
                  className={clsx('mb-1 block text-sm font-medium text-gray-700')}
                >
                  이름 <span className={clsx('text-red-500')}>*</span>
                </label>
                <input
                  type='text'
                  id='componentName'
                  value={componentName}
                  onChange={(e) => setComponentName(e.target.value)}
                  className={clsx(
                    'w-full rounded-lg border border-gray-300 px-4 py-2 shadow-sm transition-colors focus:border-indigo-500 focus:ring-indigo-500',
                  )}
                  placeholder='컴포넌트 이름'
                  disabled={isAdding}
                />
              </div>

              <div>
                <label
                  htmlFor='componentContent'
                  className={clsx('mb-1 block text-sm font-medium text-gray-700')}
                >
                  설명
                </label>
                <textarea
                  id='componentContent'
                  value={componentContent}
                  onChange={(e) => setComponentContent(e.target.value)}
                  rows={3}
                  className={clsx(
                    'w-full resize-none rounded-lg border border-gray-300 px-4 py-2 shadow-sm transition-colors focus:border-indigo-500 focus:ring-indigo-500',
                  )}
                  placeholder='컴포넌트 설명 (선택사항)'
                  disabled={isAdding}
                />
              </div>
            </div>

            <div className={clsx('mt-6 flex justify-end space-x-3 border-t border-gray-200 pt-4')}>
              <button
                type='button'
                onClick={() => {
                  setShowModifyModal(false);
                  resetForm();
                }}
                className={clsx(
                  'rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50',
                )}
                disabled={isAdding}
              >
                취소
              </button>
              <button
                type='button'
                onClick={handleModifyComponent}
                disabled={
                  isAdding ||
                  !componentName.trim() ||
                  (componentName === selectedComponent.name &&
                    componentContent === (selectedComponent.content || ''))
                }
                className={clsx(
                  'flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 focus:outline-none disabled:opacity-50',
                )}
              >
                {isAdding ? (
                  <>
                    <div
                      className={clsx(
                        'mr-2 h-4 w-4 animate-spin rounded-full border-t-2 border-b-2 border-white',
                      )}
                    ></div>
                    저장 중...
                  </>
                ) : (
                  <>
                    <Edit size={16} className={clsx('mr-2')} />
                    변경사항 저장
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 컴포넌트 삭제 확인 모달 */}
      {showDeleteModal && selectedComponent && (
        <div
          className={clsx(
            'bg-opacity-50 animate-fadeIn fixed inset-0 z-50 flex items-center justify-center bg-black p-4',
          )}
        >
          <div
            className={clsx('animate-scaleIn w-full max-w-md rounded-xl bg-white p-6 shadow-lg')}
          >
            <div className={clsx('mb-3 flex items-center justify-between')}>
              <h3 className={clsx('text-xl font-bold text-gray-900')}>컴포넌트 삭제</h3>
              <button
                type='button'
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedComponent(null);
                }}
                className={clsx('text-gray-400 transition-colors hover:text-gray-500')}
              >
                <X size={20} />
              </button>
            </div>

            <div className={clsx('mb-6 rounded-md border-l-4 border-red-500 bg-red-50 p-4')}>
              <div className={clsx('flex')}>
                <AlertCircle className={clsx('h-5 w-5 flex-shrink-0 text-red-400')} />
                <div className={clsx('ml-3')}>
                  <p className={clsx('text-sm text-red-800')}>
                    <strong>{selectedComponent.name}</strong> 컴포넌트를 삭제하시겠습니까? 이 작업은
                    되돌릴 수 없으며, 관련된 이슈들의 컴포넌트가 제거됩니다.
                  </p>
                </div>
              </div>
            </div>

            <div className={clsx('flex justify-end space-x-3 border-t border-gray-200 pt-4')}>
              <button
                type='button'
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedComponent(null);
                }}
                className={clsx(
                  'rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50',
                )}
              >
                취소
              </button>
              <button
                type='button'
                onClick={handleDeleteComponent}
                disabled={isDeleting === selectedComponent.id}
                className={clsx(
                  'flex items-center rounded-lg border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-70',
                )}
              >
                {isDeleting === selectedComponent.id ? (
                  <>
                    <div
                      className={clsx(
                        'mr-2 h-4 w-4 animate-spin rounded-full border-t-2 border-b-2 border-white',
                      )}
                    ></div>
                    삭제 중...
                  </>
                ) : (
                  <>
                    <Trash2 size={16} className={clsx('mr-2')} />
                    영구 삭제
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComponentSettingPage;
