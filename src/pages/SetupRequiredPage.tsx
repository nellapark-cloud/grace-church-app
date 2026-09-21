export function SetupRequiredPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md rounded-lg border border-amber-200 bg-amber-50 p-6 text-center">
        <h1 className="text-base font-semibold text-amber-900">
          Firebase 설정이 필요합니다
        </h1>
        <p className="mt-2 text-sm text-amber-800">
          프로젝트 루트에 <code className="rounded bg-amber-100 px-1">.env</code>{' '}
          파일을 만들고 Firebase 프로젝트 설정값을 입력한 뒤 다시 실행해주세요.
          자세한 방법은 README를 참고하세요.
        </p>
      </div>
    </div>
  )
}
