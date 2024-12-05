import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

const mockProduct = {
  id: 1,
  name: 'Product1',
  price: 10,
  category: 'C1',
  rating: 1,
};

const mockProductArray = [mockProduct];

const mockProductsService = {
  create: jest.fn().mockResolvedValue(mockProduct),
  findAll: jest.fn().mockResolvedValue(mockProductArray),
  findOne: jest.fn().mockResolvedValue(mockProduct),
  update: jest.fn().mockResolvedValue(mockProduct),
  remove: jest.fn().mockResolvedValue(null),
  findByCriteria: jest.fn().mockResolvedValue(mockProductArray),
};

describe('ProductsController', () => {
  let productsController: ProductsController;
  let productsService: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: mockProductsService,
        },
        {
          provide: getModelToken(Product),
          useValue: {}, // Mock Sequelize model
        },
      ],
    }).compile();

    productsController = module.get<ProductsController>(ProductsController);
    productsService = module.get<ProductsService>(ProductsService);
  });

  it('should create a product', async () => {
    const createProductDto: CreateProductDto = { name: 'Product1', price: 10, category: 'C1', rating: 1 };

    const result = await productsController.create(createProductDto);

    expect(result).toEqual(mockProduct);
    expect(productsService.create).toHaveBeenCalledWith(createProductDto);
  });

  it('should update a product', async () => {
    const id = '1';
    const updateProductDto: UpdateProductDto = { ...mockProduct };
    const result = await productsController.update(id, updateProductDto);

    expect(result).toEqual(mockProduct);
    expect(productsService.update).toHaveBeenCalledWith(id, updateProductDto);
  });

  it('should delete a product', async () => {
    const id = '1';
    const result = await productsController.remove(id);

    expect(result).toBeNull();
    expect(productsService.remove).toHaveBeenCalledWith(id);
  });

  it('should return an array of products', async () => {
    const result = await productsController.findAll();

    expect(result).toEqual(mockProductArray);
    expect(productsService.findAll).toHaveBeenCalled();
  });

  it('should return a specific product', async () => {
    const id = '1';
    const result = await productsController.findOne(id);

    expect(result).toEqual(mockProduct);
    expect(productsService.findOne).toHaveBeenCalledWith(id);
  });

  it('should return an array of products by criteria', async () => {
    const criteria = { category: 'C1' };
    const result = await productsController.findByCriteria(criteria);

    expect(result).toEqual(mockProductArray);
    expect(productsService.findByCriteria).toHaveBeenCalledWith(criteria);
  });
});
