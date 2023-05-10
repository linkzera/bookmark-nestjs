import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { BookmarkService } from './bookmark.service';
import { GetUser } from '../auth/decorator';
import { NewBookmarkDto } from './dto/new-bookmark.dto';
import { EditBookmarkDto } from './dto/edit-bookmark.dto';

@UseGuards(JwtGuard)
@Controller('bookmarks')
export class BookmarkController {
  constructor(private bookmarkService: BookmarkService) {}

  @Post()
  addBookmark(@GetUser('id') userId: number, @Body() bookmark: NewBookmarkDto) {
    return this.bookmarkService.addBookmark(userId, bookmark);
  }

  @Get()
  getAllBookmarks() {
    return this.bookmarkService.getAllBookmarks();
  }

  @Get(':id')
  getBookmarksByUserId(@Param('id', ParseIntPipe) userId: number) {
    return this.bookmarkService.getBookmarksByUserId(userId);
  }

  @Patch()
  updateBookmark(
    @Body('id', ParseIntPipe) bookmarkId: number,
    @Body() bookmark: EditBookmarkDto,
  ) {
    return this.bookmarkService.updateBookmark(bookmarkId, bookmark);
  }

  @Delete(':id')
  deleteBookmark(@Param('id', ParseIntPipe) bookmarkId: number) {
    return this.bookmarkService.deleteBookmark(bookmarkId);
  }
}
