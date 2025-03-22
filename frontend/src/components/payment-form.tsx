"use client"

import * as React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Icons } from "@/components/ui/icons"

interface PaymentFormProps {
  amount: number
  onPaymentComplete: (paymentMethod: string, paymentDetails: any) => void
  disabled?: boolean
}

type PaymentMethod = 'card' | 'upi' | 'phonepe' | 'razorpay'

export function PaymentForm({ amount, onPaymentComplete }: PaymentFormProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('card')
  const [cardNumber, setCardNumber] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCvv, setCardCvv] = useState('')
  const [upiId, setUpiId] = useState('')
  const [loading, setLoading] = useState(false)

  const handlePayment = async () => {
    setLoading(true)
    try {
      // Here we'll integrate with actual payment gateway
      // For now, simulate a payment process
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const paymentDetails = {
        method: selectedMethod,
        timestamp: new Date().toISOString(),
        amount: amount,
        details: selectedMethod === 'card' ? {
          cardNumber: cardNumber.replace(/\s/g, '').slice(-4),
          expiry: cardExpiry
        } : {
          upiId
        }
      }
      
      onPaymentComplete(selectedMethod, paymentDetails)
    } catch (error) {
      console.error('Payment failed:', error)
      // Handle payment failure
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Method</CardTitle>
        <CardDescription>Choose your preferred payment method</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <RadioGroup
          value={selectedMethod}
          onValueChange={(value) => setSelectedMethod(value as PaymentMethod)}
          className="grid grid-cols-2 gap-4"
        >
          <Label
            htmlFor="card"
            className="flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
          >
            <RadioGroupItem value="card" id="card" className="sr-only" />
            <Icons.creditCard className="mb-3 h-6 w-6" />
            <span className="text-sm font-medium">Credit/Debit Card</span>
          </Label>
          
          <Label
            htmlFor="upi"
            className="flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
          >
            <RadioGroupItem value="upi" id="upi" className="sr-only" />
            <Icons.qrCode className="mb-3 h-6 w-6" />
            <span className="text-sm font-medium">UPI</span>
          </Label>
          
          <Label
            htmlFor="phonepe"
            className="flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
          >
            <RadioGroupItem value="phonepe" id="phonepe" className="sr-only" />
            <Icons.smartphone className="mb-3 h-6 w-6" />
            <span className="text-sm font-medium">PhonePe</span>
          </Label>
          
          <Label
            htmlFor="razorpay"
            className="flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
          >
            <RadioGroupItem value="razorpay" id="razorpay" className="sr-only" />
            <Icons.wallet className="mb-3 h-6 w-6" />
            <span className="text-sm font-medium">Razorpay</span>
          </Label>
        </RadioGroup>

        {selectedMethod === 'card' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input
                id="cardNumber"
                placeholder="4111 1111 1111 1111"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiry">Expiry Date</Label>
                <Input
                  id="expiry"
                  placeholder="MM/YY"
                  value={cardExpiry}
                  onChange={(e) => setCardExpiry(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  type="password"
                  maxLength={3}
                  placeholder="123"
                  value={cardCvv}
                  onChange={(e) => setCardCvv(e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {(selectedMethod === 'upi' || selectedMethod === 'phonepe') && (
          <div className="space-y-2">
            <Label htmlFor="upiId">UPI ID</Label>
            <Input
              id="upiId"
              placeholder="username@upi"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
            />
          </div>
        )}

        {selectedMethod === 'razorpay' && (
          <div className="text-center text-sm text-muted-foreground">
            You will be redirected to Razorpay to complete the payment
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          onClick={handlePayment}
          disabled={loading || (
            selectedMethod === 'card' && (!cardNumber || !cardExpiry || !cardCvv) ||
            (selectedMethod === 'upi' || selectedMethod === 'phonepe') && !upiId
          )}
        >
          {loading ? (
            <>
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              Processing
            </>
          ) : (
            `Pay ${amount.toFixed(2)} USD`
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}