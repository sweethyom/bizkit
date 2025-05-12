// settings/ui/SettingPage.tsx
import {
  deleteProject,
  getProjectSettings,
  updateProjectSettings,
} from '@/pages/settings/api/settingsApi';
import { ProjectSettings } from '@/pages/settings/model/types';
import { clsx } from 'clsx';
import { AlertTriangle, Camera, CheckCircle, Save, Settings, Trash2, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router';

const SettingPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [settings, setSettings] = useState<ProjectSettings | null>(null);
  const [projectName, setProjectName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      if (!projectId) return;

      setIsLoading(true);
      try {
        const data = await getProjectSettings(projectId);
        setSettings(data);
        setProjectName(data.name);
      } catch (error) {
        console.error('Failed to fetch project settings:', error);
        setFormError('프로젝트 설정을 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, [projectId]);

  const handleSave = async () => {
    if (!settings || !projectId) return;

    // 유효성 검사
    if (!projectName.trim()) {
      setFormError('프로젝트 이름은 필수입니다.');
      return;
    }

    setFormError(null);
    setSuccessMessage(null);
    setIsSaving(true);

    try {
      // 업데이트할 설정 객체 생성
      const updatedSettingsData = {
        ...settings,
        name: projectName.trim(),
      };

      // 이미지 처리 (실제 구현에서는 이미지 업로드 API를 호출해야 함)
      if (imageFile) {
        // 가상의 이미지 URL 생성 (실제 구현에서는 업로드 후 반환된 URL 사용)
        updatedSettingsData.imageUrl = previewUrl || settings.imageUrl;
      }

      const updatedSettings = await updateProjectSettings(updatedSettingsData);
      setSettings(updatedSettings);
      setSuccessMessage('프로젝트 설정이 저장되었습니다.');

      // 3초 후 성공 메시지 숨기기
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error('Failed to update project settings:', error);
      setFormError('프로젝트 설정 저장에 실패했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageClick = () => {
    // 파일 입력창 클릭 트리거
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 이미지 파일 유효성 검사
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setFormError('이미지 파일만 업로드 가능합니다 (JPEG, PNG, GIF).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      // 5MB 제한
      setFormError('파일 크기는 5MB 이하여야 합니다.');
      return;
    }

    // 파일 저장 및 미리보기 URL 생성
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setFormError(null);
  };

  const handleDeleteProject = async () => {
    if (!projectId || !settings) return;

    // 삭제 확인 텍스트 검증
    if (deleteConfirmText !== settings.name) {
      setFormError('프로젝트 이름을 정확히 입력해주세요.');
      return;
    }

    setIsDeleting(true);
    setFormError(null);
    try {
      await deleteProject(projectId);
      // 성공 후 홈페이지로 이동
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Failed to delete project:', error);
      setFormError('프로젝트 삭제에 실패했습니다.');
      setShowConfirmDelete(false);
      setIsDeleting(false);
    }
  };

  // 이미지 URL 결정 (미리보기 또는 저장된 이미지)
  const imageUrl = previewUrl || settings?.imageUrl || '';

  if (isLoading || !settings) {
    return (
      <div className={clsx('min-h-screen bg-gray-50 p-8')}>
        <div className={clsx('max-w-4xl mx-auto')}>
          <h1 className={clsx('text-3xl font-bold text-gray-800')}>프로젝트 설정</h1>
          <div
            className={clsx(
              'mt-4 p-6 bg-white rounded-xl shadow-sm flex items-center justify-center min-h-[200px]',
            )}
          >
            <div className={clsx('flex flex-col items-center')}>
              <div
                className={clsx(
                  'w-10 h-10 border-t-2 border-b-2 border-indigo-500 rounded-full animate-spin mb-4',
                )}
              ></div>
              <p className={clsx('text-gray-500')}>프로젝트 설정을 불러오는 중...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={clsx('min-h-screen bg-gray-50 p-8')}>
      <div className={clsx('max-w-4xl mx-auto')}>
        <h1 className={clsx('text-3xl font-bold text-gray-800 flex items-center')}>
          <Settings className={clsx('mr-3')} size={28} />
          프로젝트 설정
        </h1>

        {/* 알림 메시지 */}
        {formError && (
          <div
            className={clsx(
              'mt-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-md flex items-start',
            )}
          >
            <AlertTriangle size={20} className={clsx('mr-2 flex-shrink-0 mt-0.5')} />
            <p>{formError}</p>
            <button
              onClick={() => setFormError(null)}
              className={clsx('ml-auto text-red-700 hover:text-red-900')}
              aria-label='닫기'
            >
              <X size={18} />
            </button>
          </div>
        )}

        {successMessage && (
          <div
            className={clsx(
              'mt-4 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded-md flex items-start',
            )}
          >
            <CheckCircle size={20} className={clsx('mr-2 flex-shrink-0 mt-0.5')} />
            <p>{successMessage}</p>
          </div>
        )}

        <div className={clsx('mt-6 bg-white rounded-xl shadow-sm p-8')}>
          <div className={clsx('space-y-8')}>
            {/* 프로젝트 대표 이미지 */}
            <div>
              <h2 className={clsx('text-lg font-medium text-gray-700 mb-4')}>
                프로젝트 대표 이미지
              </h2>
              <div className={clsx('flex items-center space-x-6')}>
                <div
                  onClick={handleImageClick}
                  className={clsx(
                    'relative w-32 h-32 rounded-full bg-gray-100 overflow-hidden border-2 border-gray-200 cursor-pointer hover:border-indigo-300 transition-all duration-200 flex items-center justify-center group',
                  )}
                >
                  {imageUrl ? (
                    <>
                      <img
                        src={imageUrl}
                        alt='프로젝트 이미지'
                        className={clsx('w-full h-full object-cover')}
                      />
                      <div
                        className={clsx(
                          'absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center',
                        )}
                      >
                        <Camera className={clsx('text-white')} size={24} />
                      </div>
                    </>
                  ) : (
                    <div
                      className={clsx(
                        'flex flex-col items-center justify-center text-gray-400 group-hover:text-indigo-500 transition-colors',
                      )}
                    >
                      <Camera size={32} />
                      <span className={clsx('text-xs mt-2')}>이미지 추가</span>
                    </div>
                  )}
                </div>

                <div>
                  <input
                    ref={fileInputRef}
                    type='file'
                    accept='image/*'
                    onChange={handleImageChange}
                    className={clsx('hidden')}
                  />
                  <button
                    type='button'
                    onClick={handleImageClick}
                    className={clsx(
                      'px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all',
                    )}
                  >
                    {imageUrl ? '이미지 변경' : '이미지 업로드'}
                  </button>
                  {imageFile && (
                    <p className={clsx('mt-2 text-sm text-gray-500')}>
                      {imageFile.name} ({Math.round(imageFile.size / 1024)} KB)
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* 프로젝트 이름 */}
            <div>
              <h2 className={clsx('text-lg font-medium text-gray-700 mb-4')}>
                이름 <span className={clsx('text-red-500')}>*</span>
              </h2>
              <div className={clsx('w-full')}>
                <input
                  type='text'
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className={clsx(
                    'w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition-colors',
                  )}
                  placeholder='프로젝트 이름'
                />
              </div>
            </div>

            {/* 저장 버튼 */}
            <div className={clsx('pt-5')}>
              <button
                type='button'
                onClick={handleSave}
                disabled={isSaving}
                className={clsx(
                  'flex items-center justify-center w-full sm:w-auto px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-70',
                )}
              >
                {isSaving ? (
                  <>
                    <div
                      className={clsx(
                        'w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2',
                      )}
                    ></div>
                    저장 중...
                  </>
                ) : (
                  <>
                    <Save size={18} className={clsx('mr-2')} />
                    저장
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* 프로젝트 삭제 */}
        <div className={clsx('mt-8')}>
          <button
            type='button'
            onClick={() => setShowConfirmDelete(true)}
            className={clsx(
              'flex items-center text-red-600 font-medium hover:text-red-800 focus:outline-none transition-colors',
            )}
          >
            <Trash2 size={18} className={clsx('mr-1')} />
            프로젝트 삭제
          </button>
        </div>
      </div>

      {/* 삭제 확인 모달 */}
      {showConfirmDelete && (
        <div
          className={clsx(
            'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fadeIn',
          )}
        >
          <div
            className={clsx(
              'bg-white rounded-xl p-6 w-full max-w-md shadow-xl transform transition-all animate-scaleIn',
            )}
          >
            <div className={clsx('flex items-center justify-between mb-3')}>
              <h3 className={clsx('text-xl font-bold text-gray-900')}>프로젝트 삭제</h3>
              <button
                type='button'
                onClick={() => setShowConfirmDelete(false)}
                className={clsx('text-gray-400 hover:text-gray-500 transition-colors')}
              >
                <X size={20} />
              </button>
            </div>

            <div className={clsx('p-1')}>
              <div className={clsx('mb-6 bg-red-50 p-4 rounded-md border-l-4 border-red-500')}>
                <div className={clsx('flex')}>
                  <AlertTriangle size={20} className={clsx('text-red-400 flex-shrink-0')} />
                  <div className={clsx('ml-3')}>
                    <h3 className={clsx('text-sm font-medium text-red-800')}>주의 사항</h3>
                    <div className={clsx('mt-2 text-sm text-red-700')}>
                      <p>
                        프로젝트를 삭제하면 모든 데이터가 영구적으로 제거됩니다. 이 작업은 되돌릴 수
                        없습니다.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <p className={clsx('text-gray-700 mb-2 font-medium')}>
                삭제를 확인하려면 프로젝트 이름을 입력하세요:
              </p>
              <input
                type='text'
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                className={clsx(
                  'w-full mb-6 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-red-500 focus:border-red-500',
                )}
                placeholder={settings.name}
              />
            </div>

            <div className={clsx('flex space-x-3 justify-end border-t border-gray-200 pt-4')}>
              <button
                type='button'
                onClick={() => setShowConfirmDelete(false)}
                className={clsx(
                  'px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors',
                )}
              >
                취소
              </button>
              <button
                type='button'
                onClick={handleDeleteProject}
                disabled={isDeleting || deleteConfirmText !== settings.name}
                className={clsx(
                  'flex items-center px-4 py-2 bg-red-600 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-red-700 transition-colors disabled:opacity-70',
                )}
              >
                {isDeleting ? (
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

export default SettingPage;
