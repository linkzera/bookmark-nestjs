import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';
import * as pactum from 'pactum';
import { EditUserDto } from 'src/user/dto';

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );

    await app.init();
    await app.listen(3333);

    prisma = app.get(PrismaService);

    await prisma.cleanDb();
    pactum.request.setBaseUrl('http://localhost:3333');
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Auth', () => {
    describe('Signup', () => {
      it('should create a new user', async () => {
        return await pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            email: 'teste@teste.com',
            password: '123456',
          })
          .expectStatus(201);
      });
    });

    describe('Login', () => {
      it('should return an error when email is invalid', async () => {
        return await pactum
          .spec()
          .post('/auth/login')
          .withBody({
            email: '',
            password: '123456',
          })
          .expectStatus(400);
      });

      it('should return an error when password is invalid', async () => {
        return await pactum
          .spec()
          .post('/auth/login')
          .withBody({
            email: 'teste@teste.com',
            password: '2121',
          })
          .expectStatus(403);
      });

      it('should return a token', async () => {
        return await pactum
          .spec()
          .post('/auth/login')
          .withBody({
            email: 'teste@teste.com',
            password: '123456',
          })
          .expectStatus(200)
          .stores('userAt', 'access_token');
      });
    });
  });

  describe('Users', () => {
    describe('Get me', () => {
      it('should get current user', async () => {
        return await pactum
          .spec()
          .get('/users/me')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200);
      });
    });

    describe('Edit user', () => {
      const dto: EditUserDto = {
        firstName: 'Teste',
        lastName: 'Teste',
        email: 'teste@teste.com',
      };
      it('should edit user', async () => {
        return await pactum
          .spec()
          .patch('/users/me')
          .withBody(dto)
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200)
          .expectBodyContains(dto.firstName)
          .expectBodyContains(dto.lastName);
      });

      it('should throw error with email is empty', async () => {
        return await pactum
          .spec()
          .patch('/users/me')
          .withBody({
            email: '',
          })
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(400);
      });

      it('should throw error with email is invalid email', async () => {
        return await pactum
          .spec()
          .patch('/users/me')
          .withBody({
            email: 'teste.com',
          })
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(400);
      });
    });
  });

  describe('Bookmarks', () => {
    describe('Create Bookmark', () => {});

    describe('Get all bookmarks', () => {});

    describe('Get one bookmark by id', () => {});

    describe('Update bookmark', () => {});

    describe('Delete bookmark', () => {});
  });
});
