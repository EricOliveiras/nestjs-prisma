import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';
import { BookDTO } from './book.dto';

@Injectable()
export class BookService {
  constructor(private prisma: PrismaService) {}
  async create(data: BookDTO): Promise<BookDTO | string> {
    const bookExist = await this.prisma.book.findFirst({
      where: {
        bar_code: data.bar_code,
      },
    });

    if (bookExist) {
      throw new Error('Book already exists');
    }

    const book = await this.prisma.book.create({
      data,
    });

    return book;
  }

  async findAll(): Promise<BookDTO[] | null> {
    const books = await this.prisma.book.findMany();
    return books;
  }

  async update(id: string, data: BookDTO): Promise<BookDTO> {
    const book = await this.prisma.book.findUnique({
      where: {
        id: id,
      },
    });

    if (!book) {
      throw new Error('Book not found');
    }

    return await this.prisma.book.update({
      where: {
        id: book.id,
      },
      data,
    });
  }

  async delete(id: string): Promise<BookDTO | string> {
    const findBook = await this.prisma.book.findUnique({
      where: {
        id: id,
      },
    });

    if (!findBook) {
      throw new Error('Book not found');
    }

    await this.prisma.book.delete({
      where: {
        id: findBook.id,
      },
    });

    return 'Book deleted';
  }
}
