"use client"

import { useEffect, useRef } from "react"

import "./styles.css"

type Props = {
  value: number
}

export const ProgressBar = ({ value }: Props) => {
  const progressRef = useRef<HTMLDivElement>(null)
  const progressLabelRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (progressLabelRef.current && progressRef.current) {
      const target = value <= 100 && value >= 0 ? value : 50
      progressLabelRef.current.textContent = target.toString()
      progressRef.current.style.setProperty(
        `--progress-value`,
        target.toString(),
      )
      progressRef.current.dataset.value = target.toString()

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
        <strong ref={progressLabelRef}>{value}</strong>
        <span>%</span>
      </span>
    </div>
  )
}
