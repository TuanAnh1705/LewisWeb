// File: app/admin/review/components/edit-categories-dialog.tsx (DASHBOARD)
"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import toast from "react-hot-toast"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

interface EditCategoriesDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  postId: number | null
  onSuccess: () => void
}

interface Category {
  id: number
  name: string
}

export default function EditCategoriesDialog({ open, onOpenChange, postId, onSuccess }: EditCategoriesDialogProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [selected, setSelected] = useState<number[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open && postId) {
      // Gọi API admin
      axios.get(`/api/admin/post/${postId}/categories`).then(res => {
        setCategories(res.data.allCategories || [])
        setSelected(res.data.selectedIds || [])
      }).catch(() => toast.error("Failed to load categories"))
    }
  }, [open, postId])

  const handleUpdate = async () => {
    if (!postId) return
    setLoading(true)
    try {
      // Gọi API PUT admin (đã tạo)
      await axios.put(`/api/admin/post/${postId}/categories`, { categoryIds: selected })
      toast.success("Categories updated")
      onSuccess()
      onOpenChange(false)
    } catch {
      toast.error("Failed to update categories")
    } finally {
      setLoading(false)
    }
  }

  const toggleCategory = (id: number) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(cid => cid !== id) : [...prev, id]
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Categories</DialogTitle>
        </DialogHeader>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {categories.map(cat => (
            <label key={cat.id} className="flex items-center gap-2">
              <Checkbox
                checked={selected.includes(cat.id)}
                onCheckedChange={() => toggleCategory(cat.id)}
              />
              {cat.name}
            </label>
          ))}
        </div>
        <DialogFooter>
          <Button onClick={handleUpdate} disabled={loading}>
            {loading ? "Updating..." : "Update"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}