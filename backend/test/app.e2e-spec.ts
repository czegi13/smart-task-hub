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

  //3. teszt
  it('/tasks (PATCH) - feladat státuszának módosítása', async () => {
    const createResponse = await request(app.getHttpServer())
      .post('/tasks')
      .send({ title: 'Módosítandó feladat', categoryId: 3})
      .expect(201)

    return request(app.getHttpServer())
      .patch(`/tasks/${createResponse.body.data.id}`)
      .expect(200)
      .expect((res) => {
        if (res.body.data.isCompleted !== true) {
          throw new Error('A feladat státusza nem változott true-ra!');
        }
      })
  })

  //4. teszt
  it('/tasks (DELETE) - feladat törlése', async () => {
    const createResponse = await request(app.getHttpServer())
      .post('/tasks')
      .send({title: 'Törlendő', categoryId: 3})
      .expect(201)

    await request(app.getHttpServer())
      .delete(`/tasks/${createResponse.body.data.id}`)
      .expect(200)

    return request(app.getHttpServer()) 
      .get('/tasks')
      .expect(200)
      .expect((res) => {
        const tasks = res.body.data;

        const found = tasks.find((t) => t.id === createResponse.body.data.id)
        if (found) {
          throw new Error('A feladat nem törlődött, még benne van a listában')
        }
      })
  })
})