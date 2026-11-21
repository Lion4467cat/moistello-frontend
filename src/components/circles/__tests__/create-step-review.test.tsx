import React from "react"
import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { CreateStepReview } from "../create-step-review"
import type { CircleFormData } from "@/types"

const baseFormData: CircleFormData = {
  name: "Builders Savings Circle",
  description: "Monthly accountability fund for builders",
  circleType: "public",
  payoutType: "fixed_order",
  contributionAmount: 50,
  currency: "USDC",
  frequency: "weekly",
  maxMembers: 10,
  minMoiScore: 420,
  collateralPercent: 25,
  lateFeePercent: 5,
  gracePeriodHours: 24,
  maxStrikes: 3,
  startDate: "2026-12-01",
}

describe("CreateStepReview (#801)", () => {
  it("renders all required and optional review rows with formatted values", () => {
    render(<CreateStepReview formData={baseFormData} isPending={false} />)

    expect(screen.getByText("Review Your Circle")).toBeInTheDocument()
    expect(screen.getByText("Builders Savings Circle")).toBeInTheDocument()
    expect(screen.getByText("Monthly accountability fund for builders")).toBeInTheDocument()
    expect(screen.getByText("public")).toBeInTheDocument()
    expect(screen.getByText("10")).toBeInTheDocument()
    expect(screen.getByText("50 USDC · Weekly")).toBeInTheDocument()
    expect(screen.getByText("fixed_order")).toBeInTheDocument()
    expect(screen.getByText("5%")).toBeInTheDocument()
    expect(screen.getByText("24h")).toBeInTheDocument()
    expect(screen.getByText("3")).toBeInTheDocument()
    expect(screen.getByText("25%")).toBeInTheDocument()
    expect(screen.getByText("420")).toBeInTheDocument()
  })

  it("omits optional rows when description, collateralPercent, or minMoiScore are absent or zero", () => {
    const minimal: CircleFormData = {
      ...baseFormData,
      description: "",
      collateralPercent: undefined,
      minMoiScore: 0,
    }

    render(<CreateStepReview formData={minimal} isPending={true} />)

    expect(screen.queryByText("Description")).not.toBeInTheDocument()
    expect(screen.queryByText("Collateral")).not.toBeInTheDocument()
    expect(screen.queryByText("Min MoiScore")).not.toBeInTheDocument()
  })

  it("displays submission error banner when errors.submit is present", () => {
    const { rerender } = render(<CreateStepReview formData={baseFormData} isPending={false} />)
    expect(screen.queryByText("Failed to create circle")).not.toBeInTheDocument()

    rerender(
      <CreateStepReview
        formData={baseFormData}
        isPending={false}
        errors={{ submit: "Failed to create circle" }}
      />
    )

    expect(screen.getByText("Failed to create circle")).toBeInTheDocument()
  })
})
