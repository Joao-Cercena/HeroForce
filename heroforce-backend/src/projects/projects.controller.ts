import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  UseGuards,
  Param,
  Req,
  ParseUUIDPipe,
  Put,
  Query,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';
import { AdminGuard } from '../auth/admin.guard';
import { Project } from './project.entity';
import { UpdateProjectDto } from './dto/update-project.dto';

@Controller('projects')
@UseGuards(JwtAuthGuard)
export class ProjectsController {
  constructor(private projectsService: ProjectsService) {}

  @Get()
  findAll(
    @Query('status') status?: string,
    @Query('heroId') heroId?: string,
    @Req() req?: Request,
  ) {
    return this.projectsService.findAll(status, heroId, req?.user);
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.projectsService.findOne(id);
  }

  @Post()
  @UseGuards(AdminGuard)
  create(@Body() createProjectDto: CreateProjectDto, @Req() req) {
    return this.projectsService.create(createProjectDto, req.body.hero);
  }

  @Put(':id')
  @UseGuards(AdminGuard)
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ): Promise<Project> {
    return this.projectsService.update(id, updateProjectDto);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.projectsService.remove(id);
  }
}
