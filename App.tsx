import { useState, useMemo } from "react";
import { ShieldCheck, FileText, Car, AlertTriangle, Sparkles, RotateCcw, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { predictCompliance, type DriverInput, type PredictionResult } from "@/lib/model";
import { cn } from "@/lib/utils";

const initialInput: DriverInput = {
  vehicleAge: 3,
  insuranceStatus: "valid",
  rcStatus: "present",
  pollutionStatus: "valid",
  licenseStatus: "valid",
  vehicleType: "car",
  registrationState: "DL",
  ownerAge: 35,
  pastViolations: 0,
};

export default function App() {
  const [input, setInput] = useState<DriverInput>(initialInput);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [isPredicting, setIsPredicting] = useState(false);

  const handlePredict = () => {
    setIsPredicting(true);
    setResult(null);
    setTimeout(() => {
      setResult(predictCompliance(input));
      setIsPredicting(false);
    }, 650);
  };

  const handleReset = () => {
    setInput(initialInput);
    setResult(null);
  };

  const update = <K extends keyof DriverInput>(key: K, value: DriverInput[K]) => {
    setInput((prev) => ({ ...prev, [key]: value }));
    setResult(null);
  };

  const complianceScore = useMemo(() => {
    let score = 0;
    if (input.insuranceStatus === "valid") score += 25;
    if (input.rcStatus === "present") score += 25;
    if (input.pollutionStatus === "valid") score += 20;
    if (input.licenseStatus === "valid") score += 20;
    if (input.pastViolations === 0) score += 10;
    return score;
  }, [input]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/40 to-slate-100 text-slate-800">
      {/* Header */}
      <header className="border-b border-emerald-100/80 bg-white/70 backdrop-blur-sm sticky top-0 z-10">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-600/20">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h1 className="font-serif text-xl font-bold tracking-tight text-slate-900">VeriDrive</h1>
              <p className="text-xs text-slate-500 -mt-0.5">Document Compliance Predictor</p>
            </div>
          </div>
          <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700 font-medium">
            <Sparkles className="mr-1 h-3 w-3" /> ML Heuristic Model
          </Badge>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
          {/* Input Form */}
          <Card className="border-slate-200/70 shadow-md shadow-slate-200/50 rounded-2xl">
            <CardHeader className="pb-4">
              <CardTitle className="font-serif text-lg text-slate-900">Driver & Vehicle Details</CardTitle>
              <CardDescription>Enter the details below to predict document compliance.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="vehicleAge" className="text-xs font-medium text-slate-600">Vehicle Age (years)</Label>
                  <Input
                    id="vehicleAge"
                    type="number"
                    min={0}
                    max={40}
                    value={input.vehicleAge}
                    onChange={(e) => update("vehicleAge", Math.max(0, Number(e.target.value)))}
                    className="rounded-lg"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="ownerAge" className="text-xs font-medium text-slate-600">Owner Age (years)</Label>
                  <Input
                    id="ownerAge"
                    type="number"
                    min={18}
                    max={100}
                    value={input.ownerAge}
                    onChange={(e) => update("ownerAge", Math.max(18, Number(e.target.value)))}
                    className="rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-slate-600">Vehicle Type</Label>
                  <Select value={input.vehicleType} onValueChange={(v) => update("vehicleType", v as DriverInput["vehicleType"])}>
                    <SelectTrigger className="rounded-lg"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="car">Car</SelectItem>
                      <SelectItem value="bike">Motorcycle</SelectItem>
                      <SelectItem value="truck">Truck</SelectItem>
                      <SelectItem value="auto">Auto Rickshaw</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-slate-600">Registration State</Label>
                  <Select value={input.registrationState} onValueChange={(v) => update("registrationState", v)}>
                    <SelectTrigger className="rounded-lg"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DL">Delhi</SelectItem>
                      <SelectItem value="MH">Maharashtra</SelectItem>
                      <SelectItem value="KA">Karnataka</SelectItem>
                      <SelectItem value="TN">Tamil Nadu</SelectItem>
                      <SelectItem value="UP">Uttar Pradesh</SelectItem>
                      <SelectItem value="RJ">Rajasthan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator className="my-1" />

              <div className="space-y-2">
                <Label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Insurance Status</Label>
                <RadioGroup value={input.insuranceStatus} onValueChange={(v) => update("insuranceStatus", v as DriverInput["insuranceStatus"])} className="grid grid-cols-3 gap-2">
                  {[
                    { val: "valid", label: "Valid" },
                    { val: "expired", label: "Expired" },
                    { val: "none", label: "None" },
                  ].map((opt) => (
                    <div key={opt.val}>
                      <RadioGroupItem value={opt.val} id={`ins-${opt.val}`} className="peer sr-only" />
                      <Label htmlFor={`ins-${opt.val}`} className="flex cursor-pointer items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 transition-all hover:border-emerald-300 hover:bg-emerald-50 peer-data-[state=checked]:border-emerald-500 peer-data-[state=checked]:bg-emerald-50 peer-data-[state=checked]:text-emerald-700">
                        {opt.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">RC (Registration Certificate)</Label>
                <RadioGroup value={input.rcStatus} onValueChange={(v) => update("rcStatus", v as DriverInput["rcStatus"])} className="grid grid-cols-3 gap-2">
                  {[
                    { val: "present", label: "Present" },
                    { val: "missing", label: "Missing" },
                    { val: "fake", label: "Fake" },
                  ].map((opt) => (
                    <div key={opt.val}>
                      <RadioGroupItem value={opt.val} id={`rc-${opt.val}`} className="peer sr-only" />
                      <Label htmlFor={`rc-${opt.val}`} className="flex cursor-pointer items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 transition-all hover:border-emerald-300 hover:bg-emerald-50 peer-data-[state=checked]:border-emerald-500 peer-data-[state=checked]:bg-emerald-50 peer-data-[state=checked]:text-emerald-700">
                        {opt.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Pollution (PUCC)</Label>
                  <Select value={input.pollutionStatus} onValueChange={(v) => update("pollutionStatus", v as DriverInput["pollutionStatus"])}>
                    <SelectTrigger className="rounded-lg"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="valid">Valid</SelectItem>
                      <SelectItem value="expired">Expired</SelectItem>
                      <SelectItem value="none">None</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">License</Label>
                  <Select value={input.licenseStatus} onValueChange={(v) => update("licenseStatus", v as DriverInput["licenseStatus"])}>
                    <SelectTrigger className="rounded-lg"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="valid">Valid</SelectItem>
                      <SelectItem value="expired">Expired</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="violations" className="text-xs font-medium text-slate-600">Past Violations (count)</Label>
                <Input
                  id="violations"
                  type="number"
                  min={0}
                  max={50}
                  value={input.pastViolations}
                  onChange={(e) => update("pastViolations", Math.max(0, Number(e.target.value)))}
                  className="rounded-lg"
                />
              </div>
            </CardContent>
            <CardFooter className="flex gap-3 pt-2">
              <Button onClick={handlePredict} disabled={isPredicting} className="flex-1 rounded-lg bg-emerald-600 text-white font-medium shadow-sm hover:bg-emerald-700">
                {isPredicting ? "Analyzing..." : "Predict Compliance"}
              </Button>
              <Button onClick={handleReset} variant="outline" className="rounded-lg">
                <RotateCcw className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>

          {/* Results Panel */}
          <div className="space-y-6">
            {/* Live Compliance Meter */}
            <Card className="rounded-2xl border-slate-200/70 bg-white/60 shadow-sm">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Live Compliance Score</span>
                  <span className={cn("text-sm font-bold", complianceScore >= 80 ? "text-emerald-600" : complianceScore >= 50 ? "text-amber-600" : "text-rose-600")}>
                    {complianceScore}/100
                  </span>
                </div>
                <Progress value={complianceScore} className="h-2 bg-slate-100 [&>div]:bg-gradient-to-r [&>div]:from-emerald-400 [&>div]:to-emerald-600" />
                <p className="text-xs text-slate-400 mt-2">Updates in real-time as you edit the form.</p>
              </CardContent>
            </Card>

            {/* Prediction Result */}
            {result ? (
              <Card className={cn(
                "rounded-2xl border-2 shadow-lg transition-all",
                result.compliant ? "border-emerald-200 bg-emerald-50/50 shadow-emerald-100/50" : "border-rose-200 bg-rose-50/50 shadow-rose-100/50"
              )}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardDescription className="text-xs uppercase tracking-wide font-semibold">Prediction Result</CardDescription>
                      <CardTitle className={cn("font-serif text-2xl mt-1", result.compliant ? "text-emerald-700" : "text-rose-700")}>
                        {result.compliant ? "Compliant" : "Non-Compliant"}
                      </CardTitle>
                    </div>
                    <div className={cn(
                      "grid h-12 w-12 place-items-center rounded-xl shadow-sm",
                      result.compliant ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-600"
                    )}>
                      {result.compliant ? <CheckCircle2 className="h-6 w-6" /> : <XCircle className="h-6 w-6" />}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between rounded-xl bg-white/70 px-4 py-3 border border-slate-200/60">
                    <span className="text-sm font-medium text-slate-600">Confidence</span>
                    <span className="text-lg font-bold text-slate-900">{(result.probability * 100).toFixed(1)}%</span>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">Document Breakdown</p>
                    <div className="space-y-2">
                      {result.factors.map((factor, i) => (
                        <div key={i} className="flex items-center justify-between rounded-lg bg-white/60 px-3 py-2 border border-slate-200/50">
                          <div className="flex items-center gap-2">
                            {factor.passed ? (
                              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                            ) : (
                              <XCircle className="h-4 w-4 text-rose-500" />
                            )}
                            <span className="text-sm text-slate-700">{factor.label}</span>
                          </div>
                          <span className={cn("text-xs font-semibold", factor.passed ? "text-emerald-600" : "text-rose-600")}>
                            {factor.passed ? "OK" : "Issue"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {result.issues.length > 0 && (
                    <div className="rounded-xl bg-amber-50 border border-amber-200 p-3">
                      <div className="flex items-center gap-2 mb-1.5">
                        <AlertTriangle className="h-4 w-4 text-amber-600" />
                        <span className="text-xs font-semibold text-amber-700 uppercase tracking-wide">Flagged Issues</span>
                      </div>
                      <ul className="space-y-1">
                        {result.issues.map((issue, i) => (
                          <li key={i} className="text-sm text-amber-800 flex items-start gap-1.5">
                            <span className="text-amber-500 mt-0.5">•</span> {issue}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card className="rounded-2xl border-dashed border-slate-300 bg-white/40">
                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="grid h-14 w-14 place-items-center rounded-2xl bg-slate-100 text-slate-400 mb-4">
                    <Car className="h-7 w-7" />
                  </div>
                  <p className="font-serif text-lg text-slate-600">Awaiting Prediction</p>
                  <p className="text-sm text-slate-400 mt-1 max-w-xs">Fill in the driver and vehicle details, then click "Predict Compliance" to run the model.</p>
                </CardContent>
              </Card>
            )}

            {/* Info Strip */}
            <div className="flex items-center gap-3 rounded-xl bg-slate-800 px-4 py-3 text-slate-200">
              <FileText className="h-5 w-5 text-emerald-400 shrink-0" />
              <p className="text-xs leading-relaxed">
                This model uses a weighted heuristic classifier evaluating insurance, RC, pollution certificate, license validity, and driver history to estimate compliance probability.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}