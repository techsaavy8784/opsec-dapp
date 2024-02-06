import React from "react"

type Props = {
  children: React.ReactNode
}

export const CardWrapper = ({ children }: Props) => {
  return (
    <div className="rounded-[24px] h-[calc(100dvh-268px)] overflow-y-scroll max-md:pb-4">
      <div className="p-4 md:p-8 bg-[#00000033] backdrop:blur-[100px] rounded-[24px] w-full">
        {children}
      </div>
    </div>
  )
}
