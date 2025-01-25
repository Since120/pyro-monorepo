import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/categories
 * Liefert alle Kategorien aus der DB zurück.
 */
export async function GET() {
  try {
    // Prisma-Abfrage: Alle Kategorien
    const categories = await prisma.category.findMany();
    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    console.error("GET /api/categories error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST /api/categories
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, categoryType, isVisible } = body;

    if (!name || !categoryType) {
      return NextResponse.json({ error: "Name & categoryType required" }, { status: 400 });
    }

    // 1) DB-Eintrag
    const newCat = await prisma.category.create({
      data: {
        name,
        categoryType,
        isVisible: isVisible ?? true,
      },
    });

    // 2) Bot-Webhook aufrufen (event: "category_created")
    try {
      const BOT_WEBHOOK_URL = process.env.BOT_WEBHOOK_URL;
      if (!BOT_WEBHOOK_URL) {
        console.error("Keine BOT_WEBHOOK_URL definiert!");
      } else {
        await fetch(BOT_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            event: "category_created",
            data: newCat,
          }),
        });
      }
    } catch (err) {
      console.error("Bot-Webhook (category_created) error:", err);
    }

    return NextResponse.json(newCat, { status: 201 });
  } catch (error) {
    console.error("POST /api/categories error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
