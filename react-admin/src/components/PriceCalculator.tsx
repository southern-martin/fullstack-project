import { Calculator, Loader2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Carrier, carrierService } from '../features/carriers/services/carrierService';
import { PriceCalculation, pricingService } from '../features/pricing/services/pricingService';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

const PriceCalculator: React.FC = () => {
    const [carriers, setCarriers] = useState<Carrier[]>([]);
    const [selectedCarrier, setSelectedCarrier] = useState<number | null>(null);
    const [serviceType, setServiceType] = useState<string>('');
    const [weight, setWeight] = useState<string>('');
    const [distance, setDistance] = useState<string>('');
    const [originCountry, setOriginCountry] = useState<string>('US');
    const [destinationCountry, setDestinationCountry] = useState<string>('US');
    const [customerType, setCustomerType] = useState<string>('regular');
    const [calculation, setCalculation] = useState<PriceCalculation | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingCarriers, setIsLoadingCarriers] = useState(true);

    useEffect(() => {
        loadCarriers();
    }, []);

    const loadCarriers = async () => {
        try {
            setIsLoadingCarriers(true);
            const response = await carrierService.getActiveCarriers();
            setCarriers(response);
        } catch (error) {
            console.error('Error loading carriers:', error);
        } finally {
            setIsLoadingCarriers(false);
        }
    };

    const handleCalculate = async () => {
        if (!selectedCarrier || !serviceType || !weight) {
            alert('Please fill in all required fields');
            return;
        }

        try {
            setIsLoading(true);
            const result = await pricingService.calculatePrice({
                carrierId: selectedCarrier,
                serviceType,
                weight: parseFloat(weight),
                distance: distance ? parseFloat(distance) : undefined,
                originCountry,
                destinationCountry,
                customerType: customerType === 'regular' ? undefined : customerType,
            });
            setCalculation(result);
        } catch (error) {
            console.error('Error calculating price:', error);
            alert('Error calculating price. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const serviceTypes = ['Express', 'Ground', 'Priority Mail', 'Next Day Air', '2nd Day Air'];
    const countries = ['US', 'CA', 'MX', 'GB', 'DE', 'FR', 'ES', 'IT', 'JP', 'AU'];
    const customerTypes = [
        { value: 'regular', label: 'Regular' },
        { value: 'premium', label: 'Premium' },
        { value: 'enterprise', label: 'Enterprise' },
    ];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input Form */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <Calculator className="h-5 w-5 mr-2" />
                        Price Calculator
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Carrier Selection */}
                    <div className="space-y-2">
                        <Label htmlFor="carrier">Carrier *</Label>
                        <Select
                            value={selectedCarrier?.toString() || ''}
                            onValueChange={(value) => setSelectedCarrier(parseInt(value))}
                            disabled={isLoadingCarriers}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder={isLoadingCarriers ? "Loading carriers..." : "Select a carrier"} />
                            </SelectTrigger>
                            <SelectContent>
                                {carriers.map((carrier) => (
                                    <SelectItem key={carrier.id} value={carrier.id.toString()}>
                                        {carrier.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Service Type */}
                    <div className="space-y-2">
                        <Label htmlFor="serviceType">Service Type *</Label>
                        <Select value={serviceType} onValueChange={setServiceType}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select service type" />
                            </SelectTrigger>
                            <SelectContent>
                                {serviceTypes.map((type) => (
                                    <SelectItem key={type} value={type}>
                                        {type}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Weight */}
                    <div className="space-y-2">
                        <Label htmlFor="weight">Weight (kg) *</Label>
                        <Input
                            id="weight"
                            type="number"
                            step="0.1"
                            min="0"
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                            placeholder="Enter weight in kg"
                        />
                    </div>

                    {/* Distance */}
                    <div className="space-y-2">
                        <Label htmlFor="distance">Distance (km)</Label>
                        <Input
                            id="distance"
                            type="number"
                            step="0.1"
                            min="0"
                            value={distance}
                            onChange={(e) => setDistance(e.target.value)}
                            placeholder="Enter distance in km (optional)"
                        />
                    </div>

                    {/* Origin Country */}
                    <div className="space-y-2">
                        <Label htmlFor="originCountry">Origin Country</Label>
                        <Select value={originCountry} onValueChange={setOriginCountry}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {countries.map((country) => (
                                    <SelectItem key={country} value={country}>
                                        {country}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Destination Country */}
                    <div className="space-y-2">
                        <Label htmlFor="destinationCountry">Destination Country</Label>
                        <Select value={destinationCountry} onValueChange={setDestinationCountry}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {countries.map((country) => (
                                    <SelectItem key={country} value={country}>
                                        {country}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Customer Type */}
                    <div className="space-y-2">
                        <Label htmlFor="customerType">Customer Type</Label>
                        <Select value={customerType} onValueChange={setCustomerType}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {customerTypes.map((type) => (
                                    <SelectItem key={type.value} value={type.value}>
                                        {type.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <Button
                        onClick={handleCalculate}
                        disabled={isLoading || !selectedCarrier || !serviceType || !weight}
                        className="w-full"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Calculating...
                            </>
                        ) : (
                            <>
                                <Calculator className="h-4 w-4 mr-2" />
                                Calculate Price
                            </>
                        )}
                    </Button>
                </CardContent>
            </Card>

            {/* Results */}
            <Card>
                <CardHeader>
                    <CardTitle>Price Calculation Result</CardTitle>
                </CardHeader>
                <CardContent>
                    {calculation ? (
                        <div className="space-y-4">
                            {/* Total Price */}
                            <div className="text-center p-4 bg-primary/10 rounded-lg">
                                <div className="text-3xl font-bold text-primary">
                                    ${calculation.calculation.total.toFixed(2)}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    {calculation.calculation.currency}
                                </div>
                            </div>

                            {/* Breakdown */}
                            <div className="space-y-2">
                                <h4 className="font-semibold">Price Breakdown:</h4>
                                <div className="space-y-1 text-sm">
                                    <div className="flex justify-between">
                                        <span>Base Rate:</span>
                                        <span>${calculation.calculation.baseRate.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Weight Rate:</span>
                                        <span>${calculation.calculation.weightRate.toFixed(2)}</span>
                                    </div>
                                    {calculation.calculation.distanceRate && (
                                        <div className="flex justify-between">
                                            <span>Distance Rate:</span>
                                            <span>${calculation.calculation.distanceRate.toFixed(2)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between">
                                        <span>Subtotal:</span>
                                        <span>${calculation.calculation.subtotal.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Surcharges */}
                            {calculation.calculation.surcharges.length > 0 && (
                                <div className="space-y-2">
                                    <h4 className="font-semibold">Surcharges:</h4>
                                    {calculation.calculation.surcharges.map((surcharge, index) => (
                                        <div key={index} className="flex justify-between text-sm">
                                            <span>{surcharge.description}:</span>
                                            <span className="text-red-600">+${surcharge.amount.toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Discounts */}
                            {calculation.calculation.discounts.length > 0 && (
                                <div className="space-y-2">
                                    <h4 className="font-semibold">Discounts:</h4>
                                    {calculation.calculation.discounts.map((discount, index) => (
                                        <div key={index} className="flex justify-between text-sm">
                                            <span>{discount.description}:</span>
                                            <span className="text-green-600">-${discount.amount.toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Applied Rules */}
                            {calculation.appliedRules.length > 0 && (
                                <div className="space-y-2">
                                    <h4 className="font-semibold">Applied Rules:</h4>
                                    <div className="flex flex-wrap gap-1">
                                        {calculation.appliedRules.map((rule, index) => (
                                            <Badge key={index} variant="secondary">
                                                {rule.ruleName} (Priority: {rule.priority})
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Request Details */}
                            <div className="space-y-2 pt-4 border-t">
                                <h4 className="font-semibold">Request Details:</h4>
                                <div className="text-xs text-muted-foreground space-y-1">
                                    <div>Request ID: {calculation.requestId}</div>
                                    <div>Calculated: {new Date(calculation.calculatedAt).toLocaleString()}</div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center text-muted-foreground py-8">
                            Enter the details above and click "Calculate Price" to see the result
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default PriceCalculator;

