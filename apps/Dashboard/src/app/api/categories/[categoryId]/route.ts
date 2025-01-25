import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// PATCH /api/categories/[categoryId]
export async function PATCH(
  request: Request,
  context: { params: { categoryId: string } }
) {
  try {
    const catId = context.params.categoryId;
    const body = await request.json();

    if (!catId) {
      return NextResponse.json({ error: "Missing categoryId" }, { status: 400 });
    }

    const { name, categoryType, isVisible, allowedRoles } = body;

    // 1) DB-Update
    const updatedCat = await prisma.category.update({
      where: { id: catId },
      data: {
        ...(name !== undefined && { name }),
        ...(categoryType !== undefined && { categoryType }),
        ...(isVisible !== undefined && { isVisible }),
        ...(allowedRoles !== undefined && { allowedRoles }),
      },
    });

    // 2) Bot-Webhook aufrufen (event: "category_updated")
    try {
      const BOT_WEBHOOK_URL = process.env.BOT_WEBHOOK_URL || "http://localhost:3002/webhooks/categories";
      await fetch(BOT_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event: "category_updated",
          data: updatedCat,
        }),
      });
    } catch (err) {
      console.error("Bot-Webhook (category_updated) error:", err);
    }

    return NextResponse.json(updatedCat, { status: 200 });
  } catch (error) {
    console.error("PATCH /api/categories/[categoryId] error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// DELETE /api/categories/[categoryId]
export async function DELETE(
  request: Request,
  context: { params: { categoryId: string } }
) {
  try {
    const catId = context.params.categoryId;
    if (!catId) {
      return NextResponse.json({ error: "Missing categoryId" }, { status: 400 });
    }

    // 1) DB-Delete
    const deletedCat = await prisma.category.delete({
      where: { id: catId },
    });

    // 2) Bot-Webhook aufrufen (event: "category_deleted")
    try {
      const BOT_WEBHOOK_URL = process.env.BOT_WEBHOOK_URL || "http://localhost:3002/webhooks/categories";
      await fetch(BOT_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event: "category_deleted",
          data: deletedCat,
        }),
      });
    } catch (err) {
      console.error("Bot-Webhook (category_deleted) error:", err);
    }

    return NextResponse.json(deletedCat, { status: 200 });
  } catch (error) {
    console.error("DELETE /api/categories/[categoryId] error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
