"use client"

import { useEffect, useRef, useState } from "react"
import { useQuery } from "@tanstack/react-query"

import "./styles.css"
import { Skeleton } from "@/components/ui/skeleton"

export const ProgressBar = () => {
  const progressRef = useRef<HTMLDivElement>(null)
  const progressLabelRef = useRef<HTMLElement>(null)

  const { isPending, data } = useQuery({
    queryKey: ["server/list"],
    queryFn: () => fetch("/api/server/list").then((res) => res.json()),
  })

  const [value, setValue] = useState(0)

  useEffect(() => {
    if (data)
      setValue(Math.floor(((data.total - data.capacity) / data.total) * 100))
  }, [data])

  useEffect(() => {
    if (progressLabelRef.current && progressRef.current) {
      progressLabelRef.current.textContent = value.toString()
      progressRef.current.style.setProperty(
        `--progress-value`,
        value.toString(),
      )
      progressRef.current.dataset.value = value.toString()

      if (value > 50)
        progressRef.current.classList.add(`progress--upper-half-value`)
      else
        progressRef.current.classList.contains("progress--upper-half-value") &&
          progressRef.current.classList.remove(`progress--upper-half-value`)
    }
  }, [value])

  return (
    <div className="progress" role="progressbar" ref={progressRef}>
      <div className="absolute z-10 top-4 left-4 font-semibold leading-none tracking-tight text-left w-full">
        Capacity
      </div>
      <div className="progress-inner">
        <div className="progress-indicator"></div>
        <div className="progress-indicator"></div>
      </div>
      <span className="progress-label text-xs md:text-base">
        {isPending ? (
          <Skeleton className="rounded-lg w-[32px] h-[32px] m-auto"></Skeleton>
        ) : (
          <>
            <strong ref={progressLabelRef}>{value}</strong>
            <span>%</span>
          </>
        )}
      </span>
    </div>
  )
}
