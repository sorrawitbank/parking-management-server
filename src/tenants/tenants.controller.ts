import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { CreateTenantResponseDto } from './dto/create-tenant-response.dto';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { GetTenantsQueryDto } from './dto/get-tenants-query.dto';
import { GetTenantsResponseDto } from './dto/get-tenants-response.dto';
import { TenantIdDto } from './dto/tenant-id.dto';
import { TenantResponseDto } from './dto/tenant-response.dto';
import { UpdateTenantResponseDto } from './dto/update-tenant-response.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { TenantsService } from './tenants.service';

@Controller('tenants')
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  @Get()
  async getTenants(
    @Query() query: GetTenantsQueryDto,
  ): Promise<GetTenantsResponseDto> {
    const { tenants, pagination } = await this.tenantsService.getTenants(query);

    return {
      data: plainToInstance(TenantResponseDto, tenants),
      pagination,
    };
  }

  @Post()
  async createTenant(
    @Body() body: CreateTenantDto,
  ): Promise<CreateTenantResponseDto> {
    const createdTenant = await this.tenantsService.createTenant(body);

    return plainToInstance(CreateTenantResponseDto, createdTenant);
  }

  @Put(':tenantId')
  async updateTenant(
    @Param() params: TenantIdDto,
    @Body() body: UpdateTenantDto,
  ): Promise<UpdateTenantResponseDto> {
    const updatedTenant = await this.tenantsService.updateTenant(
      params.tenantId,
      body,
    );

    return plainToInstance(UpdateTenantResponseDto, updatedTenant);
  }

  @Delete(':tenantId')
  async deleteTenant(@Param() params: TenantIdDto) {
    await this.tenantsService.deleteTenant(params.tenantId);
  }
}
