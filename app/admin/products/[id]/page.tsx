"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { ArrowLeft, Plus, Trash, Upload } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { LoadingSpinner } from "@/components/ui/LoadingSpinner"

// Define form schema using Zod
const productSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  price: z.coerce.number().positive({ message: "Price must be a positive number" }),
  stock: z.coerce.number().int().nonnegative({ message: "Stock must be a non-negative integer" }),
  category: z.string({ required_error: "Please select a category" }),
  featured: z.boolean().default(false),
});

const categories = ["clip-in", "tape-in", "wigs", "bundles", "accessories"];

type ProductData = z.infer<typeof productSchema> & {
  id: string;
  images: string[];
  colors: { id: string; name: string; value: string }[];
  lengths: { id: string; length: string }[];
};

export default function EditProductPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [colors, setColors] = useState<{ id?: string; name: string; value: string }[]>([]);
  const [lengths, setLengths] = useState<{ id?: string; length: string }[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [newColor, setNewColor] = useState({ name: '', value: '#000000' });
  const [newLength, setNewLength] = useState({ length: '' });
  const [initialized, setInitialized] = useState(false);
  
  // Initialize form
  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      stock: 0,
      category: "",
      featured: false,
    },
  });

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/admin/products/${params.id}`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch product");
        }
        
        const data = await response.json();
        const product = data.product as ProductData;
        
        // Set form values
        form.reset({
          name: product.name,
          description: product.description,
          price: product.price,
          stock: product.stock,
          category: product.category,
          featured: product.featured,
        });
        
        // Set colors, lengths, and images
        setColors(product.colors || []);
        setLengths(product.lengths || []);
        setImages(product.images || []);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to load product data");
      } finally {
        setIsLoading(false);
        setInitialized(true);
      }
    };
    
    fetchProduct();
  }, [params.id, form]);

  // Add a new color
  const addColor = () => {
    if (newColor.name.trim()) {
      setColors([...colors, { ...newColor }]);
      setNewColor({ name: '', value: '#000000' });
    }
  };

  // Remove a color
  const removeColor = (index: number) => {
    const updatedColors = [...colors];
    updatedColors.splice(index, 1);
    setColors(updatedColors);
  };

  // Add a new length
  const addLength = () => {
    if (newLength.length.trim()) {
      setLengths([...lengths, { ...newLength }]);
      setNewLength({ length: '' });
    }
  };

  // Remove a length
  const removeLength = (index: number) => {
    const updatedLengths = [...lengths];
    updatedLengths.splice(index, 1);
    setLengths(updatedLengths);
  };

  // Handle image upload (in a real app, this would connect to cloud storage)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const newImages = filesArray.map(file => URL.createObjectURL(file));
      setImages([...images, ...newImages]);
    }
  };

  // Remove an image
  const removeImage = (index: number) => {
    const updatedImages = [...images];
    updatedImages.splice(index, 1);
    setImages(updatedImages);
  };

  // Submit form data
  const onSubmit = async (data: z.infer<typeof productSchema>) => {
    if (colors.length === 0) {
      toast({
        title: "No colors added",
        description: "Please add at least one color for the product",
        variant: "destructive",
      });
      return;
    }

    if (lengths.length === 0) {
      toast({
        title: "No lengths added",
        description: "Please add at least one length for the product",
        variant: "destructive",
      });
      return;
    }

    // For demo purposes, use placeholders if no images are uploaded
    const imagesToSubmit = images.length > 0 
      ? images 
      : ["https://placehold.co/600x400?text=Hair+Extension"];

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/admin/products/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          images: imagesToSubmit,
          colors,
          lengths,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update product");
      }

      const result = await response.json();

      toast({
        title: "Product updated",
        description: "The product has been updated successfully.",
      });

      // Navigate back to products list
      router.push("/admin/products");
    } catch (error) {
      console.error("Error updating product:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update product",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state
  if (isLoading || !initialized) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex h-[70vh] flex-col items-center justify-center space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-medium text-red-500">{error}</h3>
          <p className="text-muted-foreground">Unable to load product information</p>
        </div>
        <Button asChild>
          <Link href="/admin/products">Back to Products</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/admin/products">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Edit Product</h1>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Product Information */}
            <Card>
              <CardHeader>
                <CardTitle>Product Information</CardTitle>
                <CardDescription>Edit the basic information for this product.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Product name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Product description"
                          rows={5}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price ($)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" min="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="stock"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stock</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" step="1" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="featured"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 pt-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Featured Product</FormLabel>
                        <FormDescription>
                          This product will be displayed on the featured section of the homepage.
                        </FormDescription>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Variants and Images */}
            <div className="space-y-6">
              {/* Colors */}
              <Card>
                <CardHeader>
                  <CardTitle>Colors</CardTitle>
                  <CardDescription>Edit the available colors for this product.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-end gap-2">
                      <div className="grid flex-1 gap-2">
                        <FormLabel>Color Name</FormLabel>
                        <Input
                          value={newColor.name}
                          onChange={(e) => setNewColor({ ...newColor, name: e.target.value })}
                          placeholder="e.g., Blonde, Brown, etc."
                        />
                      </div>
                      <div className="grid gap-2">
                        <FormLabel>Color</FormLabel>
                        <Input
                          type="color"
                          value={newColor.value}
                          onChange={(e) => setNewColor({ ...newColor, value: e.target.value })}
                          className="h-10 w-14 p-1"
                        />
                      </div>
                      <Button type="button" onClick={addColor}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    {colors.length === 0 ? (
                      <div className="py-3 text-center text-sm text-muted-foreground">
                        No colors added yet
                      </div>
                    ) : (
                      <div className="divide-y">
                        {colors.map((color, index) => (
                          <div key={index} className="flex items-center justify-between py-2">
                            <div className="flex items-center gap-2">
                              <div
                                className="h-5 w-5 rounded-full border"
                                style={{ backgroundColor: color.value }}
                              />
                              <span>{color.name}</span>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeColor(index)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Lengths */}
              <Card>
                <CardHeader>
                  <CardTitle>Lengths</CardTitle>
                  <CardDescription>Edit the available lengths for this product.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-end gap-2">
                      <div className="grid flex-1 gap-2">
                        <FormLabel>Length</FormLabel>
                        <Input
                          value={newLength.length}
                          onChange={(e) => setNewLength({ length: e.target.value })}
                          placeholder="e.g., 12 inches, 16 inches, etc."
                        />
                      </div>
                      <Button type="button" onClick={addLength}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    {lengths.length === 0 ? (
                      <div className="py-3 text-center text-sm text-muted-foreground">
                        No lengths added yet
                      </div>
                    ) : (
                      <div className="divide-y">
                        {lengths.map((length, index) => (
                          <div key={index} className="flex items-center justify-between py-2">
                            <span>{length.length}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeLength(index)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Images */}
              <Card>
                <CardHeader>
                  <CardTitle>Images</CardTitle>
                  <CardDescription>Edit product images.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid w-full items-center gap-1.5">
                      <FormLabel>Product Images</FormLabel>
                      <div className="flex items-center gap-2">
                        <Input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleImageUpload}
                          className="flex-1"
                        />
                        <Button type="button" variant="outline" asChild>
                          <label className="cursor-pointer">
                            <Upload className="mr-2 h-4 w-4" />
                            Upload
                            <Input
                              type="file"
                              accept="image/*"
                              multiple
                              onChange={handleImageUpload}
                              className="hidden"
                            />
                          </label>
                        </Button>
                      </div>
                      <FormDescription>
                        Upload one or more images for this product.
                      </FormDescription>
                    </div>

                    {images.length > 0 && (
                      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3">
                        {images.map((image, index) => (
                          <div key={index} className="relative aspect-square overflow-hidden rounded-md border">
                            <img
                              src={image}
                              alt={`Product preview ${index + 1}`}
                              className="h-full w-full object-cover"
                            />
                            <Button
                              variant="destructive"
                              size="icon"
                              className="absolute right-1 top-1 h-6 w-6"
                              onClick={() => removeImage(index)}
                            >
                              <Trash className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" asChild>
              <Link href="/admin/products">Cancel</Link>
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <LoadingSpinner size="small" /> : "Update Product"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
} 