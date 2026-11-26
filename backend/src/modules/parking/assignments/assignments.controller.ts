import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { AssignmentsService } from './assignments.service';
import { AssignmentIdDto } from './dto/assignment-id.dto';
import { CreateAssignmentResponseDto } from './dto/create-assignment-response.dto';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { GetActiveAssignmentResponseDto } from './dto/get-active-assignment-response.dto';
import { GetAssignmentResponseDto } from './dto/get-assignment-response.dto';
import { GetAssignmentSlotsBySlotIdQueryDto } from './dto/get-assignment-slots-by-slot-id-query.dto';
import {
  GetAssignmentSlotsBySlotIdResponse,
  GetAssignmentSlotsBySlotIdResponseDto,
} from './dto/get-assignment-slots-by-slot-id-response.dto';
import { GetAssignmentsByTenantIdQueryDto } from './dto/get-assignments-by-tenant-id-query.dto';
import {
  GetAssignmentsByTenantIdResponse,
  GetAssignmentsByTenantIdResponseDto,
} from './dto/get-assignments-by-tenant-id-response.dto';
import { GetAssignmentsQueryDto } from './dto/get-assignments-query.dto';
import {
  GetAssignmentsResponse,
  GetAssignmentsResponseDto,
} from './dto/get-assignments-response.dto';
import {
  MoveAssignmentDto,
  PayAssignmentDto,
  UpdateAssignmentDto,
} from './dto/update-assignment.dto';
import {
  CancelAssignmentResponseDto,
  MoveAssignmentResponseDto,
  PayAssignmentResponseDto,
  UpdateAssignmentResponseDto,
} from './dto/update-assignment-response.dto';
import { SlotIdDto } from '../slots/dto/slot-id.dto';
import { TenantIdDto } from '../../tenants/dto/tenant-id.dto';

@Controller()
export class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) {}

  @Get()
  async getAssignments(
    @Query() query: GetAssignmentsQueryDto,
  ): Promise<GetAssignmentsResponseDto> {
    const { assignments, pagination } =
      await this.assignmentsService.getAssignments(query);

    return {
      data: plainToInstance(GetAssignmentsResponse, assignments),
      pagination,
    };
  }

  @Get('active')
  async getActiveAssignments(): Promise<GetActiveAssignmentResponseDto[]> {
    const activeAssignments =
      await this.assignmentsService.getActiveAssignments();

    return plainToInstance(GetActiveAssignmentResponseDto, activeAssignments);
  }

  @Get(':assignmentId')
  async getAssignmentById(
    @Param() params: AssignmentIdDto,
  ): Promise<GetAssignmentResponseDto> {
    const assignment = await this.assignmentsService.getAssignmentById(
      params.assignmentId,
    );

    return plainToInstance(GetAssignmentResponseDto, assignment);
  }

  @Get('tenant/:tenantId')
  async getAssignmentsByTenantId(
    @Param() params: TenantIdDto,
    @Query() query: GetAssignmentsByTenantIdQueryDto,
  ): Promise<GetAssignmentsByTenantIdResponseDto> {
    const { assignments, pagination } =
      await this.assignmentsService.getAssignmentsByTenantId(
        params.tenantId,
        query,
      );

    return {
      data: plainToInstance(GetAssignmentsByTenantIdResponse, assignments),
      pagination,
    };
  }

  @Get('slots/slot/:slotId')
  async getAssignmentSlotsBySlotId(
    @Param() params: SlotIdDto,
    @Query() query: GetAssignmentSlotsBySlotIdQueryDto,
  ): Promise<GetAssignmentSlotsBySlotIdResponseDto> {
    const assignmentSlots =
      await this.assignmentsService.getAssignmentSlotsBySlotId(
        params.slotId,
        query,
      );

    return {
      data: plainToInstance(
        GetAssignmentSlotsBySlotIdResponse,
        assignmentSlots,
      ),
      year: query.year,
    };
  }

  @Post()
  async createAssignment(
    @Body() body: CreateAssignmentDto,
  ): Promise<CreateAssignmentResponseDto> {
    const createdAssignment = await this.assignmentsService.rent(body);

    return plainToInstance(CreateAssignmentResponseDto, createdAssignment);
  }

  @Put(':assignmentId')
  async updateAssignment(
    @Param() params: AssignmentIdDto,
    @Body() body: UpdateAssignmentDto,
  ): Promise<UpdateAssignmentResponseDto> {
    const updatedAssignment = await this.assignmentsService.updateAssignment(
      params.assignmentId,
      body,
    );

    return plainToInstance(UpdateAssignmentResponseDto, updatedAssignment);
  }

  @Patch(':assignmentId/payment')
  async payAssignment(
    @Param() params: AssignmentIdDto,
    @Body() body: PayAssignmentDto,
  ): Promise<PayAssignmentResponseDto> {
    const paidAssignment = await this.assignmentsService.pay(
      params.assignmentId,
      body,
    );

    return plainToInstance(PayAssignmentResponseDto, paidAssignment);
  }

  @Patch(':assignmentId/move')
  async moveAssignment(
    @Param() params: AssignmentIdDto,
    @Body() body: MoveAssignmentDto,
  ): Promise<MoveAssignmentResponseDto> {
    const movedAssignment = await this.assignmentsService.move(
      params.assignmentId,
      body,
    );

    return plainToInstance(MoveAssignmentResponseDto, movedAssignment);
  }

  @Patch(':assignmentId/cancel')
  async cancelAssignment(
    @Param() params: AssignmentIdDto,
  ): Promise<CancelAssignmentResponseDto> {
    const canceledAssignment = await this.assignmentsService.cancel(
      params.assignmentId,
    );

    return plainToInstance(CancelAssignmentResponseDto, canceledAssignment);
  }
}
