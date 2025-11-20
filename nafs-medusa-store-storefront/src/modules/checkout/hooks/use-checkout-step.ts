"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"

const DEFAULT_STEP = "address"

export const useCheckoutStep = (initialStep?: string) => {
  const searchParams = useSearchParams()
  const [step, setStep] = useState(initialStep || DEFAULT_STEP)

  useEffect(() => {
    const urlStep = searchParams.get("step")
    setStep(urlStep || initialStep || DEFAULT_STEP)
  }, [searchParams, initialStep])

  return step
}

export const isStep = (currentStep: string, step: string) => {
  return (currentStep || DEFAULT_STEP) === step
}
