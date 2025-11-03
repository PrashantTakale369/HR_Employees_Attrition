import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Filter } from "lucide-react";

interface FilterPanelProps {
  onFilterChange: (filters: FilterState) => void;
  filters: FilterState;
}

export interface FilterState {
  department: string;
  ageRange: [number, number];
  tenure: string;
  satisfaction: string;
}

export const FilterPanel = ({ onFilterChange, filters }: FilterPanelProps) => {
  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-primary" />
          Filters
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Department</Label>
          <Select
            value={filters.department}
            onValueChange={(value) =>
              onFilterChange({ ...filters, department: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="All Departments" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              <SelectItem value="Sales">Sales</SelectItem>
              <SelectItem value="Research & Development">R&D</SelectItem>
              <SelectItem value="Human Resources">HR</SelectItem>
              <SelectItem value="IT">IT</SelectItem>
              <SelectItem value="Marketing">Marketing</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Age Range: {filters.ageRange[0]} - {filters.ageRange[1]}</Label>
          <Slider
            min={20}
            max={65}
            step={1}
            value={filters.ageRange}
            onValueChange={(value) =>
              onFilterChange({ ...filters, ageRange: value as [number, number] })
            }
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label>Tenure</Label>
          <Select
            value={filters.tenure}
            onValueChange={(value) =>
              onFilterChange({ ...filters, tenure: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="All Tenure" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tenure</SelectItem>
              <SelectItem value="0-2">0-2 years</SelectItem>
              <SelectItem value="3-5">3-5 years</SelectItem>
              <SelectItem value="6-10">6-10 years</SelectItem>
              <SelectItem value="11+">11+ years</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Job Satisfaction</Label>
          <Select
            value={filters.satisfaction}
            onValueChange={(value) =>
              onFilterChange({ ...filters, satisfaction: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="All Levels" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="1">Level 1 (Low)</SelectItem>
              <SelectItem value="2">Level 2</SelectItem>
              <SelectItem value="3">Level 3</SelectItem>
              <SelectItem value="4">Level 4 (High)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};
