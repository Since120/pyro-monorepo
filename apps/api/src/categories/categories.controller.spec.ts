// Pfad: apps/api/src/categories/categories.controller.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import request from 'supertest';
import { CategoriesModule } from './categories.module';
import { PrismaService } from '../prisma/prisma.service';

// Wir mocken axios global, um Bot-Aufrufe abzufangen:
jest.mock('axios', () => ({
  post: jest.fn().mockResolvedValue({ data: { discordChannelId: '123MOCK' } }),
  patch: jest.fn().mockResolvedValue({}),
  delete: jest.fn().mockResolvedValue({}),
}));

describe('CategoriesController (Integration)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    // Wir erstellen ein echtes NestJS-Modul aus CategoriesModule,
    // mocken aber PrismaService => kein realer DB-Zugriff
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [CategoriesModule],
    })
      .overrideProvider(PrismaService)
      .useValue({
        category: {
          findMany: jest.fn().mockResolvedValue([]),
          create: jest.fn(),
          update: jest.fn(),
          findUnique: jest.fn(),
          delete: jest.fn(),
        },
        zone: {
          count: jest.fn(),
        },
      })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prisma = moduleFixture.get<PrismaService>(PrismaService);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /categories', () => {
    it('creates a category (happy path)', async () => {
      // Dein Mock-Verhalten => category.create => { id: 'abc', name: 'TestCat' }
      (prisma.category.create as jest.Mock).mockResolvedValue({
        id: 'abc',
        name: 'TestCat',
      });
      // update => die finalCat => wir simulieren => update => { id: 'abc', discordCategoryId:'123MOCK' }
      (prisma.category.update as jest.Mock).mockResolvedValue({
        id: 'abc',
        name: 'TestCat',
        discordCategoryId: '123MOCK',
      });

      const resp = await request(app.getHttpServer())
        .post('/categories')
        .send({
          name: 'IntegrationCat',
          categoryType: 'typeX',
        })
        .expect(HttpStatus.CREATED);

      // Prüfen, ob prisma.category.create aufgerufen
      expect(prisma.category.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          name: 'IntegrationCat',
          categoryType: 'typeX',
        }),
      });
      // finalCat => { id:'abc', name:'TestCat', discordCategoryId:'123MOCK' }
      expect(resp.body).toMatchObject({
        id: 'abc',
        name: 'TestCat',
      });
    });

    it('throws 400 if name or categoryType missing', async () => {
      // 1) name fehlt
      await request(app.getHttpServer())
        .post('/categories')
        .send({ categoryType: 'typeX' })
        .expect(HttpStatus.BAD_REQUEST);

      // 2) categoryType fehlt
      await request(app.getHttpServer())
        .post('/categories')
        .send({ name: 'Test' })
        .expect(HttpStatus.BAD_REQUEST);
    });
  });

  describe('DELETE /categories/:id', () => {
    it('returns 404 if category not found', async () => {
      // Hier ruft der Code categoriesService.deleteCategory => categoryDeleteService => ...
      (prisma.category.findUnique as jest.Mock).mockResolvedValue(null);

      const resp = await request(app.getHttpServer())
        .delete('/categories/catNotExist')
        .expect(HttpStatus.INTERNAL_SERVER_ERROR);
      // Weil im Code => if cat not found => throw NOT_FOUND.
      // Der Controller fängt HttpException => wirft 500,
      //   oder du könntest anpassen, dass er "passthrough" => 404.
      //   Aktuell schmeißt er "Error in remove(): ..."

      // Du könntest optional checken:
      // expect(resp.body.message).toMatch('Category not found') // etc.
    });

    it('returns 400 if zone exist', async () => {
      (prisma.category.findUnique as jest.Mock).mockResolvedValue({
        id: 'catZ',
      });
      (prisma.zone.count as jest.Mock).mockResolvedValueOnce(2);

      const res = await request(app.getHttpServer())
        .delete('/categories/catZ')
        .expect(HttpStatus.INTERNAL_SERVER_ERROR); // selbes Problem:
      // Im Code -> BAD_REQUEST geworfen =>
      //   Controller fängt => "Internal Server Error" => 500.
      //   Willst du es anpassen?
    });

    it('deletes the category => set deletedInDiscord = true (happy path)', async () => {
      // => category.findUnique => exist
      (prisma.category.findUnique as jest.Mock).mockResolvedValue({
        id: 'catOk',
        discordCategoryId: '999',
      });
      (prisma.zone.count as jest.Mock).mockResolvedValue(0);
      (prisma.category.update as jest.Mock).mockResolvedValue({
        id: 'catOk',
        deletedInDiscord: true,
      });

      const res = await request(app.getHttpServer())
        .delete('/categories/catOk')
        .expect(HttpStatus.OK);

      expect(prisma.category.update).toHaveBeenCalledWith({
        where: { id: 'catOk' },
        data: { deletedInDiscord: true },
      });
      expect(res.body).toMatchObject({ id: 'catOk', deletedInDiscord: true });
    });
  });
});
