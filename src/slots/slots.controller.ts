import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SlotsService } from './slots.service';
import { CreateSlotDto } from './dto/create-slot.dto';
import { UpdateSlotDto } from './dto/update-slot.dto';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Slot } from './entities/slot.entity';

@ApiTags('Slots')
@Controller('slots')
export class SlotsController {
  constructor(private readonly slotsService: SlotsService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new slot', description: 'Creates a bookable time slot with specified capacity' })
  @ApiResponse({ status: 201, description: 'Slot created successfully', type: Slot })
  @ApiResponse({ status: 400, description: 'Validation failed or start time is after end time' })
  create(@Body() createSlotDto: CreateSlotDto) {
    return this.slotsService.create(createSlotDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all slots', description: 'Retrieves all available bookable slots' })
  @ApiResponse({ status: 200, description: 'List of slots retrieved', type: [Slot] })
  @ApiResponse({ status: 404, description: 'No slots found' })
  findAll() {
    return this.slotsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a slot by ID', description: 'Retrieves details for a specific slot by its UUID' })
  @ApiParam({ name: 'id', description: 'UUID of the slot', example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' })
  @ApiResponse({ status: 200, description: 'Slot retrieved successfully', type: Slot })
  @ApiResponse({ status: 404, description: 'Slot not found' })
  findOne(@Param('id') id: string) {
    return this.slotsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a slot', description: 'Updates details of an existing slot' })
  @ApiParam({ name: 'id', description: 'UUID of the slot to update', example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' })
  @ApiResponse({ status: 200, description: 'Slot updated successfully', type: Slot })
  @ApiResponse({ status: 404, description: 'Slot not found' })
  update(@Param('id') id: string, @Body() updateSlotDto: UpdateSlotDto) {
    return this.slotsService.update(id, updateSlotDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a slot', description: 'Deletes an existing slot by its UUID' })
  @ApiParam({ name: 'id', description: 'UUID of the slot to delete', example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' })
  @ApiResponse({ status: 200, description: 'Slot deleted successfully' })
  @ApiResponse({ status: 404, description: 'Slot not found' })
  remove(@Param('id') id: string) {
    return this.slotsService.remove(id);
  }
}
