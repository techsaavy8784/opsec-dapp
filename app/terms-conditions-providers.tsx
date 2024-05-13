"use client"

import TermsAndConditions from "@/components/terms-and-conditons"
import { useState, useEffect } from "react"

const TermsAndConditionsProvider = () => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const [acceptedTerms, setAcceptedTerms] = useState(() =>
    localStorage.getItem("acceptedTerms"),
  )

  const [modalOpenStatus, setModalOpenStatus] = useState(true)

  useEffect(() => {
    if (acceptedTerms === "true") {
      setModalOpenStatus(false)
    }
  }, [acceptedTerms])

  const handleAcceptTerms = () => {
    localStorage.setItem("acceptedTerms", "true")
    setAcceptedTerms("true")
  }

  if (!isMounted) {
    return null
  }

  return (
    <TermsAndConditions
      modalOpenStatus={modalOpenStatus}
      onAccept={handleAcceptTerms}
    />
  )
}

export default TermsAndConditionsProvider
