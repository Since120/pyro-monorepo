// Pfad: apps/api/src/categories/services/category-create.service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { CategoryCreateService } from './category-create.service';
import { PrismaService } from '../../prisma/prisma.service';
import { SetupService } from '../../setup/setup.service';
import axios from 'axios';

// Wichtig: Hier unten mockst du das gesamte axios-Objekt
jest.mock('axios');

// Hilfsvariable, um axios.post leichter aufzurufen:
const mockAxiosPost = axios.post as jest.MockedFunction<typeof axios.post>;

describe('CategoryCreateService (Unit)', () => {
  let service: CategoryCreateService;
  let prisma: PrismaService;
  let setupService: SetupService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryCreateService,
        {
          provide: PrismaService,
          useValue: {
            category: {
              create: jest.fn(),
              update: jest.fn(),
            },
          },
        },
        {
          provide: SetupService,
          useValue: {
            activateSetup: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CategoryCreateService>(CategoryCreateService);
    prisma = module.get<PrismaService>(PrismaService);
    setupService = module.get<SetupService>(SetupService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a category in DB and call Bot (axios.post)', async () => {
    // 1) Eingabe
    const inputData = {
      name: 'MyCategory',
      categoryType: 'someType',
      isVisible: true,
      allowedRoles: ['111', '222'],
      trackingActive: false,
      sendSetup: false,
    };

    // 2) DB-Mocks
    (prisma.category.create as jest.Mock).mockResolvedValueOnce({
      id: 'cat123',
      ...inputData,
    });
    (prisma.category.update as jest.Mock).mockResolvedValueOnce({
      id: 'cat123',
      discordCategoryId: '999999',
      ...inputData,
    });

    // 3) Bot-Mock
    mockAxiosPost.mockResolvedValueOnce({
      data: { discordChannelId: '999999' },
    });

    // 4) Ausführen
    const result = await service.createCategory(inputData);

    // 5) Prüfen
    expect(prisma.category.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        name: 'MyCategory',
      }),
    });
    expect(mockAxiosPost).toHaveBeenCalledWith(
      expect.stringContaining('/discord/categories'),
      expect.objectContaining({
        name: 'MyCategory',
        isVisible: true,
        allowedRoles: ['111', '222'],
      }),
    );
    expect(prisma.category.update).toHaveBeenCalledWith({
      where: { id: 'cat123' },
      data: { discordCategoryId: '999999' },
    });
    expect(result.id).toBe('cat123');
    expect(result.discordCategoryId).toBe('999999');
  });

  it('should call setupService.activateSetup if sendSetup=true', async () => {
    (prisma.category.create as jest.Mock).mockResolvedValueOnce({
      id: 'catSETUP',
      name: 'CatWithSetup',
      categoryType: 'someType',
      sendSetup: true,
    });
    mockAxiosPost.mockResolvedValueOnce({
      data: { discordChannelId: '123XYZ' },
    });
    (prisma.category.update as jest.Mock).mockResolvedValueOnce({
      id: 'catSETUP',
      discordCategoryId: '123XYZ',
      name: 'CatWithSetup',
      sendSetup: true,
    });

    await service.createCategory({
      name: 'CatWithSetup',
      categoryType: 'someType',
      sendSetup: true,
    });

    // => Setup-Service aufgerufen?
    expect(setupService.activateSetup).toHaveBeenCalledWith('catSETUP');
  });

  it('should throw HttpException if Bot fails', async () => {
    // Prisma create => ok
    (prisma.category.create as jest.Mock).mockResolvedValueOnce({
      id: 'catFail',
      name: 'WillFail',
      categoryType: 'someType',
    });
    // Bot => fail
    mockAxiosPost.mockRejectedValueOnce(new Error('BotError'));

    // => erwarte HttpException
    await expect(
      service.createCategory({ name: 'WillFail', categoryType: 'someType' }),
    ).rejects.toThrow('Bot could not create the Discord category.');
  });
});
