import React from "react"

type Props = {
  children: React.ReactNode
}

export const CardWrapper = ({ children }: Props) => {
  return (
    <div className="p-8 bg-[##00000033] backdrop:blur-[100px] rounded-[24px] w-full">
      {children}
    </div>
  )
}
