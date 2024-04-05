import { useEffect, useRef } from "react"

type PollStatusArgs = {
  cb: (...arg: any[]) => Promise<any>
  stopWhen: (result: any) => boolean
  onStop?: (result: any) => void
  interval?: number
}
const usePollStatus = ({
  cb,
  stopWhen,
  onStop,
  interval = 3000,
}: PollStatusArgs) => {
  const timerRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    return () => clearInterval(timerRef.current)
  }, [])

  const startPoll = (...arg: any[]) => {
    timerRef.current = setInterval(() => {
      cb(...arg).then((res) => {
        if (stopWhen(res)) {
          stopPoll()
          onStop?.(res)
        }
      })
    }, interval)
  }

  const stopPoll = () => {
    clearInterval(timerRef.current)
  }

  return {
    startPoll,
    stopPoll,
  }
}

export default usePollStatus