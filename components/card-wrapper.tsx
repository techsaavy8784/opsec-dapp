import React from "react"

type Props = {
  children: React.ReactNode
}

export const CardWrapper = ({ children }: Props) => {
  return (
    <div className="rounded-[24px] overflow-y-scroll max-md:pb-4">
      <div className="bg-[#00000033] backdrop:blur-[100px] rounded-[24px] w-full">
        {children}
      </div>
    </div>
  )
}
