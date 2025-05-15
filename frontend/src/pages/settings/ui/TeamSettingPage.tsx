// settings/ui/TeamSettingPage.tsx
import {
  getInvitedMembers,
  getTeamMembers,
  inviteTeamMember,
  leaveTeam,
  removeInvitedMember,
  removeTeamMember,
} from '@/pages/settings/api/settingsApi';
import { InvitedMember, TeamMember } from '@/pages/settings/model/types';
import { clsx } from 'clsx';
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  LogOut,
  Mail,
  Search,
  Trash2,
  UserCog,
  UserMinus,
  UserPlus,
  Users,
  X,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';

const TeamSettingPage: React.FC = () => {
  const navigate = useNavigate();
  // projectId 파라미터 가져오기
  const { projectId } = useParams<{ projectId: string }>();

  // projectId 초기 확인
  useEffect(() => {
    console.log('현재 URL에서 추출한 projectId:', projectId);
    if (!projectId) {
      console.error('projectId가 없습니다. URL 확인이 필요합니다.');
    }
  }, [projectId]);

  const [members, setMembers] = useState<TeamMember[]>([]);
  const [invitedMembers, setInvitedMembers] = useState<InvitedMember[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<TeamMember[]>([]);
  const [activeTab, setActiveTab] = useState<'members' | 'invites'>('members');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingInvites, setIsLoadingInvites] = useState(false);
  const [isInviting, setIsInviting] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null); // 멤버 ID 저장
  const [isDeletingInvite, setIsDeletingInvite] = useState<string | null>(null); // 초대 ID 저장
  const [isLeaving, setIsLeaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showLeaveConfirmModal, setShowLeaveConfirmModal] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<TeamMember | null>(null);
  const [inviteToDelete, setInviteToDelete] = useState<InvitedMember | null>(null);
  const [inviteEmail, setInviteEmail] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // 팀원 목록 가져오기
  const fetchMembers = useCallback(async () => {
    if (!projectId) return;

    console.log('TeamSettingPage - 프로젝트 ID:', projectId);
    setIsLoading(true);
    setError(null);
    try {
      const data = await getTeamMembers(projectId);
      console.log('팀원 목록 반환된 데이터:', data);
      console.log('팀원 목록 상세 내용:', JSON.stringify(data, null, 2));

      // 서버에서 반환한 팀원 목록이 비어있는 경우, 현재 로그인한 사용자를 추가하는 임시 로직
      if (data.length === 0) {
        // 실제 프로덕션에서는 제거해야 하는 임시 로직입니다.
        console.log('팀원 목록이 비어있어 현재 사용자를 추가합니다.');

        // 현재 사용자 정보를 가져오거나, 저장된 사용자 정보를 사용할 수 있음
        // 예시로 로컬 스토리지, 상태 관리 라이브러리 등에서 사용자 정보 가져오기
        // 여기서는 로그인한 사용자가 프로젝트 소유자라고 가정
        const currentUser = {
          id: '1', // 임의의 ID
          nickname: 'test2', // 임의의 닉네임
          email: 'test2@test.com', // 임의의 이메일
          role: 'LEADER', // 프로젝트 생성자는 팀장으로 가정
        };

        setMembers([currentUser]);
        setFilteredMembers([currentUser]);
      } else {
        setMembers(data);
        setFilteredMembers(data);
      }
    } catch (error) {
      console.error('Failed to fetch team members:', error);
      setError('팀원 목록을 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  // 초대 팀원 목록 가져오기
  const fetchInvitedMembers = useCallback(async () => {
    if (!projectId) return;

    setIsLoadingInvites(true);
    setError(null);
    try {
      const data = await getInvitedMembers(projectId);
      console.log('초대 팀원 목록 데이터:', data);
      setInvitedMembers(data);
    } catch (error) {
      console.error('Failed to fetch invited members:', error);
      // 초대 멤버를 가져오는 API가 구현되지 않은 경우, 사용자에게 보이는 오류 메시지는 표시하지 않음
    } finally {
      setIsLoadingInvites(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchInvitedMembers();
  }, [fetchInvitedMembers]);

  // 검색 기능
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredMembers(members);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = members.filter(
        (member) =>
          member.nickname.toLowerCase().includes(query) ||
          member.email.toLowerCase().includes(query),
      );
      setFilteredMembers(filtered);
    }
  }, [searchQuery, members]);

  // 이메일 유효성 검사
  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  // 팀원 초대 처리
  const handleInvite = async () => {
    if (!projectId || !inviteEmail.trim()) return;

    console.log('초대 처리 - 프로젝트 ID:', projectId);
    console.log('초대할 이메일:', inviteEmail.trim());

    // 이메일 유효성 검사
    if (!validateEmail(inviteEmail)) {
      setError('유효한 이메일 주소를 입력해주세요.');
      return;
    }

    // 중복 초대 방지
    if (members.some((member) => member.email === inviteEmail)) {
      setError('이미 팀에 참여 중인 멤버입니다.');
      return;
    }

    setIsInviting(true);
    setError(null);
    try {
      const success = await inviteTeamMember(projectId, { email: inviteEmail.trim() });
      console.log('초대 결과:', success);
      if (success) {
        setSuccess(`${inviteEmail}에 초대장이 발송되었습니다.`);
        setInviteEmail('');
        setTimeout(() => {
          setShowInviteModal(false);
          setSuccess(null);
          // 초대 후 멤버 목록 새로고침
          fetchInvitedMembers();
        }, 2000);
      }
    } catch (error) {
      console.error('Failed to invite member:', error);
      setError('초대 발송에 실패했습니다. 다시 시도해 주세요.');
    } finally {
      setIsInviting(false);
    }
  };

  // 팀원 삭제 모달 열기
  const openDeleteConfirmModal = (member: TeamMember) => {
    setMemberToDelete(member);
    setShowConfirmModal(true);
  };

  // 팀원 삭제 처리
  const handleRemoveMember = async () => {
    if (!projectId || !memberToDelete) return;

    setIsDeleting(memberToDelete.id);
    setError(null);
    try {
      const success = await removeTeamMember(projectId, memberToDelete.id);
      if (success) {
        setMembers(members.filter((member) => member.id !== memberToDelete.id));
        setFilteredMembers(filteredMembers.filter((member) => member.id !== memberToDelete.id));
        setSuccess('팀원이 성공적으로 제거되었습니다.');
        setTimeout(() => {
          setSuccess(null);
        }, 3000);
      }
    } catch (error) {
      console.error('Failed to remove team member:', error);
      setError('팀원 삭제에 실패했습니다.');
    } finally {
      setIsDeleting(null);
      setShowConfirmModal(false);
      setMemberToDelete(null);
    }
  };

  // 초대 팀원 삭제 모달 열기
  const openDeleteInviteConfirmModal = (invite: InvitedMember) => {
    setInviteToDelete(invite);
    setShowConfirmModal(true);
  };

  // 초대 팀원 삭제 처리
  const handleRemoveInvitedMember = async () => {
    if (!inviteToDelete) return;

    setIsDeletingInvite(inviteToDelete.invitationId);
    setError(null);
    try {
      const success = await removeInvitedMember(inviteToDelete.invitationId);
      if (success) {
        setInvitedMembers(
          invitedMembers.filter((invite) => invite.invitationId !== inviteToDelete.invitationId),
        );
        setSuccess('초대가 성공적으로 취소되었습니다.');
        setTimeout(() => {
          setSuccess(null);
        }, 3000);
      }
    } catch (error) {
      console.error('Failed to remove invited member:', error);
      setError('초대 취소에 실패했습니다.');
    } finally {
      setIsDeletingInvite(null);
      setShowConfirmModal(false);
      setInviteToDelete(null);
    }
  };

  // 팀 나가기 모달 열기
  const openLeaveTeamConfirmModal = () => {
    setShowLeaveConfirmModal(true);
  };

  // 팀 나가기 처리
  const handleLeaveTeam = async () => {
    if (!projectId) return;

    setIsLeaving(true);
    setError(null);
    try {
      const success = await leaveTeam(projectId);
      if (success) {
        setSuccess('프로젝트에서 나갔습니다.');
        setTimeout(() => {
          // 홈 페이지로 이동
          navigate('/');
        }, 2000);
      }
    } catch (error) {
      console.error('Failed to leave team:', error);
      setError('팀 나가기에 실패했습니다.');
    } finally {
      setIsLeaving(false);
      setShowLeaveConfirmModal(false);
    }
  };

  return (
    <div className={clsx('min-h-screen bg-gray-50 p-8')}>
      <div className={clsx('mx-auto max-w-6xl')}>
        <div className={clsx('flex items-center justify-between')}>
          <h1 className={clsx('flex items-center text-3xl font-bold text-gray-800')}>
            <Users className={clsx('mr-3')} size={28} />
            팀원 관리
          </h1>

          <div className={clsx('flex space-x-3')}>
            <button
              type='button'
              onClick={openLeaveTeamConfirmModal}
              className={clsx(
                'flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none',
              )}
            >
              <LogOut size={18} className={clsx('mr-2')} />팀 나가기
            </button>

            <button
              type='button'
              onClick={() => setShowInviteModal(true)}
              className={clsx(
                'flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none',
              )}
            >
              <UserPlus size={18} className={clsx('mr-2')} />
              팀원 초대
            </button>
          </div>
        </div>

        {/* 에러 및 성공 메시지 */}
        {error && (
          <div
            className={clsx(
              'mt-4 flex items-start rounded-md border-l-4 border-red-500 bg-red-50 p-4 text-red-700',
            )}
          >
            <AlertCircle size={20} className={clsx('mt-0.5 mr-2 flex-shrink-0')} />
            <p>{error}</p>
            <button
              onClick={() => setError(null)}
              className={clsx('ml-auto text-red-700 hover:text-red-900')}
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

        {/* 탭 네비게이션 */}
        <div className={clsx('mt-6 border-b border-gray-200')}>
          <nav className={clsx('-mb-px flex')} aria-label='팀원 관리 탭'>
            <button
              onClick={() => setActiveTab('members')}
              className={clsx(
                'border-b-2 px-6 py-4 text-center text-sm font-medium',
                activeTab === 'members'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
              )}
            >
              현재 팀원
            </button>
            <button
              onClick={() => setActiveTab('invites')}
              className={clsx(
                'border-b-2 px-6 py-4 text-center text-sm font-medium',
                activeTab === 'invites'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
              )}
            >
              초대된 팀원
            </button>
          </nav>
        </div>

        <div className={clsx('mt-4')}>
          {activeTab === 'members' ? (
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
                    placeholder='이름 또는 이메일로 검색'
                    className={clsx(
                      'w-full rounded-lg border border-gray-300 py-2 pr-4 pl-10 focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs',
                    )}
                  />
                </div>
              </div>

              {/* 팀원 목록 테이블 */}
              <div className={clsx('overflow-x-auto')}>
                {isLoading ? (
                  <div className={clsx('flex items-center justify-center py-20')}>
                    <div
                      className={clsx(
                        'h-10 w-10 animate-spin rounded-full border-t-2 border-b-2 border-indigo-500',
                      )}
                    ></div>
                    <span className={clsx('ml-3 text-gray-500')}>팀원 정보를 불러오는 중...</span>
                  </div>
                ) : filteredMembers.length > 0 ? (
                  <table className={clsx('min-w-full divide-y divide-gray-200')}>
                    <thead className={clsx('bg-gray-50')}>
                      <tr>
                        <th
                          scope='col'
                          className={clsx(
                            'px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase',
                          )}
                        >
                          닉네임
                        </th>
                        <th
                          scope='col'
                          className={clsx(
                            'px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase',
                          )}
                        >
                          이메일
                        </th>
                        <th
                          scope='col'
                          className={clsx(
                            'px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase',
                          )}
                        >
                          역할
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
                      {filteredMembers.map((member) => (
                        <tr key={member.id} className={clsx('transition-colors hover:bg-gray-50')}>
                          <td className={clsx('px-6 py-4 whitespace-nowrap')}>
                            <div className={clsx('flex items-center')}>
                              <div
                                className={clsx(
                                  'flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xl font-semibold text-indigo-600',
                                )}
                              >
                                {member.nickname.charAt(0).toUpperCase()}
                              </div>
                              <div className={clsx('ml-4')}>
                                <div className={clsx('text-sm font-medium text-gray-900')}>
                                  {member.nickname}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className={clsx('px-6 py-4 whitespace-nowrap')}>
                            <div className={clsx('flex items-center text-sm text-gray-500')}>
                              <Mail size={16} className={clsx('mr-2 text-gray-400')} />
                              {member.email}
                            </div>
                          </td>
                          <td className={clsx('px-6 py-4 whitespace-nowrap')}>
                            <span
                              className={clsx(
                                'inline-flex rounded-full px-3 py-1 text-xs leading-5 font-semibold',
                                member.role === 'LEADER'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-blue-100 text-blue-800',
                              )}
                            >
                              {member.role === 'LEADER' ? '팀장' : '팀원'}
                            </span>
                          </td>
                          <td
                            className={clsx(
                              'px-6 py-4 text-right text-sm font-medium whitespace-nowrap',
                            )}
                          >
                            {member.role !== 'LEADER' ? (
                              <button
                                onClick={() => openDeleteConfirmModal(member)}
                                disabled={isDeleting === member.id}
                                className={clsx(
                                  'ml-auto flex items-center text-red-600 transition-colors hover:text-red-800',
                                  { 'cursor-not-allowed opacity-50': isDeleting === member.id },
                                )}
                              >
                                {isDeleting === member.id ? (
                                  <>
                                    <div
                                      className={clsx(
                                        'mr-2 h-4 w-4 animate-spin rounded-full border-t-2 border-b-2 border-red-600',
                                      )}
                                    ></div>
                                    처리중...
                                  </>
                                ) : (
                                  <>
                                    <Trash2 size={16} className={clsx('mr-1')} />
                                    삭제
                                  </>
                                )}
                              </button>
                            ) : (
                              <span className={clsx('text-xs text-gray-400')}>프로젝트 소유자</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className={clsx('py-20 text-center')}>
                    <UserCog size={50} className={clsx('mx-auto mb-2 text-gray-300')} />
                    <h3 className={clsx('mt-2 text-sm font-medium text-gray-900')}>
                      {searchQuery ? '검색 결과가 없습니다' : '팀원이 없습니다'}
                    </h3>
                    <p className={clsx('mt-1 text-sm text-gray-500')}>
                      {searchQuery ? '다른 검색어로 시도해보세요' : '새로운 팀원을 초대해보세요'}
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
                          onClick={() => setShowInviteModal(true)}
                          className={clsx(
                            'inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none',
                          )}
                        >
                          <UserPlus className={clsx('mr-2 -ml-1 h-5 w-5')} aria-hidden='true' />
                          팀원 초대하기
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            // 초대된 팀원 탭
            <div className={clsx('overflow-hidden rounded-xl bg-white shadow-sm')}>
              <div className={clsx('overflow-x-auto')}>
                {isLoadingInvites ? (
                  <div className={clsx('flex items-center justify-center py-20')}>
                    <div
                      className={clsx(
                        'h-10 w-10 animate-spin rounded-full border-t-2 border-b-2 border-indigo-500',
                      )}
                    ></div>
                    <span className={clsx('ml-3 text-gray-500')}>초대 목록을 불러오는 중...</span>
                  </div>
                ) : invitedMembers && invitedMembers.length > 0 ? (
                  <table className={clsx('min-w-full divide-y divide-gray-200')}>
                    <thead className={clsx('bg-gray-50')}>
                      <tr>
                        <th
                          scope='col'
                          className={clsx(
                            'px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase',
                          )}
                        >
                          닉네임
                        </th>
                        <th
                          scope='col'
                          className={clsx(
                            'px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase',
                          )}
                        >
                          이메일
                        </th>
                        <th
                          scope='col'
                          className={clsx(
                            'px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase',
                          )}
                        >
                          상태
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
                      {invitedMembers.map((invite) => (
                        <tr
                          key={invite.invitationId}
                          className={clsx('transition-colors hover:bg-gray-50')}
                        >
                          <td className={clsx('px-6 py-4 whitespace-nowrap')}>
                            <div className={clsx('flex items-center')}>
                              <div
                                className={clsx(
                                  'flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-orange-100 text-xl font-semibold text-orange-600',
                                )}
                              >
                                {invite.nickname.charAt(0).toUpperCase()}
                              </div>
                              <div className={clsx('ml-4')}>
                                <div className={clsx('text-sm font-medium text-gray-900')}>
                                  {invite.nickname}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className={clsx('px-6 py-4 whitespace-nowrap')}>
                            <div className={clsx('flex items-center text-sm text-gray-500')}>
                              <Mail size={16} className={clsx('mr-2 text-gray-400')} />
                              {invite.email}
                            </div>
                          </td>
                          <td className={clsx('px-6 py-4 whitespace-nowrap')}>
                            <span
                              className={clsx(
                                'inline-flex rounded-full bg-yellow-100 px-3 py-1 text-xs leading-5 font-semibold text-yellow-800',
                              )}
                            >
                              초대됨
                            </span>
                          </td>
                          <td
                            className={clsx(
                              'px-6 py-4 text-right text-sm font-medium whitespace-nowrap',
                            )}
                          >
                            <button
                              onClick={() => openDeleteInviteConfirmModal(invite)}
                              disabled={isDeletingInvite === invite.invitationId}
                              className={clsx(
                                'ml-auto flex items-center text-red-600 transition-colors hover:text-red-800',
                                {
                                  'cursor-not-allowed opacity-50':
                                    isDeletingInvite === invite.invitationId,
                                },
                              )}
                            >
                              {isDeletingInvite === invite.invitationId ? (
                                <>
                                  <div
                                    className={clsx(
                                      'mr-2 h-4 w-4 animate-spin rounded-full border-t-2 border-b-2 border-red-600',
                                    )}
                                  ></div>
                                  처리중...
                                </>
                              ) : (
                                <>
                                  <UserMinus size={16} className={clsx('mr-1')} />
                                  초대 취소
                                </>
                              )}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className={clsx('py-20 text-center')}>
                    <UserCog size={50} className={clsx('mx-auto mb-2 text-gray-300')} />
                    <h3 className={clsx('mt-2 text-sm font-medium text-gray-900')}>
                      초대된 팀원이 없습니다
                    </h3>
                    <p className={clsx('mt-1 text-sm text-gray-500')}>
                      새로운 팀원을 초대하여 프로젝트에 참여시켜보세요
                    </p>
                    <div className={clsx('mt-6')}>
                      <button
                        type='button'
                        onClick={() => setShowInviteModal(true)}
                        className={clsx(
                          'inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none',
                        )}
                      >
                        <UserPlus className={clsx('mr-2 -ml-1 h-5 w-5')} aria-hidden='true' />
                        팀원 초대하기
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 초대 모달 */}
      {showInviteModal && (
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
            <div className={clsx('mb-4 flex items-center justify-between')}>
              <h3 className={clsx('flex items-center text-xl font-bold text-gray-900')}>
                <UserPlus size={20} className={clsx('mr-2 text-indigo-600')} />
                팀원 초대
              </h3>
              <button
                type='button'
                onClick={() => {
                  setShowInviteModal(false);
                  setInviteEmail('');
                  setError(null);
                  setSuccess(null);
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

            {success && (
              <div
                className={clsx(
                  'mb-4 flex items-start rounded-md border-l-4 border-green-500 bg-green-50 p-3 text-green-700',
                )}
              >
                <CheckCircle size={20} className={clsx('mr-2 flex-shrink-0')} />
                <p className={clsx('text-sm')}>{success}</p>
              </div>
            )}

            <div className={clsx('space-y-4 py-2')}>
              <div>
                <label
                  htmlFor='email'
                  className={clsx('mb-1 block text-sm font-medium text-gray-700')}
                >
                  이메일 <span className={clsx('text-red-500')}>*</span>
                </label>
                <div className={clsx('relative')}>
                  <div
                    className={clsx(
                      'pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3',
                    )}
                  >
                    <Mail size={18} className={clsx('text-gray-400')} />
                  </div>
                  <input
                    type='email'
                    id='email'
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className={clsx(
                      'w-full rounded-lg border border-gray-300 py-2 pr-4 pl-10 shadow-sm focus:border-indigo-500 focus:ring-indigo-500',
                    )}
                    placeholder='example@company.com'
                    disabled={isInviting || !!success}
                  />
                </div>
                <p className={clsx('mt-1 text-xs text-gray-500')}>
                  초대 링크가 입력한 이메일 주소로 발송됩니다.
                </p>
              </div>

              <div className={clsx('mt-8 flex justify-end space-x-3')}>
                <button
                  type='button'
                  onClick={() => {
                    setShowInviteModal(false);
                    setInviteEmail('');
                    setError(null);
                  }}
                  className={clsx(
                    'rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50',
                  )}
                  disabled={isInviting || !!success}
                >
                  취소
                </button>
                <button
                  type='button'
                  onClick={handleInvite}
                  disabled={isInviting || !inviteEmail.trim() || !!success}
                  className={clsx(
                    'flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50',
                  )}
                >
                  {isInviting ? (
                    <>
                      <div
                        className={clsx(
                          'mr-2 h-4 w-4 animate-spin rounded-full border-t-2 border-b-2 border-white',
                        )}
                      ></div>
                      초대 중...
                    </>
                  ) : (
                    <>
                      <UserPlus size={16} className={clsx('mr-2')} />
                      초대하기
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 팀원 삭제 확인 모달 */}
      {showConfirmModal && (memberToDelete || inviteToDelete) && (
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
              <h3 className={clsx('text-xl font-bold text-gray-900')}>
                {memberToDelete ? '팀원 삭제' : '초대 취소'}
              </h3>
              <button
                type='button'
                onClick={() => {
                  setShowConfirmModal(false);
                  setMemberToDelete(null);
                  setInviteToDelete(null);
                }}
                className={clsx('text-gray-400 transition-colors hover:text-gray-500')}
              >
                <X size={20} />
              </button>
            </div>

            <div className={clsx('mb-6 rounded-md border-l-4 border-yellow-500 bg-yellow-50 p-4')}>
              <div className={clsx('flex')}>
                <AlertTriangle size={20} className={clsx('flex-shrink-0 text-yellow-400')} />
                <div className={clsx('ml-3')}>
                  <p className={clsx('text-sm text-yellow-800')}>
                    {memberToDelete ? (
                      <>
                        <strong>{memberToDelete.nickname}</strong>님을 팀에서 삭제하시겠습니까? 이
                        작업은 되돌릴 수 없습니다.
                      </>
                    ) : (
                      <>
                        <strong>{inviteToDelete?.nickname || inviteToDelete?.email}</strong>님의
                        초대를 취소하시겠습니까?
                      </>
                    )}
                  </p>
                </div>
              </div>
            </div>

            <div className={clsx('flex justify-end space-x-3 border-t border-gray-200 pt-4')}>
              <button
                type='button'
                onClick={() => {
                  setShowConfirmModal(false);
                  setMemberToDelete(null);
                  setInviteToDelete(null);
                }}
                className={clsx(
                  'rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50',
                )}
              >
                취소
              </button>
              <button
                type='button'
                onClick={memberToDelete ? handleRemoveMember : handleRemoveInvitedMember}
                disabled={
                  (memberToDelete && isDeleting === memberToDelete.id) ||
                  (inviteToDelete && isDeletingInvite === inviteToDelete.invitationId)
                }
                className={clsx(
                  'flex items-center rounded-lg border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-70',
                )}
              >
                {(memberToDelete && isDeleting === memberToDelete.id) ||
                  (inviteToDelete && isDeletingInvite === inviteToDelete.invitationId) ? (
                  <>
                    <div
                      className={clsx(
                        'mr-2 h-4 w-4 animate-spin rounded-full border-t-2 border-b-2 border-white',
                      )}
                    ></div>
                    처리 중...
                  </>
                ) : (
                  <>
                    {memberToDelete ? (
                      <>
                        <Trash2 size={16} className={clsx('mr-2')} />
                        팀원 삭제
                      </>
                    ) : (
                      <>
                        <UserMinus size={16} className={clsx('mr-2')} />
                        초대 취소
                      </>
                    )}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 팀 나가기 확인 모달 */}
      {showLeaveConfirmModal && (
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
              <h3 className={clsx('text-xl font-bold text-gray-900')}>프로젝트 나가기</h3>
              <button
                type='button'
                onClick={() => setShowLeaveConfirmModal(false)}
                className={clsx('text-gray-400 transition-colors hover:text-gray-500')}
              >
                <X size={20} />
              </button>
            </div>

            <div className={clsx('mb-6 rounded-md border-l-4 border-red-500 bg-red-50 p-4')}>
              <div className={clsx('flex')}>
                <AlertTriangle size={20} className={clsx('flex-shrink-0 text-red-400')} />
                <div className={clsx('ml-3')}>
                  <p className={clsx('text-sm text-red-800')}>
                    정말로 이 프로젝트에서 나가시겠습니까? 이 작업은 되돌릴 수 없으며, 프로젝트에
                    다시 참여하려면 초대를 받아야 합니다.
                  </p>
                </div>
              </div>
            </div>

            <div className={clsx('flex justify-end space-x-3 border-t border-gray-200 pt-4')}>
              <button
                type='button'
                onClick={() => setShowLeaveConfirmModal(false)}
                className={clsx(
                  'rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50',
                )}
              >
                취소
              </button>
              <button
                type='button'
                onClick={handleLeaveTeam}
                disabled={isLeaving}
                className={clsx(
                  'flex items-center rounded-lg border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-70',
                )}
              >
                {isLeaving ? (
                  <>
                    <div
                      className={clsx(
                        'mr-2 h-4 w-4 animate-spin rounded-full border-t-2 border-b-2 border-white',
                      )}
                    ></div>
                    처리 중...
                  </>
                ) : (
                  <>
                    <LogOut size={16} className={clsx('mr-2')} />
                    프로젝트 나가기
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

export default TeamSettingPage;
