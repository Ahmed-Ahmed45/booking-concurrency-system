import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsDateString, IsInt, IsNotEmpty, IsOptional, IsString, Min } from "class-validator";

export class CreateSlotDto {

    @ApiProperty({ description: 'Title or description of the slot', example: 'Dentist Consultation' })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({ description: 'Start time of the slot in ISO 8601 format', example: '2026-11-01T09:00:00.000Z' })
    @IsDateString()
    startTime: Date;

    @ApiProperty({ description: 'End time of the slot in ISO 8601 format', example: '2026-11-01T10:00:00.000Z' })
    @IsDateString()
    endTime: Date;

    @ApiPropertyOptional({ description: 'Maximum booking capacity (defaults to 1)', example: 5, default: 1, minimum: 1 })
    @IsOptional()
    @IsInt()
    @Min(1, { message: 'Capacity must be at least 1' })
    capacity: number;
}
