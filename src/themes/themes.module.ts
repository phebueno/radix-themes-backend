import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThemesController } from './themes.controller';
import { ThemesService } from './themes.service';
import { LinksService } from '../links/links.service';
import { Theme } from './theme.entity';
import { Link } from '../links/link.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Theme]), TypeOrmModule.forFeature([Link])],
  controllers: [ThemesController],
  providers: [ThemesService, LinksService]
})
export class ThemesModule {}
