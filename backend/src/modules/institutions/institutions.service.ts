import { Injectable, NotFoundException } from '@nestjs/common';
import type { Institution } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { CreateInstitutionDto } from './dto/create-institution.dto';
import { UpdateInstitutionDto } from './dto/update-institution.dto';

@Injectable()
export class InstitutionsService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateInstitutionDto): Promise<Institution> {
    return this.prisma.institution.create({
      data: {
        name: dto.name.trim(),
        code: dto.code.trim().toUpperCase(),
        shortName: dto.shortName?.trim() || null,
        isActive: dto.isActive ?? true,
      },
    });
  }

  findAll(): Promise<Institution[]> {
    return this.prisma.institution.findMany({
      where: { deletedAt: null },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string): Promise<Institution> {
    const institution = await this.prisma.institution.findFirst({
      where: { id, deletedAt: null },
    });

    if (!institution) {
      throw new NotFoundException(`Institution ${id} not found`);
    }

    return institution;
  }

  async update(id: string, dto: UpdateInstitutionDto): Promise<Institution> {
    await this.ensureExists(id);

    return this.prisma.institution.update({
      where: { id },
      data: {
        ...this.withMaybeString('name', dto.name),
        ...this.withMaybeString('code', dto.code?.toUpperCase()),
        ...this.withMaybeString('shortName', dto.shortName, true),
        ...(dto.isActive === undefined ? {} : { isActive: dto.isActive }),
      },
    });
  }

  async remove(id: string): Promise<Institution> {
    await this.ensureExists(id);

    return this.prisma.institution.update({
      where: { id },
      data: { isActive: false, deletedAt: new Date() },
    });
  }

  private async ensureExists(id: string): Promise<void> {
    const exists = await this.prisma.institution.findFirst({
      where: { id, deletedAt: null },
      select: { id: true },
    });

    if (!exists) {
      throw new NotFoundException(`Institution ${id} not found`);
    }
  }

  private withMaybeString(
    field: 'name' | 'code' | 'shortName',
    value?: string,
    allowNull = false,
  ): Record<string, string | null> {
    if (value === undefined) {
      return {};
    }

    const trimmed = value.trim();
    if (trimmed.length === 0 && allowNull) {
      return { [field]: null };
    }

    return { [field]: trimmed };
  }
}
