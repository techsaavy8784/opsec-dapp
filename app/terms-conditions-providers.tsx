"use client"

import TermsAndConditions from "@/components/terms-and-conditons"
import { useState, useEffect } from "react"

const TermsAndConditionsProvider: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false)
  const [acceptedTerms, setAcceptedTerms] = useState<string | null>(null)
  const [modalOpenStatus, setModalOpenStatus] = useState(true)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (isMounted) {
      const termsAccepted = localStorage.getItem("acceptedTerms")
      setAcceptedTerms(termsAccepted)
      if (termsAccepted === "true") {
        setModalOpenStatus(false)
      }
    }
  }, [isMounted])

  const handleAcceptTerms = () => {
    localStorage.setItem("acceptedTerms", "true")
    setAcceptedTerms("true")
    setModalOpenStatus(false)
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
