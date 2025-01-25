## Prisma Behfele

1.  **Migration ausführen**
    ´´´bash
    pnpm prisma migrate dev --name update_udatedAt

2.  **Client generieren**
    ´´´bash
    pnpm run generate

3.  **Prisma-Studio öffnen (Browser-Oberfläche)**
    ´´´bash
    pnpm run studio

4.  **Schema ändern**
    Du bearbeitest prisma/schema.prisma.

5.  **Neuer Github Push**
    ´´´bash
    git add .
    git commit -m "DB schema update"
    git push origin main
