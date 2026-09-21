export interface DaumPostcodeResult {
  address: string
  roadAddress: string
  jibunAddress: string
  zonecode: string
}

declare global {
  interface Window {
    daum?: {
      Postcode: new (options: {
        oncomplete: (data: DaumPostcodeResult) => void
      }) => { open: () => void }
    }
  }
}

let loadingPromise: Promise<void> | null = null

function loadScript(): Promise<void> {
  if (window.daum?.Postcode) return Promise.resolve()
  if (loadingPromise) return loadingPromise

  loadingPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js'
    script.onload = () => resolve()
    script.onerror = () => {
      loadingPromise = null
      reject(new Error('주소 검색 서비스를 불러오지 못했습니다.'))
    }
    document.head.appendChild(script)
  })
  return loadingPromise
}

export async function openDaumPostcode(): Promise<DaumPostcodeResult> {
  await loadScript()
  return new Promise((resolve) => {
    new window.daum!.Postcode({
      oncomplete: (data) => resolve(data),
    }).open()
  })
}
