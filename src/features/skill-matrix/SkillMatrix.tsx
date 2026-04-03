import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowLeft, 
  Save, 
  Trash2, 
  Network, 
  Users,
  ChevronDown,
  ChevronRight,
  Plus,
  Search,
  Download,
  ExpandIcon,
  ShrinkIcon,
  CheckSquare,
  Square,
  Loader2,
  Pencil,
  X,
  Check,
  Wand2,
} from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Badge } from '@/shared/components/ui/badge';
import { Checkbox } from '@/shared/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/components/ui/alert-dialog';
import { Textarea } from '@/shared/components/ui/textarea';
import { Label } from '@/shared/components/ui/label';
import { useToast } from '@/shared/hooks/use-toast';
import type { Domain, SubDomain, Competency, CompetencyItem, CompanyInfo, Role, ProficiencyLevel, SkillsBySubDomain } from '@/shared/types/skill-matrix.types';
import { generateDomains, generateSubDomains, generateCompetencies, getCategoryColorClass, getCategoryColors, getProficiencyColors } from './skill-matrix-data';
import * as XLSX from 'xlsx';

// Landing Form Component
const LandingForm = ({ onGenerate, isLoading }: { onGenerate: (info: CompanyInfo) => void; isLoading: boolean }) => {
  const [industry, setIndustry] = useState('');
  const [region, setRegion] = useState<'US' | 'Europe' | 'Asia' | 'Global'>('US');
  const [error, setError] = useState('');
  const [existingData, setExistingData] = useState<{ industry: string; domainsCount: number; subdomainsCount: number; competenciesCount: number; rolesCount: number } | null>(null);
  const [showExistingDataDialog, setShowExistingDataDialog] = useState(false);
  const [selectedIndustryForCheck, setSelectedIndustryForCheck] = useState('');

  // Check for existing data when industry is selected
  const checkExistingData = (selectedIndustry: string) => {
    const savedKey = `skills-matrix-${selectedIndustry.replace(/\s+/g, '-')}`;
    const rolesKey = `role-definitions-${selectedIndustry.replace(/\s+/g, '-')}`;
    const saved = localStorage.getItem(savedKey);
    const savedRoles = localStorage.getItem(rolesKey);
    
    if (saved) {
      try {
        const parsedDomains = JSON.parse(saved) as Domain[];
        const subdomainsCount = parsedDomains.reduce((sum, d) => sum + d.subDomains.length, 0);
        const competenciesCount = parsedDomains.reduce((sum, d) => 
          sum + d.subDomains.reduce((subSum, sd) => subSum + sd.competencies.length, 0), 0
        );
        
        let rolesCount = 0;
        if (savedRoles) {
          try {
            const parsedRoles = JSON.parse(savedRoles) as Role[];
            rolesCount = parsedRoles.length;
          } catch (e) {
            console.error('Error parsing saved roles:', e);
          }
        }
        
        setExistingData({
          industry: selectedIndustry,
          domainsCount: parsedDomains.length,
          subdomainsCount,
          competenciesCount,
          rolesCount
        });
      } catch (e) {
        console.error('Error parsing saved data:', e);
      }
    } else {
      setExistingData(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!industry.trim()) {
      setError('Industry is required');
      return;
    }
    setError('');
    setSelectedIndustryForCheck(industry);
    checkExistingData(industry);
    
    // If existing data found, show dialog; otherwise generate directly
    const savedKey = `skills-matrix-${industry.replace(/\s+/g, '-')}`;
    const saved = localStorage.getItem(savedKey);
    
    if (saved) {
      setShowExistingDataDialog(true);
    } else {
      onGenerate({ industry, companySize: 'Medium', region });
    }
  };

  const handleUseExisting = () => {
    setShowExistingDataDialog(false);
    onGenerate({ industry: selectedIndustryForCheck, companySize: 'Medium', region });
  };

  const handleRegenerate = () => {
    // Clear existing data before regenerating
    const savedKey = `skills-matrix-${selectedIndustryForCheck.replace(/\s+/g, '-')}`;
    const rolesKey = `role-definitions-${selectedIndustryForCheck.replace(/\s+/g, '-')}`;
    localStorage.removeItem(savedKey);
    localStorage.removeItem(rolesKey);
    setShowExistingDataDialog(false);
    onGenerate({ industry: selectedIndustryForCheck, companySize: 'Medium', region });
  };

  const industryOptions = [
    { name: 'Financial Services', icon: '🏦' },
    { name: 'Healthcare IT', icon: '🏥' },
    { name: 'E-commerce', icon: '🛒' },
    { name: 'Technology & Software', icon: '💻' },
  ];

  const features = [
    { icon: Network, title: 'Smart Domains', description: 'AI-generated skill domains tailored to your industry' },
    { icon: Sparkles, title: 'Competency Taxonomy', description: 'Comprehensive competency hierarchies with categories' },
    { icon: Users, title: 'Role Builder', description: 'Create roles from your generated competencies' },
  ];

  return (
    <div className="min-h-[calc(100vh-120px)] p-6">
      <div className="w-full max-w-6xl mx-auto">
        {/* Hero Section - Top */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="user-management-header-icon">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h1 className="user-management-title">
                AI Competency Matrix Generator
              </h1>
              <p className="user-management-subtitle">
                Generate comprehensive competency taxonomies for your organization
              </p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-[400px_1fr] gap-8 items-start">
          {/* Left Side - Features */}
          <div className="space-y-4">
            {features.map((feature, index) => (
              <Card key={index} className="border-border/50">
                <CardContent className="p-5 flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-purple-500/20 dark:from-primary/30 dark:to-purple-500/30 flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Stats/Info Box */}
            <Card className="border-border/50 bg-gradient-to-br from-primary/5 via-purple-500/5 to-pink-500/5 dark:from-primary/10 dark:via-purple-500/10 dark:to-pink-500/10">
              <CardContent className="p-5">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-primary" />
                  What You'll Get
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    Industry-specific competency domains
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                    Hierarchical sub-domains with competencies
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-pink-500" />
                    Categorized competencies (Skill, Knowledge & Attitude)
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    Role generator with proficiency levels
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    Export to Excel functionality
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Right Side - Form */}
          <Card className="shadow-xl border-border/50">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl flex items-center gap-2">
                <Wand2 className="w-5 h-5 text-primary" />
                Configure Your Matrix
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-sm text-destructive flex items-center gap-2">
                    <X className="w-4 h-4" />
                    {error}
                  </div>
                )}

                <div className="space-y-3">
                  <Label className="text-sm font-medium">
                    Select Your Industry <span className="text-destructive">*</span>
                  </Label>
                  <div className="grid grid-cols-2 gap-3">
                    {industryOptions.map((opt) => (
                      <button
                        key={opt.name}
                        type="button"
                        onClick={() => { setIndustry(opt.name); setError(''); }}
                        className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                          industry === opt.name 
                            ? 'border-primary bg-primary/10 dark:bg-primary/20 shadow-md' 
                            : 'border-border hover:border-primary/50 hover:bg-muted/50'
                        }`}
                      >
                        <span className="text-2xl mb-2 block">{opt.icon}</span>
                        <span className={`text-sm font-medium ${industry === opt.name ? 'text-primary' : ''}`}>
                          {opt.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">or enter custom</span>
                  </div>
                </div>

                <Input
                  placeholder="Type your industry (e.g., Retail, Manufacturing...)"
                  value={industry}
                  onChange={(e) => { setIndustry(e.target.value); setError(''); }}
                  className="h-11"
                />

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Region</Label>
                  <Select value={region} onValueChange={(v) => setRegion(v as typeof region)}>
                    <SelectTrigger className="h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="US">🇺🇸 United States</SelectItem>
                      <SelectItem value="Europe">🇪🇺 Europe</SelectItem>
                      <SelectItem value="Asia">🌏 Asia</SelectItem>
                      <SelectItem value="Global">🌍 Global</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    className="h-10 text-sm font-semibold px-6"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating Competency Matrix...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Generate Competency Matrix
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Existing Data Dialog */}
      <Dialog open={showExistingDataDialog} onOpenChange={setShowExistingDataDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-green-500" />
              Data Already Available
            </DialogTitle>
            <DialogDescription>
              We found existing data for <strong>{selectedIndustryForCheck}</strong> in your browser.
            </DialogDescription>
          </DialogHeader>
          
          {existingData && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Card className="border-border/50">
                  <CardContent className="p-3 text-center">
                    <div className="text-2xl font-bold text-primary">{existingData.domainsCount}</div>
                    <div className="text-xs text-muted-foreground mt-1">Domains</div>
                  </CardContent>
                </Card>
                <Card className="border-border/50">
                  <CardContent className="p-3 text-center">
                    <div className="text-2xl font-bold text-purple-500">{existingData.subdomainsCount}</div>
                    <div className="text-xs text-muted-foreground mt-1">SubDomains</div>
                  </CardContent>
                </Card>
                <Card className="border-border/50">
                  <CardContent className="p-3 text-center">
                    <div className="text-2xl font-bold text-pink-500">{existingData.competenciesCount}</div>
                    <div className="text-xs text-muted-foreground mt-1">Competencies</div>
                  </CardContent>
                </Card>
                <Card className="border-border/50">
                  <CardContent className="p-3 text-center">
                    <div className="text-2xl font-bold text-orange-500">{existingData.rolesCount}</div>
                    <div className="text-xs text-muted-foreground mt-1">Roles</div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="bg-muted/50 rounded-lg p-3 text-sm text-muted-foreground">
                💡 You can use the existing data (instant) or regenerate fresh data.
              </div>
            </div>
          )}
          
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={handleRegenerate}
              className="w-full sm:w-auto order-2 sm:order-1"
            >
              <Wand2 className="w-4 h-4 mr-2" />
              Regenerate
            </Button>
            <Button
              onClick={handleUseExisting}
              className="w-full sm:w-auto order-1 sm:order-2"
            >
              <CheckSquare className="w-4 h-4 mr-2" />
              Use Existing Data
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Competency Card Component
const CompetencyCard = ({
  competency,
  onDelete,
}: {
  competency: Competency;
  onDelete?: () => void;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const sections: { label: 'Skill' | 'Knowledge' | 'Attitude'; items: CompetencyItem[] }[] = [
    { label: 'Skill', items: competency.skills },
    { label: 'Knowledge', items: competency.knowledge },
    { label: 'Attitude', items: competency.attitudes },
  ];

  return (
    <div className="border rounded-lg bg-background overflow-hidden w-full">
      <div className="flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-muted/30 transition-colors" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex items-center gap-2 min-w-0">
          {isExpanded ? <ChevronDown className="w-3 h-3 text-muted-foreground flex-shrink-0" /> : <ChevronRight className="w-3 h-3 text-muted-foreground flex-shrink-0" />}
          <span className="text-sm font-medium truncate">{competency.name}</span>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 ml-2">
          {!isExpanded && (
            <div className="flex items-center gap-1.5">
              {sections.map(({ label, items }) => {
                const colors = getCategoryColors(label);
                return items.map((item) => (
                  <Badge key={item.id} variant="outline" className={`${colors.bg} ${colors.text} ${colors.border} text-[10px] px-2 py-0 h-5`} title={`${label}: ${item.description}`}>
                    <span className="opacity-60 mr-1">{label[0]}</span>{item.name}
                  </Badge>
                ));
              })}
            </div>
          )}
          <div className="flex gap-1">
            <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">{competency.skills.length}S</span>
            <span className="text-[10px] bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded">{competency.knowledge.length}K</span>
            <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded">{competency.attitudes.length}A</span>
          </div>
          {onDelete && (
            <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="text-muted-foreground hover:text-destructive transition-colors">
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
      {isExpanded && (
        <div className="px-3 py-2 border-t border-border/50 bg-muted/20">
          <div className="flex flex-wrap items-center gap-2">
            {sections.map(({ label, items }) => {
              const colors = getCategoryColors(label);
              return items.map((item) => (
                <div key={item.id} className="flex items-center gap-1">
                  <span className={`text-[9px] font-bold uppercase tracking-wider ${colors.text} opacity-70 w-6`}>{label.slice(0, 3)}</span>
                  <Badge variant="outline" className={`${colors.bg} ${colors.text} ${colors.border} text-[11px] px-2 py-0.5`} title={item.description}>
                    {item.name}
                  </Badge>
                </div>
              ));
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// Summary Card Component
const SummaryCard = ({ 
  title, 
  count, 
  icon: Icon, 
  color 
}: { 
  title: string; 
  count: number; 
  icon: React.ElementType; 
  color: string;
}) => (
  <Card className={`border-l-4 ${color}`}>
    <CardContent className="p-4 flex items-center gap-4">
      <div className={`p-3 rounded-lg bg-muted`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-2xl font-bold">{count}</p>
        <p className="text-sm text-muted-foreground">{title}</p>
      </div>
    </CardContent>
  </Card>
);

// SubDomain Row Component
const SubDomainRow = ({
  subDomain,
  onUpdate,
  onDelete,
}: {
  subDomain: SubDomain;
  onUpdate: (sd: SubDomain) => void;
  onDelete: () => void;
}) => {
  const [isLoadingCompetencies, setIsLoadingCompetencies] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(subDomain.name);
  const [editDescription, setEditDescription] = useState(subDomain.description);
  const [showAddCompetency, setShowAddCompetency] = useState(false);
  const [newCompetencyName, setNewCompetencyName] = useState('');
  const { toast } = useToast();

  const handleGenerateCompetencies = () => {
    setIsLoadingCompetencies(true);
    setTimeout(() => {
      const newCompetencies = generateCompetencies(subDomain.name);
      onUpdate({
        ...subDomain,
        competencies: [...subDomain.competencies, ...newCompetencies],
        competenciesGenerated: true,
        isExpanded: true,
      });
      setIsLoadingCompetencies(false);
      toast({ title: 'Success', description: `Generated ${newCompetencies.length} competencies` });
    }, 1000);
  };

  const handleDeleteCompetency = (competencyId: string) => {
    onUpdate({
      ...subDomain,
      competencies: subDomain.competencies.filter((c) => c.id !== competencyId),
    });
  };

  const handleSaveEdit = () => {
    if (!editName.trim()) {
      toast({ title: 'Error', description: 'Name is required', variant: 'destructive' });
      return;
    }
    onUpdate({
      ...subDomain,
      name: editName.trim(),
      description: editDescription.trim(),
    });
    setIsEditing(false);
    toast({ title: 'Success', description: 'Sub-domain updated' });
  };

  const handleCancelEdit = () => {
    setEditName(subDomain.name);
    setEditDescription(subDomain.description);
    setIsEditing(false);
  };

  const handleAddCompetency = () => {
    if (!newCompetencyName.trim()) {
      toast({ title: 'Error', description: 'Competency name is required', variant: 'destructive' });
      return;
    }
    const newCompetency: Competency = {
      id: `competency-${Date.now()}`,
      name: newCompetencyName.trim(),
      description: `${newCompetencyName} competency`,
      skills: [],
      knowledge: [],
      attitudes: [],
      isExpanded: false,
    };
    onUpdate({
      ...subDomain,
      competencies: [...subDomain.competencies, newCompetency],
    });
    setNewCompetencyName('');
    setShowAddCompetency(false);
    toast({ title: 'Success', description: 'Competency added' });
  };

  return (
    <div className="ml-4 sm:ml-8 border-l-2 border-border pl-2 sm:pl-4 py-3">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
        <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
          <Checkbox
            checked={subDomain.isSelected}
            onCheckedChange={(checked) => onUpdate({ ...subDomain, isSelected: checked as boolean })}
            className="mt-1 flex-shrink-0"
          />
          <button
            onClick={() => onUpdate({ ...subDomain, isExpanded: !subDomain.isExpanded })}
            className="mt-0.5 flex-shrink-0"
          >
            {subDomain.isExpanded ? (
              <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground" />
            )}
          </button>
          {isEditing ? (
            <div className="flex-1 space-y-2">
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Sub-domain name"
                className="h-8 text-sm"
              />
              <Textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="Description"
                rows={2}
                className="text-xs"
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleSaveEdit} className="h-7 text-xs">
                  <Check className="w-3 h-3 mr-1" /> Save
                </Button>
                <Button size="sm" variant="outline" onClick={handleCancelEdit} className="h-7 text-xs">
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex-1 group">
              <div className="flex items-center gap-2">
                <h4 className="font-medium text-sm">{subDomain.name}</h4>
                <button
                  onClick={() => setIsEditing(true)}
                  className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-primary transition-all"
                >
                  <Pencil className="w-3 h-3" />
                </button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{subDomain.description}</p>
            </div>
          )}
        </div>
        {!isEditing && (
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <Badge variant="secondary" className="text-[10px] sm:text-xs px-2 py-0.5">
              {subDomain.competencies.length} competencies
            </Badge>
            <div className="flex items-center gap-2 ml-auto sm:ml-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAddCompetency(true)}
                className="h-7 text-[10px] sm:text-xs px-2"
              >
                <Plus className="w-3 h-3 sm:mr-1" />
                <span className="hidden sm:inline">Add</span>
              </Button>
              {!subDomain.competenciesGenerated && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleGenerateCompetencies}
                  disabled={isLoadingCompetencies}
                  className="h-7 text-[10px] sm:text-xs px-2"
                >
                  {isLoadingCompetencies ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <>
                      <Wand2 className="w-3 h-3 sm:mr-1" />
                      <span className="hidden sm:inline">Generate Competencies</span>
                    </>
                  )}
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={onDelete}
                className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Add Competency Inline Form */}
      {showAddCompetency && (
        <div className="mt-3 ml-8 p-3 border rounded-lg bg-muted/30 space-y-3">
          <Input
            value={newCompetencyName}
            onChange={(e) => setNewCompetencyName(e.target.value)}
            placeholder="Competency name"
            className="h-8 text-sm"
            onKeyDown={(e) => e.key === 'Enter' && handleAddCompetency()}
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={handleAddCompetency} className="h-7 text-xs">
              <Plus className="w-3 h-3 mr-1" /> Add Competency
            </Button>
            <Button size="sm" variant="outline" onClick={() => { setShowAddCompetency(false); setNewCompetencyName(''); }} className="h-7 text-xs">
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Competencies List */}
      {subDomain.isExpanded && subDomain.competencies.length > 0 && (
        <div className="mt-3 ml-8 space-y-2">
          {subDomain.competencies.map((competency) => (
            <CompetencyCard
              key={competency.id}
              competency={competency}
              onDelete={() => handleDeleteCompetency(competency.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Domain Row Component
const DomainRow = ({
  domain,
  onUpdate,
  onDelete,
}: {
  domain: Domain;
  onUpdate: (d: Domain) => void;
  onDelete: () => void;
}) => {
  const [isLoadingSubDomains, setIsLoadingSubDomains] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(domain.name);
  const [editDescription, setEditDescription] = useState(domain.description);
  const [showAddSubDomain, setShowAddSubDomain] = useState(false);
  const [newSubDomainName, setNewSubDomainName] = useState('');
  const [newSubDomainDesc, setNewSubDomainDesc] = useState('');
  const { toast } = useToast();

  const handleGenerateSubDomains = () => {
    setIsLoadingSubDomains(true);
    setTimeout(() => {
      const newSubDomains = generateSubDomains(domain.name);
      onUpdate({
        ...domain,
        subDomains: [...domain.subDomains, ...newSubDomains],
        subDomainsGenerated: true,
        isExpanded: true,
      });
      setIsLoadingSubDomains(false);
      toast({ title: 'Success', description: `Generated ${newSubDomains.length} sub-domains` });
    }, 1500);
  };

  const handleUpdateSubDomain = (updatedSD: SubDomain) => {
    onUpdate({
      ...domain,
      subDomains: domain.subDomains.map((sd) => sd.id === updatedSD.id ? updatedSD : sd),
    });
  };

  const handleDeleteSubDomain = (sdId: string) => {
    onUpdate({
      ...domain,
      subDomains: domain.subDomains.filter((sd) => sd.id !== sdId),
    });
  };

  const handleToggleSelection = () => {
    const newSelected = !domain.isSelected;
    onUpdate({
      ...domain,
      isSelected: newSelected,
      subDomains: domain.subDomains.map((sd) => ({ ...sd, isSelected: newSelected })),
    });
  };

  const handleSaveEdit = () => {
    if (!editName.trim()) {
      toast({ title: 'Error', description: 'Name is required', variant: 'destructive' });
      return;
    }
    onUpdate({
      ...domain,
      name: editName.trim(),
      description: editDescription.trim(),
    });
    setIsEditing(false);
    toast({ title: 'Success', description: 'Domain updated' });
  };

  const handleCancelEdit = () => {
    setEditName(domain.name);
    setEditDescription(domain.description);
    setIsEditing(false);
  };

  const handleAddSubDomain = () => {
    if (!newSubDomainName.trim()) {
      toast({ title: 'Error', description: 'Sub-domain name is required', variant: 'destructive' });
      return;
    }
    const newSubDomain: SubDomain = {
      id: `subdomain-${Date.now()}`,
      name: newSubDomainName.trim(),
      description: newSubDomainDesc.trim() || `${newSubDomainName} sub-domain`,
      competencies: [],
      competenciesGenerated: false,
      isExpanded: false,
      isSelected: true,
    };
    onUpdate({
      ...domain,
      subDomains: [...domain.subDomains, newSubDomain],
      isExpanded: true,
    });
    setNewSubDomainName('');
    setNewSubDomainDesc('');
    setShowAddSubDomain(false);
    toast({ title: 'Success', description: 'Sub-domain added' });
  };

  const selectedSubDomains = domain.subDomains.filter((sd) => sd.isSelected).length;
  const isIndeterminate = selectedSubDomains > 0 && selectedSubDomains < domain.subDomains.length;

  return (
    <Card className="mb-4 overflow-hidden border-border/50 hover:shadow-md transition-shadow">
      {/* Domain Header */}
      <div className="bg-gradient-to-r from-primary/5 to-purple-500/5 dark:from-primary/10 dark:to-purple-500/10 p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div className="flex items-start sm:items-center gap-2 sm:gap-3 flex-1 min-w-0">
            <Checkbox
              checked={domain.isSelected}
              onCheckedChange={handleToggleSelection}
              className={`mt-1 sm:mt-0 flex-shrink-0 ${isIndeterminate ? 'data-[state=checked]:bg-primary/50' : ''}`}
            />
            <button
              onClick={() => onUpdate({ ...domain, isExpanded: !domain.isExpanded })}
              className="p-1 hover:bg-muted rounded flex-shrink-0 mt-0.5 sm:mt-0"
            >
              {domain.isExpanded ? (
                <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
              ) : (
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </button>
            {isEditing ? (
              <div className="flex-1 space-y-2">
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Domain name"
                  className="h-9"
                />
                <Textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="Description"
                  rows={2}
                  className="text-sm"
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleSaveEdit}>
                    <Check className="w-4 h-4 mr-1" /> Save
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex-1 group">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{domain.name}</h3>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-primary transition-all"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm text-muted-foreground">{domain.description}</p>
              </div>
            )}
          </div>
          {!isEditing && (
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <Badge variant="outline" className="text-xs">
                {domain.subDomains.length} sub-domains
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {domain.subDomains.reduce((sum, sd) => sum + sd.competencies.length, 0)} competencies
              </Badge>
              <div className="flex items-center gap-2 ml-auto sm:ml-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => { setShowAddSubDomain(true); onUpdate({ ...domain, isExpanded: true }); }}
                  className="h-8 text-xs"
                >
                  <Plus className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Add</span>
                </Button>
                {!domain.subDomainsGenerated && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleGenerateSubDomains}
                    disabled={isLoadingSubDomains}
                    className="h-8 text-xs"
                  >
                    {isLoadingSubDomains ? (
                      <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                    ) : (
                      <>
                        <Wand2 className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
                        <span className="hidden sm:inline">Generate Sub-Domain</span>
                      </>
                    )}
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onDelete}
                  className="text-muted-foreground hover:text-destructive h-8 w-8 p-0"
                >
                  <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sub-domains */}
      {domain.isExpanded && (
        <CardContent className="p-4 pt-2">
          {/* Add SubDomain Form */}
          {showAddSubDomain && (
            <div className="mb-4 p-4 border rounded-lg bg-muted/30 space-y-3">
              <h4 className="font-medium text-sm">Add New Sub-Domain</h4>
              <Input
                value={newSubDomainName}
                onChange={(e) => setNewSubDomainName(e.target.value)}
                placeholder="Sub-domain name"
                className="h-9"
              />
              <Textarea
                value={newSubDomainDesc}
                onChange={(e) => setNewSubDomainDesc(e.target.value)}
                placeholder="Description (optional)"
                rows={2}
                className="text-sm"
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleAddSubDomain}>
                  <Plus className="w-4 h-4 mr-1" /> Add Sub-Domain
                </Button>
                <Button size="sm" variant="outline" onClick={() => { setShowAddSubDomain(false); setNewSubDomainName(''); setNewSubDomainDesc(''); }}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
          
          {domain.subDomains.length > 0 ? (
            domain.subDomains.map((sd) => (
              <SubDomainRow
                key={sd.id}
                subDomain={sd}
                onUpdate={handleUpdateSubDomain}
                onDelete={() => handleDeleteSubDomain(sd.id)}
              />
            ))
          ) : !showAddSubDomain && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No sub-domains yet. Click "Add" or "Generate" to create sub-domains.
            </p>
          )}
        </CardContent>
      )}
    </Card>
  );
};

// Role Card Component
const RoleCard = ({
  role,
  orgUnitName,
  skillLevelName,
  onUpdate,
  onDelete,
}: {
  role: Role;
  orgUnitName?: string;
  skillLevelName?: string;
  onUpdate: (r: Role) => void;
  onDelete: () => void;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(role.roleName);
  const [editDescription, setEditDescription] = useState(role.description || '');
  const { toast } = useToast();

  const handleSaveEdit = () => {
    if (!editName.trim()) {
      toast({ title: 'Error', description: 'Role name is required', variant: 'destructive' });
      return;
    }
    onUpdate({
      ...role,
      roleName: editName.trim(),
      description: editDescription.trim(),
    });
    setIsEditing(false);
    toast({ title: 'Success', description: 'Role updated' });
  };

  const handleCancelEdit = () => {
    setEditName(role.roleName);
    setEditDescription(role.description || '');
    setIsEditing(false);
  };

  const handleRemoveSkill = (competencyId: string) => {
    onUpdate({
      ...role,
      assignedSkills: role.assignedSkills.filter((s) => s.competencyId !== competencyId),
    });
  };

  return (
    <Card className="mb-4 overflow-hidden border-border/50">
      <div className="bg-gradient-to-r from-primary/5 to-purple-500/5 dark:from-primary/10 dark:to-purple-500/10 p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-0">
          <div className="flex items-start sm:items-center gap-2 sm:gap-3 flex-1 min-w-0">
            <button onClick={() => onUpdate({ ...role, isExpanded: !role.isExpanded })} className="flex-shrink-0 mt-0.5 sm:mt-0">
              {role.isExpanded ? (
                <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
              ) : (
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </button>
            {isEditing ? (
              <div className="flex-1 space-y-2">
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Role name"
                  className="h-9"
                />
                <Textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="Description (optional)"
                  rows={2}
                  className="text-sm"
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleSaveEdit}>
                    <Check className="w-4 h-4 mr-1" /> Save
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="group flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-base sm:text-lg truncate">{role.roleName}</h3>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-primary transition-all flex-shrink-0"
                  >
                    <Pencil className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                </div>
                {role.description && (
                  <p className="text-xs sm:text-sm text-muted-foreground truncate">{role.description}</p>
                )}
              </div>
            )}
          </div>
          {!isEditing && (
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <Badge variant="outline" className="text-[10px] sm:text-xs">{role.assignedSkills.length} competencies</Badge>
              <Badge className="bg-pink-500 hover:bg-pink-600 text-white text-[10px] sm:text-xs truncate max-w-[150px]">{role.primarySubDomain}</Badge>
              {orgUnitName && <Badge variant="outline" className="text-[10px] sm:text-xs bg-blue-50 text-blue-700 border-blue-200">{orgUnitName}</Badge>}
              {skillLevelName && <Badge variant="outline" className="text-[10px] sm:text-xs bg-green-50 text-green-700 border-green-200">{skillLevelName}</Badge>}
              <Button
                variant="ghost"
                size="sm"
                onClick={onDelete}
                className="text-muted-foreground hover:text-destructive h-7 w-7 p-0 ml-auto sm:ml-0"
              >
                <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {role.isExpanded && (
        <CardContent className="p-3 sm:p-4 bg-muted/20 space-y-3">
          <div className="flex flex-wrap gap-2">
            {role.assignedSkills.map((skill) => (
              <Badge
                key={skill.competencyId}
                variant="outline"
                className="bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 border px-3 py-1 text-xs font-medium flex items-center gap-2 group"
              >
                <span>{skill.competencyName}</span>
                <button
                  onClick={() => handleRemoveSkill(skill.competencyId)}
                  className="opacity-0 group-hover:opacity-100 hover:text-destructive transition-all"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
          {role.assignedSkills.length === 0 && (
            <p className="text-xs sm:text-sm text-muted-foreground text-center py-2">
              No competencies assigned to this role.
            </p>
          )}
        </CardContent>
      )}
    </Card>
  );
};

// Skills Matrix Tab Component
const SkillsMatrixTab = ({
  domains,
  industry,
  onDomainsChange,
}: {
  domains: Domain[];
  industry: string;
  onDomainsChange: (domains: Domain[]) => void;
}) => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [allExpanded, setAllExpanded] = useState(false);
  const [addDomainOpen, setAddDomainOpen] = useState(false);
  const [newDomain, setNewDomain] = useState({ name: '', description: '' });
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; domainId: string; name: string } | null>(null);

  // Filter domains
  const filteredDomains = domains.filter((domain) => {
    const query = searchQuery.toLowerCase();
    if (domain.name.toLowerCase().includes(query) || domain.description.toLowerCase().includes(query)) return true;
    if (domain.subDomains.some((sd) => sd.name.toLowerCase().includes(query))) return true;
    if (domain.subDomains.some((sd) => sd.competencies.some((c) => c.name.toLowerCase().includes(query)))) return true;
    return false;
  });

  // Calculate stats
  const totalDomains = domains.length;
  const totalSubDomains = domains.reduce((sum, d) => sum + d.subDomains.length, 0);
  const totalSkills = domains.reduce((sum, d) => sum + d.subDomains.reduce((s, sd) => s + sd.competencies.length, 0), 0);

  const handleExpandAll = () => {
    onDomainsChange(domains.map((d) => ({ ...d, isExpanded: !allExpanded })));
    setAllExpanded(!allExpanded);
  };

  const handleSelectAll = () => {
    onDomainsChange(domains.map((d) => ({
      ...d,
      isSelected: true,
      subDomains: d.subDomains.map((sd) => ({ ...sd, isSelected: true })),
    })));
  };

  const handleDeselectAll = () => {
    onDomainsChange(domains.map((d) => ({
      ...d,
      isSelected: false,
      subDomains: d.subDomains.map((sd) => ({ ...sd, isSelected: false })),
    })));
  };

  const handleAddDomain = () => {
    if (!newDomain.name.trim() || !newDomain.description.trim()) {
      toast({ title: 'Error', description: 'Name and description are required', variant: 'destructive' });
      return;
    }
    const domain: Domain = {
      id: `domain-${Date.now()}`,
      name: newDomain.name.trim(),
      description: newDomain.description.trim(),
      subDomains: [],
      subDomainsGenerated: false,
      isExpanded: false,
      isSelected: true,
    };
    onDomainsChange([...domains, domain]);
    setNewDomain({ name: '', description: '' });
    setAddDomainOpen(false);
    toast({ title: 'Success', description: 'Domain added successfully' });
  };

  const handleDeleteDomain = (domainId: string) => {
    onDomainsChange(domains.filter((d) => d.id !== domainId));
    setDeleteDialog(null);
    toast({ title: 'Success', description: 'Domain deleted successfully' });
  };

  const handleExport = () => {
    try {
      const wb = XLSX.utils.book_new();
      interface ExcelRow {
        Level: string;
        Name: string;
        Description: string;
        Category: string;
        'Sub-Domains': number | string;
        Competencies: number | string;
      }
      const excelData: ExcelRow[] = [];

      domains.forEach((domain) => {
        excelData.push({
          'Level': 'DOMAIN',
          'Name': domain.name,
          'Description': domain.description,
          'Category': '',
          'Sub-Domains': domain.subDomains.length,
          'Competencies': domain.subDomains.reduce((sum, sd) => sum + sd.competencies.length, 0),
        });

        domain.subDomains.forEach((sd) => {
          excelData.push({
            'Level': '  SUB-DOMAIN',
            'Name': sd.name,
            'Description': sd.description,
            'Category': '',
            'Sub-Domains': '',
            'Competencies': sd.competencies.length,
          });

          sd.competencies.forEach((comp) => {
            excelData.push({
              'Level': '    COMPETENCY',
              'Name': comp.name,
              'Description': comp.description,
              'Category': `${comp.skills.length}S / ${comp.knowledge.length}K / ${comp.attitudes.length}A`,
              'Sub-Domains': '',
              'Competencies': '',
            });
          });
        });

        excelData.push({ 'Level': '', 'Name': '', 'Description': '', 'Category': '', 'Sub-Domains': '', 'Competencies': '' });
      });

      const ws = XLSX.utils.json_to_sheet(excelData);
      XLSX.utils.book_append_sheet(wb, ws, 'Competency Matrix');
      XLSX.writeFile(wb, `competency-matrix-${industry.replace(/\s+/g, '-')}.xlsx`);
      toast({ title: 'Success', description: 'Competency matrix exported successfully' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to export', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SummaryCard title="Domains" count={totalDomains} icon={Network} color="border-l-primary" />
        <SummaryCard title="Sub-Domains" count={totalSubDomains} icon={Network} color="border-l-purple-500" />
        <SummaryCard title="Competencies" count={totalSkills} icon={Sparkles} color="border-l-green-500" />
      </div>

      {/* Toolbar */}
      <div className="space-y-3 sm:space-y-0 sm:flex sm:items-center sm:gap-4">
        <div className="w-full sm:flex-1 sm:min-w-[200px] sm:max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search domains, sub-domains, or competencies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={handleExpandAll} className="text-xs">
            {allExpanded ? <ShrinkIcon className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" /> : <ExpandIcon className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />}
            <span className="hidden sm:inline">{allExpanded ? 'Collapse All' : 'Expand All'}</span>
          </Button>
          <Button variant="outline" size="sm" onClick={handleSelectAll} className="text-xs">
            <CheckSquare className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
            <span className="hidden sm:inline">Select All</span>
          </Button>
          <Button variant="outline" size="sm" onClick={handleDeselectAll} className="text-xs">
            <Square className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
            <span className="hidden sm:inline">Deselect All</span>
          </Button>
          <Button variant="outline" size="sm" onClick={() => setAddDomainOpen(true)} className="text-xs">
            <Plus className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
            <span className="hidden sm:inline">Add Domain</span>
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport} className="text-xs col-span-2 sm:col-span-1">
            <Download className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
            <span className="hidden sm:inline">Export</span>
          </Button>
        </div>
      </div>

      {/* Domain List */}
      <div>
        {filteredDomains.length === 0 ? (
          <Card className="p-8 text-center text-muted-foreground">
            <Network className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No domains found. Add a domain to get started.</p>
          </Card>
        ) : (
          filteredDomains.map((domain) => (
            <DomainRow
              key={domain.id}
              domain={domain}
              onUpdate={(d) => onDomainsChange(domains.map((dom) => dom.id === d.id ? d : dom))}
              onDelete={() => setDeleteDialog({ open: true, domainId: domain.id, name: domain.name })}
            />
          ))
        )}
      </div>

      {/* Add Domain Dialog */}
      <Dialog open={addDomainOpen} onOpenChange={setAddDomainOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Domain</DialogTitle>
            <DialogDescription>Create a new skill domain for your organization.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Domain Name <span className="text-destructive">*</span></Label>
              <Input
                value={newDomain.name}
                onChange={(e) => setNewDomain({ ...newDomain, name: e.target.value })}
                placeholder="e.g., Cloud Infrastructure"
              />
            </div>
            <div className="space-y-2">
              <Label>Description <span className="text-destructive">*</span></Label>
              <Textarea
                value={newDomain.description}
                onChange={(e) => setNewDomain({ ...newDomain, description: e.target.value })}
                placeholder="Describe this domain..."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDomainOpen(false)}>Cancel</Button>
            <Button onClick={handleAddDomain}>Add Domain</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialog?.open} onOpenChange={(open) => !open && setDeleteDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Domain</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteDialog?.name}"? This will also delete all sub-domains and skills within it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteDialog && handleDeleteDomain(deleteDialog.domainId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

// Role Generator Tab Component
const RoleGeneratorTab = ({
  domains,
  industry,
}: {
  domains: Domain[];
  industry: string;
}) => {
  const { toast } = useToast();
  const ROLES_STORAGE_KEY = `role-definitions-${industry.replace(/\s+/g, '-')}`;

  const [selectedDomainId, setSelectedDomainId] = useState('');
  const [selectedSubDomainIds, setSelectedSubDomainIds] = useState<string[]>([]);
  const [selectedOrgUnitId, setSelectedOrgUnitId] = useState('');
  const [selectedSkillLevelId, setSelectedSkillLevelId] = useState('');
  const [roles, setRoles] = useState<Role[]>(() => {
    try {
      const saved = localStorage.getItem(ROLES_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const selectedDomain = domains.find((d) => d.id === selectedDomainId);
  const domainsWithSkills = domains.filter((d) => d.subDomains.some((sd) => sd.competencies.length > 0));

  const totalSkills = selectedDomain
    ? selectedDomain.subDomains
        .filter((sd) => selectedSubDomainIds.includes(sd.id) && sd.competencies.length > 0)
        .reduce((sum, sd) => sum + sd.competencies.length, 0)
    : 0;

  const ORG_UNITS: Record<string, string> = { '10': 'Engineering', '20': 'Sales', '30': 'HR', '40': 'Marketing', '50': 'Operations' };
  const SKILL_LEVELS: Record<string, ProficiencyLevel> = { '1': 'Beginner', '2': 'Intermediate', '3': 'Advanced', '4': 'Expert' };

  const handleGenerateRoles = async () => {
    if (!selectedDomain || selectedSubDomainIds.length === 0) {
      toast({ title: 'Error', description: 'Select a domain and sub-domains', variant: 'destructive' });
      return;
    }
    if (!selectedOrgUnitId) {
      toast({ title: 'Error', description: 'Select an Organisation Unit', variant: 'destructive' });
      return;
    }
    if (!selectedSkillLevelId) {
      toast({ title: 'Error', description: 'Select a Skill Level', variant: 'destructive' });
      return;
    }
    if (totalSkills === 0) {
      toast({ title: 'Error', description: 'At least 1 competency required to generate roles', variant: 'destructive' });
      return;
    }

    setIsGenerating(true);

    try {
      // Check for existing roles first
      const existingRolesData = localStorage.getItem(ROLES_STORAGE_KEY);
      const existingRoles: Role[] = existingRolesData ? JSON.parse(existingRolesData) : [];
      const existingRoleNames = new Set(
        existingRoles.map(r => r.roleName.toLowerCase().trim())
      );

      await new Promise((resolve) => setTimeout(resolve, 2000));

      const skillsBySubDomain: SkillsBySubDomain[] = selectedDomain.subDomains
        .filter((sd) => selectedSubDomainIds.includes(sd.id) && sd.competencies.length > 0)
        .map((sd) => ({
          subDomainName: sd.name,
          competencies: sd.competencies.map((c) => ({ id: c.id, name: c.name, description: c.description })),
        }));

      const allCompetencies = skillsBySubDomain.flatMap((sd) =>
        sd.competencies.map((c) => ({ ...c, subDomainName: sd.subDomainName }))
      );

      const proficiencies: ProficiencyLevel[] = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

      const chosenProficiency: ProficiencyLevel = SKILL_LEVELS[selectedSkillLevelId] ?? 'Intermediate';
      const chosenOrgUnitId = selectedOrgUnitId ? parseInt(selectedOrgUnitId) : undefined;

      const mockRoles: Role[] = [
        {
          id: `role-${Date.now()}-1`,
          roleName: `${selectedDomain.name} Specialist`,
          description: `Expert in ${selectedDomain.name.toLowerCase()}`,
          primarySubDomain: skillsBySubDomain[0]?.subDomainName || '',
          organization_unit_id: chosenOrgUnitId,
          organization_unit_level_id: parseInt(selectedSkillLevelId),
          assignedSkills: allCompetencies.slice(0, Math.min(8, allCompetencies.length)).map((c) => ({
            competencyId: c.id,
            competencyName: c.name,
            subDomainName: c.subDomainName,
            proficiency: chosenProficiency,
          })),
          isExpanded: true,
        },
        {
          id: `role-${Date.now()}-2`,
          roleName: `${skillsBySubDomain[0]?.subDomainName || 'Technical'} Lead`,
          description: `Leads ${skillsBySubDomain[0]?.subDomainName.toLowerCase() || 'technical'} projects`,
          primarySubDomain: skillsBySubDomain[0]?.subDomainName || '',
          organization_unit_id: chosenOrgUnitId,
          organization_unit_level_id: parseInt(selectedSkillLevelId),
          assignedSkills: skillsBySubDomain[0]?.competencies.slice(0, 6).map((c) => ({
            competencyId: c.id,
            competencyName: c.name,
            subDomainName: skillsBySubDomain[0].subDomainName,
            proficiency: chosenProficiency,
          })) || [],
          isExpanded: true,
        },
      ];

      // Filter out roles with names that already exist (case-insensitive)
      const newRoles = mockRoles.filter(role => 
        !existingRoleNames.has(role.roleName.toLowerCase().trim())
      );

      const duplicateCount = mockRoles.length - newRoles.length;

      if (newRoles.length === 0) {
        // All roles already exist
        setRoles(existingRoles);
        toast({ 
          title: 'Roles Already Exist', 
          description: `All ${mockRoles.length} roles already exist. Using existing roles.` 
        });
      } else {
        // Merge new roles with existing ones
        const allRoles = [...existingRoles, ...newRoles];
        setRoles(allRoles);
        localStorage.setItem(ROLES_STORAGE_KEY, JSON.stringify(allRoles));
        
        if (duplicateCount > 0) {
          toast({ 
            title: 'Success', 
            description: `Added ${newRoles.length} new role${newRoles.length > 1 ? 's' : ''}. ${duplicateCount} role${duplicateCount > 1 ? 's' : ''} already existed.` 
          });
        } else {
          toast({ 
            title: 'Success', 
            description: `Generated ${newRoles.length} role${newRoles.length > 1 ? 's' : ''}` 
          });
        }
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to generate roles', variant: 'destructive' });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExportRoles = () => {
    try {
      const wb = XLSX.utils.book_new();
      const orgUnitsMap: Record<string, string> = { '10': 'Engineering', '20': 'Sales', '30': 'HR', '40': 'Marketing', '50': 'Operations' };
      const skillLevelsMap: Record<string, string> = { '1': 'Beginner', '2': 'Intermediate', '3': 'Advanced', '4': 'Expert' };
      const data = roles.flatMap((role) => [
        {
          'Role': role.roleName,
          'Description': role.description || '',
          'Organisation Unit': role.organization_unit_id ? (orgUnitsMap[role.organization_unit_id.toString()] || '') : '',
          'Skill Level': role.organization_unit_level_id ? (skillLevelsMap[role.organization_unit_level_id.toString()] || '') : '',
          'Sub-Domain': role.primarySubDomain,
          'Competency': '',
        },
        ...role.assignedSkills.map((s) => ({
          'Role': '',
          'Description': '',
          'Organisation Unit': '',
          'Skill Level': '',
          'Sub-Domain': s.subDomainName,
          'Competency': s.competencyName,
        })),
        { 'Role': '', 'Description': '', 'Organisation Unit': '', 'Skill Level': '', 'Sub-Domain': '', 'Competency': '' },
      ]);
      const ws = XLSX.utils.json_to_sheet(data);
      XLSX.utils.book_append_sheet(wb, ws, 'Roles');
      XLSX.writeFile(wb, `roles-${industry.replace(/\s+/g, '-')}.xlsx`);
      toast({ title: 'Success', description: 'Roles exported' });
    } catch {
      toast({ title: 'Error', description: 'Export failed', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Configuration */}
      <Card>
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="text-base sm:text-lg">Generate Roles from Competencies</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:gap-6 items-start">
            <div className="space-y-2">
              <Label className="text-sm">Select Domain</Label>
              <Select value={selectedDomainId} onValueChange={(v) => { setSelectedDomainId(v); setSelectedSubDomainIds([]); }}>
                <SelectTrigger className="w-full h-9 sm:h-10 text-sm">
                  <SelectValue placeholder="Choose a domain with skills" />
                </SelectTrigger>
                <SelectContent>
                  {domainsWithSkills.map((d) => (
                    <SelectItem key={d.id} value={d.id} className="text-sm">
                      {d.name} ({d.subDomains.filter((sd) => sd.competencies.length > 0).length} sub-domains with competencies)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {!selectedDomain && domainsWithSkills.length === 0 && (
                <p className="text-xs text-muted-foreground mt-2">
                  No domains with competencies available. Generate competencies in the Competency Matrix tab first.
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm">Select Sub-Domains</Label>
                {selectedDomain && (
                  <div className="flex gap-1 sm:gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 sm:h-7 text-[10px] sm:text-xs px-2"
                      onClick={() => setSelectedSubDomainIds(selectedDomain.subDomains.filter((sd) => sd.competencies.length > 0).map((sd) => sd.id))}
                    >
                      Select All
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 sm:h-7 text-[10px] sm:text-xs px-2"
                      onClick={() => setSelectedSubDomainIds([])}
                    >
                      Clear
                    </Button>
                  </div>
                )}
              </div>
              {selectedDomain ? (
                <div className="space-y-2 max-h-48 overflow-y-auto border rounded-md p-2 sm:p-3">
                  {selectedDomain.subDomains.filter((sd) => sd.competencies.length > 0).map((sd) => (
                    <div key={sd.id} className="flex items-center gap-2 sm:gap-3">
                      <Checkbox
                        checked={selectedSubDomainIds.includes(sd.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedSubDomainIds([...selectedSubDomainIds, sd.id]);
                          } else {
                            setSelectedSubDomainIds(selectedSubDomainIds.filter((id) => id !== sd.id));
                          }
                        }}
                        className="flex-shrink-0"
                      />
                      <span className="text-xs sm:text-sm flex-1 truncate">{sd.name}</span>
                      <Badge className="bg-pink-500 hover:bg-pink-600 text-white text-[10px] sm:text-xs flex-shrink-0">{sd.competencies.length}</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="border rounded-md p-3 sm:p-4 text-center text-xs sm:text-sm text-muted-foreground bg-muted/30 min-h-[100px] sm:min-h-[120px] flex items-center justify-center">
                  Select a domain to view sub-domains
                </div>
              )}
            </div>
          </div>

          {/* Organisation Unit + Skill Level */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm">Organisation Unit <span className="text-destructive">*</span></Label>
              <Select value={selectedOrgUnitId} onValueChange={setSelectedOrgUnitId}>
                <SelectTrigger className="w-full h-9 sm:h-10 text-sm">
                  <SelectValue placeholder="Select Organisation Unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">Engineering</SelectItem>
                  <SelectItem value="20">Sales</SelectItem>
                  <SelectItem value="30">HR</SelectItem>
                  <SelectItem value="40">Marketing</SelectItem>
                  <SelectItem value="50">Operations</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Skill Level <span className="text-destructive">*</span></Label>
              <Select value={selectedSkillLevelId} onValueChange={setSelectedSkillLevelId}>
                <SelectTrigger className="w-full h-9 sm:h-10 text-sm">
                  <SelectValue placeholder="Select Skill Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">L1</SelectItem>
                  <SelectItem value="2">L2</SelectItem>
                  <SelectItem value="3">L3</SelectItem>
                  <SelectItem value="4">L4</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-4 border-t">
            <div className="text-xs sm:text-sm text-muted-foreground">
              {totalSkills} competencies from {selectedSubDomainIds.length} sub-domain(s)
              {selectedOrgUnitId && ORG_UNITS[selectedOrgUnitId] && <span className="ml-2 text-blue-600">· {ORG_UNITS[selectedOrgUnitId]}</span>}
              {selectedSkillLevelId && SKILL_LEVELS[selectedSkillLevelId] && <span className="ml-1 text-green-600">· {SKILL_LEVELS[selectedSkillLevelId]}</span>}
            </div>
            <Button
              onClick={handleGenerateRoles}
              disabled={isGenerating || !selectedDomain || selectedSubDomainIds.length === 0 || totalSkills === 0 || !selectedOrgUnitId || !selectedSkillLevelId}
              className="w-full sm:w-auto"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Users className="w-4 h-4 mr-2" />
                  Generate Roles
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Generated Roles */}
      {roles.length > 0 && (
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <h3 className="text-base sm:text-lg font-semibold">Generated Roles ({roles.length})</h3>
            <Button variant="outline" size="sm" onClick={handleExportRoles} className="w-full sm:w-auto">
              <Download className="w-4 h-4 mr-2" />
              Export Roles
            </Button>
          </div>
          {roles.map((role) => (
            <RoleCard
              key={role.id}
              role={role}
              orgUnitName={role.organization_unit_id ? ORG_UNITS[role.organization_unit_id.toString()] : undefined}
              skillLevelName={role.organization_unit_level_id ? SKILL_LEVELS[role.organization_unit_level_id.toString()] : undefined}
              onUpdate={(r) => {
                const updated = roles.map((ro) => ro.id === r.id ? r : ro);
                setRoles(updated);
                localStorage.setItem(ROLES_STORAGE_KEY, JSON.stringify(updated));
              }}
              onDelete={() => {
                const updated = roles.filter((r) => r.id !== role.id);
                setRoles(updated);
                localStorage.setItem(ROLES_STORAGE_KEY, JSON.stringify(updated));
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Main Skills Matrix Page
export default function SkillMatrix() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState<'landing' | 'matrix'>('landing');
  const [industry, setIndustry] = useState('');
  const [domains, setDomains] = useState<Domain[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showClearDialog, setShowClearDialog] = useState(false);

  const STORAGE_KEY = `skills-matrix-${industry.replace(/\s+/g, '-')}`;
  const ROLES_STORAGE_KEY = `role-definitions-${industry.replace(/\s+/g, '-')}`;

  const handleGenerate = (info: CompanyInfo) => {
    setIsLoading(true);
    setIndustry(info.industry);

    // Check for saved data
    const savedKey = `skills-matrix-${info.industry.replace(/\s+/g, '-')}`;
    const saved = localStorage.getItem(savedKey);

    setTimeout(() => {
      if (saved) {
        setDomains(JSON.parse(saved));
        toast({ 
          title: 'Loaded Existing Data', 
          description: `Using ${JSON.parse(saved).length} domains from storage (instant, free)` 
        });
      } else {
        const newDomains = generateDomains(info.industry);
        setDomains(newDomains);
        toast({ title: 'Generated', description: `Created ${newDomains.length} new domains` });
      }
      setStep('matrix');
      setIsLoading(false);
    }, 1500);
  };

  const handleSaveDraft = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(domains));
    toast({ title: 'Saved', description: 'Draft saved successfully' });
  };

  const handleClearDraft = () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(ROLES_STORAGE_KEY);
    const newDomains = generateDomains(industry);
    setDomains(newDomains);
    setShowClearDialog(false);
    toast({ title: 'Cleared', description: 'All data reset to initial state' });
  };

  const handleReset = () => {
    setStep('landing');
    setDomains([]);
    setIndustry('');
  };

  if (step === 'landing') {
    return <LandingForm onGenerate={handleGenerate} isLoading={isLoading} />;
  }

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-primary to-purple-600 shadow-lg flex-shrink-0">
                <Network className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-lg md:text-2xl font-bold truncate">Competency Matrix - {industry}</h1>
                <p className="text-xs md:text-sm text-muted-foreground hidden sm:block">Manage and organize your organization's competency taxonomy</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
              <Button variant="outline" onClick={handleSaveDraft} size="sm" className="flex-1 sm:flex-none">
                <Save className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Save Draft</span>
              </Button>
              <Button variant="outline" onClick={() => setShowClearDialog(true)} size="sm" className="text-destructive hover:text-destructive flex-1 sm:flex-none">
                <Trash2 className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Clear Draft</span>
              </Button>
              <Button variant="secondary" onClick={handleReset} size="sm" className="flex-1 sm:flex-none">
                <ArrowLeft className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Back</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="matrix" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="matrix" className="flex items-center gap-2">
              <Network className="w-4 h-4" />
              Competency Matrix
            </TabsTrigger>
            <TabsTrigger value="roles" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Role Generator
            </TabsTrigger>
          </TabsList>

          <TabsContent value="matrix">
            <SkillsMatrixTab
              domains={domains}
              industry={industry}
              onDomainsChange={setDomains}
            />
          </TabsContent>

          <TabsContent value="roles">
            <RoleGeneratorTab
              domains={domains}
              industry={industry}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Clear Dialog */}
      <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear All Saved Data</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to clear all saved skills and roles? This will reset everything to the initial state.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleClearDraft}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Clear All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
