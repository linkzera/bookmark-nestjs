import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { NewBookmarkDto } from './dto/new-bookmark.dto';

@Injectable()
export class BookmarkService {
  constructor(private prisma: PrismaService) {}

  //Create
  async addBookmark(userId: number, bookmark: NewBookmarkDto) {
    const newBookmark = await this.prisma.bookmark.create({
      data: {
        userId,
        ...bookmark,
      },
    });

    return newBookmark;
  }

  //Read
  async getBookmarksByUserId(userId: number) {
    const bookmarks = await this.prisma.bookmark.findMany({
      where: {
        userId,
      },
    });

    return bookmarks;
  }

  async getAllBookmarks() {
    const bookmarks = await this.prisma.bookmark.findMany();

    return bookmarks;
  }

  //Update
  async updateBookmark(bookmarkId: number, data: NewBookmarkDto) {
    const updatedBookmark = await this.prisma.bookmark.update({
      where: {
        id: bookmarkId,
      },
      data: { ...data },
    });

    return updatedBookmark;
  }

  //Delete
  async deleteBookmark(bookmarkId: number) {
    const deletedBookmark = await this.prisma.bookmark.delete({
      where: {
        id: bookmarkId,
      },
    });

    return deletedBookmark;
  }
}
