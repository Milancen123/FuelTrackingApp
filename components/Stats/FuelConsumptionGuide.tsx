"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { DialogTitle } from "@radix-ui/react-dialog";

const steps = [
  {
    title: "Understanding the Graph",
    content: (
      <>
        <p>
          This graph shows your <strong>average fuel consumption per full-tank cycle</strong>.
          Each point is one cycle from one full tank to the next.
        </p>
        <p className="mt-2">
          You will see three horizontal reference lines that help you interpret what’s normal
          and what might indicate an issue.
        </p>
      </>
    ),
  },
  {
    title: "1. The Average Line (Gray)",
    content: (
      <>
        <p>
          The gray line represents the <strong>mean long-term consumption</strong> of your vehicle.
        </p>
        <ul className="list-disc ml-6 mt-2">
          <li>Your normal driving behavior</li>
          <li>Your typical conditions (weather, traffic, routes)</li>
        </ul>
        <p className="mt-2">
          If points hover around this line, everything is normal.
        </p>
      </>
    ),
  },
  {
    title: "2. The Green & Red Thresholds",
    content: (
      <>
        <p>
          These thresholds are calculated from your data using the <strong>standard deviation</strong>.
        </p>
        <p className="font-semibold mt-3 text-green-600">Green Line — (Avg − SD)</p>
        <p>More efficient than expected. Usually:</p>
        <ul className="list-disc ml-6">
          <li>Highway driving</li>
          <li>Light acceleration</li>
          <li>Good tire pressure</li>
        </ul>

        <p className="font-semibold mt-3 text-red-600">Red Line — (Avg + SD)</p>
        <p>Spikes above this line may indicate:</p>
        <ul className="list-disc ml-6">
          <li>Aggressive driving</li>
          <li>Cold weather / short trips</li>
          <li>Low tire pressure</li>
          <li>Dirty injector or failing O₂ sensor</li>
        </ul>
      </>
    ),
  },
  {
    title: "3. How to Use These Insights",
    content: (
      <>
        <ul className="list-disc ml-6">
          <li>One spike → normal, can be conditions.</li>
          <li>Multiple spikes → check tire pressure or engine health.</li>
          <li>Long-term rise → possible mechanical or seasonal issue.</li>
          <li>Big oscillations → mixed driving or inconsistent fill patterns.</li>
        </ul>
        <p className="mt-3">
          This system helps detect issues early and understand real-world fuel behavior over time.
        </p>
      </>
    ),
  },
];

const FuelConsumptionGuide = () => {
  const [step, setStep] = useState(0);
  const totalSteps = steps.length;

  return (
    <Dialog>
      <DialogTrigger className="flex items-center gap-2 text-sm underline cursor-pointer text-blue-500">
        <Info className="w-4 h-4" color="#0000ff" />
        How to interpret this graph
      </DialogTrigger>

      <DialogContent className="max-w-lg p-6">
        <DialogHeader>
            <DialogTitle className="text-xl font-bold">
                {steps[step].title}
            </DialogTitle>
          
        </DialogHeader>

        {/* DOTS */}
        <div className="flex justify-center gap-2 mb-4">
          {steps.map((_, i) => (
            <span
              key={i}
              className={`h-2 w-2 rounded-full ${
                i === step ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>

        {/* ANIMATED CONTENT */}
        <div className="min-h-[180px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.25 }}
              className="text-sm space-y-3"
            >
              {steps[step].content}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* NAVIGATION */}
        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            disabled={step === 0}
            onClick={() => setStep(step - 1)}
          >
            Back
          </Button>

          {step === totalSteps - 1 ? (
            <Button onClick={() => setStep(0)}>Done</Button>
          ) : (
            <Button onClick={() => setStep(step + 1)}>Next</Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}


export default FuelConsumptionGuide;