import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Booking } from './entities/booking.entity';

@ApiTags('Booking')
@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new booking', description: 'Reserves a slot for a user after verifying availability and preventing double-booking' })
  @ApiResponse({ status: 201, description: 'Booking created successfully', type: Booking })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 404, description: 'Slot not found' })
  @ApiResponse({ status: 409, description: 'Slot is fully booked or user is already booked for this slot' })
  create(@Body() createBookingDto: CreateBookingDto) {
    return this.bookingService.create(createBookingDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all bookings', description: 'Retrieves all bookings along with their associated slot information' })
  @ApiResponse({ status: 200, description: 'List of bookings retrieved', type: [Booking] })
  @ApiResponse({ status: 404, description: 'No bookings found' })
  findAll() {
    return this.bookingService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a booking by ID', description: 'Retrieves details for a specific booking by its UUID' })
  @ApiParam({ name: 'id', description: 'UUID of the booking', example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' })
  @ApiResponse({ status: 200, description: 'Booking details retrieved', type: Booking })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  findOne(@Param('id') id: string) {
    return this.bookingService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a booking', description: 'Updates status (e.g. CANCELLED) or moves booking to a new slot with capacity recalculation' })
  @ApiParam({ name: 'id', description: 'UUID of the booking to update', example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' })
  @ApiResponse({ status: 200, description: 'Booking updated successfully', type: Booking })
  @ApiResponse({ status: 404, description: 'Booking or new slot not found' })
  @ApiResponse({ status: 409, description: 'New slot is fully booked' })
  update(@Param('id') id: string, @Body() updateBookingDto: UpdateBookingDto) {
    return this.bookingService.update(id, updateBookingDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a booking', description: 'Deletes a booking and restores slot capacity if it was confirmed' })
  @ApiParam({ name: 'id', description: 'UUID of the booking to delete', example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' })
  @ApiResponse({ status: 200, description: 'Booking deleted successfully' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  remove(@Param('id') id: string) {
    return this.bookingService.remove(id);
  }
}
