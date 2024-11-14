import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/service/prismaService/prisma.service';

@Injectable()
export class MangaResponse {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll() {}

  async findOne() {}
}
