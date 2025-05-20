// settings/ui/SettingPage.tsx
import {
  deleteProject,
  getProjectSettings,
  updateProjectImage,
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
        if (!data.leader) {
          alert('팀장만 접근 가능한 페이지입니다. 스프린트 페이지로 이동합니다.');
          navigate(`/projects/${projectId}/sprint`, { replace: true });
        }
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
  }, [projectId, navigate]);

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

      // 설정 먼저 업데이트
      let updatedSettings = await updateProjectSettings(updatedSettingsData);

      // 이미지 업로드 실패 플래그
      let imageUploadFailed = false;

      // 이미지 파일이 있으면 별도로 이미지 업로드 API 호출
      if (imageFile) {
        try {
          console.log('이미지 파일 업로드 시작:', imageFile.name);
          const imageUploadSuccess = await updateProjectImage(projectId, imageFile);

          if (imageUploadSuccess) {
            console.log('이미지 업로드 성공');
            // 이미지 업로드 성공 시 설정 다시 불러오기
            updatedSettings = await getProjectSettings(projectId);
          } else {
            console.error('이미지 업로드 실패 - 응답은 성공이지만 결과가 SUCCESS가 아님');
            imageUploadFailed = true;
          }
        } catch (imageError) {
          console.error('이미지 업로드 중 오류 발생:', imageError);
          imageUploadFailed = true;
        }
      }

      // 이미지 업로드 실패 시 메시지 표시
      if (imageUploadFailed) {
        setFormError('이미지 업로드는 실패했으나 다른 설정은 저장되었습니다.');
        setTimeout(() => setFormError(null), 5000);
      } else {
        setSuccessMessage('프로젝트 설정이 저장되었습니다.');
        setTimeout(() => setSuccessMessage(null), 3000);
      }

      setSettings(updatedSettings);

      // 이미지 상태 초기화
      if (!imageUploadFailed) {
        setImageFile(null);
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl); // 메모리 누수 방지
          setPreviewUrl(null);
        }
      }
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
  const imageUrl = previewUrl || settings?.imageUrl || settings?.image || '';

  if (isLoading || !settings) {
    return (
      <div className={clsx('min-h-screen bg-gray-50 p-8')}>
        <div className={clsx('mx-auto max-w-4xl')}>
          <h1 className={clsx('text-3xl font-bold text-gray-800')}>프로젝트 설정</h1>
          <div
            className={clsx(
              'mt-4 flex min-h-[200px] items-center justify-center rounded-xl bg-white p-6 shadow-sm',
            )}
          >
            <div className={clsx('flex flex-col items-center')}>
              <div
                className={clsx(
                  'mb-4 h-10 w-10 animate-spin rounded-full border-t-2 border-b-2 border-indigo-500',
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
      <div className={clsx('mx-auto max-w-4xl')}>
        <h1 className={clsx('flex items-center text-3xl font-bold text-gray-800')}>
          <Settings className={clsx('mr-3')} size={28} />
          프로젝트 설정
        </h1>

        {/* 알림 메시지 */}
        {formError && (
          <div
            className={clsx(
              'mt-4 flex items-start rounded-md border-l-4 border-red-500 bg-red-50 p-4 text-red-700',
            )}
          >
            <AlertTriangle size={20} className={clsx('mt-0.5 mr-2 flex-shrink-0')} />
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
              'mt-4 flex items-start rounded-md border-l-4 border-green-500 bg-green-50 p-4 text-green-700',
            )}
          >
            <CheckCircle size={20} className={clsx('mt-0.5 mr-2 flex-shrink-0')} />
            <p>{successMessage}</p>
          </div>
        )}

        <div className={clsx('mt-6 rounded-xl bg-white p-8 shadow-sm')}>
          <div className={clsx('space-y-8')}>
            {/* 프로젝트 대표 이미지 */}
            <div>
              <h2 className={clsx('mb-4 text-lg font-medium text-gray-700')}>
                프로젝트 대표 이미지
              </h2>
              <div className={clsx('flex items-center space-x-6')}>
                <div
                  onClick={handleImageClick}
                  className={clsx(
                    'group relative flex h-32 w-32 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-gray-200 bg-gray-100 transition-all duration-200 hover:border-indigo-300',
                  )}
                >
                  {imageUrl ? (
                    <>
                      <img
                        src={imageUrl}
                        alt='프로젝트 이미지'
                        className={clsx('h-full w-full object-cover')}
                      />
                      <div
                        className={clsx(
                          'bg-opacity-40 absolute inset-0 flex items-center justify-center bg-black opacity-0 transition-opacity duration-200 group-hover:opacity-100',
                        )}
                      >
                        <Camera className={clsx('text-white')} size={24} />
                      </div>
                    </>
                  ) : (
                    <div
                      className={clsx(
                        'flex flex-col items-center justify-center text-gray-400 transition-colors group-hover:text-indigo-500',
                      )}
                    >
                      <Camera size={32} />
                      <span className={clsx('mt-2 text-xs')}>이미지 추가</span>
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
                      'rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:border-gray-400 hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none',
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
              <h2 className={clsx('mb-4 text-lg font-medium text-gray-700')}>
                이름 <span className={clsx('text-red-500')}>*</span>
              </h2>
              <div className={clsx('w-full')}>
                <input
                  type='text'
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className={clsx(
                    'w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm transition-colors focus:border-indigo-500 focus:ring-indigo-500',
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
                  'flex w-full items-center justify-center rounded-lg bg-indigo-600 px-6 py-3 font-medium text-white transition-colors hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none disabled:opacity-70 sm:w-auto',
                )}
              >
                {isSaving ? (
                  <>
                    <div
                      className={clsx(
                        'mr-2 h-5 w-5 animate-spin rounded-full border-t-2 border-b-2 border-white',
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
              'flex items-center font-medium text-red-600 transition-colors hover:text-red-800 focus:outline-none',
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
            'bg-opacity-50 animate-fadeIn fixed inset-0 z-50 flex items-center justify-center bg-black p-4',
          )}
        >
          <div
            className={clsx(
              'animate-scaleIn w-full max-w-md transform rounded-xl bg-white p-6 shadow-xl transition-all',
            )}
          >
            <div className={clsx('mb-3 flex items-center justify-between')}>
              <h3 className={clsx('text-xl font-bold text-gray-900')}>프로젝트 삭제</h3>
              <button
                type='button'
                onClick={() => setShowConfirmDelete(false)}
                className={clsx('text-gray-400 transition-colors hover:text-gray-500')}
              >
                <X size={20} />
              </button>
            </div>

            <div className={clsx('p-1')}>
              <div className={clsx('mb-6 rounded-md border-l-4 border-red-500 bg-red-50 p-4')}>
                <div className={clsx('flex')}>
                  <AlertTriangle size={20} className={clsx('flex-shrink-0 text-red-400')} />
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

              <p className={clsx('mb-2 font-medium text-gray-700')}>
                삭제를 확인하려면 프로젝트 이름을 입력하세요:
              </p>
              <input
                type='text'
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                className={clsx(
                  'mb-6 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-red-500 focus:ring-red-500',
                )}
                placeholder={settings.name}
              />
            </div>

            <div className={clsx('flex justify-end space-x-3 border-t border-gray-200 pt-4')}>
              <button
                type='button'
                onClick={() => setShowConfirmDelete(false)}
                className={clsx(
                  'rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50',
                )}
              >
                취소
              </button>
              <button
                type='button'
                onClick={handleDeleteProject}
                disabled={isDeleting || deleteConfirmText !== settings.name}
                className={clsx(
                  'flex items-center rounded-lg border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-70',
                )}
              >
                {isDeleting ? (
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

export default SettingPage;
