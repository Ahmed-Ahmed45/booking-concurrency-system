import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSlotDto } from './dto/create-slot.dto';
import { UpdateSlotDto } from './dto/update-slot.dto';
import { Slot } from './entities/slot.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class SlotsService {
  constructor(
    @InjectRepository(Slot) private readonly SlotRepository: Repository<Slot>,
  ) { }
  async create(dto: CreateSlotDto) {
    if (new Date(dto.startTime) >= new Date(dto.endTime)) {
      throw new BadRequestException('Start time must be before end time');
    }
    const slot = this.SlotRepository.create(dto);
    return await this.SlotRepository.save(slot);
  }

  async findAll() {
    const slots = await this.SlotRepository.find();
    if (!slots || slots.length === 0) {
      throw new NotFoundException('No slots found');
    }
    return slots;
  }

  async findOne(id: string) {
    const slot = await this.SlotRepository.findOne({ where: { id } });
    if (!slot) {
      throw new NotFoundException('Slot not found');
    }
    return slot;
  }

  async update(id: string, updateSlotDto: UpdateSlotDto) {
    const slot = await this.findOne(id);
    Object.assign(slot, updateSlotDto);
    return await this.SlotRepository.save(slot);
  }

  async remove(id: string) {
    const slot = await this.findOne(id);
    return await this.SlotRepository.remove(slot);
  }
}
