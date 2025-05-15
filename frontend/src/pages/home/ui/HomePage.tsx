import { FC } from 'react';
import { clsx } from 'clsx';
import {
  LayoutDashboard,
  Users,
  Calendar,
  CheckSquare,
  Kanban,
  BarChart4,
  Share2,
  ArrowRight,
  ChevronRight,
  Github,
  Award,
  Shield,
  Clock,
  Zap,
} from 'lucide-react';

export const HomePage: FC = () => {
  // 헤더 메뉴 아이템
  const menuItems = [
    { label: '제품', url: '/product' },
    { label: '기능', url: '/features' },
    { label: '가격', url: '/pricing' },
    { label: '문서', url: '/docs' },
    { label: '기업', url: '/enterprise' },
  ];

  // 주요 기능 아이템
  const features = [
    {
      icon: <LayoutDashboard className='w-10 h-10 p-2 bg-blue-100 text-blue-600 rounded-lg' />,
      title: '직관적인 대시보드',
      description: '한눈에 모든 프로젝트와 작업의 상태를 파악할 수 있는 대시보드를 제공합니다.',
    },
    {
      icon: <Kanban className='w-10 h-10 p-2 bg-purple-100 text-purple-600 rounded-lg' />,
      title: '칸반 보드',
      description: '드래그 앤 드롭으로 쉽게 작업 상태를 관리할 수 있는 칸반 보드를 제공합니다.',
    },
    {
      icon: <Calendar className='w-10 h-10 p-2 bg-green-100 text-green-600 rounded-lg' />,
      title: '스프린트 계획',
      description: '스크럼 방법론에 맞게 스프린트를 계획하고 관리할 수 있습니다.',
    },
    {
      icon: <Users className='w-10 h-10 p-2 bg-orange-100 text-orange-600 rounded-lg' />,
      title: '팀 협업',
      description: '팀원들과 실시간으로 소통하고 협업할 수 있는 도구를 제공합니다.',
    },
    {
      icon: <CheckSquare className='w-10 h-10 p-2 bg-red-100 text-red-600 rounded-lg' />,
      title: '이슈 트래킹',
      description: '모든 작업과 이슈를 체계적으로 관리하고 추적할 수 있습니다.',
    },
    {
      icon: <BarChart4 className='w-10 h-10 p-2 bg-indigo-100 text-indigo-600 rounded-lg' />,
      title: '데이터 분석',
      description: '팀의 생산성과 성과를 측정하고 분석할 수 있는 도구를 제공합니다.',
    },
  ];

  // 신뢰할 수 있는 브랜드
  const trustedBy = ['Samsung', 'LG', 'Hyundai', 'SK', 'POSCO', 'Naver', 'Kakao'];

  // 이점 아이템
  const benefits = [
    {
      icon: <Zap size={24} className='text-yellow-500' />,
      title: '생산성 향상',
      description: '작업 관리 자동화로 30% 이상 생산성이 향상됩니다.',
    },
    {
      icon: <Shield size={24} className='text-blue-500' />,
      title: '안정적인 서비스',
      description: '99.9% 업타임을 보장하는 안정적인 서비스를 제공합니다.',
    },
    {
      icon: <Clock size={24} className='text-green-500' />,
      title: '시간 절약',
      description: '반복 작업 자동화로 귀중한 시간을 절약할 수 있습니다.',
    },
  ];

  return (
    <div className='min-h-screen font-sans'>
      {/* 헤더 */}
      <header className='bg-white shadow-sm'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center py-4'>
            <div className='flex items-center'>
              <div className='text-2xl font-bold text-blue-600'>BizKit</div>
              <nav className='hidden md:ml-10 md:flex space-x-8'>
                {menuItems.map((item, index) => (
                  <a
                    key={index}
                    href={item.url}
                    className='text-gray-600 hover:text-gray-900 font-medium'
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
            </div>
            <div className='flex items-center'>
              <a href='/signin' className='text-gray-600 hover:text-gray-900 font-medium mr-6'>
                로그인
              </a>
              <a
                href='/signup'
                className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700'
              >
                무료로 시작하기
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* 히어로 섹션 */}
      <section className='bg-gradient-to-r from-blue-50 to-indigo-50 py-20'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-12 items-center'>
            <div>
              <h1 className='text-4xl sm:text-5xl font-bold text-gray-900 leading-tight'>
                팀 생산성을 <span className='text-blue-600'>높이는</span>
                <br />
                프로젝트 관리 솔루션
              </h1>
              <p className='mt-4 text-xl text-gray-600 max-w-lg'>
                BizKit은 개발팀을 위한 최고의 프로젝트 관리 도구입니다. 스프린트 계획, 칸반 보드,
                이슈 트래킹 등을 한 곳에서 관리하세요.
              </p>
              <div className='mt-8 flex flex-wrap gap-4'>
                <a
                  href='/signup'
                  className='inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors'
                >
                  무료로 시작하기
                  <ArrowRight className='ml-2 w-5 h-5' />
                </a>
                <a
                  href='/demo'
                  className='inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors'
                >
                  데모 보기
                </a>
              </div>
            </div>
            <div className='flex justify-center'>
              <img
                src='/api/placeholder/600/400'
                alt='BizKit 대시보드'
                className='rounded-lg shadow-xl'
              />
            </div>
          </div>
        </div>
      </section>

      {/* 신뢰 섹션 */}
      <section className='py-12 bg-white'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <p className='text-center text-gray-500 text-sm font-medium uppercase tracking-wide'>
            다음 기업들이 BizKit을 신뢰하고 있습니다
          </p>
          <div className='mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-8'>
            {trustedBy.map((company, index) => (
              <div key={index} className='flex justify-center'>
                <div className='text-gray-400 font-semibold text-lg'>{company}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 기능 섹션 */}
      <section className='py-16 bg-gray-50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center'>
            <h2 className='text-3xl font-bold text-gray-900'>강력한 기능</h2>
            <p className='mt-4 text-xl text-gray-600 max-w-2xl mx-auto'>
              BizKit은 프로젝트 관리에 필요한 모든 기능을 제공합니다.
            </p>
          </div>
          <div className='mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3'>
            {features.map((feature, index) => (
              <div
                key={index}
                className={clsx(
                  'flex flex-col p-6 bg-white rounded-lg shadow-sm border border-gray-200',
                  'hover:shadow-md hover:border-blue-200 transition-all duration-200',
                )}
              >
                <div className='mb-4'>{feature.icon}</div>
                <h3 className='text-xl font-semibold text-gray-900 mb-2'>{feature.title}</h3>
                <p className='text-gray-600 flex-grow'>{feature.description}</p>
                <a href='#' className='mt-4 inline-flex items-center text-blue-600 font-medium'>
                  자세히 보기 <ChevronRight className='ml-1 w-4 h-4' />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 이점 섹션 */}
      <section className='py-16 bg-white'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-12 items-center'>
            <div>
              <h2 className='text-3xl font-bold text-gray-900'>BizKit과 함께하면</h2>
              <p className='mt-4 text-lg text-gray-600'>
                BizKit은 프로젝트 관리를 쉽고 효율적으로 만들어 팀의 생산성을 높이고 업무 흐름을
                개선합니다.
              </p>
              <div className='mt-8 space-y-6'>
                {benefits.map((benefit, index) => (
                  <div key={index} className='flex items-start'>
                    <div className='flex-shrink-0 mt-1'>{benefit.icon}</div>
                    <div className='ml-4'>
                      <h3 className='text-lg font-medium text-gray-900'>{benefit.title}</h3>
                      <p className='mt-1 text-gray-600'>{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className='mt-8'>
                <a
                  href='/case-studies'
                  className='inline-flex items-center px-5 py-2 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors'
                >
                  성공 사례 보기
                  <ChevronRight className='ml-2 w-5 h-5' />
                </a>
              </div>
            </div>
            <div className='flex justify-center'>
              <img
                src='/api/placeholder/520/400'
                alt='BizKit 사용 예시'
                className='rounded-lg shadow-xl'
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className='py-16 bg-blue-600'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
          <h2 className='text-3xl font-bold text-white'>지금 BizKit과 함께 시작하세요</h2>
          <p className='mt-4 text-xl text-blue-100 max-w-2xl mx-auto'>
            14일 무료 체험 기간 동안 BizKit의 모든 기능을 경험해보세요. 신용카드 정보가 필요하지
            않습니다.
          </p>
          <div className='mt-8 flex justify-center'>
            <a
              href='/signup'
              className='inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 transition-colors'
            >
              무료로 시작하기
              <ArrowRight className='ml-2 w-5 h-5' />
            </a>
          </div>
        </div>
      </section>

      {/* 푸터 */}
      <footer className='bg-gray-800 text-white py-12'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-8'>
            <div>
              <h3 className='text-lg font-semibold mb-4'>제품</h3>
              <ul className='space-y-2'>
                <li>
                  <a href='#' className='text-gray-300 hover:text-white'>
                    기능
                  </a>
                </li>
                <li>
                  <a href='#' className='text-gray-300 hover:text-white'>
                    가격
                  </a>
                </li>
                <li>
                  <a href='#' className='text-gray-300 hover:text-white'>
                    보안
                  </a>
                </li>
                <li>
                  <a href='#' className='text-gray-300 hover:text-white'>
                    기업용
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className='text-lg font-semibold mb-4'>리소스</h3>
              <ul className='space-y-2'>
                <li>
                  <a href='#' className='text-gray-300 hover:text-white'>
                    문서
                  </a>
                </li>
                <li>
                  <a href='#' className='text-gray-300 hover:text-white'>
                    가이드
                  </a>
                </li>
                <li>
                  <a href='#' className='text-gray-300 hover:text-white'>
                    API
                  </a>
                </li>
                <li>
                  <a href='#' className='text-gray-300 hover:text-white'>
                    튜토리얼
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className='text-lg font-semibold mb-4'>회사</h3>
              <ul className='space-y-2'>
                <li>
                  <a href='#' className='text-gray-300 hover:text-white'>
                    소개
                  </a>
                </li>
                <li>
                  <a href='#' className='text-gray-300 hover:text-white'>
                    블로그
                  </a>
                </li>
                <li>
                  <a href='#' className='text-gray-300 hover:text-white'>
                    채용
                  </a>
                </li>
                <li>
                  <a href='#' className='text-gray-300 hover:text-white'>
                    연락처
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className='text-lg font-semibold mb-4'>법적 고지</h3>
              <ul className='space-y-2'>
                <li>
                  <a href='#' className='text-gray-300 hover:text-white'>
                    개인정보 처리방침
                  </a>
                </li>
                <li>
                  <a href='#' className='text-gray-300 hover:text-white'>
                    이용약관
                  </a>
                </li>
                <li>
                  <a href='#' className='text-gray-300 hover:text-white'>
                    쿠키 정책
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className='mt-12 pt-8 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center'>
            <div className='text-gray-400'>
              &copy; {new Date().getFullYear()} BizKit. All rights reserved.
            </div>
            <div className='flex space-x-6 mt-4 md:mt-0'>
              <a href='#' className='text-gray-400 hover:text-white'>
                <Github className='w-6 h-6' />
              </a>
              <a href='#' className='text-gray-400 hover:text-white'>
                <Share2 className='w-6 h-6' />
              </a>
              <a href='#' className='text-gray-400 hover:text-white'>
                <Award className='w-6 h-6' />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
