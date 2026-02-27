import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { SearchService } from './search.service';

@ApiTags('search')
@Controller()
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('search')
  @ApiOperation({ summary: 'Recherche globale' })
  @ApiQuery({ name: 'q', description: 'Terme de recherche' })
  search(@Query('q') q: string) {
    return this.searchService.search(q || '');
  }
}
