// File: app/admin/review/components/delete-category-dialog.tsx (DASHBOARD)
// (Đây là ReapproveDialog của bạn)
"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import toast from "react-hot-toast"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface ReapproveDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  postId: number | null
  categoryId: number | null
  onSelectCategory: (id: number | null) => void
  onSuccess: () => void
}

export default function ReapproveDialog({ open, onOpenChange, postId, categoryId, onSelectCategory, onSuccess }: ReapproveDialogProps) {
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open && postId) {
      axios.get(`/api/admin/post/${postId}/categories`).then((res) => {
        // Lọc ra chỉ những category đã được gán
        const cats = res.data.allCategories.filter((c: any) =>
          res.data.selectedIds.includes(c.id)
        )
        setCategories(cats)
      })
    }
  }, [open, postId])

  const handleReapprove = async () => {
    if (!postId || !categoryId) {
      toast.error("Please select a category")
      return
    }
    try {
      setLoading(true)
      // Gọi API reapprove (đã tạo)
      await axios.post(`/api/admin/post/${postId}/reapprove`, { categoryId })
      toast.success("Re-Approved: category removed & post unpublished")
      onSuccess()
      onOpenChange(false)
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to re-approve post")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Re-Approve Post</DialogTitle>
        </DialogHeader>
        <p className="text-sm">
          Chọn một category để xóa và hủy duyệt bài viết này.
        </p>

        <div className="space-y-2 mt-4">
          {categories.map((cat) => (
            <Button
              key={cat.id}
              variant={categoryId === cat.id ? "default" : "outline"}
              onClick={() => onSelectCategory(cat.id)}
              className="w-full justify-start"
            >
              {cat.name}
            </Button>
          ))}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button
            variant="destructive"
            onClick={handleReapprove}
            disabled={!categoryId || loading}
          >
            {loading ? "Processing..." : "Re-Approve"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}