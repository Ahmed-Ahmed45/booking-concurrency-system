import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { Repository } from 'typeorm';
import { Booking } from './entities/booking.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { SlotsService } from '../slots/slots.service';
import { BookingStatus } from '../utils/enum';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking) private readonly bookingRepository: Repository<Booking>,
    private readonly slotsService: SlotsService
  ) { }
  async create(dto: CreateBookingDto) {
    // 1. Verify slot exists and has available capacity
    const slot = await this.slotsService.findOne(dto.slotId);
    if (slot.bookedCount >= slot.capacity) {
      throw new ConflictException('Slot is fully booked');
    }

    // 2. Ensure the user hasn't already booked this slot
    const existingBooking = await this.bookingRepository.findOne({
      where: { userId: dto.userId, slot: { id: dto.slotId } },
    });
    if (existingBooking) {
      throw new ConflictException('User is already booked for this slot');
    }

    // 3. Create and persist the booking with the slot relation
    const booking = this.bookingRepository.create({
      userId: dto.userId,
      slot: slot,
    });
    await this.bookingRepository.save(booking);

    // 4. Increment slot booking count and persist update
    slot.bookedCount += 1;
    await this.slotsService.update(slot.id, slot);

    // 5. Return the created booking
    return booking;
  }

  async findAll() {
    const bookings = await this.bookingRepository.find({
      relations: { slot: true },
      order: { createdAt: 'DESC' },
    });
    if (!bookings || bookings.length === 0) {
      throw new NotFoundException('No bookings found');
    }
    return bookings;
  }

  async findOne(id: string) {
    const booking = await this.bookingRepository.findOne({
      where: { id },
      relations: { slot: true },
    });
    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }
    return booking;
  }

  async update(id: string, updateBookingDto: UpdateBookingDto) {
    const booking = await this.findOne(id);

    // 1. If slotId is updated and different, reassign and update slot counts
    if (updateBookingDto.slotId && updateBookingDto.slotId !== booking.slot?.id) {
      const newSlot = await this.slotsService.findOne(updateBookingDto.slotId);
      if (newSlot.bookedCount >= newSlot.capacity) {
        throw new ConflictException('New slot is fully booked');
      }

      // If existing booking was confirmed, free old slot and occupy new slot
      if (booking.status === BookingStatus.CONFIRMED) {
        if (booking.slot) {
          booking.slot.bookedCount = Math.max(0, booking.slot.bookedCount - 1);
          await this.slotsService.update(booking.slot.id, booking.slot);
        }
        newSlot.bookedCount += 1;
        await this.slotsService.update(newSlot.id, newSlot);
      }

      booking.slot = newSlot;
    }

    // 2. Handle status changes (CONFIRMED <-> CANCELLED)
    if (updateBookingDto.status && updateBookingDto.status !== booking.status) {
      if (
        booking.status === BookingStatus.CONFIRMED &&
        updateBookingDto.status === BookingStatus.CANCELLED
      ) {
        // Free up slot capacity when cancelled
        if (booking.slot) {
          booking.slot.bookedCount = Math.max(0, booking.slot.bookedCount - 1);
          await this.slotsService.update(booking.slot.id, booking.slot);
        }
      } else if (
        booking.status === BookingStatus.CANCELLED &&
        updateBookingDto.status === BookingStatus.CONFIRMED
      ) {
        // Ensure capacity is available before re-confirming
        if (booking.slot) {
          const currentSlot = await this.slotsService.findOne(booking.slot.id);
          if (currentSlot.bookedCount >= currentSlot.capacity) {
            throw new ConflictException('Slot is fully booked');
          }
          currentSlot.bookedCount += 1;
          await this.slotsService.update(currentSlot.id, currentSlot);
          booking.slot = currentSlot;
        }
      }
      booking.status = updateBookingDto.status;
    }

    if (updateBookingDto.userId) {
      booking.userId = updateBookingDto.userId;
    }

    return await this.bookingRepository.save(booking);
  }

  async remove(id: string) {
    const booking = await this.findOne(id);

    // If confirmed booking is deleted, decrement slot count
    if (booking.status === BookingStatus.CONFIRMED && booking.slot) {
      booking.slot.bookedCount = Math.max(0, booking.slot.bookedCount - 1);
      await this.slotsService.update(booking.slot.id, booking.slot);
    }

    return await this.bookingRepository.remove(booking);
  }
}
