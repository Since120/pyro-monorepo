// Pfad: apps/api/src/categories/services/category-delete.service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { CategoryDeleteService } from './category-delete.service';
import { PrismaService } from '../../prisma/prisma.service';
import { SetupService } from '../../setup/setup.service';
import axios from 'axios';

jest.mock('axios');
const mockAxiosDelete = axios.delete as jest.MockedFunction<typeof axios.delete>;

describe('CategoryDeleteService (Unit)', () => {
  let service: CategoryDeleteService;
  let prisma: PrismaService;
  let setupService: SetupService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryDeleteService,
        {
          provide: PrismaService,
          useValue: {
            category: {
              findUnique: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
            zone: {
              count: jest.fn(),
            },
          },
        },
        {
          provide: SetupService,
          useValue: {
            deactivateSetup: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CategoryDeleteService>(CategoryDeleteService);
    prisma = module.get<PrismaService>(PrismaService);
    setupService = module.get<SetupService>(SetupService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deleteCategory => throws if not found', async () => {
    (prisma.category.findUnique as jest.Mock).mockResolvedValue(null);
    await expect(service.deleteCategory('catX')).rejects.toThrow('Category not found');
  });

  it('deleteCategory => throws if zones exist', async () => {
    (prisma.category.findUnique as jest.Mock).mockResolvedValue({ id: 'catZ' });
    (prisma.zone.count as jest.Mock).mockResolvedValueOnce(2);

    await expect(service.deleteCategory('catZ')).rejects.toThrow(
      'Category cannot be deleted while Zones still exist!',
    );
  });

  it('deleteCategory => calls Bot if discordCategoryId', async () => {
    (prisma.category.findUnique as jest.Mock).mockResolvedValue({
      id: 'catOk',
      discordCategoryId: '999',
    });
    (prisma.zone.count as jest.Mock).mockResolvedValueOnce(0);
    (prisma.category.update as jest.Mock).mockResolvedValueOnce({
      id: 'catOk',
      deletedInDiscord: true,
    });

    const result = await service.deleteCategory('catOk');
    expect(mockAxiosDelete).toHaveBeenCalledWith(
      expect.stringContaining('/discord/categories/999'),
    );
    expect(result).toMatchObject({ deletedInDiscord: true });
  });

  it('deleteCategoryHard => forcibly removes record (no Bot error throw)', async () => {
    (prisma.zone.count as jest.Mock).mockResolvedValueOnce(0);
    (prisma.category.findUnique as jest.Mock).mockResolvedValue({
      id: 'catHard',
      discordCategoryId: '999',
    });
    (prisma.category.delete as jest.Mock).mockResolvedValue({ id: 'catHard' });

    mockAxiosDelete.mockRejectedValueOnce(new Error('fail')); 
    // Im Hard-Delete Code => wir loggen nur => no throw

    const res = await service.deleteCategoryHard('catHard');
    expect(res).toEqual({ id: 'catHard' });
  });
});
