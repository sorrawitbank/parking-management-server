import { Test, TestingModule } from '@nestjs/testing';
import { AssignmentsService } from './assignments.service';
import DATABASE_CONNECTION from '../../database/database-connection';
import {} from '../../database/database.schemas';

describe('AssignmentsService', () => {
  let service: AssignmentsService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AssignmentsService,
        {
          provide: DATABASE_CONNECTION,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<AssignmentsService>(AssignmentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
