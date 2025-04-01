"use client"

import { useState, useEffect, useId } from "react"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

interface FiltersState {
  price: [number, number]
  category?: string
  colors: string[]
  lengths: string[]
  featured?: boolean
}

export function ProductFilters({
  onFilterChange,
  initialCategory,
  initialFeatured,
}: {
  onFilterChange: (filters: FiltersState) => void
  initialCategory?: string
  initialFeatured?: boolean
}) {
  const formId = useId();
  const [filters, setFilters] = useState<FiltersState>({
    price: [0, 500],
    category: initialCategory,
    colors: [],
    lengths: [],
    featured: initialFeatured,
  });
  
  useEffect(() => {
    setFilters(prevFilters => ({
      ...prevFilters,
      category: initialCategory,
      featured: initialFeatured,
    }));
  }, [initialCategory, initialFeatured]);

  const handlePriceChange = (value: number[]) => {
    const newFilters = { ...filters, price: [value[0], value[1]] }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handleCategoryChange = (category: string, checked: boolean) => {
    const newFilters = { 
      ...filters, 
      category: checked ? category : undefined 
    }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handleColorChange = (color: string, checked: boolean) => {
    const newColors = checked 
      ? [...filters.colors, color] 
      : filters.colors.filter((c) => c !== color)

    const newFilters = { ...filters, colors: newColors }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handleLengthChange = (length: string, checked: boolean) => {
    const newLengths = checked 
      ? [...filters.lengths, length] 
      : filters.lengths.filter((l) => l !== length)

    const newFilters = { ...filters, lengths: newLengths }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }
  
  const handleFeaturedChange = (checked: boolean) => {
    const newFilters = { ...filters, featured: checked }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-4 text-lg font-semibold">Price Range</h3>
        <Slider 
          defaultValue={[0, 500]} 
          max={500} 
          step={10} 
          onValueChange={handlePriceChange} 
          className="mb-6" 
          suppressHydrationWarning
        />
        <div className="flex items-center justify-between">
          <span>${filters.price[0]}</span>
          <span>${filters.price[1]}</span>
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold">Categories</h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id={`${formId}-category-clip-in`}
              checked={filters.category === "clip-in"}
              onCheckedChange={(checked) => handleCategoryChange("clip-in", checked as boolean)}
              suppressHydrationWarning
            />
            <Label htmlFor={`${formId}-category-clip-in`}>Clip-In Extensions</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id={`${formId}-category-tape-in`}
              checked={filters.category === "tape-in"}
              onCheckedChange={(checked) => handleCategoryChange("tape-in", checked as boolean)}
              suppressHydrationWarning
            />
            <Label htmlFor={`${formId}-category-tape-in`}>Tape-In Extensions</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id={`${formId}-category-wigs`}
              checked={filters.category === "wigs"}
              onCheckedChange={(checked) => handleCategoryChange("wigs", checked as boolean)}
              suppressHydrationWarning
            />
            <Label htmlFor={`${formId}-category-wigs`}>Wigs & Hairpieces</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id={`${formId}-category-accessories`}
              checked={filters.category === "accessories"}
              onCheckedChange={(checked) => handleCategoryChange("accessories", checked as boolean)}
              suppressHydrationWarning
            />
            <Label htmlFor={`${formId}-category-accessories`}>Accessories</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id={`${formId}-category-care`}
              checked={filters.category === "care"}
              onCheckedChange={(checked) => handleCategoryChange("care", checked as boolean)}
              suppressHydrationWarning
            />
            <Label htmlFor={`${formId}-category-care`}>Hair Care</Label>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="mb-4 text-lg font-semibold">Featured</h3>
        <div className="flex items-center space-x-2">
          <Checkbox
            id={`${formId}-featured`}
            checked={filters.featured}
            onCheckedChange={(checked) => handleFeaturedChange(checked as boolean)}
            suppressHydrationWarning
          />
          <Label htmlFor={`${formId}-featured`}>Show Featured Only</Label>
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold">Colors</h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id={`${formId}-color-black`} 
              checked={filters.colors.includes("Black")}
              onCheckedChange={(checked) => handleColorChange("Black", checked as boolean)} 
              suppressHydrationWarning
            />
            <Label htmlFor={`${formId}-color-black`}>Black</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id={`${formId}-color-brown`} 
              checked={filters.colors.includes("Brown")}
              onCheckedChange={(checked) => handleColorChange("Brown", checked as boolean)} 
              suppressHydrationWarning
            />
            <Label htmlFor={`${formId}-color-brown`}>Brown</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id={`${formId}-color-blonde`}
              checked={filters.colors.includes("Blonde")}
              onCheckedChange={(checked) => handleColorChange("Blonde", checked as boolean)}
              suppressHydrationWarning
            />
            <Label htmlFor={`${formId}-color-blonde`}>Blonde</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id={`${formId}-color-red`} 
              checked={filters.colors.includes("Red")}
              onCheckedChange={(checked) => handleColorChange("Red", checked as boolean)} 
              suppressHydrationWarning
            />
            <Label htmlFor={`${formId}-color-red`}>Red</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id={`${formId}-color-ombre`} 
              checked={filters.colors.includes("Ombre")}
              onCheckedChange={(checked) => handleColorChange("Ombre", checked as boolean)} 
              suppressHydrationWarning
            />
            <Label htmlFor={`${formId}-color-ombre`}>Ombre</Label>
          </div>
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold">Length</h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id={`${formId}-length-12`}
              checked={filters.lengths.includes("12 inches")}
              onCheckedChange={(checked) => handleLengthChange("12 inches", checked as boolean)}
              suppressHydrationWarning
            />
            <Label htmlFor={`${formId}-length-12`}>12 inches</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id={`${formId}-length-16`}
              checked={filters.lengths.includes("16 inches")}
              onCheckedChange={(checked) => handleLengthChange("16 inches", checked as boolean)}
              suppressHydrationWarning
            />
            <Label htmlFor={`${formId}-length-16`}>16 inches</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id={`${formId}-length-18`}
              checked={filters.lengths.includes("18 inches")}
              onCheckedChange={(checked) => handleLengthChange("18 inches", checked as boolean)}
              suppressHydrationWarning
            />
            <Label htmlFor={`${formId}-length-18`}>18 inches</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id={`${formId}-length-20`}
              checked={filters.lengths.includes("20 inches")}
              onCheckedChange={(checked) => handleLengthChange("20 inches", checked as boolean)}
              suppressHydrationWarning
            />
            <Label htmlFor={`${formId}-length-20`}>20 inches</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id={`${formId}-length-24`}
              checked={filters.lengths.includes("24 inches")}
              onCheckedChange={(checked) => handleLengthChange("24 inches", checked as boolean)}
              suppressHydrationWarning
            />
            <Label htmlFor={`${formId}-length-24`}>24 inches</Label>
          </div>
        </div>
      </div>
    </div>
  )
}

