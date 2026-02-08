import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { TransformInterceptor } from '../src/common/interceptors/transform.interceptor';



 describe('Appcontroller (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalInterceptors(new TransformInterceptor());

    await app.init();
  
  });

  //1. teszt
  it('/tasks (GET) - visszaadja a listát becsomagolva', () => {
    return request(app.getHttpServer())
      .get('/tasks')
      .expect(200)
      .expect((res) => {
        if(!res.body.success) throw new Error('Hiányzik a success mező');
        if(!res.body.timestamp) throw new Error('Hiányzik a időbélyeg');
        if(!Array.isArray(res.body.data)) throw new Error('A data nem tömb')

      });
  });

  //2. teszt
  it('/tasks (POST) - létrehoz egy feladatot', () => {
    return request(app.getHttpServer())
      .post('/tasks')
      .send({
        title: 'E2E Teszt Feladat',
        categoryId: 3,
        priority: 'medium',
        dueDate: '2026-03-02'
      })
      .expect(201)
      .expect((res) => {
        if (res.body.data.title !== 'E2E Teszt Feladat') {
           throw new Error('A visszakapott cím nem egyezik!');
        }
      })
  })
 })