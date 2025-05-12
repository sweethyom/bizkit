// settings/ui/ComponentSettingPage.tsx
import {
  addComponent,
  deleteComponent,
  getComponents,
  updateComponent,
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
  const [componentDescription, setComponentDescription] = useState('');
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
          (comp.description && comp.description.toLowerCase().includes(query)),
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
        description: componentDescription.trim() || undefined,
      });

      setComponents([...components, newComponent]);
      setFilteredComponents([...components, newComponent]);
      setSuccess('컴포넌트가 성공적으로 추가되었습니다.');
      setComponentName('');
      setComponentDescription('');
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
      const updatedComponent = await updateComponent(projectId, {
        ...selectedComponent,
        name: componentName.trim(),
        description: componentDescription.trim() || undefined,
      });

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
      const success = await deleteComponent(projectId, selectedComponent.id);
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
    setComponentDescription(component.description || '');
    setShowModifyModal(true);
  };

  const resetForm = () => {
    setComponentName('');
    setComponentDescription('');
    setSelectedComponent(null);
    setError(null);
  };

  return (
    <div className='min-h-screen bg-gray-50 p-8'>
      <div className='max-w-6xl mx-auto'>
        <div className='flex justify-between items-center'>
          <h1 className='text-3xl font-bold text-gray-800 flex items-center'>
            <Puzzle className='mr-3' size={28} />
            컴포넌트 관리
          </h1>

          <button
            type='button'
            onClick={() => {
              resetForm();
              setShowAddModal(true);
            }}
            className='flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors'
          >
            <Plus size={18} className='mr-2' />
            컴포넌트 추가
          </button>
        </div>

        {/* 에러 및 성공 메시지 */}
        {error && (
          <div className='mt-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-md flex items-start'>
            <AlertCircle size={20} className='mr-2 flex-shrink-0 mt-0.5' />
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
              'mt-4 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded-md flex items-start animate-fadeIn',
            )}
          >
            <CheckCircle size={20} className={clsx('mr-2 flex-shrink-0')} />
            <p>{success}</p>
          </div>
        )}

        <div className={clsx('mt-6')}>
          <div className={clsx('bg-white rounded-xl shadow-sm overflow-hidden')}>
            {/* 검색 및 필터링 */}
            <div className={clsx('p-4 bg-gray-50 border-b border-gray-200')}>
              <div className={clsx('flex items-center relative')}>
                <div
                  className={clsx(
                    'absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none',
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
                    'pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full sm:max-w-xs focus:ring-indigo-500 focus:border-indigo-500',
                  )}
                />
              </div>
            </div>

            {/* 컴포넌트 목록 테이블 */}
            <div className={clsx('overflow-x-auto')}>
              {isLoading ? (
                <div className={clsx('flex justify-center items-center py-20')}>
                  <div
                    className={clsx(
                      'w-10 h-10 border-t-2 border-b-2 border-indigo-500 rounded-full animate-spin',
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
                          'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
                        )}
                      >
                        이름
                      </th>
                      <th
                        scope='col'
                        className={clsx(
                          'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
                        )}
                      >
                        설명
                      </th>
                      <th
                        scope='col'
                        className={clsx(
                          'px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider',
                        )}
                      >
                        작업
                      </th>
                    </tr>
                  </thead>
                  <tbody className={clsx('bg-white divide-y divide-gray-200')}>
                    {filteredComponents.map((component) => (
                      <tr key={component.id} className={clsx('hover:bg-gray-50 transition-colors')}>
                        <td className={clsx('px-6 py-4 whitespace-nowrap')}>
                          <div className={clsx('flex items-center')}>
                            <div
                              className={clsx(
                                'flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600',
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
                          <div className={clsx('text-sm text-gray-500 max-w-md break-words')}>
                            {component.description || (
                              <span className={clsx('text-gray-400 italic')}>설명 없음</span>
                            )}
                          </div>
                        </td>
                        <td
                          className={clsx(
                            'px-6 py-4 whitespace-nowrap text-right text-sm font-medium',
                          )}
                        >
                          <div className={clsx('flex items-center justify-end space-x-3')}>
                            <button
                              onClick={() => openModifyModal(component)}
                              className={clsx(
                                'flex items-center text-indigo-600 hover:text-indigo-900 transition-colors',
                              )}
                            >
                              <Edit size={16} className={clsx('mr-1')} />
                              수정
                            </button>
                            <button
                              onClick={() => handleDeleteClick(component)}
                              disabled={isDeleting === component.id}
                              className={clsx(
                                'flex items-center text-red-600 hover:text-red-800 transition-colors',
                                isDeleting === component.id && 'opacity-50 cursor-not-allowed',
                              )}
                            >
                              {isDeleting === component.id ? (
                                <>
                                  <div
                                    className={clsx(
                                      'w-4 h-4 border-t-2 border-b-2 border-red-600 rounded-full animate-spin mr-1',
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
                <div className={clsx('text-center py-20')}>
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
                          'inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500',
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
                          'inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500',
                        )}
                      >
                        <Plus className={clsx('-ml-1 mr-2 h-5 w-5')} aria-hidden='true' />
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
            'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fadeIn',
          )}
        >
          <div
            className={clsx('bg-white rounded-xl p-6 w-full max-w-md shadow-lg animate-scaleIn')}
          >
            <div className={clsx('flex justify-between items-center mb-4')}>
              <h3 className={clsx('text-xl font-bold text-gray-900 flex items-center')}>
                <Plus size={20} className={clsx('mr-2 text-indigo-600')} />
                컴포넌트 추가
              </h3>
              <button
                type='button'
                onClick={() => {
                  setShowAddModal(false);
                  resetForm();
                }}
                className={clsx('text-gray-400 hover:text-gray-500 transition-colors')}
              >
                <X size={20} />
              </button>
            </div>

            {error && (
              <div
                className={clsx(
                  'mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-md flex items-start',
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
                  className={clsx('block text-sm font-medium text-gray-700 mb-1')}
                >
                  이름 <span className={clsx('text-red-500')}>*</span>
                </label>
                <input
                  type='text'
                  id='componentName'
                  value={componentName}
                  onChange={(e) => setComponentName(e.target.value)}
                  className={clsx(
                    'w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition-colors',
                  )}
                  placeholder='컴포넌트 이름 (예: 프론트엔드, 백엔드)'
                  disabled={isAdding}
                />
              </div>

              <div>
                <label
                  htmlFor='componentDescription'
                  className={clsx('block text-sm font-medium text-gray-700 mb-1')}
                >
                  설명
                </label>
                <textarea
                  id='componentDescription'
                  value={componentDescription}
                  onChange={(e) => setComponentDescription(e.target.value)}
                  rows={3}
                  className={clsx(
                    'w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 resize-none transition-colors',
                  )}
                  placeholder='컴포넌트 설명 (선택사항)'
                  disabled={isAdding}
                />
              </div>
            </div>

            <div className={clsx('mt-6 flex justify-end space-x-3 pt-4 border-t border-gray-200')}>
              <button
                type='button'
                onClick={() => {
                  setShowAddModal(false);
                  resetForm();
                }}
                className={clsx(
                  'px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors',
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
                  'flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 focus:outline-none disabled:opacity-50 transition-colors',
                )}
              >
                {isAdding ? (
                  <>
                    <div
                      className={clsx(
                        'w-4 h-4 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2',
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
            'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fadeIn',
          )}
        >
          <div
            className={clsx('bg-white rounded-xl p-6 w-full max-w-md shadow-lg animate-scaleIn')}
          >
            <div className={clsx('flex justify-between items-center mb-4')}>
              <h3 className={clsx('text-xl font-bold text-gray-900 flex items-center')}>
                <Edit size={20} className={clsx('mr-2 text-indigo-600')} />
                컴포넌트 수정
              </h3>
              <button
                type='button'
                onClick={() => {
                  setShowModifyModal(false);
                  resetForm();
                }}
                className={clsx('text-gray-400 hover:text-gray-500 transition-colors')}
              >
                <X size={20} />
              </button>
            </div>

            {error && (
              <div
                className={clsx(
                  'mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-md flex items-start',
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
                  className={clsx('block text-sm font-medium text-gray-700 mb-1')}
                >
                  이름 <span className={clsx('text-red-500')}>*</span>
                </label>
                <input
                  type='text'
                  id='componentName'
                  value={componentName}
                  onChange={(e) => setComponentName(e.target.value)}
                  className={clsx(
                    'w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition-colors',
                  )}
                  placeholder='컴포넌트 이름'
                  disabled={isAdding}
                />
              </div>

              <div>
                <label
                  htmlFor='componentDescription'
                  className={clsx('block text-sm font-medium text-gray-700 mb-1')}
                >
                  설명
                </label>
                <textarea
                  id='componentDescription'
                  value={componentDescription}
                  onChange={(e) => setComponentDescription(e.target.value)}
                  rows={3}
                  className={clsx(
                    'w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 resize-none transition-colors',
                  )}
                  placeholder='컴포넌트 설명 (선택사항)'
                  disabled={isAdding}
                />
              </div>
            </div>

            <div className={clsx('mt-6 flex justify-end space-x-3 pt-4 border-t border-gray-200')}>
              <button
                type='button'
                onClick={() => {
                  setShowModifyModal(false);
                  resetForm();
                }}
                className={clsx(
                  'px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors',
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
                    componentDescription === (selectedComponent.description || ''))
                }
                className={clsx(
                  'flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 focus:outline-none disabled:opacity-50 transition-colors',
                )}
              >
                {isAdding ? (
                  <>
                    <div
                      className={clsx(
                        'w-4 h-4 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2',
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
            'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fadeIn',
          )}
        >
          <div
            className={clsx('bg-white rounded-xl p-6 w-full max-w-md shadow-lg animate-scaleIn')}
          >
            <div className={clsx('flex justify-between items-center mb-3')}>
              <h3 className={clsx('text-xl font-bold text-gray-900')}>컴포넌트 삭제</h3>
              <button
                type='button'
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedComponent(null);
                }}
                className={clsx('text-gray-400 hover:text-gray-500 transition-colors')}
              >
                <X size={20} />
              </button>
            </div>

            <div className={clsx('mb-6 bg-red-50 p-4 rounded-md border-l-4 border-red-500')}>
              <div className={clsx('flex')}>
                <AlertCircle className={clsx('h-5 w-5 text-red-400 flex-shrink-0')} />
                <div className={clsx('ml-3')}>
                  <p className={clsx('text-sm text-red-800')}>
                    <strong>{selectedComponent.name}</strong> 컴포넌트를 삭제하시겠습니까? 이 작업은
                    되돌릴 수 없으며, 관련된 이슈들의 컴포넌트가 제거됩니다.
                  </p>
                </div>
              </div>
            </div>

            <div className={clsx('flex space-x-3 justify-end border-t border-gray-200 pt-4')}>
              <button
                type='button'
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedComponent(null);
                }}
                className={clsx(
                  'px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors',
                )}
              >
                취소
              </button>
              <button
                type='button'
                onClick={handleDeleteComponent}
                disabled={isDeleting === selectedComponent.id}
                className={clsx(
                  'flex items-center px-4 py-2 bg-red-600 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-red-700 transition-colors disabled:opacity-70',
                )}
              >
                {isDeleting === selectedComponent.id ? (
                  <>
                    <div
                      className={clsx(
                        'w-4 h-4 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2',
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
