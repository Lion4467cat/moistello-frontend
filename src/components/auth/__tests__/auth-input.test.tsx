import React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import { AuthInput } from "../auth-input"

describe("AuthInput (#802)", () => {
  it("links label to derived input id, forwards ref, and propagates input changes", () => {
    const inputRef = React.createRef<HTMLInputElement>()
    const handleChange = vi.fn()

    render(
      <AuthInput
        ref={inputRef}
        label="Wallet Alias"
        placeholder="e.g. Treasury"
        onChange={handleChange}
      />
    )

    const input = screen.getByLabelText("Wallet Alias") as HTMLInputElement
    expect(input).toHaveAttribute("id", "auth-input-wallet-alias")
    expect(input).toHaveAttribute("placeholder", "e.g. Treasury")
    expect(input).toHaveAttribute("aria-invalid", "false")
    expect(input).not.toHaveAttribute("aria-describedby")
    expect(inputRef.current).toBe(input)
    expect(AuthInput.displayName).toBe("AuthInput")

    fireEvent.change(input, { target: { value: "Primary Vault" } })
    expect(handleChange).toHaveBeenCalledTimes(1)
  })

  it("supports custom id override and autoCompleteType attribute mappings", () => {
    const { rerender } = render(
      <AuthInput id="custom-name-id" label="Display Name" autoCompleteType="name" />
    )

    const nameInput = screen.getByLabelText("Display Name")
    expect(nameInput).toHaveAttribute("id", "custom-name-id")
    expect(nameInput).toHaveAttribute("autocomplete", "name")
    expect(nameInput).toHaveAttribute("spellcheck", "false")

    rerender(<AuthInput label="Country" autoCompleteType="country" />)
    expect(screen.getByLabelText("Country")).toHaveAttribute("autocomplete", "country-name")

    rerender(<AuthInput label="Verification Code" autoCompleteType="one-time-code" />)
    expect(screen.getByLabelText("Verification Code")).toHaveAttribute(
      "autocomplete",
      "one-time-code"
    )
  })

  it("renders alert error message and aria-invalid / aria-describedby when error is provided", () => {
    const { rerender } = render(
      <AuthInput label="Email Address" error="Invalid email format" />
    )

    const input = screen.getByLabelText("Email Address")
    const alert = screen.getByRole("alert")

    expect(alert).toHaveTextContent("Invalid email format")
    expect(alert).toHaveAttribute("id", "auth-input-email-address-error")
    expect(input).toHaveAttribute("aria-invalid", "true")
    expect(input).toHaveAttribute("aria-describedby", "auth-input-email-address-error")
    expect(input.className).toContain("border-red-500/50")

    rerender(<AuthInput label="Email Address" error={null} />)
    expect(screen.queryByRole("alert")).not.toBeInTheDocument()
    expect(input).toHaveAttribute("aria-invalid", "false")
    expect(input).not.toHaveAttribute("aria-describedby")
  })
})
