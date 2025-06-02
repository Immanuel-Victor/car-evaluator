import { Controller, Post, Body, UseGuards, Patch, Param } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dtos/create-report.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { User } from 'src/users/user.entity';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { ReportDto } from './dtos/report.dto';
import { ApproveReportDto } from './dtos/approve-report.dto';

@Controller('reports')
@UseGuards(AuthGuard)
@Serialize(ReportDto)
export class ReportsController {
    constructor(private reportService: ReportsService) {}

    @Post()
    async createReport(
        @Body() body: CreateReportDto,
        @CurrentUser() user: User
    ) {
        return await this.reportService.createReport(body, user);
    }

    @Patch()
    async approveReport(@Param("id") id: string, @Body() body: ApproveReportDto) {
        return await this.reportService.changeApproval(id, body.approved)
    }
}
