import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Product } from './products.model';

@Injectable()
export class ProductsService {
  products: Product[] = [];

  constructor(
    @InjectModel('Product') private readonly productModel: Model<Product>,
  ) {}

  async insertProduct(
    title: string,
    desc: string,
    price: number,
  ): Promise<string> {
    const newProduct = new this.productModel({
      title,
      description: desc,
      price,
    });
    const result = await newProduct.save();
    return result.id;
  }

  async getProducts(): Promise<Product[]> {
    const products = await this.productModel.find();
    return products;
  }

  async getSingleProduct(productId: string) {
    const product = await this.findProduct(productId);
    return {
      id: product.id,
      title: product.title,
      description: product.description,
      price: product.price,
    };
  }

  async updateProduct(
    productId: string,
    title: string,
    description: string,
    price: number,
  ) {
    let product;
    try {
      product = await this.productModel.findByIdAndUpdate(productId, {
        title,
        description,
        price,
      });
    } catch (err) {
      throw new NotFoundException('Coult not find product.');
    }
    if (!product) {
      throw new NotFoundException('Coult not find product.');
    }

    return product as Product;
  }

  async deleteProduct(prodId: string) {
    const result = await this.productModel.deleteOne({ _id: prodId });

    if (result.deletedCount === 0) {
      throw new NotFoundException('Coult not find product.');
    }
  }

  private async findProduct(id: string): Promise<Product> {
    let product;
    try {
      product = await this.productModel.findById(id);
    } catch (err) {
      throw new NotFoundException('Coult not find product.');
    }

    if (!product) {
      throw new NotFoundException('Coult not find product.');
    }
    return product;
  }
}
