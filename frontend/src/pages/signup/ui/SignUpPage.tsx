import { SignUpForm } from './SignUpForm';

export const SignUpPage = () => {
  return (
    <div className='flex min-h-screen w-full items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8'>
      <div className='w-full max-w-lg space-y-8 rounded-xl bg-white p-8 shadow-lg'>
        <div className='text-center'>
          <h1 className='mb-2 text-3xl font-extrabold text-gray-900'>회원가입</h1>
          <p className='text-sm text-gray-600'>BizKit의 새로운 회원이 되어주세요</p>
        </div>
        <SignUpForm />
      </div>
    </div>
  );
};
