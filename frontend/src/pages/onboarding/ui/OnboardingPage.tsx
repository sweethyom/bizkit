import { ClipboardList, Layers, ListChecks, Rocket, UserPlus, Users } from 'lucide-react';

const featureColors = [
  'from-indigo-400 to-indigo-600',
  'from-blue-400 to-blue-600',
  'from-green-400 to-green-600',
  'from-pink-400 to-pink-600',
  'from-orange-400 to-orange-600',
  'from-gray-400 to-gray-600',
];

export function OnboardingPage() {
  // 실제 구현된 기능만 반영
  const features = [
    {
      icon: <Layers className='h-8 w-8 text-white' />, // 프로젝트/팀
      title: '프로젝트 & 팀 관리',
      description: '프로젝트를 생성하고, 팀원을 초대해 협업할 수 있습니다.',
    },
    {
      icon: <ClipboardList className='h-8 w-8 text-white' />, // 스프린트
      title: '스프린트 관리',
      description: '스프린트를 생성하고, 이슈를 할당하여 체계적으로 협업할 수 있습니다.',
    },
    {
      icon: <ListChecks className='h-8 w-8 text-white' />, // 백로그
      title: '스택(Stack)',
      description: '모든 작업과 요구사항을 스택에서 관리할 수 있습니다.',
    },
    {
      icon: <Rocket className='h-8 w-8 text-white' />, // 이슈/에픽
      title: '킷 & 이슈 관리',
      description:
        '작업 단위를 킷과 이슈로 구분해 관리하며, 드래그 앤 드롭으로 손쉽게 관리할 수 있습니다.',
    },
    {
      icon: <Users className='h-8 w-8 text-white' />, // 팀 협업
      title: '팀 협업',
      description: '팀원 초대, 관리 등 협업에 필수적인 기능을 제공합니다.',
    },
    {
      icon: <UserPlus className='h-8 w-8 text-white' />, // 초대/참여
      title: '간편한 초대와 참여',
      description: '이메일 초대 링크로 누구나 쉽게 팀에 합류할 수 있습니다.',
    },
  ];

  return (
    <div className='min-h-screen cursor-default bg-gradient-to-b from-indigo-50 via-white to-blue-50 font-sans'>
      {/* 히어로 */}
      <section className='border-gray-2 flex h-dvh flex-col items-center gap-20 border-b bg-gradient-to-br from-indigo-100 via-white to-blue-100 py-26 text-center'>
        <div className='flex flex-col items-center gap-10'>
          <div className='mb-4 flex items-center justify-center gap-6'>
            <Layers className='text-primary' size={80} />
            <span className='text-primary text-heading-xxl font-bold'>BIZKIT</span>
          </div>

          <h1 className='mb-6 flex flex-col gap-4 text-5xl font-extrabold text-gray-900 drop-shadow-sm'>
            <div>
              <span className='animate-gradient-x mb-2 bg-gradient-to-r from-indigo-500 to-blue-500 bg-clip-text text-transparent'>
                체계적이지만 간편한 협업
              </span>
              <span>을 위한 </span>
            </div>

            <span className='text-indigo-700'>프로젝트 관리 플랫폼</span>
          </h1>

          <p className='text-gray-5 text-lg'>
            BizKit은 개발팀의 실질적인 업무 흐름에 맞춘
            <br />
            <span className='font-bold text-indigo-600'>
              프로젝트/팀 관리, 스프린트, 스택, 킷/이슈 관리
            </span>
            를 제공합니다.
          </p>
        </div>

        <a
          href='/my-works'
          className='inline-block w-fit rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 px-10 py-4 text-lg font-bold text-white shadow-lg transition-transform duration-200 hover:scale-105 hover:from-indigo-600 hover:to-blue-600'
        >
          지금 시작하기
        </a>
      </section>

      {/* 기능 섹션 */}
      <section className='h-dvh bg-gradient-to-b from-white via-blue-50 to-indigo-50 py-16'>
        <div className='mx-auto max-w-5xl px-4'>
          <h2 className='mb-12 text-center text-3xl font-bold text-gray-900 drop-shadow-sm'>
            BizKit에서 가능한 일
          </h2>
          <div className='mb-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3'>
            {features.map((feature, idx) => (
              <div
                key={idx}
                className='group relative flex flex-col items-center gap-2 overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-xl transition hover:shadow-2xl'
              >
                <div
                  className={`mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br shadow-lg ${featureColors[idx % featureColors.length]} transition-transform duration-200 group-hover:scale-110`}
                >
                  {feature.icon}
                </div>
                <h3 className='text-label-xl mb-2 font-bold text-gray-800 transition-colors group-hover:text-indigo-600'>
                  {feature.title}
                </h3>
                <p className='text-label-md text-center leading-relaxed text-gray-600'>
                  {feature.description}
                </p>
                <div
                  className={`absolute right-0 bottom-0 -z-10 h-32 w-32 rounded-full bg-gradient-to-br opacity-10 blur-2xl ${featureColors[idx % featureColors.length]}`}
                ></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className='bg-gradient-to-r from-indigo-500 to-blue-500 py-20 text-center'>
        <h2 className='mb-4 text-2xl font-bold text-white drop-shadow'>
          지금 바로 팀과 함께 BizKit을 경험해보세요
        </h2>
        <p className='mb-8 text-blue-100'>
          복잡한 설정 없이, 이메일 초대만으로 협업을 시작할 수 있습니다.
        </p>
        <a
          href='/signup'
          className='inline-block rounded-full bg-white px-10 py-4 text-lg font-bold text-indigo-600 shadow-lg transition-colors duration-200 hover:scale-105 hover:bg-blue-50 hover:text-blue-700'
        >
          시작하기
        </a>
      </section>
    </div>
  );
}
