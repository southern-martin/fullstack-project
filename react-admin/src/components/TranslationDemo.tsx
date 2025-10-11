import { Check, Copy, Globe, Loader2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Language, translationService } from '../features/translations/services/translationService';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

const TranslationDemo: React.FC = () => {
    const [languages, setLanguages] = useState<Language[]>([]);
    const [selectedLanguage, setSelectedLanguage] = useState<string>('');
    const [textToTranslate, setTextToTranslate] = useState<string>('');
    const [translatedText, setTranslatedText] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingLanguages, setIsLoadingLanguages] = useState(true);
    const [fromCache, setFromCache] = useState<boolean>(false);
    const [copied, setCopied] = useState<boolean>(false);

    useEffect(() => {
        loadLanguages();
    }, []);

    const loadLanguages = async () => {
        try {
            setIsLoadingLanguages(true);
            const response = await translationService.getActiveLanguages();
            setLanguages(response);
        } catch (error) {
            console.error('Error loading languages:', error);
        } finally {
            setIsLoadingLanguages(false);
        }
    };

    const handleTranslate = async () => {
        if (!textToTranslate.trim() || !selectedLanguage) {
            alert('Please enter text and select a target language');
            return;
        }

        try {
            setIsLoading(true);
            const result = await translationService.translateText({
                text: textToTranslate,
                targetLanguage: selectedLanguage,
                context: {
                    category: 'ui',
                    module: 'demo',
                    component: 'translation',
                },
            });
            setTranslatedText(result.translatedText);
            setFromCache(result.fromCache);
        } catch (error) {
            console.error('Error translating text:', error);
            alert('Error translating text. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(translatedText);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error('Error copying text:', error);
        }
    };

    const sampleTexts = [
        'Welcome to our platform',
        'Login to your account',
        'Email address',
        'Password',
        'Create new account',
        'Forgot password?',
        'Dashboard',
        'Settings',
        'Logout',
    ];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input Form */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <Globe className="h-5 w-5 mr-2" />
                        Translation Demo
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Text Input */}
                    <div className="space-y-2">
                        <Label htmlFor="textToTranslate">Text to Translate</Label>
                        <Input
                            id="textToTranslate"
                            value={textToTranslate}
                            onChange={(e) => setTextToTranslate(e.target.value)}
                            placeholder="Enter text to translate"
                        />
                    </div>

                    {/* Sample Texts */}
                    <div className="space-y-2">
                        <Label>Sample Texts:</Label>
                        <div className="flex flex-wrap gap-2">
                            {sampleTexts.map((text, index) => (
                                <Button
                                    key={index}
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setTextToTranslate(text)}
                                >
                                    {text}
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* Language Selection */}
                    <div className="space-y-2">
                        <Label htmlFor="targetLanguage">Target Language</Label>
                        <Select
                            value={selectedLanguage}
                            onValueChange={setSelectedLanguage}
                            disabled={isLoadingLanguages}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder={isLoadingLanguages ? "Loading languages..." : "Select target language"} />
                            </SelectTrigger>
                            <SelectContent>
                                {languages.map((language) => (
                                    <SelectItem key={language.id} value={language.code}>
                                        <div className="flex items-center space-x-2">
                                            <span>{language.metadata.flag}</span>
                                            <span>{language.name}</span>
                                            <span className="text-muted-foreground">({language.code})</span>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <Button
                        onClick={handleTranslate}
                        disabled={isLoading || !textToTranslate.trim() || !selectedLanguage}
                        className="w-full"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Translating...
                            </>
                        ) : (
                            <>
                                <Globe className="h-4 w-4 mr-2" />
                                Translate
                            </>
                        )}
                    </Button>
                </CardContent>
            </Card>

            {/* Results */}
            <Card>
                <CardHeader>
                    <CardTitle>Translation Result</CardTitle>
                </CardHeader>
                <CardContent>
                    {translatedText ? (
                        <div className="space-y-4">
                            {/* Translation Result */}
                            <div className="p-4 bg-muted rounded-lg">
                                <div className="text-lg font-medium mb-2">Translated Text:</div>
                                <div className="text-2xl font-bold mb-2">{translatedText}</div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <Badge variant={fromCache ? "default" : "secondary"}>
                                            {fromCache ? "From Cache" : "New Translation"}
                                        </Badge>
                                        {fromCache && (
                                            <Badge variant="outline" className="text-xs">
                                                Cached
                                            </Badge>
                                        )}
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleCopy}
                                    >
                                        {copied ? (
                                            <>
                                                <Check className="h-4 w-4 mr-2" />
                                                Copied!
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="h-4 w-4 mr-2" />
                                                Copy
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>

                            {/* Language Info */}
                            {selectedLanguage && (
                                <div className="space-y-2">
                                    <h4 className="font-semibold">Target Language Info:</h4>
                                    {(() => {
                                        const language = languages.find(l => l.code === selectedLanguage);
                                        return language ? (
                                            <div className="text-sm space-y-1">
                                                <div className="flex items-center space-x-2">
                                                    <span>{language.metadata.flag}</span>
                                                    <span className="font-medium">{language.name}</span>
                                                    <span className="text-muted-foreground">({language.nativeName})</span>
                                                </div>
                                                <div className="text-muted-foreground">
                                                    Direction: {language.metadata.direction?.toUpperCase()}
                                                </div>
                                                {language.metadata.region && (
                                                    <div className="text-muted-foreground">
                                                        Region: {language.metadata.region}
                                                    </div>
                                                )}
                                                {language.metadata.currency && (
                                                    <div className="text-muted-foreground">
                                                        Currency: {language.metadata.currency}
                                                    </div>
                                                )}
                                            </div>
                                        ) : null;
                                    })()}
                                </div>
                            )}

                            {/* Available Languages */}
                            <div className="space-y-2">
                                <h4 className="font-semibold">Available Languages:</h4>
                                <div className="flex flex-wrap gap-2">
                                    {languages.map((language) => (
                                        <Badge
                                            key={language.id}
                                            variant={language.code === selectedLanguage ? "default" : "outline"}
                                            className="cursor-pointer"
                                            onClick={() => setSelectedLanguage(language.code)}
                                        >
                                            {language.metadata.flag} {language.code}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center text-muted-foreground py-8">
                            Enter text and select a language to see the translation
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default TranslationDemo;







